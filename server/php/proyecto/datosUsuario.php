<?php

   function datosUsuario($idUsuario)
   {
      $link = Conectar();
    
      $sql = "SELECT 
               Login.idLogin,
               Login.Usuario,
               Login.Estado,
               Login.idPerfil,
               DatosUsuarios.idCiudad,
               DatosUsuarios.idArea,
               DatosUsuarios.Nombre,
               DatosUsuarios.Cedula,
               DatosUsuarios.Correo
            FROM 
               login AS Login
               INNER JOIN datosusuarios AS DatosUsuarios ON Login.idLogin = DatosUsuarios.idLogin
            WHERE 
               Login.idLogin = $idUsuario
            GROUP BY
               Login.idLogin";
      
      $result = $link->query($sql);

      if ( $result->num_rows > 0)
      {
         $idx = 0;
            $Usuarios = array();
            while ($row = mysqli_fetch_assoc($result))
            { 
               foreach ($row as $key => $value) 
               {
                  $Usuarios[$key] = utf8_encode($value);
               }

               $idx++;
            }
            
               mysqli_free_result($result);  
               return $Usuarios;
      } else
      {
         echo 0;
      }
   }
?>