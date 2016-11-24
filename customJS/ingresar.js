function iniciarModulo()
{
	$("#txtIngresar_id").val(obtenerPrefijo());
	$("#txtIngresar_FechaIngreso").datetimepicker(
    {
        format: 'YYYY-MM-DD',
        inline: true,
        sideBySide: true,
        locale: 'es'
    });

    $("#frmIngresar_AgregarCategoria").on("submit", function(evento)
    {   
        evento.preventDefault();
        if ($("#txtIngresar_AgregarCategoria_Nombre").val() != "")
        {
            $("#txtIngresar_Categorias").append('<option val="' + $("#txtIngresar_AgregarCategoria_Nombre").val() + '">' + $("#txtIngresar_AgregarCategoria_Nombre").val() + '</option>');
            $('#txtIngresar_Categorias').selectpicker("refresh");
        }
        $("#cntIngresar_AgregarCategoria").modal("hide");
    });

    $("#txtIngresar_Ciudad").cargarDatosConf("configuracion/cargarCombo", function()
        {
            $("#txtIngresar_Ciudad").trigger('change');
        }, {Tabla : 'ciudades'});

    $("#txtIngresar_idArea").cargarDatosConf("configuracion/cargarCombo", function()
        {
        	$("#txtIngresar_idArea").prepend('<option value="0">Ninguno</option>');
        }, {Tabla : 'areas'});

    $("#txtIngresar_idEstadoActivo").cargarDatosConf("configuracion/cargarCombo", function()
        {}, {Tabla : 'estadosActivo'});            

    $("#txtIngresar_Ciudad").on("change", function()
    {
        var idCiudad = $("#txtIngresar_Ciudad").val();
        $("#txtIngresar_idSede").cargarDatosConf("configuracion/cargarCombo", function()
        {
        	$("#txtIngresar_idSede").prepend('<option value="0">Ninguna</option>');
        }, {Tabla : 'sedes', Condicion: 'idCiudad#=#' + idCiudad});
    });

    $('#txtIngresar_idResponsable').on('loaded.bs.select', function (e) 
    {
  		var objeto = $("#txtIngresar_idResponsable").parent(".bootstrap-select").find(".bs-searchbox").find("input");

  		$(objeto).on("change keyup paste", function()
  		{
  			cargarResponsables($(objeto).val());
  		});
	});

    $("#frmIngresar").on("submit", function(evento)
    {
        evento.preventDefault();
        $("#frmIngresar").generarDatosEnvio("txtIngresar_", function(datos)
        {
            $.post('server/php/proyecto/ingresar/crearActivo.php', {Usuario: Usuario.id,datos: datos}, function(data, textStatus, xhr) 
            {
            	if (parseInt(data) > 0)
            	{
            		Mensaje("Hey", "Activo ingresado exitosamente", "success");

            		$("#txtIngresar_Nombre").val("");
            		$("#txtIngresar_Descripcion").val("");
            		$("#txtIngresar_Detalles").val("");
            		$("#txtIngresar_Serial").val("");
            		$("#txtIngresar_Modelo").val("");
            		$("#txtIngresar_Marca").val("");
            		$("#txtIngresar_Placa").val("");
            		$("#txtIngresar_Proveedor").val("");
            		$("#txtIngresar_Factura").val("");
            		$("#txtIngresar_Valor").val("");
            		$("#txtIngresar_FotosMismoModelo").prop("checked", false);

            		$('#txtIngresar_Categorias').selectpicker("deselectAll");
            		$("#cntIngresar_DivArchivo_Listado a").remove();
            	} else
            	{
            		Mensaje("Error", data, "danger");
            	}
            });
        });
    });

    var files;
    $("#txtIngresar_Archivo").on("change", function(event)
    {
    	$("#txtIngresar_ArchivoDescripcion").val("");
    	$("#cntIngresar_Archivo").modal("show");
    	$("#lblIngresar_Archivo_Nombre").text($("#txtIngresar_Archivo").val().replace("C:\\fakepath\\", ""));
    	$("#txtIngresar_ArchivoDescripcion").focus();

    	files = event.target.files;
    });

    $("#frmIngresar_Archivo").on("submit", function(evento)
    {
    	evento.preventDefault();
	    $("#cntIngresar_Archivo").modal("hide");

    	var data = new FormData();

    	$.each(files, function(key, value)
	    {
	        data.append(key, value);
	    });

	    data.append("idActivo", $("#txtIngresar_id").val());
	    data.append("Observaciones", $("#txtIngresar_ArchivoDescripcion").val());
	    data.append("Usuario", Usuario.id);

	    var nomArchivo = files[0].name;
	    $.ajax({
		        url: 'server/php/proyecto/ingresar/subirArchivos.php',
		        type: 'POST',
		        data: data,
		        cache: false,
		        dataType: 'html',
		        processData: false, // Don't process the files
		        contentType: false, // Set content type to false as jQuery will tell the server its a query string request
		        success: function(data, textStatus, jqXHR)
		        {
		            if( parseInt(data) > 1)
		            {
		            	var extension = nomArchivo.split('.');
		            	if (extension.length > 0)
		            	{
		            		extension = extension[extension.length - 1];
		            	} else
		            	{
		            		extension = "obj";
		            	}
		            	var tds = " ";
		               	tds += '<a href="server/Archivos/Activos/' + $("#txtIngresar_id").val() + '/' + nomArchivo + '" target="_blank" class="list-group-item media">';
                            tds += '<div class="pull-left">';
                                tds += '<div class="avatar-char ac-check">';
                                    tds += '<span class="acc-helper palette-Red bg text-uppercase">' + extension + '</span>';
                                tds += '</div>';
                            tds += '</div>';
                            tds += '<div class="media-body">';
                                tds += '<div class="lgi-heading">' + nomArchivo.replace(extension, "") + '</div>';
                                tds += '<small class="lgi-text">' + $("#txtIngresar_ArchivoDescripcion").val() + '</small>';
                            tds += '</div>';
                        tds += '</a>';

                        $("#cntIngresar_DivArchivo_Listado").prepend(tds);
		            }
		            else
		            {
		                Mensaje('Error:', data, "danger");
		            }
		        },
		        error: function(jqXHR, textStatus, errorThrown)
		        {
		            // Handle errors here
		            Mensaje('Error:', textStatus, "danger");
		            $("#cntIngresar_Archivo").modal("show");
		        }
		    });
    });

    $("#btnIngresar_Archivo_Cancelar").on("click", function(evento)
	{
		evento.preventDefault();
		$("#cntIngresar_Archivo").modal("hide");
	});

	$("#frmIngresar_AgregarResponsable").on("submit", function(evento)
		{
			evento.preventDefault();
			$("#frmIngresar_AgregarResponsable").generarDatosEnvio("txtIngresar_AgregarResponsable_", function(datos)
			{
				$.post('server/php/proyecto/ingresar/agregarResponsable.php', 
					{
						Usuario: Usuario.id,
						datos: datos, 
						Ciudad : $("#txtIngresar_Ciudad").val(), 
						Area : $("#txtIngresar_idArea").val()
					}, function(data, textStatus, xhr) 
	            {
	            	if (data.Error == "")
	            	{
	            		Mensaje("Hey", "Se agregó el responsable", "success", "bottom");
	            		$('#txtIngresar_idResponsable').append('<option value="' + data.datos + '" data-tokens="' + $("#txtIngresar_AgregarResponsable_Cedula").val() + ' ' + $("#txtIngresar_AgregarResponsable_Nombre").val() + '">' + $("#txtIngresar_AgregarResponsable_Nombre").val() + '</option>');
	            		$("#txtIngresar_AgregarResponsable_Cedula").val("");
	            		$("#txtIngresar_AgregarResponsable_Nombre").val("");
	            		$('#txtIngresar_idResponsable').selectpicker("refresh");
	            		$("#cntIngresar_AgregarResponsable").modal("hide");
	            	} else
	            	{
	            		Mensaje("Error", data.Error, "danger");
	            	}
	            }, "json");
			});
		});
}

