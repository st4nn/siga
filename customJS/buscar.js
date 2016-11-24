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
				}
			} else
			{
				Mensaje("Error", data.Error, "danger");
			}

			$("#cntCargando").hide();
		}, "json");
}