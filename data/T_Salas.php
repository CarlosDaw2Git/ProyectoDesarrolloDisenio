<?php

class Sala{
    private $id;
    private $numFilas;
    private $numButacas;

    //Constructor
    function __construct($registro){
        $this->id = $registro['idSala'];
        $this->numFilas = $registro['numFilas'];
        $this->numButacas = $registro['numButacas'];
    }

    //GETTERS
    function getId(){
        return $this->id;
    }
    function getNumFilas(){
        return $this->numFilas;
    }
    function getNumColumnas(){
        return $this->numButacas;
    }

    //SETTERS
    function setNumFilas($newValue){
        $this->numFilas = $newValue;
    }
    function setNumColumnas($newValue){
        $this->numButacas = $newValue;
    }

    //OTRAS FUNCIONES
    function getArray(){
        return array(
            "id" => $this->id,
            "numFilas" => $this->numFilas,
            "numButacas" => $this->numButacas
        ); 
    }
}

?>