import { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ObjectList = () => {
    
    const allObjects = useSelector((store) => store.oggetti.allObjects);
    const oggetti = allObjects && Array.isArray(allObjects) ? allObjects : [];
    const personalProfile = useSelector((store) => store.utenti.personalProfile)
    const oggettiOther = personalProfile ? oggetti.filter(ogg => ogg.utente.id !== personalProfile.id) : oggetti; 
    const [userLatitudine, setUserLatitudine] = useState(null);
    const [userLongitudine, setUserLongitudine] = useState(null);


    const calculateDistanceInMeters = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const toRadians = angle => (angle * Math.PI) / 180;

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);

        const lat1Rad = toRadians(lat1);
        const lat2Rad = toRadians(lat2);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1Rad) * Math.cos(lat2Rad) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distanceInMeters = R * c;
        return distanceInMeters;
    };

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLatitudine(position.coords.latitude);
                    setUserLongitudine(position.coords.longitude);
                },
                (error) => {
                    console.error("Errore nell'ottenere la posizione dell'utente", error);
                }
            );
        } else {
            console.error("Geolocalizzazione non supportata dal browser.");
        }
    }, []);


    const sortedObjects = oggettiOther.map(oggetto => ({
        ...oggetto,
        distanza: calculateDistanceInMeters(oggetto.utente.latitudine, oggetto.utente.longitudine, userLatitudine, userLongitudine)
    }))
        .sort((a, b) => a.distanza - b.distanza);


    const formatDistance = (distanceInMeters) => {
        if (distanceInMeters >= 1000) {

            const distanceInKilometers = (distanceInMeters / 1000).toFixed(1);
            return `${distanceInKilometers} km`;
        } else {

            return `${Math.round(distanceInMeters)} m`;
        }
    };

    return (
        <>
            <div className="user-details-box w-100">
                <Container className="p-2">
                    <Row className="py-1">
                        <Col>
                            <div className="py-1 d-flex align-items-center justify-content-between" style={{ fontSize: "14px" }}>
                                <div>
                                    <p> Oggetti intorno a te: </p>
                                </div>
                            </div>
                            <div className="user-stats p-1">
                                {
                                    oggettiOther.length === 0 ?
                                        (
                                            <div className="p-2">
                                                <p style={{ fontSize: "15px", opacity: "0.6" }}> Nessun oggetto nelle vicinanze. </p>
                                            </div>
                                        )
                                        :
                                        (
                                            sortedObjects.map((oggetto, index) => (
                                                <Link to={`item/${oggetto.id}`} className="text-decoration-none text-dark" key={index}>
                                                    <div className="p-2 px-3">
                                                        <Row className="single-stat">
                                                            <Col lg={9} className="">
                                                                <p style={{ fontSize: "14px" }}>
                                                                    {oggetto.nomeOggetto} di {oggetto.utente.nomeUtente}
                                                                </p>

                                                            </Col>
                                                            <Col className="d-flex align-items-center justify-content-end" lg={3}>
                                                                <p style={{ fontSize: "14px", opacity: "0.7" }}>
                                                                    {

                                                                        formatDistance(oggetto.distanza)
                                                                    }
                                                                </p>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </Link>
                                            ))
                                        )
                                }
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div >
        </>
    );
};

export default ObjectList;
