function iniciarModulo()
{
	$("#lblHeader_NomModulo").text("Usuarios");
	
	$("#tblUsuarios_Resultado").bootgrid({
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
                }).on("selected.rs.jquery.bootgrid", function (e, row)
                {
                    $("#txtUsuarios_idUsuario").val(row[0].id);

                    var posicion = $("tr[data-row-id=" + row[0].id + "]").position();

                    $("#cntUsuarios_SubMenu").show();
                    $("#cntUsuarios_SubMenu").css("top", posicion.top);
                }).on("deselected.rs.jquery.bootgrid", function (e, row)
                {
                    $("#txtUsuarios_idUsuario").val("");
                    $("#cntUsuarios_SubMenu").hide();
                });
}