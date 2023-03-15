function comprobarCookie(nombreCookie){
    arrCookies = document.cookie.split("; ")
    for (let i = 0; i < arrCookies.length; i++) {
        cookie = arrCookies[i].split("=")
        if(nombreCookie == cookie[0]){
            return true
        }
        
    }
    return false
}

function getValorCookie(nombreCookie){
    arrCookies = document.cookie.split("; ")
    for (let i = 0; i < arrCookies.length; i++) {
        cookie = arrCookies[i].split("=")
        if(nombreCookie == cookie[0]){
            return cookie[1]
        }
        
    }
    return null
}