<?php
include("BD_Cine.php");

$bd = new BD_Cine();

if(isset($_REQUEST['nombrePelicula']) && !empty($_REQUEST['nombrePelicula'])){
    $pelicula = BD_Cine::getPeliculaByNombre($_REQUEST['nombrePelicula']);
    echo json_encode($pelicula->getArray());
}
else{
    echo json_encode(array(
        'err' => 'Error en la selección de la película'
    ));
}


?>