<?php

class Pelicula{
    private $id;
    private $nombre;
    private $duracion;
    private $descripcion;
    private $nombreImagen;

    //Constructor
    function __construct($registro){
        $this->id = $registro['idPelicula'];
        $this->nombre = $registro['nombrePelicula'];
        $this->duracion = $registro['duracion'];
        $this->descripcion = $registro['descripcion'];
        $this->nombreImagen = $registro['nombreImagen'];
    }

    //GETTERS
    function getId(){
        return $this->id;
    }
    function getNombre(){
        return $this->nombre;
    }
    function getDuracion(){
        return $this->duracion;
    }
    function getDescripcion(){
        return $this->descripcion;
    }
    function getNombreImagen(){
        return $this->nombreImagen;
    }

    //SETTERS
    function setId($newValue){
        $this->id = $newValue;
    }
    function setNombre($newValue){
        $this->nombre = $newValue;
    }
    function setDuracion($newValue){
        $this->duracion = $newValue;
    }
    function setDescripcion($newValue){
        $this->descripcion = $newValue;
    }
    function setNombreImagen($newValue){
        $this->nombreImagen = $newValue;
    }

    //OTRAS FUNCIONES
    function getArray(){
        return array(
            "id" => $this->id,
            "nombre" => $this->nombre,
            "duracion" => $this->duracion,
            "descripcion" => $this->descripcion,
            "nombreImagen" => $this->nombreImagen
        ); 
    }
}

?>