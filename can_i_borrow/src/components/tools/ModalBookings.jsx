import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DatePicker from 'react-datepicker';
import { useDispatch, useSelector } from "react-redux";
import { createBooking } from "../../redux/actions";

const ModalBookings = ({ selectedObject, showModal, setShowModal }) => {
    const dispatch = useDispatch();
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [costoPrenotazione, setCostoPrenotazione] = useState(null);
    const [durataPrenotazione, setDurataPrenotazione] = useState(null)
    const [bookedDates, setBookedDates] = useState([]);
    const handleClose = () => setShowModal(false);
    const oggetti = useSelector((store) => store.oggetti.allObjects)
    const personalProfile = useSelector((store) => store.utenti.personalProfile)
    const token = useSelector((store) => store.token.token)


    const singleObject = selectedObject && oggetti.length > 0
        ? oggetti.find(oggetto => oggetto.id === selectedObject.id)
        : null;


    const createPrenotazione = () => {
        if (durataPrenotazione === 0) {
            console.error("La durata della prenotazione è zero.");
            return;
        }

        const calculatedCost = durataPrenotazione * singleObject.prezzoGiornaliero;
        setCostoPrenotazione(calculatedCost);
        console.log('Costo prenotazione calcolato:', calculatedCost);

        const startDate = selectedStartDate ? selectedStartDate.toLocaleDateString('en-CA') : null;
        const endDate = selectedEndDate ? selectedEndDate.toLocaleDateString('en-CA') : null;

        const newPrenotazione = {
            utenteId: personalProfile.id,
            oggettoId: singleObject.id,
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
                console.log(bookedDates)
            } else {
                console.error('Errore nella fetch per ottenere le prenotazioni');
            }
        } catch (error) {
            console.error('Errore durante la fetch', error);
        }
    };

    useEffect(() => {
        if (selectedObject) {
            fetchDates(selectedObject);
            console.log("Questo ci sarà quando clicco botton per modale", selectedObject)
            console.log("Questo dovrebbe sempre essere pieno essendo su Redux", oggetti)
        }
    }, [selectedObject]);



    return (
        <>
            <Modal show={showModal} onHide={handleClose} backdropClassName="custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>
                        {singleObject.disponibilita ? <p>Ci sei quasi!</p> : <p>Peccato!</p>}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        {singleObject.disponibilita ? (
                            <>
                                <p>Hai scelto <strong>{singleObject.nomeOggetto}</strong> di {singleObject.utente.usernameUtente}!</p>
                                <p>Quando ti servirebbe?</p>
                            </>
                        ) : (
                            <>
                                <p>Hai scelto <strong>{singleObject.nomeOggetto}</strong> di {singleObject.utente.usernameUtente} ma non è al momento disponibile!</p>
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
                                <p><strong>{singleObject.prezzoGiornaliero}€</strong></p>
                            </div>
                            <div className="d-flex justify-content-between">
                                <p>Durata prenotazione:</p>
                                <p>{durataPrenotazione ? `${durataPrenotazione} ${durataPrenotazione > 1 ? "giorni" : "giorno"}` : " - "}</p>
                            </div>
                            <div className="d-flex py-2 justify-content-between">
                                <p>Costo totale prenotazione:</p>
                                <p>{durataPrenotazione ? `${durataPrenotazione * singleObject.prezzoGiornaliero}€` : " - "}</p>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={handleClose}>Annulla</Button>
                    <Button variant="primary" onClick={() => {
                        createPrenotazione();
                        handleClose();
                    }}>Conferma Prenotazione</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ModalBookings;