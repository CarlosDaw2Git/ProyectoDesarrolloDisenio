<?php
//include("BD_Cine.php");

//$bd = new BD_Cine();

$nombrePelicula = "None";

if(isset($_REQUEST['nombrePelicula'])){
    echo "Pelicula seleccionada: ".$_REQUEST['nombrePelicula'];
}
else{
    echo "Error";
}


?>