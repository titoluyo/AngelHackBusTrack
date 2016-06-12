var gMaps = (function (global) {
    var _this = this;
    var g = window.google.maps;
    this.setEvent = setEvent;
    this.displayUbigeo = displayUbigeo;
    this.clear = clear;
    this.clearEvent = clearEvent;
    this.setMarker = setMarker;
    this.setValues = null;
    this.drawPath = drawPath;
    this.setDrawingManager = setDrawingManager;
    this.crearControlMap = crearControlMap;
    this.getCoordinates = getCoordinates;
    this.newPolygon = newPolygon;
    this.newLine = newLine;
    this.drawPolygon = drawPolygon;
    this.editPolygon = editPolygon;
    this.clearSelection = clearSelection;
    this.deletePolygon = deletePolygon;



    var drawingManager;
    var selectedShape;
    var ubigeo = null;
    var markerCliente = null;
    var polygon;

    var styles = [
        {
            stylers: [
                { hue: '#00ffe6' },
                { saturation: -20 }
            ]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                { lightness: 100 },
                { visibility: 'simplified' }
            ]
        }, {
            featureType: 'road',
            elementType: 'labels',
            stylers: [
                { visibility: 'off' }
            ]
        }
    ];
    var styledMap = new g.StyledMapType(styles, { name: 'Styled Map' });

    // Inicializando mapa
    // TODO: posicion inicial dependiendo de la oficina
    var chacarilla = new g.LatLng(-12.1007574, -77.0275498);
    var mapOptions = {
        center: chacarilla,
        zoom: 16,
        mapTypeId: g.MapTypeId.ROADMAP,
        // controles adicionales
        streetViewControl: false,
        panControl: false,
        scaleControl: true,
        mapTypeControl: true,
        mapTypeControlOptions: {
            style: g.MapTypeControlStyle.HORIZONTAL_BAR
        },
        overviewMapControl: true
    };
    var map = new g.Map(document.getElementById('map-raiz'), mapOptions);

    //Associate the styled map with the MapTypeId and set it to display.
    //map.mapTypes.set('map_style', styledMap);
    //map.setMapTypeId('map_style');

    // define evento click para agregar un marker a un mapa
    function setEvent() {
        g.event.addListener(map, 'click', function (event) {
            console.log('map clicked');
            console.log(event);
            g.event.clearListeners(map, 'click');
            placeMarker(map, event.latLng, handleMarkerCliente); //, clientes[currCliente]);
            //enableGrabar(true);
        });
    }

    // Drawing Management
    function setDrawingManager(endDraw) {
        drawingManager = new g.drawing.DrawingManager({
            drawingControl: false,
            drawingControlOptions: {
                drawingModes: [
                    g.drawing.OverlayType.POLYGON
                ]
            },
            polygonOptions: {
                editable: true
            },
            map: map
        });
        g.event.addListener(drawingManager, 'overlaycomplete', function (e) {
            if (e.type != g.drawing.OverlayType.MARKER) {
                // Switch back to non-drawing mode after drawing a shape.
                drawingManager.setDrawingMode(null);

                // Add an event listener that selects the newly-drawn shape when the user
                // mouses down on it.
                var newShape = e.overlay;
                newShape.type = e.type;
                newShape.key = -1;
                g.event.addListener(newShape, 'click', function () {
                    setSelection(newShape);
                });
                setSelection(newShape);
                if (endDraw) {
                    endDraw();
                }
            }
        });

        //ear the current selection when the drawing mode is changed, or when the
        //p is clicked.
        g.event.addListener(drawingManager, 'drawingmode_changed', clearSelection);

    }

    function drawPolygon(coordinates) {
        if (polygon) {
            polygon.setMap(null);
            polygon = null;
        }
        polygon = new google.maps.Polygon({
            paths: coordinates
        });
        polygon.setMap(map);
    }

    function editPolygon() {
        setSelection(polygon);
    }

    function deletePolygon() {
        if (polygon) {
            polygon.setMap(null);
        }
        deleteSelectedShape();
    }

    function getCoordinates() {
        var coordinates = [];
        for (var i = 0; i < selectedShape.getPath().getLength() ; i++) {
            coordinates.push({ lat: selectedShape.getPath().getAt(i).lat(), lng: selectedShape.getPath().getAt(i).lng() });
        }
        return coordinates;
    }
    function clearSelection() {
        if (selectedShape) {
            selectedShape.setEditable(false);
            selectedShape = null;
        }
    }

    function setSelection(shape) {
        clearSelection();
        selectedShape = shape;
        shape.setEditable(true);
    }

    function deleteSelectedShape() {
        if (selectedShape) {
            selectedShape.setMap(null);
        }
    }

    function newPolygon() {
        console.log('newPolygon');
        drawingManager.setDrawingMode(g.drawing.OverlayType.POLYGON);
    }

    function newLine() {
        console.log('newLine');
        drawingManager.setDrawingMode(g.drawing.OverlayType.POLYLINE);
    }

    // Control de usuario en Mapa
    function crearControlMap(idControl, caption, tip, enabled, action) {
        //Divisiones
        var divTerritorialControlDiv = document.createElement('div');
        userControl(divTerritorialControlDiv, map, idControl, caption, tip, action, enabled);
        divTerritorialControlDiv.index = 1;
        map.controls[window.google.maps.ControlPosition.TOP_RIGHT].push(divTerritorialControlDiv);
    }

    function userControl(controlDiv, map, id, caption, tip, action, enabled) {

        controlDiv.style.padding = '5px';

        // Set CSS for the control border
        var controlUi = document.createElement('div');
        controlUi.id = id;
        controlUi.style.backgroundColor = 'white';
        controlUi.style.borderStyle = 'solid';
        controlUi.style.borderWidth = '1px';
        controlUi.style.cursor = 'pointer';
        controlUi.style.textAlign = 'center';
        controlUi.title = tip;
        controlDiv.appendChild(controlUi);

        // Set CSS for the control interior
        var controlText = document.createElement('div');
        controlText.id = id + 'Text';
        controlText.style.fontFamily = 'Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.paddingTop = '1.5px';
        controlText.style.paddingBottom = '1.5px';
        controlText.style.paddingLeft = '6px';
        controlText.style.paddingRight = '6px';
        controlText.innerHTML = caption;
        controlUi.appendChild(controlText);

        if (enabled) {
            window.google.maps.event.addDomListener(controlUi, 'click', action);
        } else {
            controlUi.style.borderColor = '#cccccc';
            controlText.style.color = '#cccccc';
        }
    }

    //
    function setMarker(lat, long) {
        var location = new g.LatLng(lat, long);
        placeMarker(map, location, handleMarkerCliente);
    }

    function placeMarker(map, location, funcHandler) { //, cliente) {
        markerCliente = new g.Marker({
            position: location,
            animation: g.Animation.DROP,
            //title: cliente.nombre,
            //icon: 'images/walking-tour.png',
            map: map,
            draggable: true
        });
        markerCliente.info = new g.InfoWindow({
            content: 'Nombre : <b>' // + cliente.nombre + '</b><br/>Codigo : ' + cliente.codigo + '<br/><span id=ubigeoCliente>Departamento : <b>' + cliente.nomDepartamento + '</b><br/>Provincia : <b>' + cliente.nomProvincia + '</b><br/>Distrito : <b>' + cliente.nomDistrito + '</b></span><br/><b>Zonas : </b><span id='clienteZonas'><br/><br/></span>'
        });
        //resolverUbigeo(location);
        g.event.addListener(markerCliente, 'click', function () {
            markerCliente.info.open(map, markerCliente);
        });
        //markerCliente.cliente = cliente;
        //markersArray.push(markerCliente);
        ////handleMarkerCliente(markerCliente);
        funcHandler(map, markerCliente);
    }

    function handleMarkerCliente(map, marker) {
        hidValues(marker.position);
        g.event.addListener(marker, 'dragend', function () {
            var posEnd = this.getPosition();
            hidValues(posEnd);
            //resolverUbigeo(posEnd);
            //marker.info.setContent(ubigeo.nomDistrito);
            //enableGrabar(true);
        });
    }

    // llama a metodo externo al que le pasa la posicion
    function hidValues(position) {
        _this.setValues(position);
    }

    function displayUbigeo(geojson) {
        var options = {
            clickable: false,
            strokeColor: '#FF7800',
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: '#46461F',
            fillOpacity: 0.25
        };
        ubigeo = new GeoJSON(geojson, options);
        if (ubigeo.error) {
            console.log(ubigeo.error);
        } else {
            //console.log(map);
            ubigeo.setMap(map);
            var bounds = new g.LatLngBounds();
            bounds.extend(new g.LatLng(geojson.bbox[0], geojson.bbox[1]));
            bounds.extend(new g.LatLng(geojson.bbox[2], geojson.bbox[3]));
            map.fitBounds(bounds);
        }
    }

    function clear() {
        clearUbigeo();
        clearMarker();
    }

    function clearUbigeo() {
        if (typeof ubigeo !== 'undefined' && ubigeo != null) {
            ubigeo.setMap(null);
            ubigeo = null;
        }
    }

    function clearMarker() {
        if (typeof markerCliente !== 'undefined' && markerCliente != null) {
            markerCliente.setMap(null);
            markerCliente = null;
        }
    }

    function clearEvent() {
        g.event.clearListeners(markerCliente, 'dragend');
        markerCliente.setDraggable(false);
    }

    // Georeferencia móvil
    function drawPath(path) {
        if (this.path) {
            if (this.path.path) {
                this.path.path.setMap(null);
                this.path.path = null;
            }
            if (this.path.markerIni) {
                this.path.markerIni.setMap(null);
                this.path.markerIni = null;
            }
            if (this.path.markerFin) {
                this.path.markerFin.setMap(null);
                this.path.markerFin = null;
            }
        }
        var bounds = new g.LatLngBounds();
        for (var i = 0; i < path.length; i++) {
            bounds.extend(new g.LatLng(path[i].lat, path[i].lng));
        }
        map.fitBounds(bounds);

        var markerIni = simpleMarker(path[0]);

        var markerFin = simpleMarker(path[path.length - 1]);

        var flightPath = new g.Polyline({
            path: path,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 2
        });

        flightPath.setMap(map);

        this.path = {
            path: flightPath,
            markerIni: markerIni,
            markerFin: markerFin
        };
    }

    function simpleMarker(point) {
        var marker = new g.Marker({
            position: new g.LatLng(point.lat, point.lng),
            map: map
        });
        return marker;
    }

});