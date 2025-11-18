//Service Worker

if('serviceWorker' in navigator) {
    console.log('Puedes usar los ServiceWorkers en tu navegador');

    navigator.serviceWorker.register('./sw.js')
    .then(reg => console.log('Registro de SW exitoso', reg))
    .catch(err => console.warn('Error al registrar el SW', err));

}else{
    console.log('No puedes usar los serviceWorkers en tu navegador');
}

// Scroll suavizado
$(document).ready(function(){

    $("#menu a").click(function(e){
        e.preventDefault();

        $("html, body").animate({
            scrollTop: $($(this).attr('href')).offset().top
        });
        return false;
    });
});