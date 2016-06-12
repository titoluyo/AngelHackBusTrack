
var gMap;

function initMap() {
    gMap = new gMaps();
    gMap.setDrawingManager();
    gMap.crearControlMap('controlNuevaLinea', 'Avenida/Calle', 'Crear nueva Avenida/Calle', true, nuevaDivision);

    function nuevaDivision() {
        gMap.newLine();
    }

    $.getJSON("/api/values", function (data) {
        var items = [];
        $.each(data, function (key, val) {
            console.log(val.Lat + " * " + val.Lon);
            gMap.setMarker(val.Lat, val.Lon);
        });

    });

}