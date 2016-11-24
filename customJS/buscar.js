function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Buscar Activos");

	$("#frmBuscar_BusquedaSimple").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#cntCargando").show();

		$.post('server/php/proyecto/buscar/busquedaSimple.php', {Usuario: Usuario.id, Parametro : $("#txtBuscar_BusquedaSimple_Parametro").val()}, function(data, textStatus, xhr) 
		{
			if (data.Error == "")
			{
				if (data.datos == 0)
				{
					Mensaje("Hey", "Ningún dato coincide con la búsqueda", "warning");
				} else
				{
					$("#tblBuscar_Resultados").bootgrid("append", data.datos);
					$("#cntBuscar_Resultados").slideDown();
				}
			} else
			{
				Mensaje("Error", data.Error, "danger");
			}

			$("#cntCargando").hide();
		}, "json").fail(function()
		{
			Mensaje("Error", "No hay conexión con el servidor", "danger");
			$("#cntCargando").hide();
		});
	})

	$("#tblBuscar_Resultados").bootgrid({
                    css: {
                        icon: 'zmdi icon',
                        iconColumns: 'zmdi-view-module',
                        iconDown: 'zmdi-expand-more',
                        iconRefresh: 'zmdi-refresh',
                        iconUp: 'zmdi-expand-less'
                    },
                    caseSensitive: false,
                    multiSort: true,
                    formatters: {
				        "commands": function(column, row)
				        {
				            return "<button type=\"button\" class=\"btn btn-warning btn-icon waves-effect waves-circle waves-float btnBuscar_ItemSeleccionado\" data-row-id=\"" + row.id + "\"><span class=\"zmdi zmdi-arrow-forward\"></span></button> ";
				        }
				    }
                }).on("loaded.rs.jquery.bootgrid", function()
				{
					$("#tblBuscar_Resultados .btnBuscar_ItemSeleccionado").on('click', function(event) 
				    {

				    	var consecutivo = $(this).attr("data-row-id");

				        $("#txtBuscar_ItemSeleccionado").val(consecutivo);
				        
				        $("#lnkBuscar_BusquedaAvanzada").hide();
				        $("#lnkBuscar_BusquedaSimple").hide();
				        $("#lnkBuscar_VolverABusqueda").show();

				        $("#cntBusqueda").hide();
				        $("#cntBuscar_Resultados").hide();

				        $("#cntBusqueda_Detalles").slideDown();

				        cargarActivo();
				    });
				});

	
    $("#lnkBuscar_VolverABusqueda").on("click", function()
    {
        $("#cntBusqueda_Detalles").hide();
        $("#lnkBuscar_VolverABusqueda").hide();
        $("#cntBusqueda").show();
        $("#cntBuscar_Resultados").slideDown();
        $("#lnkBuscar_BusquedaAvanzada").show();
    });

    $("#lnkBuscar_BusquedaAvanzada").on("click", function()
    {
    	$("#cntBusqueda_Simple").hide();
    	$("#lnkBuscar_BusquedaAvanzada").hide();
    	$("#cntBusqueda_Avanzada").show();
    	$("#lnkBuscar_BusquedaSimple").show();

    	$("#cntBusqueda_Avanzada").addClass('bounceInRight')

    	setTimeout(function(){
            $("#cntBusqueda_Avanzada").removeClass('bounceInRight');
        }, 1200);
    });

    $("#lnkBuscar_BusquedaSimple").on("click", function()
    {
    	$("#cntBusqueda_Avanzada").hide();
    	$("#lnkBuscar_BusquedaSimple").hide();
    	$("#lnkBuscar_BusquedaAvanzada").show();
    	$("#cntBusqueda_Simple").show();

    	$("#cntBusqueda_Simple").addClass('bounceInLeft')

    	setTimeout(function(){
            $("#cntBusqueda_Simple").removeClass('bounceInLeft');
        }, 1200);
    });

    $(document).delegate('.btnBuscar_Avanzada_BorrarParametro', 'click', function(event) {
    	$(this).parent("div").parent("div").remove();
    });

	$(".btnBuscar_Detalles_Editar").on("click", function(evento)
	{   
	    evento.preventDefault();
	    var contenedor = $(this).parent("div")
	    var obj = $(contenedor).find(".form-control");
	    $(this).removeClass("btnBuscar_Detalles_Editar");
	    $(contenedor).find("span").hide();
	    $(contenedor).find("i").removeClass("zmdi-border-color");
	    $(contenedor).find("i").addClass("zmdi-floppy");                
	    $(contenedor).find("i").addClass("btnBuscar_Detalles_Guardar");   

	    $(obj).show();
	    $(obj).focus();
	    
	    $(this).addClass("btnBuscar_Detalles_Guardar");
	});

	$("#btnBuscar_Avanzada_AgregarParametro").on("click", function(evento)
	{
		evento.preventDefault();
		var modelo = $("#cntBuscar_Avanzada_PrimeraFila").html();
		modelo = modelo.replace(' hide', '');
		modelo = modelo.replace('btnBuscar_Avanzada_BorrarParametro_fake', 'btnBuscar_Avanzada_BorrarParametro');
		
		$("#cntBuscar_Avanzada_Filas").append('<div class="row">' + modelo + '</div>');
	});

	$("#frmBuscar_BusquedaAvanzada").on("submit", function(evento)
	{
		evento.preventDefault();
		$("#cntCargando").show();
		var filas = $("#cntBuscar_Avanzada_Filas").find(".row");

		var datos = [];
		var idx = 0;

		$.each(filas, function(index, val) 
		{
			if ($(val).find('.txtBuscar_Avanzada_Filtro').val() != "")
			{
				datos[idx] = {
					concatenador : $(val).find('.txtBuscar_Avanzada_Concatenador').val(),
					parametro : $(val).find('.txtBuscar_Avanzada_Campo').val(),
					condicion : $(val).find('.txtBuscar_Avanzada_Condicion').val(),
					filtro : $(val).find('.txtBuscar_Avanzada_Filtro').val()
				};
				idx++;
			} else
			{
				$(val).find('.btnBuscar_Avanzada_BorrarParametro').trigger('click');
			}
		});

		if (idx > 0)
		{
			$.post('server/php/proyecto/buscar/busquedaAvanzada.php', {datos: datos}, function(data, textStatus, xhr) 
			{
				if (data.Error == "")
				{
					if (data.datos == 0)
					{
						Mensaje("Hey", "Ningún dato coincide con la búsqueda", "warning");
					} else
					{
						$("#tblBuscar_Resultados").bootgrid("append", data.datos);
						$("#cntBuscar_Resultados").slideDown();
					}
				} else
				{
					Mensaje("Error", data.Error, "danger");
				}

				$("#cntCargando").hide();
			}, "json").fail(function()
			{
				Mensaje("Error", "No hay conexión con el Servidor", "danger");
				$("#cntCargando").hide();
			});
		} else
		{
			$("#cntCargando").hide();
			Mensaje("Hey", "Debe ingresar por lo menos un filtro", "warning");
		}
	});

	$("#txtBuscar_Traslado_Ciudad").cargarDatosConf("configuracion/cargarCombo", function()
    {
        $("#txtBuscar_Traslado_Ciudad").trigger('change');
    }, {Tabla : 'ciudades'});

    $("#txtBuscar_Traslado_Ciudad").on("change", function()
    {
        var idCiudad = $("#txtBuscar_Traslado_Ciudad").val();
        $("#txtBuscar_Traslado_Sede").cargarDatosConf("configuracion/cargarCombo", function()
        {
        	$("#txtBuscar_Traslado_Sede").prepend('<option value="0">Ninguna</option>');
        }, {Tabla : 'sedes', Condicion: 'idCiudad#=#' + idCiudad});
    });

    $("#txtBuscar_Traslado_CentroDeCosto").cargarDatosConf("configuracion/cargarCombo", function()
        {
        	$("#txtBuscar_Traslado_CentroDeCosto").prepend('<option value="0">Ninguno</option>');
        }, {Tabla : 'areas'});

    $('#txtBuscar_Traslado_idResponsable').on('loaded.bs.select', function (e) 
    {
  		var objeto = $("#txtBuscar_Traslado_idResponsable").parent(".bootstrap-select").find(".bs-searchbox").find("input");

  		$(objeto).on("change keyup paste", function()
  		{
  			cargarResponsables($(objeto).val());
  		});
	});

    $("#frmBuscar_AgregarResponsable").on("submit", function(evento)
        {
            evento.preventDefault();
            $("#frmBuscar_AgregarResponsable").generarDatosEnvio("txtBuscar_AgregarResponsable_", function(datos)
            {
                $.post('server/php/proyecto/Buscar/agregarResponsable.php', 
                    {
                        Usuario: Usuario.id,
                        datos: datos, 
                        Ciudad : $("#txtBuscar_Traslado_Ciudad").val(), 
                        Area : $("#txtBuscar_Traslado_CentroDeCosto").val()
                    }, function(data, textStatus, xhr) 
                {
                    if (data.Error == "")
                    {
                        Mensaje("Hey", "Se agregó el responsable", "success", "bottom");
                        $('#txtBuscar_Traslado_idResponsable').append('<option value="' + data.datos + '" data-tokens="' + $("#txtBuscar_AgregarResponsable_Cedula").val() + ' ' + $("#txtBuscar_AgregarResponsable_Nombre").val() + '">' + $("#txtBuscar_AgregarResponsable_Nombre").val() + '</option>');
                        $("#txtBuscar_AgregarResponsable_Cedula").val("");
                        $("#txtBuscar_AgregarResponsable_Nombre").val("");
                        $("#txtBuscar_AgregarResponsable_Correo").val("");
                        $('#txtBuscar_Traslado_idResponsable').selectpicker("refresh");
                        $("#cntBuscar_AgregarResponsable").modal("hide");
                    } else
                    {
                        Mensaje("Error", data.Error, "danger");
                    }
                }, "json");
            });
        });
}