function cargarResponsables(parametro)
{
	if (parametro === undefined)
	{
		parametro = "";
	}
	var estado = $("#txtIngresar_idResponsable").attr("data-estado");
	if (estado == "listo")
	{
		$("#txtIngresar_idResponsable").attr("data-estado", "buscando");
		$("#txtIngresar_idResponsable option").remove();
		
		$.post('server/php/proyecto/ingresar/cargarResponsables.php', {Parametro : parametro, Ciudad: $("#txtIngresar_Ciudad").val(), Area: $("#txtIngresar_idArea").val()}, function(data, textStatus, xhr) 
		{
			if (data != 0 && typeof(data) == 'object')
			{
				$("#txtIngresar_idResponsable").llenarCombito(data, function(){
					$('#txtIngresar_idResponsable').selectpicker("refresh");
				});
			}
			$("#txtIngresar_idResponsable").attr("data-estado", "listo");
	
		}, "json").fail(function()
		{
			$("#txtIngresar_idResponsable").attr("data-estado", "listo");		
		});
	}

	$.fn.llenarCombito = function(data, callback)
	{
	  if (callback === undefined)
	    {callback = function(){};}

	  var elemento = $(this);
	      var tds = "";
	      $.each(data, function(index, val) 
	      {
	         tds += '<option value="' + val.id + '" data-tokens="' + val.Cedula + ' ' + val.Nombre + '">' + val.Nombre + '</option>';
	      });
	  elemento.append(tds);
	  callback();
	}
}