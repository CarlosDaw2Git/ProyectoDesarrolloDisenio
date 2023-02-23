let listadoPeliculas = ["Avatar 2: El camino del agua;192", "Babylon;189", "Los renglones torcidos de Dios;154"]
let butacasOcupadas = []

$(document).ready(function(){
    $('#linkUbicacion').click(function(){
        $.ajax({
            type: 'GET',
            url: 'mapa.html',
            data: {},
            success: function(data){
                $('#contenidoWeb').html(data)
            }
        })
    })
    $('#botonReserva').click(function(){
        $.ajax({
            type: 'GET',
            url: 'reserva.html',
            data: {},
            success: function(data){
                $('#contenidoWeb').html(data)
                mostrarReserva()
            }
        })
    })
})

function mostrarReserva(){
    for(let index in listadoPeliculas){
        let pelicula = listadoPeliculas[index].split(";")
        $('.peliculas').append(filaPeliculaHtml(index, pelicula[0], pelicula[1]))
    }

    //$('#botonReserva').attr('disable', true)
}

function seleccionarPelicula(index){
    allPelis = $('.peliculas .fila')
    for(let i in allPelis){
        if (i == index){
            allPelis.eq(i).css('background-color', 'lightgray')
            $('#peliculaSeleccionada').text(listadoPeliculas[i].split(";")[0])
        }
        else{
            allPelis.eq(i).css('background-color', 'white')
        }
    }
}

function reservarPelicula(){
    //Recoger datos de la pelicula
    let peliculaSeleccionada = $('#peliculaSeleccionada').text()
    if(peliculaSeleccionada == ""){
        alert("Error, tienes que seleccionar una película")
        return false
    }
    //Recoger datos de la reserva
    let nombre = $('#nombreEspectador').val()
    let fila = $('#filaEspectador').val()
    let butaca = $('#butacaEspectador').val()
    if(nombre == "" || fila == "" || butaca == ""){
        alert("Error: Los campos \"Nombre\", \"Fila\" y \"Butaca\" son oblicatorios")
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
                alert("Error: Esa butaca está ocupada para la película "+peliculaSeleccionada)
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

function borrar(peliculaSeleccionada, fila, butaca){
    let allVendidas = $('.listadoVendidas > .row')
    let index = 0
    for(let i in allVendidas){
        let peliCabecera = allVendidas.eq(i).find('.cabecera h3').text()
        if(peliCabecera == peliculaSeleccionada){
            index = i
        }
    }

    let allButacas = allVendidas.eq(index).find('.row')
    for(let i in allButacas){
        let filaActual = allButacas.eq(i).find('p').eq(1).text().split(" ")[1]
        let butacaActual = allButacas.eq(i).find('p').eq(2).text().split(" ")[1]
        if(filaActual == fila && butacaActual == butaca){
            allButacas.eq(i).remove()
            butacasOcupadas[peliculaSeleccionada].splice(butacasOcupadas[peliculaSeleccionada].indexOf(filaActual+";"+butacaActual))
            let numAsientos = allButacas.length - 1
            if(numAsientos == 0){
                allVendidas.eq(index).remove()
                butacasOcupadas[peliculaSeleccionada] == undefined
            }
            else{
                allVendidas.eq(index).find('.cabecera p').text(numAsientos+' asientos ocupados')
            }
        }
    }
}


//Funciones del Examen

function tituloDePeliculaHtml(peliculaSeleccionada) {
    return "<div class='row'>\
    <div class='bg-secondary text-center text-white cabecera'>\
        <h3>" + peliculaSeleccionada + "</h3>\
        <p>1 asiento ocupado</p>\
    </div>"
}

function filaReservaHtml(nombre, fila, butaca, peliculaSeleccionada) {
    let filaHtml = "<div class='row'><div class='col-8 offset-1 border-bottom border-dark border-2 mt-2'>\
    <p>" + nombre + "</p>\
    <p>Fila: " + fila + "</p>\
    <p>Butaca: " + butaca + "</p>\
    </div>\
    <div class='col-2 d-flex align-items-center border-bottom border-dark border-2'>\
    <button class='btn' onclick='borrar(\""+ peliculaSeleccionada + "\"," + fila + "," + butaca + ")'><i class='bi bi-trash-fill'></i></button>\
    </div></div>"
    return filaHtml
}
function filaPeliculaHtml(indice, nombre, minutos) {
    let filaHtml = "<div class='fila mt-3 d-flex justify-content-between align-items-center'>\
    <div class='col-9 ps-2'>\
    <p class='fw-bold mb-0 fs-5'>" + nombre + "</p>\
    <span class='text-muted'>" + minutos + " minutos</span>\
    </div>\
    <div class='col-3'>\
    <button onclick='seleccionarPelicula(" + indice + ")' class='btn btn-warning'>Seleccionar</button>\
    </div></div>"
    return filaHtml
}
