import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoDotFill } from "react-icons/go";
import { createBooking, removeFromFav } from "../../redux/actions";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';

const FavoritesPage = () => {

    const favObjects = useSelector((store) => store.oggetti.favObjects);
    const [showModal, setShowModal] = useState(false);
    const [selectedObject, setSelectedObject] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [costoPrenotazione, setCostoPrenotazione] = useState(null);
    const [durataPrenotazione, setDurataPrenotazione] = useState(null)
    const [bookedDates, setBookedDates] = useState([]);
    const handleClose = () => setShowModal(false);
    const personalProfile = useSelector((store) => store.utenti.personalProfile)
    const token = useSelector((store) => store.token.token)

    const createPrenotazione = () => {
        if (durataPrenotazione === 0) {
            console.error("La durata della prenotazione è zero.");
            return;
        }

        const calculatedCost = durataPrenotazione * selectedObject.prezzoGiornaliero;
        setCostoPrenotazione(calculatedCost);
        console.log('Costo prenotazione calcolato:', calculatedCost);

        const startDate = selectedStartDate ? selectedStartDate.toLocaleDateString('en-CA') : null;
        const endDate = selectedEndDate ? selectedEndDate.toLocaleDateString('en-CA') : null;

        const newPrenotazione = {
            utenteId: personalProfile.id,
            oggettoId: selectedObject.id,
            dataPrenotazione: startDate,
            dataFinePrenotazione: endDate,
            prezzoPrenotazione: costoPrenotazione
        };

        dispatch(createBooking(newPrenotazione, token));
    };

    const fetchDates = async (selectedObject) => {
        const url = `http://localhost:3001/prenotazioni/dates/${selectedObject.id}`;
        console.log(selectedObject);

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const convertedDates = data.map(dateStr => new Date(dateStr));
                setBookedDates(convertedDates);
                console.log("Qui ci dovrebbero andare le date", bookedDates)

            } else {
                console.error('Errore nella fetch per ottenere le prenotazioni');
            }
        } catch (error) {
            console.error('Errore durante la fetch', error);
        }
    };

    const handleRemove = (obj) => {
        dispatch(removeFromFav(obj.id));
    };

    const handleShow = (obj) => {
        setShowModal(!showModal)
        setSelectedObject(obj);
        fetchDates(obj);
        console.log("Questo ci sarà quando clicco botton per modale", selectedObject)
    }

    useEffect(() => {
        if (selectedObject) {
            setIsLoading(false)
        }
        console.log("Qui siamo nello useEffect", selectedObject)
        console.log("Qui c'è lo stato del caricamento", isLoading)
    }, [selectedObject]);

    return (
        <>
            <Row className="d-flex w-100 align-items-start justify-content-center">
                <Col style={{ maxHeight: "600px" }} className="favorites-box" lg={8}>
                    <Container fluid className="p-2">
                        <Row className="px-2">
                            <Col lg={9} className="p-0">
                                <div>
                                    <h1 style={{ fontWeight: "400" }}> I tuoi oggetti preferiti</h1>
                                </div>
                            </Col>
                        </Row>
                        <Row className="p-2 py-3">
                            {
                                favObjects?.length === 0 || favObjects === null ?
                                    (
                                        <Col className="p-0">
                                            <p style={{opacity: "0.6"}}> Non hai ancora degli oggetti tra i preferiti.</p>
                                        </Col>
                                    )
                                    :
                                    (
                                        favObjects.map((o, i) => (
                                            <Col key={i} sm={12} className={`p-0 ${i === favObjects.length - 1 ? "" : "pb-3"}`}>
                                                <div className="d-flex">
                                                    <div className="fav-img-box">
                                                        <img src={o?.fotoUrls[0]} alt="img-fav"  />
                                                    </div>
                                                    <div className="ps-3 d-flex align-items-center justify-content-between flex-grow-1">
                                                        <div>
                                                            <div style={{ fontSize: "30px" }}>
                                                                <p> {o.nomeOggetto} </p>
                                                            </div>
                                                            <div>
                                                                <p> di
                                                                    <Link className="text-decoration-none text-dark">
                                                                        <span className="ps-1">
                                                                            {o.utente.usernameUtente}
                                                                        </span>
                                                                    </Link>
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="pe-3 d-flex flex-column justify-content-end">
                                                            <div className="d-flex align-items-center justify-content-end">
                                                                <div className="d-flex align-items-center">
                                                                    <p className="pe-1" style={{ opacity: 0.4 }}> Stato: </p>
                                                                    <span> {o.disponibilita ? "Disponibile" : "Non Disponibile"}
                                                                    </span>
                                                                    <div className="ps-3 position-relative" style={{ color: o.disponibilita ? "green" : "red" }}>
                                                                        <GoDotFill className="avaiable-icon" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <p> <span style={{ opacity: 0.4 }}> Prezzo giornaliero: </span> <span> {o.prezzoGiornaliero}€</span></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" d-flex align-items-center justify-content-end">
                                                        <div className="d-flex button-box-fav ps-3 flex-column justify-content-around">
                                                            <div className="pb-1">
                                                                <button className="fav-page-button" onClick={() => handleShow(o)}> Prendi in prestito</button>
                                                            </div>
                                                            <div className="pt-1">
                                                                <button className="fav-page-button" onClick={() => handleRemove(o)}> Rimuovi dai preferiti</button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </div>
                                            </Col>
                                        ))
                                    )
                            }

                        </Row>
                    </Container>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleClose} backdropClassName="custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>
                        {
                            isLoading && selectedObject === null ?
                                (<p> Attendi un momento</p>)
                                :
                                (
                                    selectedObject?.disponibilita ? <p>Ci sei quasi!</p> : <p>Peccato!</p>
                                )
                        }

                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {
                        isLoading && selectedObject === null ?

                            (
                                <p> Attendi caricamento!</p>
                            )
                            :
                            (
                                <form>
                                    {selectedObject?.disponibilita ? (
                                        <>
                                            <p>Hai scelto <strong>{selectedObject?.nomeOggetto}</strong> di {selectedObject?.utente?.usernameUtente}!</p>
                                            <p>Quando ti servirebbe?</p>
                                        </>
                                    ) : (
                                        <>
                                            <p>Hai scelto <strong>{selectedObject?.nomeOggetto}</strong> di {selectedObject?.utente?.usernameUtente} ma non è al momento disponibile!</p>
                                            <p>Puoi scegliere una data libera tra queste!</p>
                                        </>
                                    )}

                                    <div className="d-flex align-items-center justify-content-between py-2">
                                        <div className="d-flex align-items-center">
                                            <p className="me-2">dal:</p>
                                            <DatePicker
                                                excludeDates={bookedDates}
                                                selected={selectedStartDate}
                                                onChange={(date) => setSelectedStartDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                minDate={new Date()}
                                                className="input-date-booking"
                                            />
                                        </div>
                                        <div className="d-flex align-items-center">
                                            <p className="me-2">al:</p>
                                            <DatePicker
                                                excludeDates={bookedDates}
                                                selected={selectedEndDate}
                                                onChange={(date) => setSelectedEndDate(date)}
                                                dateFormat="yyyy-MM-dd"
                                                minDate={new Date()}
                                                className="input-date-booking"
                                            />
                                        </div>
                                    </div>

                                    <div className="py-2">
                                        <div className="d-flex justify-content-between">
                                            <p>Prezzo giornaliero:</p>
                                            <p><strong>{selectedObject?.prezzoGiornaliero}€</strong></p>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p>Durata prenotazione:</p>
                                            <p>{durataPrenotazione ? `${durataPrenotazione} ${durataPrenotazione > 1 ? "giorni" : "giorno"}` : " - "}</p>
                                        </div>
                                        <div className="d-flex py-2 justify-content-between">
                                            <p>Costo totale prenotazione:</p>
                                            <p>{durataPrenotazione ? `${durataPrenotazione * selectedObject?.prezzoGiornaliero}€` : " - "}</p>
                                        </div>
                                    </div>
                                </form>
                            )
                    }


                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button style={{border: "none"}} variant="secondary" onClick={handleClose}>Annulla</Button>
                    <Button style={{background: "var(--pinkCIB)", border: "none"}} onClick={() => {
                        createPrenotazione();
                        handleClose();
                    }}>Conferma Prenotazione</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default FavoritesPage;