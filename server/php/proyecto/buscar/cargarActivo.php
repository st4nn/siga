<?php
  include("../../conectar.php"); 
  include("../datosUsuario.php"); 
   $link = Conectar();

   $idUsuario = addslashes($_POST['Usuario']);
   $Consecutivo = addslashes($_POST['Consecutivo']);

   $Respuesta = array();
   $Respuesta['Error'] = "";



   if ($Consecutivo <> "")
   {
      $sql = "SELECT * FROM v_activos WHERE Consecutivo = '$Consecutivo';";
      $result = $link->query($sql);

      $Respuesta['datos'] = array();

      $Prefijo = "";
      $fotosMismoModelo = 0;
      $Modelo = "";

      if ( $result->num_rows > 0)
      {
         while ($row = mysqli_fetch_assoc($result))
         {
            $Prefijo = $row['id'];
            $fotosMismoModelo = $row['FotosMismoModelo'];
            $Modelo = $row['Modelo'];

            foreach ($row as $key => $value) 
            {
               $Respuesta['datos'][$key] = utf8_encode($value);
            }
         }
      }

      $sql = "SELECT Comentarios.*, datosUsuarios.Nombre FROM Comentarios INNER JOIN datosUsuarios ON Comentarios.idlogin = datosUsuarios.idLogin WHERE idActivo = '$Prefijo' ORDER BY Comentarios.Fecha DESC;";
      $result = $link->query($sql);

      $Respuesta['Comentarios'] = array();

      if ( $result->num_rows > 0)
      {
         $idx = 0;
         while ($row = mysqli_fetch_assoc($result))
         {
            $Respuesta['Comentarios'][$idx] = array();
            foreach ($row as $key => $value) 
            {
               $Respuesta['Comentarios'][$idx][$key] = utf8_encode($value);
            }
            $idx++;
         }
      }
      $sql = "SELECT Archivos.*, datosUsuarios.Nombre FROM Archivos INNER JOIN datosUsuarios ON Archivos.idlogin = datosUsuarios.idLogin WHERE idActivo = '$Prefijo' ORDER BY Archivos.FechaCargue DESC;";
      if ($fotosMismoModelo == 1)
      {
         $sql =  "SELECT Archivos.*, datosUsuarios.Nombre FROM Archivos INNER JOIN datosUsuarios ON Archivos.idlogin = datosUsuarios.idLogin WHERE idActivo = '$Prefijo' UNION ALL
               SELECT Archivos.*, datosUsuarios.Nombre FROM Archivos INNER JOIN datosUsuarios ON Archivos.idlogin = datosUsuarios.idLogin INNER JOIN activos ON Archivos.idActivo = activos.id AND activos.Modelo = '$Modelo' WHERE idActivo <> '$Prefijo'";
      }

      $result = $link->query($sql);

      $Respuesta['Archivos'] = array();

      if ( $result->num_rows > 0)
      {
         $idx = 0;
         while ($row = mysqli_fetch_assoc($result))
         {
            $Respuesta['Archivos'][$idx] = array();
            foreach ($row as $key => $value) 
            {
               $Respuesta['Archivos'][$idx][$key] = utf8_encode($value);
            }
            $idx++;
         }
      }

      $sql = "SELECT 
               Traslados.*, 
               Responsable.Nombre AS 'Responsable_Nombre',
               areaResponsable.Nombre AS 'Responsable_Area',
               Recibe.Nombre AS 'Recibe_Nombre',
               areaRecibe.Nombre AS 'Recibe_Area'
            FROM 
               Traslados 
               LEFT JOIN datosUsuarios AS Responsable ON Traslados.idResponsable = Responsable.idLogin 
               LEFT JOIN areas AS areaResponsable ON Responsable.idArea = areaResponsable.id
               LEFT JOIN datosUsuarios AS Recibe ON Traslados.idRecibe = Recibe.idLogin 
               LEFT JOIN areas AS areaRecibe ON Recibe.idArea = areaRecibe.id
            WHERE 
               idActivo = '$Prefijo' 
            ORDER 
               BY Fecha DESC;";

      $result = $link->query($sql);

      $Respuesta['Traslados'] = array();

      if ( $result->num_rows > 0)
      {
         $idx = 0;
         while ($row = mysqli_fetch_assoc($result))
         {
            $Respuesta['Traslados'][$idx] = array();
            foreach ($row as $key => $value) 
            {
               $Respuesta['Traslados'][$idx][$key] = utf8_encode($value);
            }
            $idx++;
         }
      }

   } else
   {
      $Respuesta['Error'] = "No se envió el consecutivo";
   }

   
   if ($link->error <> "")
   {
      $Respuesta['Error'] = $link->error;
   }

   echo json_encode($Respuesta);
?>