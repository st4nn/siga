<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = $_POST['Usuario'];
   $datos = json_decode($_POST['datos']);

   foreach ($datos as $key => $value) 
   {
      if ($key <> 'Categorias')
      {
         $datos->$key = addslashes($value);
      }
   }

   $Categorias = "";
   foreach ($datos->Categorias as $key => $value) 
   {
      $value = addslashes($value);
      $sql = "SELECT id FROM Etiquetas WHERE Nombre LIKE '$value'";
      $result = $link->query(utf8_decode($sql));

      if ($result->num_rows > 0)
      {
         $fila =  $result->fetch_array(MYSQLI_ASSOC);
         $Categorias .= $fila['id'] . ",";
      } else
      {
         $sql = "INSERT INTO Etiquetas (Nombre) VALUES ('$value');";
         $link->query(utf8_decode($sql));
         $Categorias .= $link->insert_id . ",";
      }
   }

   $id = "NULL";

   if (array_key_exists("id", $datos))
   {
      if ($datos->id > 0)
      {
         $id = $datos->id;
      }
   } 

   $sql = "INSERT INTO activos(id, Nombre, Placa, idSede, idArea, idResponsable, Responsable, Descripcion, idEstadoActivo, Serial, Modelo, Marca, Proveedor, Factura, Valor, FotosMismoModelo, FechaIngreso) VALUES (
            " . $id . ",
            '" . $datos->Nombre . "',
            '" . $datos->Placa . "',
            '" . $datos->idSede . "',
            '" . $datos->idArea . "',
            '" . $datos->idResponsable . "',
            '" . $datos->Responsable . "',
            '" . $datos->Descripcion . "',
            '" . $datos->idEstadoActivo . "',
            '" . $datos->Serial . "',
            '" . $datos->Modelo . "',
            '" . $datos->Marca . "',
            '" . $datos->Proveedor . "',
            '" . $datos->Factura . "',
            '" . $datos->Valor . "',
            '" . $datos->FotosMismoModelo . "',
            '" . $datos->FechaIngreso . "')
         ON DUPLICATE KEY UPDATE
            Nombre = VALUES(Nombre), 
            Placa = VALUES(Placa), 
            idSede = VALUES(idSede), 
            idArea = VALUES(idArea), 
            Descripcion = VALUES(Descripcion), 
            idEstadoActivo = VALUES(idEstadoActivo), 
            Serial = VALUES(Serial), 
            Modelo = VALUES(Modelo), 
            Marca = VALUES(Marca), 
            Proveedor = VALUES(Proveedor), 
            Factura = VALUES(Factura), 
            Valor = VALUES(Valor), 
            FotosMismoModelo = VALUES(FotosMismoModelo);";


   $link->query(utf8_decode($sql));
   
   $nuevoId = $datos->id;

  if ($link->error <> "")
  {
    $link->error;
  } else
  {
      if ($Categorias <> "")
      {
         $Categorias = substr($Categorias, 0, -1);
         $arrCategorias = explode(",", $Categorias);
         $values = "";
         foreach ($arrCategorias as $key => $value) 
         {
            if ($value <> "")
            {
               $values .= "('$nuevoId', '$value'), ";
            }
         }
         $values = substr($values, 0, -2);
         $sql = "INSERT INTO activos_has_Etiquetas (idActivo, idEtiqueta) VALUES " . $values . ";";
         $link->query(utf8_decode($sql));
      }

      echo $datos->id;
  }
?>