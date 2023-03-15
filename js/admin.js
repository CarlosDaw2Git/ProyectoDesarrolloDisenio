$.getScript("./js/cookies.js")

$(document).ready(function(){
    if(!comprobarCookie('admin')){
        $("#divContenido").html(
            "<h2 class='text-danger text-center'>\
            FATAL ERROR: USUARIO NO AUTORIZADO"
        )
    }
    else{
        mostrarContenido()
    }
})

function mostrarContenido(){

}