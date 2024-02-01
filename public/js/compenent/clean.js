export function CleanBody() {
    var login = document.querySelector('.loginBox')
    var header = document.querySelector('header')
    var container = document.querySelector('.container')
    var containerGraphic = document.querySelector('.container-graphic')
    var containerRation = document.querySelector('.container-ration')

    if (login) {
        document.body.removeChild(login)
    }
    if (header) {
        document.body.removeChild(header)
    }
    if (container) {
        document.body.removeChild(container)
    }
    if (containerGraphic) {
        document.body.removeChild(containerGraphic)
    }
    if (containerRation) {
        document.body.removeChild(containerRation)
    }
}