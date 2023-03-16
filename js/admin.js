$(document).ready(function(){
    if(!comprobarCookie('admin')){
        $("#divContenido").html(
            "<h2 class='text-danger text-center'>\
            FATAL ERROR: USUARIO NO AUTORIZADO"
        )
    }
    else{
        $.ajax({
            data : {
                'verSalas' : 'true'
            },
            url: 'data/BD_Manager.php',
            type: 'POST',
            success: function(datosRecogidos){
                mostrarContenido(JSON.parse(datosRecogidos))
            }
        })
    }

    $('#salir').click(function(){
        document.cookie = "admin=;max-age=0;"
        window.location = "./login.html"
    })

    $('#updateSala').click(function(){
        updateSala($(this).parent().parent())
    })    
})

$(document).on('click', '.btnModificar', function(){
    let fila = $(this).parent().parent()
    $('#nombreSala').text(fila.find('td').eq(0).text())
    $('#numFilas').val(fila.find('td').eq(1).text())
    $('#numButacas').val(fila.find('td').eq(2).text())
})

//FUNCIONES
function mostrarContenido(datosJson){
    html = '<table class="text-light text-center" id="tablaSalas">\
                <tr>\
                    <th>Nombre de la sala</th>\
                    <th>Número de filas</th>\
                    <th>Nombre de butacas</th>\
                    <th>Modificar sala</th>\
                </tr>'
    for (let i = 0; i < datosJson.length; i++) {
        let sala = datosJson[i];
        html += '\
        <tr>\
            <td>Sala '+sala.id+'</td>\
            <td>'+sala.numFilas+'</td>\
            <td>'+sala.numButacas+'</td>\
            <td>\
                <button type="button" class="btn btn-outline-light btnModificar" \
                data-bs-toggle="modal" data-bs-target="#modalEditar">\
                Modificar</button>\
            </td>\
        </tr>'
    }
    html += '</table>'
    $('#divContenido').html(html)
}

function updateSala(modal){
    $('#errorReserva').text("")

    //Recopilando datos
    let idSala = modal.find('#nombreSala').text().split(" ")[1]
    let numFilas = modal.find('#numFilas').val()
    let numButacas = modal.find('#numButacas').val()
 
    //Comprobando que no estén vacíos
    if(numFilas == ""){
        $('#errorReserva').text(
            "El campo \"Número de filas\" no puede estar vacía"
        )
        return null
    }
    if(numButacas == ""){
        $('#errorReserva').text(
            "El campo \"Numero de butacas\" no puede estar vacía"
        )
        return null
    }

    //Enviamos los datos
    $.ajax({
        data : {
            'updateSala' : 'true',
            'idSala': idSala,
            'numFilas': numFilas,
            'numButacas': numButacas
        },
        url: 'data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            let datosJson = JSON.parse(datosRecogidos)
            if(datosJson.success == true){
                window.location.reload()
            }
            else{
                $('#errorReserva').text(datosJson.error)
            }
        }
    })
}