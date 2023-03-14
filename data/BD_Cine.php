<?php
include("T_Peliculas.php");
include("T_Usuarios.php");

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

    //SELECTS
    //SELECT ALL PELICULAS
    public static function getAllPeliculas(){
        /*
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
        */
        $arrayPeliculas = [];
        try{
            $sql="SELECT * FROM peliculas";
            $conexion = self::realizarConexion();
            $resultado =  $conexion->prepare($sql);
            $resultado->execute();
            while($fila = $resultado->fetch()){
                array_push($arrayPeliculas, new Pelicula($fila));
            }
        }
        catch(PDOException $e){
            echo "<script>alert('Error en getAllPeliculas(): ".$e->getMessage()."')</script>";
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $arrayPeliculas;
        }
    }

    //SELECT PELICULA POR ID
    public static function getPeliculaByNombre($nombre)
    {   try{
            $sql = "SELECT * FROM peliculas WHERE nombrePelicula = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($nombre));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(empty($fila)){
                return null;
            }
            else{
                return new Pelicula($fila);
            }
        }
        catch(PDOException $e){
            echo "<script>alert('Error en getPeliculaByNombre(): ".$e->getMessage()."')</script>";
            return null;
        }
    }

    //SELECT USUARIO POR NOMBRE
    public static function getUserByNombre($nombre){
        try{
            $sql = "SELECT * FROM usuarios WHERE nombreUsuario = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($nombre));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(empty($fila)){
                return null;
            }
            else{
                return new Usuario($fila);
            }
        }
        catch(PDOException $e){
            echo "<script>alert('Error en getUserByNombre(): ".$e->getMessage()."')</script>";
            return null;
        }
    }
}

?>