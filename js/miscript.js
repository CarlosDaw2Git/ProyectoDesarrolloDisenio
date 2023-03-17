let butacasOcupadas = []
let numAsientosPorFila = 8

//CARGA DEL ARCHIVO
//Carga - Index
$(document).ready(function(){
    //Trailer aleatorio
    getTrailerAleatorio()

    //Veces que has visitado la página
    if(!comprobarCookie("visitas")){
        document.cookie = "visitas=1;max-age=99999999;"
    }
    else{
        let numVisitas = parseInt(getValorCookie("visitas"))
        document.cookie = "visitas="+(numVisitas + 1)+";max-age=99999999;"
    }

    //Funcionalidades de los botones:
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

    $('#linkEntradasVendidas').click(function(){
        $.ajax({
            url: './data/datosVentas.json',
            dataType: 'json',
            success: mostrarGraficoEntradas,
            error: function(){
                console.log("Error al mostrar la información")
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
    if(comprobarCookie("usuario")){
        $('#linkRegistro').append('<div id="iconoPerfil">2</div>')
        $('#linkRegistro').click(function(){
            $.ajax({
                data : {
                    'verPerfil' : 'true',
                    'nombre': getValorCookie('usuario')
                },
                url: 'data/BD_Manager.php',
                type: 'POST',
                success: function(datosRecogidos){
                    mostrarPerfil(JSON.parse(datosRecogidos))
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

$(document).on("click", ".asiento", function(){
    comprobarAsientos($(this))
})

$(document).on("click", "#reservarAsiento", function(){
    reservarPelicula()
})

$(document).on("click", '.btnEliminar', function(){
    borrar($(this).parent().parent())
})

//Carga - Perfil
$(document).on("click", '#cerrarSesion', function(){
    document.cookie = "usuario=;max-age=0;"
    window.location.reload()
})

//FUNCIONES
//Funciones - Index
function getTrailerAleatorio(){
    let trailers = ["https://www.youtube.com/embed/FSyWAxUg3Go",
        "https://www.youtube.com/embed/gBil8RpweBE",
        "https://www.youtube.com/embed/VpZjyY4wPi0"
    ]
    let index = parseInt(getValorCookie("trailer"))

    if(!comprobarCookie("trailer") || index == 2){
        document.cookie = "trailer=0;max-age=99999999;"
    }
    else{
        document.cookie = "trailer="+(index + 1)+";max-age=99999999;"
    }
    //console.log(document.cookie)
    $('#trailer').attr("src", trailers[getValorCookie("trailer")])
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

//Funciones - Mostrar perfil
function mostrarPerfil(datosJson){
    if(datosJson.error != undefined){
        $('#contenidoWeb').html("<div id='errorReserva'>"+datosJson.error+"</div>")
    }
    else{
        let html = '\
        <h2 class="mb-2 text-center">Mi perfil</h2>\
        <div class="container-fluid d-flex flex-column align-items-center">\
            <p>Veces que se ha visitado la página:\
            '+getValorCookie("visitas")+'</p>\
            <table id="tablaDatosCine">\
                <tr>\
                    <th>Nombre:</th>\
                    <td>'+datosJson.nombre+'</td>\
                </tr>\
                <tr>\
                    <th>Contraseña:</th>\
                    <td>'+datosJson.clave+'</td>\
                </tr>\
                <tr>\
                    <th>¿Es administrador?</th>\
                    <td>'
        if(datosJson.admin == "0"){
            html += "No"
        }
        else{
            html += "Si"
        }
        html += '</td></tr>\
            </table>\
            <button class="btn btn-danger mt-3" id="cerrarSesion">Cerrar sesión</button>\
        </div>'
        $('#contenidoWeb').html(html)
    }
}

//Funciones - Grafico entradas vendidas
function mostrarGraficoEntradas(datosJson){
    $('#contenidoWeb').html('<h2 class="text-center">Entradas vendidas</h2>\
    <div class="container">\
        <canvas id="graficoVendidas"></canvas>\
    </div>')
    new Chart($('#graficoVendidas'), datosJson)
}

//Funciones - Reserva
function mostrarReserva(datosJson){
    datosJson.forEach(element => {
        $('.peliculas').append(filaPeliculaHtml(element.titulo, element.duracion))
    });
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

function seleccionarPelicula(fila){
    let tituloBuscado = fila.find('.tituloPelicula').text()
    let allFilas = $('.peliculas .fila')
    allFilas.each(function(){
        let tituloActual = $(this).find('.tituloPelicula').text()
        if (tituloBuscado == tituloActual){
            $(this).css('background-color', 'lightgray')
        }
        else{
            $(this).css('background-color', 'rgba(0, 0, 0, 0)')
        }
    })
    $('#peliculaSeleccionada').text(tituloBuscado)
    actualizarModalAsientos(tituloBuscado)

}

function actualizarModalAsientos(titulo){
    //Activamos el boton y ponemos el titulo
    $('#btnModalAsientos').removeAttr('disabled')
    $('#tituloModalAsientos').text(titulo)

    //Removemos todos los asientos, tanto ocupados
    //como seleccionados
    let allAsientos = $('.asiento')
    allAsientos.each(function(){
        $(this).removeClass('ocupado')
        $(this).removeClass('seleccionado')
    })

    //Comprobamos el array, si no existe el index
    //con ese nombre de película, salimos de la función
    if(butacasOcupadas[titulo] == undefined){
        return false
    }

    //Extraemos ese array y lo recorremos
    let arrAsientosOcupados = butacasOcupadas[titulo]
    arrAsientosOcupados.forEach(element => {
        let datos = element.split(";")
        let fila = parseInt(datos[0]) - 1
        let columna = parseInt(datos[1])

        let numAsiento = (fila * numAsientosPorFila) + columna
        allAsientos.eq(numAsiento - 1).addClass("ocupado")

    });
}

function comprobarAsientos(asiento){
    $('#errorAsientos').text("")

    let clases = asiento.attr("class").split(" ")
    //Primera condicion - Que el asiento no esté ocupado
    if(clases.find(element => element == "ocupado")){
        $('#errorAsientos').text("Error: Ese asiento está ocupado")
        return false
    }
    //Segunda condicion - Que el asiento esté seleccionado
    if(clases.find(element => element == "seleccionado")){
        asiento.toggleClass("seleccionado")
        $('#filaEspectador').val("")
        $('#butacaEspectador').val("")
        return false
    }
    //Tercera condicion - Comprobar que no haya ya un asiento seleccionado
    console.log($('.seleccionado').length)
    if($('.seleccionado').length > 0){
        $('#errorAsientos').text("Error: Solo se puede seleccionar un asiento")
        return false
    }
    asiento.toggleClass("seleccionado")

    //Averiguar cual es la fila y la columna para ponerlo en los inputs
    let numAsientoTotal =  -1
    let allAsientos = $('.asiento')
    for (let i = 0; i <= allAsientos.length; i++) {
        let asientoBuscando = allAsientos.eq(i)
        if(asientoBuscando.is(asiento)){
            numAsientoTotal = i + 1
            break
        }
    }
    let numFila = Math.floor(numAsientoTotal / numAsientosPorFila) + 1
    let numAsiento = Math.floor(numAsientoTotal % numAsientosPorFila)

    $('#filaEspectador').val(numFila)
    $('#butacaEspectador').val(numAsiento)
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
            actualizarModalAsientos(peliculaSeleccionada)
            return false
        }
    }

    //Si no existe, lo crea
    $('.listadoVendidas').append(tituloDePeliculaHtml(peliculaSeleccionada)
    +filaReservaHtml(nombre, fila, butaca, peliculaSeleccionada))
    //Y lo añade al array
    butacasOcupadas[peliculaSeleccionada].push(fila+";"+butaca)

    //Actualizar modal asientos
    actualizarModalAsientos(peliculaSeleccionada)
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
        let arrAsientosPelicula = butacasOcupadas[nombrePelicula]
        for(let index in arrAsientosPelicula){
            if(arrAsientosPelicula[index] == valorAsiento){
                butacasOcupadas[nombrePelicula].splice(index)
            }
        }
        elementoPadre.find('.cabecera p').text((elementoPadre.find('.row').length)+' asientos ocupados')
    }
    actualizarModalAsientos(nombrePelicula)
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