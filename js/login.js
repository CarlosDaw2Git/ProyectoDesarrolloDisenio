$(document).ready(function(){
    $('#verificar').click(function(){

        verificarUsuario($('#nombreLogin').val(), $('#claveLogin').val())
    })

    $('#registrarse').click(function(){
        $.ajax({
            type: 'GET',
            url: 'registrarse.html',
            data: {},
            success: function(datosRecogidos){
                $('#form').html(datosRecogidos)
            }
        })
    })
})

$(document).on("click", "#volver",function(){
    window.location.reload()
})

$(document).on("click", "#crearUsuario",function(){
    crearUsuario()
})

function verificarUsuario(nombre, clave){
    if(nombre == ""){
        $('#errorReserva').text(
            "El nombre no puede estar vacío"
        )
        return null
    }
    if(clave == ""){
        $('#errorReserva').text(
            "La contraseña no puede estar vacía"
        )
        return null
    }
    $.ajax({
        data : {
            'verificarUsuario' : 'true',
            'nombre': nombre,
            'clave': clave
        },
        url: 'data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            //$('#errorReserva').html(datosRecogidos)
        }
    })
}

function crearUsuario(){
    $.ajax({
        data : {
            'crearUsuario' : 'true'
        },
        url: 'data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            $('#errorReserva').text(datosRecogidos)
        }
    })
}