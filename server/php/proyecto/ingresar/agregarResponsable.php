<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $datos = json_decode($_POST['datos']);
   $Ciudad = addslashes($_POST['Ciudad']);
   $Area = addslashes($_POST['Area']);

   $id = "NULL";

   $Respuesta = array();
   $Respuesta['Error'] = "";

   foreach ($datos as $key => $value) 
   {
      $datos->$key = addslashes($value);
   }

   $sql = "SELECT Nombre FROM datosUsuarios WHERE Cedula LIKE '" . $datos->Cedula . "';";
   $result = $link->query(utf8_decode($sql));
   if ($result->num_rows > 0)
   {
      $fila =  $result->fetch_array(MYSQLI_ASSOC);
      $Respuesta['Error'] = "El Usuario " . $fila['Nombre'] . " ya se encuentra registrado con ese numero de Cedula";
   } else
   {
      $sql = "SELECT Nombre FROM datosUsuarios WHERE Correo LIKE '" . $datos->Correo . "';";
      $result = $link->query(utf8_decode($sql));
      if ($result->num_rows > 0)
      {
         $fila =  $result->fetch_array(MYSQLI_ASSOC);
         $Respuesta['Error'] = "El Usuario " . $fila['Nombre'] . " ya se encuentra registrado con ese Correo";
      } else
      {
         $sql = "INSERT INTO  login ( Usuario ,  Clave ,  Estado) VALUES (
                  '" . $datos->Cedula . "',
                  '" . md5(date('Y-m-d H:i:s')) . "',
                  'Pendiente')";

         $link->query(utf8_decode($sql));

         $nuevoId = $link->insert_id;

         $sql = "INSERT INTO datosUsuarios(idLogin, Nombre, Cedula, Correo, idCiudad, idArea) VALUES (
                     " . $nuevoId . ",
                     '" . $datos->Nombre . "',
                     '" . $datos->Cedula . "',
                     '" . $datos->Correo . "',
                     '" . $Ciudad . "',
                     '" . $Area . "')";
         $link->query(utf8_decode($sql));

        if ($link->error <> "")
        {
          $Respuesta['Error'] = $link->error;
        } else
        {
            $Respuesta['datos'] = $nuevoId;
        }
      }
   }
   echo json_encode($Respuesta);
?>