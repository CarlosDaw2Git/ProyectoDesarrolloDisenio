<?php
require("BD_Cine.php");

$bd = new BD_Cine();

//Selección de peliculas para el modal
if(isset($_REQUEST['nombrePelicula']) && !empty($_REQUEST['nombrePelicula'])){
    $pelicula = BD_Cine::getPeliculaByNombre($_REQUEST['nombrePelicula']);
    echo json_encode($pelicula->getArray());
}

//Recoger todas las películas para mostrarlas
//a la hora de reservar
if(isset($_REQUEST['getAllPeliculas'])){
    $peliculas = BD_Cine::getAllPeliculas();
    $arrayPeliculas = [];
    foreach ($peliculas as $key => $pelicula) {
        $datosPeli = array(
            'titulo' => $pelicula->getNombre(),
            'duracion' => $pelicula->getDuracion()
        );
    $arrayPeliculas[$key] = $datosPeli;
    }
    echo json_encode($arrayPeliculas);
}
?>