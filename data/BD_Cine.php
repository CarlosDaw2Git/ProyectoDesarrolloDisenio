<?php
include("T_Peliculas.php");

class BD_Cine{
    public static function realizarConexion()
    {
        try {
            $conexion = new PDO("mysql:host=localhost; dbname=cineslabutaca", "root", "");
            $conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $conexion->exec("SET CHARACTER SET utf8");
            return $conexion;
        } catch (Exception $e) {
            echo "Error: " . $e->getMessage();
        }
    }

    //SELECT ALL PELICULAS
    public static function getAllPeliculas(){
        $sql="SELECT * FROM peliculas";
        $conexion=self::realizarConexion();
		$resultado=$conexion->query($sql);
	    $peliculas=array();
        while ($fila=$resultado->fetch()){
            array_push($peliculas, new Pelicula($fila));
        }
        $resultado->closeCursor();
		$conexion=null;
		return ($peliculas);
    }

    //SELECT PELICULA POR ID
    public static function getPeliculaByNombre($nombre)
    {
        $sql = "SELECT * FROM peliculas WHERE nombrePelicula = '$nombre'";
        $conexion = self::realizarConexion();
        $resultado = $conexion->query($sql);
        $fila = $resultado->fetch();
        $conexion = null;

        if (empty($fila)) {
            return null;
        }

        $pelicula = new Pelicula($fila);
        return $pelicula;
    }
}

?>