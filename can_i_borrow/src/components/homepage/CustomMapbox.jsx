import { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from 'mapbox-gl';
import omino from '../../assets/logos/LogoScontornato-remove-background.com.png';
import { useSelector } from 'react-redux';
import { FaMapMarkerAlt } from "react-icons/fa";
import { createRoot } from 'react-dom/client';
import { Link, useNavigate } from 'react-router-dom';

const CustomMapbox = ({ query }) => {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    const personalProfile = useSelector((store) => store.utenti.personalProfile);
    const oggetti = useSelector((state) => state.oggetti.allObjects);
    const oggettiOther = personalProfile ? oggetti.filter(ogg => ogg.utente.id !== personalProfile.id) : oggetti;

    const token = useSelector((store) => store.token.token);
    const navigate = useNavigate();

    
    const filterObjects = useMemo(() => {
        const markersArray = token ? oggettiOther : oggetti;
        if (!query) {
            return markersArray; 
        }

        // Filtro in base alla query
        return markersArray.filter((oggetto) => 
            oggetto.nomeOggetto.toLowerCase().includes(query.toLowerCase()) || 
            oggetto.descrizioneOggetto.toLowerCase().includes(query.toLowerCase())
        );
    }, [oggetti, oggettiOther, query, token]);  

    useEffect(() => {
        if (!mapContainerRef.current) {
            console.error("Il contenitore della mappa non è disponibile.");
            return;
        }

        if (mapRef.current) {
            return;
        }

        mapboxgl.accessToken = "pk.eyJ1IjoiaGF2b2MxMiIsImEiOiJjbTNpMnBxdXMwMWIzMmxzOXhqZ3ZpaDE5In0.TcFICJNu8fZjbvlFgJHYxA";

        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: "mapbox://styles/mapbox/light-v10?optimize=true",
            center: [0, 0],
            zoom: 2,
            attributionControl: false,
        });

        mapRef.current.on('load', () => {
            setMapLoaded(true);
        });

        const handleGeolocationSuccess = (position) => {
            const { longitude, latitude } = position.coords;

            if (mapLoaded && mapRef.current) {
                mapRef.current.setCenter([longitude, latitude]);
                mapRef.current.setZoom(12);

                const el = document.createElement('div');
                el.className = 'custom-marker';
                el.style.backgroundImage = `url(${omino})`;
                el.style.width = '80px';
                el.style.height = '80px';
                el.style.backgroundSize = 'contain';
                el.style.backgroundRepeat = 'no-repeat';

                new mapboxgl.Marker(el)
                    .setLngLat([longitude, latitude])
                    .addTo(mapRef.current);
            }
        };

        const handleGeolocationError = (error) => {
            console.error('Errore nella richiesta della posizione:', error);
        };

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                handleGeolocationSuccess,
                handleGeolocationError
            );
        } else {
            alert('La geolocalizzazione non è supportata dal tuo browser');
        }

        const handleView = (o) => {
            navigate(`/homepage/main/item/${o.id}`);
        };

        const addObjectMarkers = () => {
            if (mapLoaded && mapRef.current) {
                filterObjects.forEach((oggetto) => {
                    const lat = parseFloat(oggetto.utente.latitudine);
                    const lgt = parseFloat(oggetto.utente.longitudine);

                    const el = document.createElement('div');
                    el.className = 'object-marker';

                    const root = createRoot(el);
                    root.render(<FaMapMarkerAlt style={{ width: '100%', height: '100%' }} />);

                    const popupContainer = document.createElement('div');

                    const PopupContent = () => (
                        <div className="popup-card" style={{ width: '200px' }}>
                            <p className="title-popup">{oggetto.nomeOggetto}</p>
                            <div className="box-image-popup">
                                <img className="image-popup" src={oggetto.fotoUrls[0]} alt={oggetto.nomeOggetto} />
                            </div>
                            <div className="description-popup">
                                <p>{oggetto.descrizioneOggetto}</p>
                            </div>
                            <div className="box-info-popup">
                                <div>
                                    <p>€/giorno: {oggetto.prezzoGiornaliero.toFixed(2)}</p>
                                    <p>{oggetto.disponibilita ? "Disponibile" : "Non disponibile"}</p>
                                </div>
                                <div className="box-button-view">
                                    <button onClick={() => handleView(oggetto)}>Visualizza</button>
                                </div>
                            </div>
                        </div>
                    );

                    const popupRoot = createRoot(popupContainer);
                    popupRoot.render(<PopupContent />);

                    const popup = new mapboxgl.Popup({
                        offset: 25,
                        closeButton: false,
                        closeOnClick: false,
                    }).setDOMContent(popupContainer);

                    const marker = new mapboxgl.Marker(el)
                        .setLngLat([lgt, lat])
                        .addTo(mapRef.current);

                    let popupOpen = false;

                    el.addEventListener('mouseenter', () => {
                        if (!popupOpen) {
                            popup.addTo(mapRef.current);
                            popup.setLngLat([lgt, lat]);
                        }
                    });

                    el.addEventListener('mouseleave', () => {
                        if (!popupOpen) {
                            popup.remove();
                        }
                    });

                    el.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (!popupOpen) {
                            popup.addTo(mapRef.current);
                            popup.setLngLat([lgt, lat]);
                            popupOpen = true;
                        } else {
                            popup.remove();
                            popupOpen = false;
                        }
                    });

                    mapRef.current.on('click', () => {
                        if (popupOpen) {
                            popup.remove();
                            popupOpen = false;
                        }
                    });
                });
            }
        };

        if (mapLoaded) {
            addObjectMarkers();
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [filterObjects, mapLoaded]); 

    return (
        <div
            id="map-container"
            ref={mapContainerRef}
            style={{ width: '100%', height: '100%' }}
        />
    );
};

export default CustomMapbox;
