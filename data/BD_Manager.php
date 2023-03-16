<?php
require("BD_Cine.php");

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

//Verificar usuario en el login
if(isset($_REQUEST['verificarUsuario'])){
    $nombre = $_REQUEST['nombre'];
    $clave = $_REQUEST['clave'];
    $usuario = BD_Cine::verificarUsuario($nombre, $clave);
    if(empty($usuario)){
        echo json_encode(array(
            "error" => "Datos incorrectos"
        ));
    }
    else{
        echo json_encode($usuario->getArray());
    }
}
//Crear usuario en el login
if(isset($_REQUEST['crearUsuario'])){
    $nombre = $_REQUEST['nombre'];
    $clave = $_REQUEST['clave'];
    if(BD_Cine::insertUsuario($nombre, $clave)){
        echo "Usuario registrado correctamente";
    }
    else{
        echo "Error";
    }
}

//Ver perfil del usuario
if(isset($_REQUEST['verPerfil'])){
    $nombre = $_REQUEST['nombre'];
    $usuario = BD_Cine::getUserByNombre($nombre);
    if(empty($usuario)){
        echo json_encode(array(
            "error" => "Datos incorrectos"
        ));
    }
    else{
        echo json_encode($usuario->getArray());
    }
}

//Recibir datos de las salas
if(isset($_REQUEST['verSalas'])){
    $salas = BD_Cine::getAllSalas();
    $arrayDatos = [];
    foreach ($salas as $key => $sala) {
        $datosSala = $sala->getArray();
        $arrayDatos[$key] = $datosSala;
    }
    echo json_encode($arrayDatos);
}

//Actualizar una sala
if(isset($_REQUEST['updateSala'])){
    $idSala = $_REQUEST['idSala'];
    $numFilas = $_REQUEST['numFilas'];
    $numButacas = $_REQUEST['numButacas'];
    
    $exito = BD_Cine::updateSala($idSala, $numFilas, $numButacas);
    if(!$exito){
        echo json_encode(array(
            "success" => false,
            "error" => "Vaya, parece que algo ha ido mal"
        ));
    }
    else{
        echo json_encode(array(
            "success" => true,
            "error" => null
        ));
    }
}
?>