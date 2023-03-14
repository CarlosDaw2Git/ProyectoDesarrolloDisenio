<?php

class Usuario{
    private $id;
    private $nombre;
    private $clave;
    private $admin;

    //Constructor
    function __construct($registro){
        $this->id = $registro['idUsuario'];
        $this->nombre = $registro['nombreUsuario'];
        $this->clave = $registro['claveUsuario'];
        $this->admin = $registro['administrador'];
    }

    //GETTERS
    function getId(){
        return $this->id;
    }
    function getNombre(){
        return $this->nombre;
    }
    function getClave(){
        return $this->clave;
    }
    function getAdmin(){
        return $this->admin;
    }

    //SETTERS
    function setNombre($newValue){
        $this->nombre = $newValue;
    }
    function setClave($newValue){
        $this->clave = $newValue;
    }
    function setAdmin($newValue){
        $this->admin = $newValue;
    }

    //OTRAS FUNCIONES
    function getArray(){
        return array(
            "id" => $this->id,
            "nombre" => $this->nombre,
            "clave" => $this->clave,
            "admin" => $this->admin
        ); 
    }
}

?>