<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Parametro = addslashes($_POST['Parametro']);

   $Respuesta = array();
   $Respuesta['Error'] = "";

   if ($Parametro <> "")
   {
      $Parametro = str_replace(" ", "%", $Parametro);
      $where = " Nombre LIKE '%" . $Parametro . "%'
      OR Placa LIKE '%" . $Parametro . "%'
      OR Descripcion LIKE '%" . $Parametro . "%'
      OR Serial LIKE '%" . $Parametro . "%'
      OR Modelo LIKE '%" . $Parametro . "%'
      OR Marca LIKE '%" . $Parametro . "%'
      OR Proveedor LIKE '%" . $Parametro . "%'
      OR Factura LIKE '%" . $Parametro . "%'
      OR Valor LIKE '%" . $Parametro . "%'
      OR Sede LIKE '%" . $Parametro . "%'
      OR Ciudad LIKE '%" . $Parametro . "%'
      OR Responsable_Nombre LIKE '%" . $Parametro . "%'
      OR Responsable_Cedula LIKE '%" . $Parametro . "%'
      OR Estado LIKE '%" . $Parametro . "%'
      OR CentroDeCosto LIKE '%" . $Parametro . "%' ";
   } else
   {
      $where = "1";
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

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
?>