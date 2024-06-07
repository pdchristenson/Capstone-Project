/* eslint-disable react/prop-types */
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { cellToBoundary } from 'h3-js';
import 'leaflet/dist/leaflet.css';
import Icon from '../../assets/record.png';

const MapComponent = React.memo(({
    searchCenter,
    searchRadius,
    searchResults,
    hexagonsVisible,
    onHexagonClick,
    hoveredFacility,
    tornadoData,
    earthquakeData,
    selectedLocation
}) =>
{
    const mapRef = useRef(null);
    const hexLayerRef = useRef(null);
    const initialViewSet = useRef(false);
    const bboxLayerRef = useRef(null);
    const tornadoLayerRef = useRef(null);
    const earthquakeLayerRef = useRef(null);
    const searchCircleRef = useRef(null);
    const [mapInitialized, setMapInitialized] = useState(false);

    const [selectedHexIndex, setSelectedHexIndex] = useState(null);

    const myIcon = new L.icon({
        iconUrl: Icon,
        iconSize: [15, 15],
    });

    const clearMapLayers = () =>
    {
        hexLayerRef.current.clearLayers();
        bboxLayerRef.current.clearLayers();
        tornadoLayerRef.current.clearLayers();
        earthquakeLayerRef.current.clearLayers();
    };

    const handleHexagonClick = (h3Index) =>
    {
        setSelectedHexIndex(h3Index);
        if (onHexagonClick)
        {
            onHexagonClick(h3Index);
        }
    };

    useEffect(() =>
    {
        const map = L.map('map', {
            center: [0, 0],
            zoom: 1,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © OpenStreetMap contributors',
        }).addTo(map);

        mapRef.current = map;
        hexLayerRef.current = L.layerGroup().addTo(map);
        bboxLayerRef.current = L.layerGroup().addTo(map);
        tornadoLayerRef.current = L.layerGroup().addTo(map);
        earthquakeLayerRef.current = L.layerGroup().addTo(map);

        map.createPane('hexagons');
        map.getPane('hexagons').style.zIndex = 400;

        map.createPane('selectedHexagon');
        map.getPane('selectedHexagon').style.zIndex = 401;
        setMapInitialized(true);

        return () =>
        {
            map.off('zoomend');
            map.remove();
        };
    }, []);

    useEffect(() =>
    {
        bboxLayerRef.current.clearLayers();
        if (hoveredFacility && hoveredFacility.images && hoveredFacility.images.length > 0)
        {
            const { bbox } = hoveredFacility.images[0];
            const bounds = [[bbox.northeast[1], bbox.northeast[0]], [bbox.southwest[1], bbox.southwest[0]]];
            L.rectangle(bounds, { color: "#ff7800", weight: 2, fill: false }).addTo(bboxLayerRef.current);
        }
    }, [hoveredFacility]);

    useEffect(() =>
    {
        if (selectedLocation && mapRef.current)
        {
            mapRef.current.flyTo([selectedLocation.lat, selectedLocation.lng], 14, {
                animate: true,
                duration: 0.7
            });
        }
    }, [selectedLocation]);

    useEffect(() =>
    {
        const tornadoLayer = tornadoLayerRef.current;
        tornadoLayer.clearLayers();

        tornadoData.forEach(tornado =>
        {
            const startLatLng = [tornado.start_lat, tornado.start_lon];
            const startMarker = L.marker(startLatLng, { icon: myIcon }).addTo(tornadoLayer);
            startMarker.bindPopup(`<strong>Start Location</strong><br>Date: ${tornado.date}<br>State: ${tornado.state}<br>Fatalities: ${tornado.fatalities}<br>Injuries: ${tornado.injuries}`);

            if (parseFloat(tornado?.end_lat) !== 0 || parseFloat(tornado?.end_lon) !== 0)
            {
                const endLatLng = [tornado.end_lat, tornado.end_lon];
                const endMarker = L.marker(endLatLng, { icon: myIcon }).addTo(tornadoLayer);
                endMarker.bindPopup(`<strong>End Location</strong><br>Date: ${tornado.date}<br>State: ${tornado.state}<br>Fatalities: ${tornado.fatalities}<br>Injuries: ${tornado.injuries}`);

                L.polyline([startLatLng, endLatLng], { color: 'red' }).addTo(tornadoLayer);
            }
        });
    }, [tornadoData]);

    useEffect(() =>
    {
        earthquakeLayerRef.current.clearLayers();
        earthquakeData.forEach(earthquake =>
        {
            const latLng = [earthquake.epicenter_latitude, earthquake.epicenter_longitude];
            L.circle(latLng, {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.1,
                radius: earthquake.magnitude * 10000,
            }).addTo(earthquakeLayerRef.current);
        });
    }, [earthquakeData]);

    useEffect(() =>
    {
        if (!initialViewSet.current && searchResults.length > 0 && mapRef.current)
        {
            const firstResult = searchResults[0];
            mapRef.current.setView([firstResult.latitude, firstResult.longitude], 12);
            initialViewSet.current = true;
        }
    }, [searchResults]);

    useEffect(() =>
    {
        if (!mapInitialized) return;

        if (searchCircleRef.current && searchCenter.lat[0] !== 0)
        {
            searchCircleRef.current.setLatLng([searchCenter.lat, searchCenter.lng]);
            searchCircleRef.current.setRadius(searchRadius * 1100);
        } else
        {
            searchCircleRef.current = L.circle([searchCenter.lat, searchCenter.lng], {
                color: 'red',
                fillOpacity: 0.01,
                radius: searchRadius * 1100,
                dashArray: '5, 10',
            }).addTo(mapRef.current);
        }

    }, [searchCenter, searchRadius, mapInitialized]);

    useEffect(() =>
    {
        clearMapLayers();
        const hexLayer = hexLayerRef.current;

        searchResults.forEach((result) =>
        {
            if (result && typeof result.latitude === 'number' && typeof result.longitude === 'number')
            {
                const center = [result.latitude, result.longitude];
                const boundary = cellToBoundary(result.h3_index);
                const latLngBoundary = boundary.map((coord) => L.latLng(coord[0], coord[1]));

                if (hexagonsVisible)
                {
                    L.polygon(latLngBoundary, {
                        color: result.h3_index === selectedHexIndex ? 'orange' : 'blue',
                        fillColor: result.h3_index === selectedHexIndex ? 'orange' : 'blue',
                        fillOpacity: 0.01,
                        pane: result.h3_index === selectedHexIndex ? 'selectedHexagon' : 'hexagons',
                    }).addTo(hexLayer)
                        .on('click', () => handleHexagonClick(result.h3_index));
                }

                const marker = L.marker(center, { icon: myIcon }).addTo(hexLayerRef.current);

                const popupContent = `
                    <div>
                        <h3>${result.name ?? 'No Provided Name'}</h3>
                        <p>${result.address}</p>
                        <p>Lat: ${result.latitude.toFixed(4)}, Lng: ${result.longitude.toFixed(4)}</p>
                    </div>
                `;

                marker.bindPopup(popupContent);
                marker.bindTooltip(result.name, { direction: 'top' });

                result.images?.forEach((image) =>
                {
                    if (image.visible)
                    {
                        const neLatLng = new L.LatLng(image.bbox.northeast[1], image.bbox.northeast[0]);
                        const swLatLng = new L.LatLng(image.bbox.southwest[1], image.bbox.southwest[0]);
                        const rectangleBounds = [swLatLng, neLatLng];
                        L.imageOverlay(image.url, rectangleBounds).addTo(hexLayerRef.current);
                    }
                });
            }
        });


    }, [searchResults, hexagonsVisible, selectedHexIndex, searchRadius, searchCenter]);

    return <div id="map" className="h-[calc(100vh-4rem)] w-full"></div>;
});



MapComponent.displayName = "MapComponent";

export default MapComponent;