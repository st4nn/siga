$(document).ready(arranque);
function arranque()
{
	if(localStorage.wsp_siga)
	{window.location.replace("home.html");}

	$("#Login").submit(Login_Submit);
}
function btnMouseOver () 
{
	var obj = document.getElementById('imgLogo');
	obj.src = "img/wsplogo.png";
}
function btnMouseOut () 
{
	var obj = document.getElementById('imgLogo');
	obj.src = "img/wsplogo_negro.png";
}
function Login_Submit(evento)
{
	evento.preventDefault();
	if (validar("#Login"))
	{
		var cDate = new Date();
		$.post("php/validarUsuario.php", 
	    {
	      pUsuario : $("#txtLogin_Usuario").val(),
	      pClave : $("#txtLogin_Clave").val(),
	      pFecha : cDate
	    }, function (data)
	    {
	      if (data != 0)
	      {
	      	if (typeof(data) == "object")
	      	{
	        	localStorage.setItem("wsp_siga", JSON.stringify(data));  
	        	window.location.replace("home.html");
	      	}
	      } else
	      {
	        $(".alert").html("<strong>Error!</strong> Acceso denegado.");
	        $(".alert").fadeIn(300).delay(2600).fadeOut(600);
	      }
	      
	    }, 'json').fail(function()
	    {
	      $(".alert").html("<strong>Error!</strong> No hay conexión.");
	      $(".alert").fadeIn(300).delay(2600).fadeOut(600);
	    });
	} 
}
function validar(elemento)
{
	var obj = $(elemento + ' [required]');
	var bandera = true;
	$.each(obj, function(index, val) 
	{
		 if (($(val).prop("tagName") == "SELECT" && $(val).val() == 0) || $(val).val() == "")
		 {
		 	$(val).focus();
		 	bandera = false;
			return false;
		 }
	});
	return bandera;
}