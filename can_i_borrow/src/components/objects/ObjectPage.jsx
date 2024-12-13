import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { IoLocationSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa6";
import { useEffect, useState } from "react";
import DatePicker from 'react-datepicker';
import { addToFav, createBooking, removeFromFav } from "../../redux/actions";
import BookingBanner from "../bookings/BookingBanner";
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";


const ObjectPage = () => {

    const [showModal, setShowModal] = useState(false);
    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);
    const dispatch = useDispatch();
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [costoPrenotazione, setCostoPrenotazione] = useState(null);
    const [durataPrenotazione, setDurataPrenotazione] = useState(null)
    const [bookedDates, setBookedDates] = useState([]);
    const { id } = useParams()
    const personalProfile = useSelector((store) => store.utenti.personalProfile)
    const token = useSelector((store) => store.token.token)
    const allBookings = useSelector((store) => store.bookings.allBookings)
    const [liked, setLiked] = useState(false)
    const allObjects = useSelector((store) => store.oggetti.allObjects);
    const favObjects = useSelector((store) => store.oggetti.favObjects);
    const singleObject = allObjects?.find(oggetto => oggetto.id === parseInt(id))
    const singleFav = favObjects?.find(oggetto => oggetto.id === singleObject.id);

    const allPersonalBookings = personalProfile?.id
        ? allBookings.filter(booking => booking.utente.id === personalProfile.id)
        : [];
    const specificObjectBooking = allPersonalBookings.filter(booking => booking.oggetto.id === parseInt(id));

    const createPrenotazione = () => {
        if (durataPrenotazione === 0) {
            console.error("La durata della prenotazione è zero.");
            return;
        }

        const calculatedCost = durataPrenotazione * singleObject.prezzoGiornaliero;
        setCostoPrenotazione(calculatedCost);
        console.log('Costo prenotazione calcolato:', calculatedCost);

        const startDate = selectedStartDate ? selectedStartDate.toLocaleDateString('en-CA') : null; // "en-CA" per formato yyyy-MM-dd
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

    useEffect(() => {
        if (selectedStartDate && selectedEndDate) {
            const date1 = new Date(selectedStartDate);
            const date2 = new Date(selectedEndDate);
            const diffInMilliseconds = date2 - date1;
            const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
            setDurataPrenotazione(diffInDays > 0 ? diffInDays : null);
        } else {
            setDurataPrenotazione(null);
            console.log(singleFav)
        }
    }, [selectedStartDate, selectedEndDate]);

    const fetchDates = async () => {
        const url = `http://localhost:3001/prenotazioni/dates/${id}`;

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
            } else {
                console.error('Errore nella fetch per ottenere le prenotazioni');
            }
        } catch (error) {
            console.error('Errore durante la fetch', error);
        }
    };

    useEffect(() => {
        fetchDates();
    }, []);


    const handleClick = async () => {
        handleShow();
        await fetchDates();
        setSelectedEndDate("")
        setSelectedStartDate("");
    }

    const handleLikeClick = (obj) => {


        if (liked) {
            dispatch(removeFromFav(obj.id));
        } else {
            dispatch(addToFav(obj));
        }

        setLiked(!liked);
    };


    return (
        <>
            <Row className="d-flex align-items-start w-100 justify-content-center">
                <Col className="object-box" style={{ maxHeight: "600px" }} md={10} lg={10} xl={8}>
                    <Container fluid className="p-2 h-100">
                        <Row className="h-100">
                            <Col sm={10} md={10} lg={9} className="p-0 pe-2 h-100">
                                <div className="details-object d-flex flex-column h-100 p-2">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <h1> {singleObject?.nomeOggetto}</h1>
                                        </div>
                                        <div className="like-icon" onClick={() => handleLikeClick(singleObject)}>
                                            {
                                                singleFav ?
                                                    (<FaHeart />)
                                                    :
                                                    (<FaRegHeart />)
                                            }

                                        </div>
                                    </div>
                                    <div>
                                        <Container>
                                            <Row className="py-2">
                                                <Col lg={4} className="box-img-fake p-0 pe-2">
                                                    <img src={singleObject?.fotoUrls[0]} alt="foto1" className="img-fake" />
                                                </Col>
                                                <Col lg={4} className="box-img-fake px-1 p-0">
                                                    <img src={singleObject?.fotoUrls[1]} alt="foto2" className="img-fake" />
                                                </Col>
                                                <Col lg={4} className="box-img-fake ps-2 p-0">
                                                    <img src={singleObject?.fotoUrls[2]} alt="foto3" className="img-fake" />
                                                </Col>
                                            </Row>
                                        </Container>

                                    </div>
                                    <div className="py-2">
                                        <p style={{ opacity: "0.8" }}> Descrizione: </p>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <p> {singleObject.descrizioneOggetto}</p>
                                            <div style={{ opacity: "0.6" }}>
                                                <p> {singleObject?.oggettoCategorie[0]?.categoria?.categoria}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2 d-flex align-items-center justify-content-between">
                                        <div>
                                            <p style={{ opacity: "0.8" }}> Prezzo giornaliero: </p>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <p> {singleObject.prezzoGiornaliero}€ </p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center" style={{ height: "100%" }}>
                                            {
                                                token === null ?
                                                    (
                                                        <button className="custom-reserve-button" onClick={handleShow}>
                                                            Accedi per prenotare!
                                                        </button>
                                                    )
                                                    :
                                                    (
                                                        <button className="custom-reserve-button" onClick={handleClick}>
                                                            Prendi in prestito!
                                                        </button>
                                                    )
                                            }

                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        {
                                            specificObjectBooking.length === 0 ?
                                                ("")
                                                :
                                                (
                                                    <BookingBanner specificObjectBooking={specificObjectBooking} />
                                                )
                                        }
                                    </div>
                                </div>

                            </Col>
                            <Col lg={3} className="p-0 d-flex flex-column justify-content-between">
                                <div className="details-object p-2">
                                    <Link to={`user/${singleObject.utente.id}`} className="text-decoration-none text-dark">
                                        <div>
                                            <h3 className="m-0"> {singleObject.utente.usernameUtente}</h3>
                                        </div>
                                    </Link>
                                    <div className="py-2">
                                        <div className="d-flex align-items-center position-relative">
                                            <div className="location-icon">
                                                <IoLocationSharp />
                                            </div>
                                            <div style={{ marginLeft: "19px" }}>
                                                <p>{singleObject.utente.cittaUtente}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center position-relative py-1">
                                            <div className="review-icon">
                                                <FaStar />
                                            </div>
                                            <div style={{ marginLeft: "19px" }}>
                                                <p> 5.00</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="w-50 px-2">
                                            <button className="user-card-button"> Segui</button>
                                        </div>
                                        <div className="w-50 px-2">
                                            <button className="user-card-button"> Contatta</button>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ flexGrow: "1" }} className="pt-2">
                                    <div className="details-object p-2 h-100">
                                        <p> Altri oggetti di questo utente:</p>
                                        <div>
                                            <Container>
                                                <Row className="py-2">

                                                </Row>
                                            </Container>

                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Row >

            <Modal show={showModal} onHide={handleClose} backdropClassName="custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title>
                        {
                            singleObject.disponibilita === true ?
                                (
                                    <p>Ci sei quasi!</p>
                                )
                                :
                                (
                                    <p>Peccato!</p>
                                )
                        }
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        {
                            singleObject.disponibilita === true ?

                                (
                                    <>
                                        <p>Hai scelto <strong>{singleObject.nomeOggetto}</strong> di {singleObject.utente.usernameUtente}!</p>
                                        <p>Quando ti servirebbe?</p>
                                    </>)
                                :
                                (
                                    <>
                                        <p>Hai scelto <strong>{singleObject.nomeOggetto}</strong> di {singleObject.utente.usernameUtente} ma non è al momento disponibile!</p>
                                        <p>Puoi scegliere una data libera tra queste!</p>
                                    </>)

                        }


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

export default ObjectPage;