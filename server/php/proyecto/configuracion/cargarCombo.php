<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $Tabla = $_POST['Tabla'];

   $where = "";

   
   if (array_key_exists("Condicion", $_POST))
   {
      $arrCondiciones = explode("&", $_POST['Condicion']);

      foreach ($arrCondiciones as $key => $value) 
      {
         $arrCondicion = explode("#", $value);
         $where .= $arrCondicion[0] . " " . $arrCondicion[1] . $arrCondicion[2] . " AND ";
      }
      $where = substr($where, 0, -4);
   }

   if ($where <> "")
   {
      $where = " WHERE " . $where;
   }

   $Usuario = datosUsuario($idUsuario);

   $sql = "SELECT * FROM $Tabla $where ORDER BY $Tabla.Nombre;";

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
         echo json_encode($Resultado);
   } else
   {
      echo 0;
   }
?>