function cargarActivo()
{
	$("#cntBuscar_Resultados_Archivos a").remove();
	$("#tblBuscar_Resultados_Traslados tbody tr").remove();
	$("#cntBuscar_Resultados_Comentarios a").remove();

	$.post('server/php/proyecto/buscar/cargarActivo.php', {Usuario: Usuario.id, Consecutivo: $("#txtBuscar_ItemSeleccionado").val()}, 
		function(data, textStatus, xhr) 
		{
			if (data.Error == "")
			{
				if (data.datos == 0)
				{
					Mensaje("Hey", "Ningún dato coincide con la búsqueda", "warning");
				} else
				{
					$.each(data.datos, function(index, val) 
					{
						if ($("#txtBuscar_Resultado_" + index).length > 0)							 
						{
							var obj = $("#txtBuscar_Resultado_" + index);
							$(obj).val(val);
							$(obj).parent("div").find("span").text(val);
						}
					});			

					var tds = "";
					if (data.Comentarios.length > 0)
					{
						tds = "";
						$.each(data.Comentarios, function(index, val) 
						{
							tds += '<a href="" class="list-group-item media">';
                                tds += '<div class="pull-left">';
                                    tds += '<img class="avatar-img" src="img/profile-pics/1.jpg" alt="">';
                                tds += '</div>';
                                tds += '<div class="media-body">';
                                    tds += '<div class="lgi-heading">' + val.Nombre + ' <small class="pull-right">' + calcularTiempoPublicacion(val.Fecha) + '</small></div>';
                                    tds += '<small class="lgi-text">' + val.Comentario + '</small>';
                                tds += '</div>';
                            tds += '</a>';
						});

						$("#cntBuscar_Resultados_Comentarios").append(tds);
					}

					if (data.Archivos.length > 0)
					{
						tds = "";
						$.each(data.Archivos, function(index, val) 
						{
							var extension = val.Nombre.split('.');
			            	if (extension.length > 0)
			            	{
			            		extension = extension[extension.length - 1];
			            	} else
			            	{
			            		extension = "obj";
			            	}
							if (extension == "jpg" || extension == "jpeg" || extension == "png" || extension == "gif")
							{
								tds += '<div class="col-xs-3">';
	                                tds += '<a href="">';
	                                    tds += '<img src="server/' + val.Ruta + '/' + val.Nombre + '" alt="">';
	                                tds += '</a>';
	                            tds += '</div>';
							} else
							{
								tds += '<a href="server/' + val.Ruta + '/' + val.Nombre + '" target="_blank" class="list-group-item media">';
		                            tds += '<div class="pull-left">';
		                                tds += '<div class="avatar-char ac-check">';
		                                    tds += '<span class="acc-helper palette-Red bg text-uppercase">' + extension + '</span>';
		                                tds += '</div>';
		                            tds += '</div>';
		                            tds += '<div class="media-body">';
		                                tds += '<div class="lgi-heading">' + val.Nombre.replace(extension, "") + '</div>';
		                                tds += '<small class="lgi-text">' + val.Observaciones + '</small>';
		                            tds += '</div>';
		                        tds += '</a>';
							}
							
						});

						$("#cntBuscar_Resultados_Comentarios").append(tds);
					}
				}
			} else
			{
				Mensaje("Error", data.Error, "danger");
			}

			$("#cntCargando").hide();
		}, "json");
}

function cargarResponsables(parametro)
{
	if (parametro === undefined)
	{
		parametro = "";
	}
	var estado = $("#txtBuscar_Traslado_idResponsable").attr("data-estado");
	if (estado == "listo")
	{
		$("#txtBuscar_Traslado_idResponsable").attr("data-estado", "buscando");
		$("#txtBuscar_Traslado_idResponsable option").remove();
		
		$.post('server/php/proyecto/Ingresar/cargarResponsables.php', {Parametro : parametro, Ciudad: $("#txtBuscar_Traslado_Ciudad").val(), Area: $("#txtBuscar_Traslado_Sede").val()}, function(data, textStatus, xhr) 
		{
			if (data != 0 && typeof(data) == 'object')
			{
				$("#txtBuscar_Traslado_idResponsable").llenarCombito(data, function(){
					$('#txtBuscar_Traslado_idResponsable').selectpicker("refresh");
				});
			}
			$("#txtBuscar_Traslado_idResponsable").attr("data-estado", "listo");
	
		}, "json").fail(function()
		{
			Mensaje("Error", "No hay conexión con el servidor", "danger");
			$("#txtBuscar_Traslado_idResponsable").attr("data-estado", "listo");		
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