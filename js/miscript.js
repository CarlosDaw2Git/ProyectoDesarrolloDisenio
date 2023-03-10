//let listadoPeliculas = ["Avatar 2: El camino del agua;192", "Babylon;189", "Los renglones torcidos de Dios;154"]
let butacasOcupadas = []

//CARGA DEL ARCHIVO
//Carga - Index
$(document).ready(function(){
    $('#linkInicio').click(function(){
        $('#contenidoWeb').html("")
    })
    
    $('#linkUbicacion').click(function(){
        $.ajax({
            type: 'GET',
            url: 'mapa.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
    })

    $('#linkAcercaDe').click(function(){
        $.ajax({
            url: './data/datosCine.json',
            dataType: 'json',
            success: mostrarDatosCine,
            error: function(){
                console.log("Error al mostrar la información")
            }
        })
    })

    //Botón de login:
    //document.cookie = "prueba=true;"
    if(comprobarCookie("usuario")){
        $('#linkRegistro').append('<div id="iconoPerfil">2</div>')
        $('#linkRegistro').click(function(){
            $.ajax({
                type: 'GET',
                url: 'perfil.html',
                data: {},
                success: function(datosRecogidos){
                    $('#contenidoWeb').html(datosRecogidos)
                }
            })
        })
    }
    else{
        $('#linkRegistro').click(function(){
            window.location = "login.html"
        })
    }
    

    $('#botonReserva').click(function(){
        //Mostrar formulario de las reservas
        $.ajax({
            type: 'GET',
            url: 'reserva.html',
            data: {},
            success: function(datosRecogidos){
                $('#contenidoWeb').html(datosRecogidos)
            }
        })
        //Recoger datos de todas las películas
        $.ajax({
            data : {
                'getAllPeliculas' : 'true'
            },
            url: 'data/BD_Manager.php',
            type: 'POST',
            success: function(datosRecogidos){
                mostrarReserva(JSON.parse(datosRecogidos))
            }
        })
    })
})

//Carga - Reserva
$(document).on("click", ".asiento:not(.ocupado)", function(){
    $(this).toggleClass('seleccionado')
})

$(document).on("click", ".seleccionarPelicula",function(){
    seleccionarPelicula($(this).parent().parent())
})

$(document).on("click", ".btnInfoPelicula", function(){
    $.ajax({
        data : {
            "nombrePelicula": $(this).parent().find('span').text()
        },
        url: 'data/BD_Manager.php',
        type: 'POST',
        success: function(datosRecogidos){
            infoPelicula(JSON.parse(datosRecogidos))
        }
    })
})

$(document).on("click", "#reservarAsiento", function(){
    reservarPelicula()
})

$(document).on("click", '.btnEliminar', function(){
    borrar($(this).parent().parent())
})


//FUNCIONES
//Funciones - Index
function comprobarCookie(nombreCookie){
    arrCookies = document.cookie.split("; ")
    for (let i = 0; i < arrCookies.length; i++) {
        cookie = arrCookies[i].split("=")
        if(nombreCookie == cookie[0]){
            return true
        }
        
    }
    return false
}
//Funciones - Acerca De
function mostrarDatosCine(datosJson){
    $('#contenidoWeb').html('<div id="datosCine" class="mt-4 mb-4"></div>')
    let html = '<h2 class="text-center mb-3">Acerca De</h2><table id="tablaDatosCine">'
    html += '<tr><th>Nombre del cine</th><td>'+datosJson.nombre+'</td></tr>'
    html += '<tr><th>Año de construcción</th><td>'+datosJson.añoConstruccion+'</td></tr>'
    html += '<tr><th rowspan="'+(datosJson.salas.length + 1)+'">Salas</th></tr>'
    for (let index = 0; index < datosJson.salas.length; index++) {
        let sala = datosJson.salas[index]
        html += '<tr><td><span class="fw-bold">'+sala.nombreSala+'</span>'
        html += '<br>'+sala.numAsientos+'&nbsp;Asientos</td></tr>'
    }
    html += '</tr></table>'
    $('#datosCine').append(html)
}

//Funciones - Reserva
function mostrarReserva(datosJson){
    datosJson.forEach(element => {
        $('.peliculas').append(filaPeliculaHtml(element.titulo, element.duracion))
    });
}

function seleccionarPelicula(fila){
    let tituloBuscado = fila.find('.tituloPelicula').text()
    let allFilas = $('.peliculas .fila')
    allFilas.each(function(){
        let tituloActual = $(this).find('.tituloPelicula').text()
        if (tituloBuscado == tituloActual){
            $(this).css('background-color', 'lightgray')
            $('#peliculaSeleccionada').text(tituloActual)
        }
        else{
            $(this).css('background-color', 'rgba(0, 0, 0, 0)')
        }
    })
}

function infoPelicula(datosJson){
    let html = '<div class="col-6">\
    <img src="./img/'+datosJson.nombreImagen+'" alt="imagen" class="img-fluid w-75"></div>\
    <table class="col-6">\
    <tr><th>Duración</th></tr>\
    <tr><td>'+datosJson.duracion+'&nbsp;minutos</td></tr>\
    <tr><th>Descripción</th></tr>\
    <tr><td>'+datosJson.descripcion+'</td></tr></table>'

    $('#tituloModalPelicula').text(datosJson.nombre)
    $('#infoPelicula .row').html(html)
}

function reservarPelicula(){
    //Limpiar mensaje de error por si hay alguno
    let parrafoError = $('#errorReserva')
    if(parrafoError.text() != ""){
        parrafoError.text("")
    }

    //Recoger datos de la pelicula
    let peliculaSeleccionada = $('#peliculaSeleccionada').text()
    if(peliculaSeleccionada == ""){
        parrafoError.text("*Error, tienes que seleccionar una película")
        return false
    }
    //Recoger datos de la reserva
    let nombre = $('#nombreEspectador').val()
    let fila = $('#filaEspectador').val()
    let butaca = $('#butacaEspectador').val()
    if(nombre == "" || fila == "" || butaca == ""){
        parrafoError.text("*Error: Los campos \"Nombre\", \"Fila\" y \"Butaca\" son oblicatorios")
        return false
    }
    //Comprobar si la peli se encuentra en el arrray
    if(butacasOcupadas[peliculaSeleccionada] == undefined){
        butacasOcupadas[peliculaSeleccionada] = []
    }
    //Comprobar si la butaca está ocupada
    for(let index of butacasOcupadas[peliculaSeleccionada]){
        let asiento = index.split(";")
            if(asiento[0] == fila && asiento[1] == butaca){
                parrafoError.text("*Error: Esa butaca está ocupada para la película "+peliculaSeleccionada)
                return false
            }
    }

    //Comprobar si existe la fila de esa pelicula
    let allVendidas = $('.listadoVendidas > .row')
    for(let index in allVendidas){
        let peliCabecera = allVendidas.eq(index).find('.cabecera h3').text()
        if(peliCabecera == peliculaSeleccionada){
            butacasOcupadas[peliculaSeleccionada].push(fila+";"+butaca)
            allVendidas.eq(index).append(filaReservaHtml(nombre, fila, butaca, peliculaSeleccionada))
            let numAsientos = butacasOcupadas[peliculaSeleccionada].length
            allVendidas.eq(index).find('.cabecera p').text(numAsientos+' asientos ocupados')
            return false
        }
    }

    //Si no existe, lo crea
    $('.listadoVendidas').append(tituloDePeliculaHtml(peliculaSeleccionada)
    +filaReservaHtml(nombre, fila, butaca, peliculaSeleccionada))
    butacasOcupadas[peliculaSeleccionada].push(fila+";"+butaca)
}

function borrar(fila){
    let elementoPadre = fila.parent()
    let nombrePelicula = elementoPadre.find('.cabecera h3').text()
    let filaAsiento = fila.find('p').eq(1).text().split(" ")[1]
    let butacaAsiento = fila.find('p').eq(2).text().split(" ")[1]

    if(elementoPadre.find('.row').length < 2){
        elementoPadre.remove()
        delete butacasOcupadas[nombrePelicula]
    }
    else{
        fila.remove()
        let valorAsiento = filaAsiento+";"+butacaAsiento
        for(let index in butacasOcupadas[nombrePelicula]){
            if(butacasOcupadas[nombrePelicula][index] == valorAsiento){
                butacasOcupadas[nombrePelicula].splice(index)
            }
        }
        elementoPadre.find('.cabecera p').text((elementoPadre.find('.row').length)+' asientos ocupados')
    }
}

//Desc:Filas para la selección de la pelicula ANTES de hacer la reserva
function filaPeliculaHtml(nombre, minutos) {
    let filaHtml =
    "<div class='fila mt-3 d-flex justify-content-between align-items-center'>\
        <div class='col-9 ps-2'>\
            <p class='fw-bold mb-0 fs-5'><span class='tituloPelicula'>" + nombre +"</span>&nbsp;\
            <button class='btn btn-secondary rounded-circle btnInfoPelicula' \
            data-bs-toggle='modal' data-bs-target='#modalPelicula'>&nbsp;i&nbsp;</button></p>\
            <span class='text-muted'>" + minutos + " minutos</span>\
        </div>\
        <div class='col-3'>\
            <button class='btn btn-warning seleccionarPelicula'>Seleccionar</button>\
        </div>\
    </div>"
    return filaHtml
}

//Desc:Una fila de la reserva con el nombre y el numero de asientos
function tituloDePeliculaHtml(peliculaSeleccionada) {
    return "<div class='row'>\
    <div class='bg-secondary text-center text-white cabecera'>\
        <h3>" + peliculaSeleccionada + "</h3>\
        <p>1 asiento ocupado</p>\
    </div>"
}

//Desc:Una fila de x película con el nombre, butaca, etc
function filaReservaHtml(nombre, fila, butaca) {
    let filaHtml = "<div class='row'><div class='col-8 offset-1 border-bottom border-dark border-2 mt-2'>\
    <p>" + nombre + "</p>\
    <p>Fila: " + fila + "</p>\
    <p>Butaca: " + butaca + "</p>\
    </div>\
    <div class='col-2 d-flex align-items-center border-bottom border-dark border-2'>\
    <button class='btn btnEliminar'><i class='bi bi-trash-fill'></i></button>\
    </div></div>"
    return filaHtml
}
