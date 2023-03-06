<?php
//header("Content-Type: application/json");
//include("BD_Cine.php");

//$bd = new BD_Cine();

if(isset($_REQUEST['nombrePelicula'])){
    echo "Pelicula seleccionada: ".$_REQUEST['nombrePelicula'];
}
else{
    echo "Error";
}


?>