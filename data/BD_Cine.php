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

    //VERIFICAR USUARIO
    public static function verificarUsuario($nombre, $clave){
        $usuario = null;
        try{
            $sql = "SELECT * FROM usuarios WHERE nombreUsuario = ?
            AND claveUsuario = md5(?)";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($nombre, $clave));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(!empty($fila)){
                $usuario = new Usuario($fila);
            }
        }
        catch(PDOException $e){
            echo "<script>alert('Error en verificarUsuario(): ".$e->getMessage()."')</script>";
        }
        finally{
            return $usuario;
        }
    }

    //SELECT USER BY NAME
    public static function getUserByNombre($nombre){
        $usuario = null;
        try{
            $sql = "SELECT * FROM usuarios WHERE nombreUsuario = ?";
            $conexion = self::realizarConexion();
            $resultado = $conexion->prepare($sql);
            $resultado->execute(array($nombre));
            $fila = $resultado->fetch();
            $resultado->closeCursor();
            $conexion = null;
            if(!empty($fila)){
                $usuario = new Usuario($fila);
            }
        }
        catch(PDOException $e){
            echo "<script>alert('Error en getUsuarioByNombre(): ".$e->getMessage()."')</script>";
        }
        finally{
            return $usuario;
        }
    }
    //INSERTS
    //INSERTAR NUEVO USUARIO
    public static function insertUsuario($nombre, $clave){
        try{
            $sql = "INSERT INTO usuarios(nombreUsuario, claveUsuario, 
            administrador) VALUES(?, md5(?), 0)";
            $conexion = self::realizarConexion();
            $resultado =  $conexion->prepare($sql);
            $afectados = $resultado->execute(array($nombre, $clave));
            if ($afectados > 0){
                $exito= true;
            }
        }
        catch(PDOException $e){
            echo "<script>alert('Error en insertar_comida(): ".$e->getMessage()."')</script>";
        }
        finally{
            $resultado->closeCursor();
            $conexion = null;
            return $exito;
        }
    }
}
