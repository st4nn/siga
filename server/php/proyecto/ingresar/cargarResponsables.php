<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $Ciudad = addslashes($_POST['Ciudad']);
   $Area = addslashes($_POST['Area']);

   $where = "";

   $idx = 0;

   $Condiciones = array();

   if ($Ciudad > 0)
   {
      $Condiciones[$idx] = " datosUsuarios.idCiudad = '$Ciudad'";
      $idx++;
   }

   if ($Area > 0)
   {
      $Condiciones[$idx] = " datosUsuarios.idArea = '$Area'";
      $idx++;
   }

   foreach ($Condiciones as $key => $value) 
   {
      $where .= $value . " AND ";
   }

   if ($where <> "")
   {
      $where = " WHERE " . substr($where, 0, -4);
   }

   $sql = "SELECT idLogin AS id, Nombre FROM datosUsuarios $where ORDER BY datosUsuarios.Nombre;";

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