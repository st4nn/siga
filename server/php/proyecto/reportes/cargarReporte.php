<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   
   $encabezado = addslashes($_POST['encabezado']);
   $agrupado = $_POST['agrupado'];

   $Respuesta = array();
   $Respuesta['Error'] = "";

   $addSelect = "";

   $where = "";

   if (array_key_exists("datos", $_POST))
   {
      $datos = $_POST['datos'];
      
      $cadenaAND = "";
      $cadenaOR = "";

     foreach ($datos as $indice => $fila) 
     {
        if ($fila['filtro'] <> "" )
        {
          $tmpCadena = validarCondicion(addslashes($fila['condicion']), addslashes($fila['filtro']));

          $tmpCadena = " " . addslashes($fila['parametro']) . " " . $tmpCadena;

          if (addslashes($fila['concatenador']) == "AND")
          {
             $cadenaAND .=  $tmpCadena . " AND";
          } else
          {
             $cadenaOR .=  $tmpCadena . " OR";
          }
        }
     }

      $cadenaAND = substr($cadenaAND, 0, -3);
      $cadenaOR = substr($cadenaOR, 0, -2);

     if ($cadenaAND != "")
     {
        $where = $cadenaAND;
     }

     if ($cadenaOR != "")
     {
        if ($where != "")
        {
           $where .= " AND (" . $cadenaOR . ") ";
        } else
        {
           $where = $cadenaOR;
        }
     }
   }

   $arrAgrupado = explode(",", $agrupado);
   $tmpCadenaAgrupado = "";
   foreach ($arrAgrupado as $key => $value) 
   {
      if ($value <> "")
      {
        $tmpAgrupado = explode("#", $value);
        $tmpRespuestaGrupo = validarGrupo(addslashes($tmpAgrupado[1]), addslashes($tmpAgrupado[0]));
        if ($tmpRespuestaGrupo[0]<> "")
        {
          $tmpCadenaAgrupado .= $tmpRespuestaGrupo[0] . ", ";
        }

        $addSelect .= $tmpRespuestaGrupo[1];
      }
   }

   $tmpCadenaAgrupado = substr($tmpCadenaAgrupado, 0, -2);

   if ($tmpCadenaAgrupado <> "")
   {
    $tmpCadenaAgrupado = "GROUP BY " . $tmpCadenaAgrupado;
   }

   
   if ($where != "")
   {
      $where = " WHERE " . $where;
   }

   $sql = "SELECT $encabezado $addSelect FROM v_activos $where $tmpCadenaAgrupado";

   $result = $link->query($sql);

   $idx = 0;
   if ( $result->num_rows > 0)
   {
      $Resultado = array();
      while ($row = mysqli_fetch_assoc($result))
      {
         $Resultado[$idx] = array();
         foreach ($row as $key => $value) 
         {
            $Resultado[$idx][$key] = utf8_encode($value);
         }
         $idx++;
      }
         mysqli_free_result($result);  
         $Respuesta['datos'] = $Resultado;
   } else
   {
      $Respuesta['datos'] = 0;
   }

   if ($link->error <> "")
   {
      $Respuesta['Error'] = $link->error;
   }

   echo json_encode($Respuesta);

   function validarCondicion($idCondicion, $Parametro)
   {
      $cadena = "";
      switch ($idCondicion) 
      {
         case 1:
              $cadena = "LIKE '%" . str_replace(" ", "%", $Parametro) . "%'";
              break;
         case 2:
              $cadena = "LIKE '" . str_replace(" ", "%", $Parametro) . "%'";
              break;
         case 3:
              $cadena = "LIKE '%" . str_replace(" ", "%", $Parametro) . "'";
              break;
         case 4:
              $cadena = "= '" . $Parametro . "'";
              break;
         case 5:
              $cadena = "NOT LIKE '%" . str_replace(" ", "%", $Parametro) . "%'";
              break;
         case 6:
              $cadena = "<> '" . $Parametro . "'";
              break;
         case 7:
              $cadena = "> '" . $Parametro . "'";
              break;
         case 8:
              $cadena = ">= '" . $Parametro . "'";
              break;
         case 9:
              $cadena = "< '" . $Parametro . "'";
              break;
         case 10:
              $cadena = "<= '" . $Parametro . "'";
              break;
        case 11:
              $cadena = "IS NULL";
              break;
        case 12:
              $cadena = "IS NOT NULL";
              break;
      }
      return $cadena;
   }

   function validarGrupo($idCondicion, $Parametro)
   {
      $cadena = "";
      $tmpSelect = "";
      switch ($idCondicion) 
      {
         case 1:
              $cadena = " $Parametro ";
              break;
         case 2:
              $cadena = "";
              $tmpSelect .= ", COUNT(DISTINCT " . $Parametro . ") AS Cantidad ";
              break;
         case 3:
              $cadena = "";
              $tmpSelect .= ", SUM (" . $Parametro . ") AS 'Suma_del_Valor'";
              break;
         case 4:
              $cadena = "";
              $tmpSelect .= ", AVG (" . $Parametro . ") AS 'Valor_Promedio'";
              break;
         case 5:
              $cadena = "";
              $tmpSelect .= ", SUM (" . $Parametro . ") AS 'Suma_del_Valor', AVG (" . $Parametro . ") AS 'Valor_Promedio'";
              break;
         case 6:
              $cadena = "";
              $tmpSelect .= ", MAX (" . $Parametro . ") AS 'Valor_Maximo'";
              break;
         case 7:
              $cadena = "";
              $tmpSelect .= ", MIN (" . $Parametro . ") AS 'Valor_Minimo'";
              break;
         case 8:
              $cadena = "";
              $tmpSelect .= ", MAX (" . $Parametro . ") AS 'Valor_Maximo', MIN (" . $Parametro . ") AS 'Valor_Minimo'";
              break;
         case 9:
              $cadena = " YEAR (" . $Parametro . ")";
              $tmpSelect .= ", YEAR (" . $Parametro . ") AS 'Año'";
              break;
        case 10:
              $cadena = " MONTH (" . $Parametro . ")";
              $tmpSelect .= ", MONTH (" . $Parametro . ") AS 'Mes'";
              break;
        case 11:
              $cadena = " DAY (" . $Parametro . ")";
              $tmpSelect .= ", DAY (" . $Parametro . ") AS 'Dia'";
              break;
        case 12:
              $cadena = " YEAR (" . $Parametro . "), MONTH (" . $Parametro . ")";
              $tmpSelect .= ", YEAR (" . $Parametro . ") AS 'Año', MONTH (" . $Parametro . ") AS 'Mes'";
              break;
        case 13:
              $cadena = "  MONTH (" . $Parametro . "), DAY (" . $Parametro . ")";
              $tmpSelect .= ", MONTH (" . $Parametro . ") AS 'Mes', DAY (" . $Parametro . ") AS 'Dia'";
              break;
        case 14:
              $cadena = " YEAR (" . $Parametro . "), MONTH (" . $Parametro . "), DAY (" . $Parametro . ")";
              $tmpSelect .= ",YEAR (" . $Parametro . ") AS 'Año', MONTH (" . $Parametro . ") AS 'Mes', DAY (" . $Parametro . ") AS 'Dia'";
              break;
        case 15:
              $cadena = " DATE_FORMAT(" . $Parametro . ", '%W')";
              $tmpSelect .= ",DATE_FORMAT(" . $Parametro . ", '%W') AS 'Dia_De_La_Semana'";
              break;
        case 16:
              $cadena = " MONTH (" . $Parametro . "), DATE_FORMAT(" . $Parametro . ", '%W')";
              $tmpSelect .= ", MONTH (" . $Parametro . ") AS 'Mes', DATE_FORMAT(" . $Parametro . ", '%W') AS 'Dia_De_La_Semana'";
              break;
        case 17:
              $cadena = " DATE_FORMAT(" . $Parametro . ", '%H')";
              $tmpSelect .= ", DATE_FORMAT(" . $Parametro . ", '%H') AS 'Hora'";
              break;
        case 18:
              $cadena = " DATE_FORMAT(" . $Parametro . ", '%W'), DATE_FORMAT(" . $Parametro . ", '%H')";
              $tmpSelect .= ", DATE_FORMAT(" . $Parametro . ", '%W') AS 'Dia_De_La_Semana',DATE_FORMAT(" . $Parametro . ", '%H') AS 'Hora'";
              break;
      }
      return [$cadena, $tmpSelect];
   }
?>