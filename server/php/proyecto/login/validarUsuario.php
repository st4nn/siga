<?php
   include("../../conectar.php"); 
   $link = Conectar();

   $usuario = addslashes($_POST['pUsuario']);
   $clave = addslashes($_POST['pClave']);
   $Fecha = $_POST['pFecha'];
   
   $sql = "SELECT 
               Login.idLogin AS 'idLogin',
               Login.Usuario AS 'Usuario',
               Login.Estado AS 'Estado',
               Login.idPerfil AS 'idPerfil',
               Datos.*
            FROM 
               Login AS Login
               INNER JOIN datosUsuarios AS Datos ON Datos.idLogin = Login.idLogin
            WHERE 
               Login.Usuario = '$usuario' 
               AND Login.Clave = '" . $clave . "';";

   $result = $link->query($sql);

   if ( $result->num_rows == 1)
   {
      
         $row = $result->fetch_assoc();
         $Users = array();
         foreach ($row as $key => $value) 
         {
            $Users[$key] = utf8_encode($value);
         }
         $Users['cDate'] = $Fecha;
         $Users['id'] = $row['idLogin'];

         mysqli_free_result($result);  
         echo json_encode($Users);
   } else
   {
      echo 0;
   }
?>