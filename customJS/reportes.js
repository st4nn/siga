function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Reportes");

    $("#btnReportes_Filtros_AgregarParametro").on("click", function(evento)
    {
        evento.preventDefault();
        var modelo = $("#cntReportes_Filtros_PrimeraFila").html();
        modelo = modelo.replace(' hide', '');
        modelo = modelo.replace('btnReportes_Filtros_BorrarParametro_fake', 'btnReportes_Filtros_BorrarParametro');
        
        $("#cntReportes_Filtros_Filas").append('<div class="row">' + modelo + '</div>');
    });

    $(document).delegate('.btnReportes_Filtros_BorrarParametro', 'click', function(event) {
        $(this).parent("div").parent("div").remove();
    });

    $("#lnkReportes_Crear").on("click", function()
    {
        $("#cntReportes_Guardados").hide();
        $("#ctnReportes_Crear").show();

        $("#lnkReportes_Crear").hide();
        $("#lnkReportes_Guardados").show();

        $("#ctnReportes_Crear").addClass('bounceInRight')

        setTimeout(function(){
            $("#ctnReportes_Crear").removeClass('bounceInRight');
        }, 1200);
    });

    $("#lnkReportes_Guardados").on("click", function()
    {
        $("#cntReportes_Guardados").show();
        $("#ctnReportes_Crear").hide();

        $("#lnkReportes_Crear").show();
        $("#lnkReportes_Guardados").hide();

        $("#cntReportes_Guardados").addClass('bounceInLeft')

        setTimeout(function(){
            $("#cntReportes_Guardados").removeClass('bounceInLeft');
        }, 1200);
    });

    $(".btnReportes_Consultar").on("click", function()
    {
        var obj = generarParametrosReporte();
        if (obj != false)
        {
            generarReporte(obj[0], obj[1], obj[2], 0);
        }
    });
	
}

function generarParametrosReporte(callback)
{
    if (callback === undefined)
    {callback = function(){};}

    var arrEncabezado = $("#cntReportes_Encabezado input:checked");

    if (arrEncabezado.length == 0)
    {
        Mensaje("Error", "Debe seleccionar por lo menos un elemento del Encabezado", "danger");
        return false;
    } else
    {
        var strEncabezado = "";
        $.each(arrEncabezado, function(index, val) 
        {
            strEncabezado += $(val).attr("data-campo") + ", ";
        });

        var len = strEncabezado.length - 2;
        strEncabezado = strEncabezado.substr(0, len);

        var arrAgrupados = $("#cntReportes_Agrupado select");
        var strAgrupado = "";

        $.each(arrAgrupados, function(index, val) 
        {
             if ($(val).val() > 0)
             {
                strAgrupado += $(val).attr("data-campo") + "#" + $(val).val() + ",";
             }
        });

        len = strAgrupado.length - 1;
        strAgrupado = strAgrupado.substr(0, len);

        var filas = $("#cntReportes_Filtros_Filas").find(".row");
        
        var datos = [];
        var idx = 0;

        $.each(filas, function(index, val) 
        {
            if ($(val).find('.txtReportes_Filtros_Filtro').val() != "")
            {
                datos[idx] = {
                    concatenador : $(val).find('.txtReportes_Filtros_Concatenador').val(),
                    parametro : $(val).find('.txtReportes_Filtros_Campo').val(),
                    condicion : $(val).find('.txtReportes_Filtros_Condicion').val(),
                    filtro : $(val).find('.txtReportes_Filtros_Filtro').val()
                };
                idx++;
            }
        });

        callback();
        return [datos, strEncabezado, strAgrupado];
    }
}

function generarReporte(datos, strEncabezado, strAgrupado, guardado, callback)
{
    if (callback === undefined)
    {callback = function(){};}

    $.post('server/php/proyecto/reportes/cargarReporte.php', {Usuario: Usuario.id, datos: datos, encabezado: strEncabezado, agrupado : strAgrupado, guardar : guardado}, function(data, textStatus, xhr) 
    {
        if (data.Error != "")
        {
            Mensaje("Error", data.Error, "danger");
        }
        else
        {
            if (data.datos == 0)
            {
                Mensaje("Hey", "Ningún registro coincide con los parámetros enviados", "warning");
            } else
            {
                $("#cntReportes_Resultado_Tabla table").bootgrid('destroy');
                $("#cntReportes_Resultado_Tabla table").remove();
                var tds = "";
                var pPrefijo = obtenerPrefijo();

                tds += '<table id="tblResultado_' + pPrefijo+'" class="table table-striped">';
                    tds += '<thead><tr>';

                    $.each(data.datos[0], function(index, val) 
                    {
                         tds += '<th data-column-id="' + index + '">' + index + '</th>';
                    });
                    tds += '</tr></thead>';
                    tds += '<tbody>';
                    $.each(data.datos, function(index, val) 
                    {
                        tds += '<tr>';
                        $.each(val, function(index2, val2) 
                        {
                             tds += '<td>' + val2 + '</td>';
                        });
                        tds += '</tr>';
                    });
                    tds += '</tbody>';
                tds += '</table>';

                $("#cntReportes_Resultado_Tabla").append(tds);
                console.log(tds);

                $("#cntReportes_Resultado_Tabla table").bootgrid({
                    css: {
                        icon: 'zmdi icon',
                        iconColumns: 'zmdi-view-module',
                        iconDown: 'zmdi-expand-more',
                        iconRefresh: 'zmdi-refresh',
                        iconUp: 'zmdi-expand-less'
                    },
                    caseSensitive: false,
                    multiSort: true,
                    selection: true,
                    multiSelect: false,
                    rowSelect: true,
                    keepSelection: true
                });
            }
        }
    }, "json");
    
}