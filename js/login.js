$.getScript("./js/cookies.js")

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
    let nombre = $('#nombreRegistro').val()
    let clave = $('#claveRegistro').val()
    let repiteClave = $('#repiteClaveRegistro').val()
    crearUsuario(nombre, clave, repiteClave)
})

function verificarUsuario(nombre, clave){
    if(nombre == ""){
        $('#errorReserva').text(
            "El Campo \"Nombre\" no puede estar vacío"
        )
        return null
    }
    if(clave == ""){
        $('#errorReserva').text(
            "El campo \"Contraseña\" no puede estar vacía"
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
            let datosJson = JSON.parse(datosRecogidos)
            if(datosJson.error != null){
                $('#errorReserva').html(datosJson.error)
            }
            else if(datosJson.admin == true){
                document.cookie = "admin=true;max-age=999999999;"
                window.location = "./administrador.html"
            }
            else{
                document.cookie = "usuario="+nombre+";max-age=999999999;"
                window.location = "./index.html"
            }
        }
    })
}

function crearUsuario(nombre, clave, repiteClave){
    if(nombre == ""){
        $('#errorReserva').text(
            "El Campo \"Nombre\" no puede estar vacío"
        )
        return null
    }
    if(clave == ""){
        $('#errorReserva').text(
            "El campo \"Contraseña\" no puede estar vacía"
        )
        return null
    }
    if(clave != repiteClave){
        $('#errorReserva').text(
            "Las contraseñas no cohinciden"
        )
        return null
    }
    
    $.ajax({
        data : {
            'crearUsuario' : 'true',
            'nombre': nombre,
            'clave': clave
        },
        url: 'data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            $('#errorReserva').text(datosRecogidos)
        }
    })
}