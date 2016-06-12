
var gMap 

function initMap() {
    gMap = new gMaps();
    gMap.setDrawingManager();
    gMap.crearControlMap('controlDivisiones', 'Divisiones', 'Elegir las divisiones a localizar', true, nuevaDivision);

    function nuevaDivision() {
        gMap.newLine();
    }

}