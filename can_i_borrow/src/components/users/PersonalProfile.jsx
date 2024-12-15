import { useEffect, useState } from "react";
import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BsThreeDots } from "react-icons/bs";
import { acceptBooking, createNewObject, deleteObject, getBookings, getBookingsIn, getOggetti, modifyObject, rejectBooking } from "../../redux/actions";
import { FaPlus } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { CiCircleCheck } from "react-icons/ci";

const PersonalProfile = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [addClass, setAddClass] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showAcceptModal, setShowAcceptModal] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState([]);
    const [selectedObject, setSelectedObject] = useState([]);
    const [photos, setPhotos] = useState([null, null, null]);
    const [labels, setLabels] = useState(["I tuoi oggetti", "Prenotazioni effettuate", "Prenotazioni ricevute"]);

    const [nomeNewOggetto, setNomeNewOggetto] = useState("")
    const [descrizioneNewOggetto, setDescrizioneNewOggetto] = useState("")
    const [prezzoNewOggetto, setPrezzoNewOggetto] = useState("")
    const [statoNewOgggetto, setStatoNewOggetto] = useState(true)
    const [categoriaNewOggetto, setCategoriaNewOggetto] = useState([])
    const [nomeOggettoModificato, setNomeOggetto] = useState("")
    const [descrizioneOggettoModificato, setDescrizioneOggetto] = useState("")
    const [prezzoOggettoModificato, setPrezzoOggetto] = useState(0);
    const [statoOgettoModificato, setStatoOggetto] = useState(true);


    const token = useSelector((store) => store.token.token)
    const personalProfile = useSelector((store) => store.utenti.personalProfile);
    const allBookings = useSelector((store) => store.bookings.allBookings);
    const personalBookings = allBookings.filter(book => book.utente.id === personalProfile.id);
    const bookingsIn = useSelector((store) => store.bookings.bookingsIn)

    const categories = [
        {
            value: "ABBIGLIAMENTO",
            title: "Abbigliamento",
        },
        {
            value: "ARTICOLI_CASA",
            title: "Articoli per la casa",
        },
        {
            value: "ELETTRONICA",
            title: "Elettronica",
        },
        {
            value: "MUSICA",
            title: "Musica",
        },
        {
            value: "SPORT_TEMPO_LIBERO",
            title: "Sport e tempo libero",
        },
    ];

    const [allCategory, setAllCategory] = useState(categories)
    const [selectedCategory, setSelectedCategory] = useState([])

    const addCategory = (c) => {
        const updatedSelection = [...selectedCategory]
        const updateAllCategory = [...allCategory]
        updatedSelection.push(c)

        const filteredAll = updateAllCategory.filter(cat => cat.title !== c.title)

        setCategoriaNewOggetto(updatedSelection.map(i => i.value));

        setAllCategory(filteredAll)
        setSelectedCategory(updatedSelection)
    }

    const removeCategory = (c) => {
        const updatedSelection = [...selectedCategory]
        const updateAllCategory = [...allCategory]

        const filteredSelected = updatedSelection.filter(cat => cat.title !== c.title)

        setCategoriaNewOggetto(filteredSelected.map(i => i.value));

        updateAllCategory.push(c)

        setSelectedCategory(filteredSelected)
        setAllCategory(updateAllCategory)

    }

    const handleClass = (index) => {
        setAddClass(index);
    };

    const getCurrentLabel = () => {
        return labels[addClass];
    };


    useEffect(() => {
        if (personalProfile === null) {
            navigate("/login");
        }
    }, [personalProfile, navigate]);

    useEffect(() => {
        dispatch(getBookingsIn());
        dispatch(getBookings());
        console.log("Update delle prenotazioni!!!!")
    }, [dispatch]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        const year = date.getFullYear();
        return `${day} ${capitalizedMonth} ${year}`;
    };

    const oggetti = useSelector((store) => store.oggetti.allObjects);
    const oggettiUtente = personalProfile && oggetti
        ? oggetti.filter(oggettoUtente => oggettoUtente.utente.id === personalProfile.id)
        : [];

    if (personalProfile === null) {
        return null;
    }

    const handleOpenAcceptBooking = (o) => {
        setShowAcceptModal(true)
        setSelectedBooking(o)
    }

    const handleShowModal = () => {
        setShowCreateModal(true)
    }

    const handleShowDelete = (obj) => {
        setShowDeleteModal(true)
        setSelectedObject(obj)
    }

    const handleEditModal = (obj) => {
        setSelectedObject(obj)
        setShowModal(true)
    }

    const handleClose = () => {
        setShowModal(false)
    }

    const handleCloseDelete = () => {
        setShowDeleteModal(false)
    }

    const handleCloseCreate = () => {
        setShowCreateModal(false)
    }

    const handleCloseAccept = () => {
        setShowAcceptModal(false)
    }

    const handleChangeNome = (e) => {
        setNomeOggetto(e.target.value)
    }

    const handleChangeNewNome = (e) => {
        setNomeNewOggetto(e.target.value)
    }

    const handleChangeDescrizione = (e) => {
        setDescrizioneOggetto(e.target.value)
    }

    const handleChangeNewDescrizione = (e) => {
        setDescrizioneNewOggetto(e.target.value)
    }

    const handleChangePrezzo = (e) => {
        setPrezzoOggetto(e.target.value)
    }

    const handleChangeNewPrezzo = (e) => {
        setPrezzoNewOggetto(e.target.value)
    }

    const handleChangeStato = (v) => {
        setStatoOggetto(v);
    };

    const handleChangeNewStato = (v) => {
        setStatoNewOggetto(v);
    };

    const handleModify = async () => {

        const fotoUrls = photos.length > 0 ? await uploadPhotos(photos) : selectedObject.fotoUrls;

        const oggetto = {
            utenteId: personalProfile.id,
            nomeOggetto: nomeOggettoModificato?.trim() || selectedObject.nomeOggetto,
            descrizioneOggetto: descrizioneOggettoModificato?.trim() || selectedObject.descrizioneOggetto,
            disponibilita: statoOgettoModificato ?? selectedObject.disponibilita,
            prezzoGiornaliero: parseInt(prezzoOggettoModificato || selectedObject.prezzoGiornaliero),
            categorie: [selectedObject.oggettoCategorie[0].categoria.categoria],
            fotoUrls: fotoUrls
        };

        if (!oggetto.nomeOggetto || oggetto.nomeOggetto.length < 2 || oggetto.nomeOggetto.length > 100) {
            console.error("Nome oggetto non valido!");
            return;
        }
        if (!oggetto.descrizioneOggetto || oggetto.descrizioneOggetto.length < 5 || oggetto.descrizioneOggetto.length > 500) {
            console.error("Descrizione oggetto non valida!");
            return;
        }
        if (oggetto.prezzoGiornaliero <= 0) {
            console.error("Prezzo giornaliero non valido!");
            return;
        }

        dispatch(modifyObject(oggetto, token, selectedObject.id));
        dispatch(getOggetti());
        dispatch(getBookingsIn());
        console.log("Modifiche inviate:", oggetto);
    };

    const uploadPhotos = async (photos) => {
        const uploadedUrls = [];

        for (let i = 0; i < photos.length; i++) {
            const formData = new FormData();
            formData.append("file", photos[i]);
            formData.append("upload_preset", "ml_default");

            try {
                const res = await fetch("https://api.cloudinary.com/v1_1/dcrdtbcyz/image/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) {
                    throw new Error(`Errore nel caricamento della foto: ${res.statusText}`);
                }

                const data = await res.json();
                console.log("Risposta da Cloudinary:", data);

                if (data.secure_url) {
                    uploadedUrls.push(data.secure_url);
                } else {
                    console.error("Errore nel ricevere l'URL dalla risposta:", data);
                }
            } catch (error) {
                console.error("Errore nel caricamento della foto su Cloudinary:", error);
            }
        }

        return uploadedUrls;
    };


    const handleCreate = async () => {
        if (!personalProfile || !personalProfile.id) {
            console.error("Errore: personalProfile non definito o id mancante");
            return;
        }

        const oggetto = {
            utenteId: personalProfile.id,
            nomeOggetto: nomeNewOggetto?.trim(),
            descrizioneOggetto: descrizioneNewOggetto?.trim(),
            disponibilita: statoNewOgggetto,
            prezzoGiornaliero: parseInt(prezzoNewOggetto),
            categorie: categoriaNewOggetto,
            fotoUrls: await uploadPhotos(photos)
        };

        console.log("Dati oggetto prima del dispatch", oggetto);

        dispatch(createNewObject(oggetto, token));
        dispatch(getOggetti());
    };


    const handleDelete = () => {
        dispatch(deleteObject(selectedObject.id, token))
        dispatch(getOggetti());
    }

    const handleAcceptBooking = () => {
        setShowAcceptModal(false)
        dispatch(acceptBooking(selectedBooking.id, token))
        dispatch(getBookingsIn())
    }

    const handleRejectBooking = () => {
        setShowAcceptModal(false)
        dispatch(rejectBooking(selectedBooking.id, token))
        dispatch(getBookingsIn())
    }



    return (
        <>
            <Row className="d-flex border h-100 w-100 align-items-start justify-content-center">
                <Col className="profile-info-box h-100" md={10} lg={9} xl={8}>
                    <Container fluid className="p-3">
                        <Row className="d-flex align-items-center">
                            <Col md={2} lg={2} xl={2} className="p-0 px-2">
                                <div className="profile-image-box">
                                    <img src={personalProfile.avatarUtente} alt="profile-image" />
                                </div>
                            </Col>
                            <Col md={10} lg={10} xl={10} className="ps-4">
                                <div>
                                    <p style={{ fontSize: "30px", fontWeight: "500" }}>
                                        {personalProfile.usernameUtente}
                                    </p>
                                </div>
                                <div className="py-2">
                                    <div style={{ opacity: "0.7" }}>
                                        Le tue informazioni:
                                    </div>
                                    <div className="py-1">
                                        <Row>
                                            <Col md={2} lg={2} xl={2}>
                                                <p> Nome: </p>
                                            </Col>
                                            <Col className="p-0" md={10} lg={10}>
                                                <p> {personalProfile.nomeUtente} </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2} lg={2}>
                                                <p> Cognome: </p>
                                            </Col>
                                            <Col className="p-0" md={9} lg={9}>
                                                <p> {personalProfile.cognomeUtente} </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2} lg={2}>
                                                <p> Data di nascita: </p>
                                            </Col>
                                            <Col className="p-0" md={10} lg={10}>
                                                <p> {formatDate(personalProfile.dataNascita)}  </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2} lg={2}>
                                                <p> Indirizzo: </p>
                                            </Col>
                                            <Col className="p-0" md={9} lg={9}>
                                                <p> {personalProfile.indirizzoUtente} ({personalProfile.cittaUtente}, {personalProfile.codicePostaleUtente}) </p>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={2} lg={2}>
                                                <p> Stato: </p>
                                            </Col>
                                            <Col className="p-0" md={10} lg={10}>
                                                <p> {personalProfile.statoUtente} </p>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                    <div className="px-3">
                        <Container fluid>
                            <Row>
                                <Col className="p-0">
                                    <div>
                                        <button className="button-create-obj" onClick={handleShowModal}>
                                            Aggiungi nuovo oggetto
                                        </button>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </div>


                    <div className="p-3">
                        <Container fluid>
                            <Row className="p-0 position-relative">
                                <Col md={4} lg={4} className="p-0 ">
                                    <motion.div
                                        className="indicator"
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            height: "100%",
                                            width: "33.33%",
                                            backgroundColor: "var(--greyBack)",
                                            left: `${addClass * 33.33}%`,
                                        }}

                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {getCurrentLabel()}
                                    </motion.div>
                                    <motion.div
                                        className="p-2 d-flex align-items-center justify-content-center"
                                        onClick={() => handleClass(0)}>
                                        <p className="label-tag"> I tuoi oggetti </p>
                                    </motion.div>
                                </Col>
                                <Col md={4} lg={4} className="p-0">
                                    <motion.div
                                        className="p-2 d-flex align-items-center justify-content-center"
                                        onClick={() => handleClass(1)}>
                                        <p className="label-tag"> Prenotazioni effettuate </p>
                                    </motion.div>
                                </Col>
                                <Col md={4} lg={4} className="p-0">
                                    <motion.div
                                        className="p-2 d-flex align-items-center justify-content-center"
                                        onClick={() => handleClass(2)}>
                                        <p className="label-tag"> Prenotazioni ricevute </p>
                                    </motion.div>
                                </Col>
                            </Row>
                        </Container>
                        <Container
                            fluid
                            className="px-3 py-3 table-object p-0"
                            style={{
                                borderTopRightRadius: addClass === 1 || addClass === 0 ? "8px" : "0px",
                                borderTopLeftRadius: addClass === 2 || addClass === 1 ? "8px" : "0px",
                                maxHeight: "190px",
                                overflowX: "hidden"
                            }}
                        >
                            {addClass === 0 ? (
                                oggettiUtente.map((oggetto, index) => (
                                    <div className="px-2" key={index}>
                                        <Row className="single-object py-2">
                                            <Col md={3} lg={3} className="p-0 d-flex align-items-center">
                                                <div className="px-2" style={{ fontSize: "15px" }}>
                                                    <p>{oggetto.nomeOggetto}</p>
                                                </div>
                                            </Col>
                                            <Col md={6} lg={6} className="p-0 d-flex justify-content-start align-items-center">
                                                <div className="px-3 d-flex align-items-center justify-content-center" style={{ fontSize: "15px" }}>
                                                    <p>{oggetto.descrizioneOggetto}</p>
                                                </div>
                                            </Col>
                                            <Col md={6} lg={2} className="p-0 d-flex align-items-center">
                                                <div className="px-2 d-flex align-items-center" style={{ fontSize: "15px" }}>
                                                    <p>{oggetto.disponibilita ? 'Disponibile' : 'Non disponibile'}</p>
                                                </div>
                                            </Col>
                                            <Col className="p-0 d-flex align-items-center justify-content-around" md={1} lg={1}>
                                                <div className="edit-icon" onClick={() => handleEditModal(oggetto)} >
                                                    <BsThreeDots />
                                                </div>
                                                <div className="delete-icon" style={{ fontSize: "17px" }} onClick={() => handleShowDelete(oggetto)} >
                                                    <MdOutlineDeleteOutline />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))
                            ) : addClass === 1 ? (
                                personalBookings.map((booking, index) => (

                                    <div className="px-2" key={index}>
                                        <Row className="single-object">
                                            <Col lg={6} className="p-0 d-flex align-items-center">
                                                <div className="p-2" style={{ fontSize: "15px" }}>
                                                    <p> {booking?.oggetto?.nomeOggetto} di {booking?.oggetto?.utente?.usernameUtente}</p>
                                                </div>
                                            </Col>
                                            <Col lg={5} className="p-0 d-flex align-items-center justify-content-end">
                                                <div className="px-2 w-100 d-flex align-items-center justify-content-end" style={{ fontSize: "15px" }}>
                                                    <p>
                                                        {booking?.stato === "IN_ATTESA"
                                                            ? "Non confermata!"
                                                            : booking?.stato === "ACCETTATA"
                                                                ? "Confermata!"
                                                                : booking?.stato === "RIFIUTATA"
                                                                    ? "Rifiutata"
                                                                    : null}
                                                    </p>
                                                </div>
                                            </Col>
                                            <Col lg={1} className="p-0 d-flex justify-content-end align-items-center">
                                                <div className="d-fle px-2 align-items-center">
                                                    <BsThreeDots />
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>

                                ))
                            ) : (

                                bookingsIn.map((book, i) => (
                                    <div className="px-2" key={i} onClick={() => handleOpenAcceptBooking(book)}>
                                        <Row className="single-object">
                                            <Col md={10} className="p-0 d-flex align-items-center">
                                                <div className="p-2" style={{ fontSize: "15px" }}>
                                                    <p> {book?.utente?.usernameUtente} vorrebbe prendere in prestito il tuo oggetto <span style={{ fontWeight: "500" }}>{book.oggetto.nomeOggetto}</span> per {book.durataPrenotazione} {book.durataPrenotazione > 1 ? "giorni" : "giorno"}.  </p>
                                                </div>
                                            </Col>
                                            <Col md={2} className="p-0 d-flex align-items-center">
                                                <div className="p-2" style={{ fontSize: "15px" }}>
                                                    <p style={{ opacity: "0.6" }}> {book.stato === "IN_ATTESA" ? "Da confermare" : "Confermata"} </p>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                ))

                            )}
                        </Container>

                    </div>
                </Col>
            </Row>


            {/* MODALE EDIT */}


            <Modal show={showModal} onHide={handleClose} backdropClassName=" custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title> Modifica il tuo oggetto! </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Container fluid>
                            <Row className="d-flex justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Nome oggetto:</p>
                                </Col>
                                <Col lg={9} className="p-0 ps-1">
                                    <input
                                        className="input-edit"
                                        placeholder={selectedObject.nomeOggetto}
                                        value={nomeOggettoModificato}
                                        onChange={handleChangeNome} />
                                </Col>
                            </Row>
                            <Row className="d-flex pt-3 justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Descrizione:</p>
                                </Col>
                                <Col lg={9} className="p-0 ps-1">
                                    <input className="input-edit"
                                        placeholder={selectedObject.descrizioneOggetto}
                                        value={descrizioneOggettoModificato}
                                        onChange={handleChangeDescrizione} />
                                </Col>
                            </Row>
                            <Row className="pt-3 d-flex align-items-center">
                                <Col lg={3} className="d-flex h-100 p-0 align-items-center">
                                    <p>Aggiungi foto:</p>
                                </Col>
                                <Col lg={9} className="d-flex ps-1 p-0 align-items-center justify-content-between">
                                    {photos.map((photo, index) => (
                                        <div key={index}>
                                            <label htmlFor={`file-upload-${index}`}>
                                                <div className="uploader-icon">
                                                    {
                                                        photo ?
                                                            (
                                                                <FaCheck style={{ fontSize: "20px", color: "var(--pinkCIB)" }} />
                                                            )
                                                            :
                                                            (
                                                                <FaPlus style={{ fontSize: "20px", opacity: "0.6" }} />
                                                            )
                                                    }
                                                </div>
                                            </label>
                                            <input
                                                id={`file-upload-${index}`}
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    const newPhotos = [...photos];
                                                    newPhotos[index] = file;
                                                    setPhotos(newPhotos);
                                                }}
                                                accept="image/*"
                                                style={{ display: "none" }}
                                            />
                                        </div>
                                    ))}
                                </Col>
                            </Row>
                            <Row className="d-flex pt-3 justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Prezzo:</p>
                                </Col>
                                <Col lg={3} className="p-0 ps-1 pe-5">
                                    <input className="input-edit"
                                        placeholder={`${selectedObject.prezzoGiornaliero}€`}
                                        value={prezzoOggettoModificato}
                                        onChange={handleChangePrezzo}
                                    />
                                </Col>
                                <Col lg={2} className="d-flex p-0 align-items-center">
                                    <p>Stato:</p>
                                </Col>
                                <Col lg={4} className="p-0">
                                    <select
                                        className="input-edit"
                                        value={statoOgettoModificato ? "true" : "false"}
                                        onChange={(e) => handleChangeStato(e.target.value === "true")}
                                    >
                                        <option value="true">Disponibile</option>
                                        <option value="false">Non Disponibile</option>
                                    </select>

                                </Col>
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={handleClose}>Annulla</Button>
                    <button className="edit-object-button" onClick={() => {
                        handleModify();
                        handleClose();
                    }}> Conferma modifiche</button>
                </Modal.Footer>
            </Modal >


            {/* MODALE CREA */}


            <Modal show={showCreateModal} onHide={handleCloseCreate} backdropClassName=" custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title> Crea un nuovo oggetto! </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Container fluid>
                            <Row className="d-flex justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Nome oggetto:</p>
                                </Col>
                                <Col lg={9} className="p-0 ps-1">
                                    <input
                                        className="input-edit"
                                        placeholder="Inserisci un nome per il tuo oggetto!"
                                        value={nomeNewOggetto}
                                        onChange={handleChangeNewNome} />
                                </Col>
                            </Row>
                            <Row className="d-flex pt-3 justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Descrizione:</p>
                                </Col>
                                <Col lg={9} className="p-0 ps-1">
                                    <input className="input-edit"
                                        placeholder="Descrivi il tuo oggetto!"
                                        value={descrizioneNewOggetto}
                                        onChange={handleChangeNewDescrizione} />
                                </Col>
                            </Row>
                            <Row className="pt-3 d-flex align-items-center">
                                <Col lg={3} className="d-flex h-100 p-0 align-items-center">
                                    <p>Aggiungi foto:</p>
                                </Col>
                                <Col lg={9} className="d-flex ps-1 p-0 align-items-center justify-content-between">
                                    {photos.map((photo, index) => (
                                        <div key={index}>
                                            <label htmlFor={`file-upload-${index}`}>
                                                <div className="uploader-icon">
                                                    {
                                                        photo ? (
                                                            <FaCheck style={{ fontSize: "20px", color: "var(--pinkCIB)" }} />
                                                        ) : (
                                                            <FaPlus style={{ fontSize: "20px", opacity: "0.6" }} />
                                                        )
                                                    }
                                                </div>
                                            </label>
                                            <input
                                                id={`file-upload-${index}`}
                                                type="file"
                                                onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        const newPhotos = [...photos];
                                                        newPhotos[index] = file;
                                                        setPhotos(newPhotos);
                                                    }
                                                }}
                                                accept="image/*"
                                                style={{ display: "none" }}
                                            />
                                        </div>
                                    ))}

                                </Col>
                            </Row>
                            <Row className="d-flex pt-3 justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Prezzo:</p>
                                </Col>
                                <Col lg={3} className="p-0 ps-1 pe-5">
                                    <input className="input-edit"
                                        placeholder="-"
                                        value={prezzoNewOggetto}
                                        onChange={handleChangeNewPrezzo}
                                    />
                                </Col>
                                <Col lg={2} className="d-flex p-0 align-items-center">
                                    <p>Stato:</p>
                                </Col>
                                <Col lg={4} className="p-0">
                                    <select
                                        className="input-edit"
                                        value={statoNewOgggetto ? "true" : "false"}
                                        onChange={(e) => handleChangeNewStato(e.target.value === "true")}
                                    >
                                        <option value="true">Disponibile</option>
                                        <option value="false">Non Disponibile</option>
                                    </select>

                                </Col>
                            </Row>
                            <Row className="d-flex pt-3 justify-content-between align-items-center">
                                <Col lg={3} className="d-flex p-0 align-items-center">
                                    <p>Categoria:</p>
                                </Col>
                                <Col lg={9} className="p-0 ps-1 py-1 flex-wrap d-flex align-items-center justify-content-start container-category">
                                    {
                                        selectedCategory.length === 0 ?
                                            (
                                                <div className="d-flex align-items-center justify-content-start" style={{ paddingTop: "10px", paddingBottom: "10px" }}>
                                                    <p style={{ opacity: "0.4", fontSize: "14.5px", paddingLeft: "1px" }}> Inserisci almeno una categoria!</p>
                                                </div>
                                            )
                                            :
                                            (
                                                selectedCategory.map((c, i) => (
                                                    <div key={i} className="px-1 py-1">
                                                        <div className="single-category d-flex align-items-center justify-content-between">
                                                            <p> {c.title}</p>
                                                            <div className="px-1 d-flex align-items-center" style={{ fontSize: "14px" }} onClick={() => removeCategory(c)}>
                                                                <p> <RxCross2 /> </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))
                                            )
                                    }
                                </Col>
                            </Row>
                            <Row className="pt-3">
                                <Col md={12} className="p-0 py-1 flex-wrap d-flex align-items-center justify-content-start container-category">
                                    {
                                        allCategory.map((c, i) => (
                                            <div key={i} className="px-1 py-1">
                                                <div className="single-category" onClick={() => addCategory(c)}>
                                                    <p> {c.title}</p>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </Col>
                            </Row>
                        </Container>
                    </form>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={handleCloseCreate}>Annulla</Button>
                    <button className="edit-object-button" onClick={() => {
                        handleCreate();
                        handleCloseCreate();
                    }}> Crea oggetto</button>
                </Modal.Footer>
            </Modal >

            {/* MODALE ELIMINA */}

            <Modal show={showDeleteModal} onHide={handleCloseDelete} backdropClassName=" custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title> Sei sicuro di voler procedere?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Stai per eliminare l'oggetto <span style={{ fontWeight: "500" }}> {selectedObject.nomeOggetto}</span>. L'azione è irreversibile!</p>

                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={handleCloseDelete}>Annulla</Button>
                    <button className="edit-object-button" onClick={() => {
                        handleDelete();
                        handleCloseDelete();
                    }}> Elimina oggetto</button>
                </Modal.Footer>
            </Modal >

            {/* MODALE ACCETTA PRENOTAZIONI */}

            <Modal show={showAcceptModal} onHide={handleCloseAccept} backdropClassName=" custom-backdrop" centered size={"lg"}>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title> Scheda prenotazione</Modal.Title>
                </Modal.Header>
                <Modal.Body className="pt-0 pb-3">
                    <Container fluid>
                        <Row>
                            <Col className="p-0">
                                {
                                    selectedBooking?.stato === "ACCETTATA" ?
                                        (
                                            <p> Ben fatto! Abbiamo informato {selectedBooking?.utente?.usernameUtente} che la prenotazione è stata accettata! </p>
                                        )
                                        :
                                        (
                                            <p> Ottimo! {selectedBooking?.utente?.usernameUtente} è interessato a prendere in prestito un tuo oggetto:</p>
                                        )
                                }
                            </Col>
                        </Row>
                        <Row className="py-3">
                            <Col md={3} className="p-0">
                                <div>
                                    <div className="box-img-modal-acc">
                                        <img src={selectedBooking?.oggetto?.fotoUrls[0]} alt="imgBook" />
                                    </div>
                                </div>
                            </Col>
                            <Col md={6} className="p-0 d-flex flex-column justify-content-between">
                                <Row>
                                    <Col md={12}>
                                        <p style={{ fontSize: "22px" }}> {selectedBooking?.oggetto?.nomeOggetto}</p>
                                    </Col>
                                </Row>
                                <Row className="pt-2">
                                    <Col md={3} className="pe-0">
                                        <div style={{ opacity: "0.7" }}>
                                            <p> Data inizio: </p>
                                        </div>
                                        <div style={{ opacity: "0.7" }}>
                                            <p> Data fine: </p>
                                        </div>
                                        <div style={{ opacity: "0.7" }}>
                                            <p> Durata: </p>
                                        </div>
                                    </Col>
                                    <Col md={9}>
                                        <div>
                                            <p> {formatDate(selectedBooking?.dataPrenotazione)} </p>
                                        </div>
                                        <div>
                                            <p> {formatDate(selectedBooking?.dataFinePrenotazione)} </p>
                                        </div>
                                        <div>
                                            <p> {selectedBooking?.durataPrenotazione} {selectedBooking?.durataPrenotazione > 1 ? "giorni" : "giorno"} </p>
                                        </div>
                                    </Col>
                                </Row>
                                <Row className="pt-3">
                                    <Col md={12} className="pe-0 d-flex align-items-center">
                                        <div>
                                            <p> <span style={{ opacity: "0.7" }}>Totale prenotazione: </span><span style={{ fontWeight: "500" }}>{selectedBooking?.oggetto?.prezzoGiornaliero}€</span><span style={{ opacity: "0.7" }}> x </span><span style={{ fontWeight: "500" }}> {selectedBooking?.durataPrenotazione} {selectedBooking?.durataPrenotazione > 1 ? "giorni" : "giorno"} </span>  </p>
                                        </div>
                                        <div className="ps-1">
                                            <p style={{ fontWeight: "600" }}>= {(selectedBooking?.oggetto?.prezzoGiornaliero) * (selectedBooking?.durataPrenotazione)}€ </p>
                                        </div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={3} className="p-0">

                                {
                                    selectedBooking?.stato === "ACCETTATA" ?
                                        (
                                            <div style={{ borderLeft: "1px solid var(--greyImgFake)" }} className="d-flex flex-column h-100 justify-content-around align-items-center">
                                                <div style={{ fontSize: "65px", color: "green" }}>
                                                    <CiCircleCheck />
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <div style={{ borderLeft: "1px solid var(--greyImgFake)" }} className="d-flex flex-column h-100 justify-content-around align-items-center">
                                                <div className="not-accept-button">
                                                    <button onClick={handleRejectBooking}> Rifiuta prenotazione</button>
                                                </div>
                                                <div className="accept-button">
                                                    <button onClick={handleAcceptBooking}> Accetta prenotazione</button>
                                                </div>
                                            </div>
                                        )
                                }

                            </Col>
                        </Row>
                    </Container>
                </Modal.Body>
            </Modal >
        </>
    );
};

export default PersonalProfile;
