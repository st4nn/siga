<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $datos = $_POST['datos'];

   $Respuesta = array();
   $Respuesta['Error'] = "";

   $cadenaAND = "";
   $cadenaOR = "";

   foreach ($datos as $indice => $fila) 
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

   $cadenaAND = substr($cadenaAND, 0, -3);
   $cadenaOR = substr($cadenaOR, 0, -2);

   $where = "";

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

   if ($where != "")
   {
      $where = " WHERE " . $where;
   }

   $sql = "SELECT Consecutivo AS id, Sede, Nombre, Placa, Responsable_Nombre AS Responsable, Estado, Serial FROM v_activos $where ORDER BY FechaIngreso;";
   

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
?>