import { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalProfile } from "../../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const UserDetails = ({ token }) => {

    const myProfile = useSelector((store) => store.utenti.personalProfile)
    const bookings = useSelector((store) => store.bookings.allBookings)
    const bookingsIn = useSelector((store) => store.bookings.bookingsIn)
    const [notification, setNotification] = useState(0);
    const [books, setBooks] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showBookIndex, setShowBookIndex] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            await dispatch(getPersonalProfile(token));
            setLoading(false);
        };

        if (token && (!myProfile || Object.keys(myProfile).length === 0)) {

            fetchProfile();
        } else {
            setLoading(false);
        }
    }, [dispatch, token, myProfile]);


    useEffect(() => {
        setNotification(bookingsIn ? bookingsIn.length : 0);
        setBooks(bookingsIn || []);
    }, [bookingsIn]);


    useEffect(() => {
        if (myProfile === null) {
            navigate("/homepage/main");
        }
    }, [myProfile, navigate]);

    if (!myProfile) {
        return null;
    }

    const changeButton = (i) => {
        setSelected(i)
    }

    const handleShowBook = (i) => {
        setShowBookIndex(showBookIndex === i ? null : i);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
        const year = date.getFullYear();
        return `${day} ${capitalizedMonth} ${year}`;
    };


    return (
        <>
            {
                loading ? (
                    <div>Caricamento...</div>
                ) : (
                    <Container className="w-100 m-0 p-0 pt-3">
                        <Row>
                            <Col>
                                <div className="button-dashboard-box position-relative" style={{ paddingTop: "28px" }}>
                                    <div className="widget-name">
                                        <p style={{ fontSize: "20px" }}> Ciao
                                            <Link to="/homepage/profile" style={{ color: "var(--white)" }} className="text-decoration-none">
                                                <span style={{ fontWeight: "600" }}> {myProfile.nomeUtente}</span>
                                            </Link>!
                                        </p>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-center">
                                        <div className="w-50">
                                            <button className={`button-dashboard w-100 ${selected === 0 ? "selected-button" : "unselected-button"}`} onClick={() => changeButton(0)}> Preso in prestito</button>
                                        </div>
                                        <div className="w-50 position-relative">
                                            <button className={`button-dashboard w-100 ${selected === 1 ? "selected-button" : "unselected-button"}`} onClick={() => changeButton(1)}> Prestato </button>
                                            {/* <div className={` ${selected === 0 ? "dash-notification-number-not-active" : "dash-notification-number"}`}>  {notification}</div> */}
                                        </div>
                                    </div>
                                    {
                                        selected === 0 ?
                                            (
                                                <div className="selected-board pt-2" style={{ borderTopRightRadius: selected === 0 ? "4px" : "0px" }}>
                                                    <Container>
                                                        {
                                                            bookings === null || bookings.length === 0 ?
                                                                (
                                                                    <Row>
                                                                        <Col className="text-center p-0 py-3" style={{ opacity: "0.7" }}>
                                                                            <p> Non hai preso in presito nulla ancora.</p>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                                :
                                                                (
                                                                    bookings.map((b, i) => (
                                                                        <Row className="py-1">
                                                                            <Col md={2} key={i} className="p-0">
                                                                                <div className="box-img-dashboard-card">
                                                                                    <img alt="singleBook" src={b?.oggetto?.fotoUrls[0]} />
                                                                                </div>
                                                                            </Col>
                                                                            <Col md={6} className="p-0 ps-2">
                                                                                <div className="h-50 d-flex align-items-end">
                                                                                    <Link to={`item/${b?.oggetto?.id}`} className="text-decoration-none text-dark">
                                                                                        <p style={{ fontSize: "15px", fontWeight: "500" }}> {b?.oggetto?.nomeOggetto}</p>
                                                                                    </Link>
                                                                                </div>
                                                                                <div className="h-50 d-flex align-items-start">
                                                                                    <p style={{ fontSize: "15px" }}> di {b?.oggetto?.utente?.usernameUtente}</p>
                                                                                </div>

                                                                            </Col>
                                                                            <Col className="p-0" md={3} style={{ borderLeft: "1px solid var(--greyImgFake)" }}>
                                                                                <div className="d-flex flex-column ps-2 justify-content-between w-100 h-100">
                                                                                    <div className="d-flex align-items-end h-50 justify-content-start w-100" style={{ fontSize: "15px" }}>
                                                                                        <p style={{ opacity: "0.5" }}> Stato:</p>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-start h-50 justify-content-start" style={{ fontSize: "15px" }}>
                                                                                        <p style={{ fontWeight: "400" }}> {b?.stato === "ACCETTATA" ? "Accettata" : "In attesa"}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    )
                                                                    )
                                                                )
                                                        }
                                                    </Container>
                                                </div>

                                            )
                                            :
                                            (
                                                <div className="selected-board pt-2" style={{ borderTopLeftRadius: selected === 1 ? "4px" : "0px", maxHeight: "232px", overflowY: "auto" }}>
                                                    <Container>
                                                        {
                                                            bookingsIn === null || bookingsIn.length === 0 ?
                                                                (
                                                                    <Row>
                                                                        <Col className="text-center py-3 p-0" style={{ opacity: "0.7" }}>
                                                                            <p> Non hai ricevuto nuove prenotazioni.</p>
                                                                        </Col>
                                                                    </Row>
                                                                )
                                                                :
                                                                (
                                                                    bookingsIn.map((b, i) => (
                                                                        <Row key={i} className="py-1">
                                                                            <Col md={12} className="p-0 d-flex w-100 align-items-center justify-content-start">
                                                                                <div className={`${i === bookingsIn.length - 1 ? "" : "pb-3"} w-100`}>
                                                                                    <div className="d-flex align-items-center justify-content-between w-100">
                                                                                        <p>
                                                                                            Hai una nuova prenotazione da <span style={{ fontWeight: "500" }}>{b.utente.usernameUtente}</span>!
                                                                                        </p>
                                                                                        <IoIosArrowForward
                                                                                            className={`${showBookIndex === i ? "show-icon-rotate" : ""} show-icon`}
                                                                                            onClick={() => handleShowBook(i)}
                                                                                        />
                                                                                    </div>

                                                                                    <Col
                                                                                        lg={12}
                                                                                        className={`${showBookIndex === i ? "show-text" : "hidden-text"}`}
                                                                                        style={{ fontWeight: "300" }}
                                                                                    >
                                                                                        <div className="w-100 d-flex align-items-center h-100">
                                                                                            <div style={{ width: "17%" }} className="d-flex align-items-center justify-content-start">
                                                                                                <div className="p-0" style={{ width: "60px", height: "60px" }}>
                                                                                                    <img style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "6px" }} alt="img" src={b?.oggetto.fotoUrls[0]} />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="h-100" style={{ width: "43%", fontSize: "15px" }}>
                                                                                                <div className="d-flex align-items-end h-50 justify-content-between w-100">
                                                                                                    <div style={{ opacity: "0.6" }}>
                                                                                                        <p> dal: </p>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p> {formatDate(b.dataPrenotazione)}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="d-flex h-50 align-items-start justify-content-between w-100">
                                                                                                    <div style={{ opacity: "0.6" }}>
                                                                                                        <p> al: </p>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p> {formatDate(b.dataFinePrenotazione)}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="h-100 ps-4" style={{ width: "40%", fontSize: "15px" }}>
                                                                                                <div className="d-flex align-items-end h-50 justify-content-between w-100">
                                                                                                    <div style={{ opacity: "0.6" }}>
                                                                                                        <p> Costo: </p>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p> {(b?.oggetto?.prezzoGiornaliero) * (b.durataPrenotazione

                                                                                                        )}€</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className="d-flex h-50 align-items-start justify-content-between w-100">
                                                                                                    <div style={{ opacity: "0.6" }}>
                                                                                                        <p> Stato: </p>
                                                                                                    </div>
                                                                                                    <div>
                                                                                                        <p>{b?.stato === "IN_ATTESA" ? "Da confermare" : "Confermata"}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </Col>
                                                                                </div>
                                                                            </Col>
                                                                        </Row>
                                                                    ))
                                                                )
                                                        }

                                                    </Container>
                                                </div >
                                            )
                                    }
                                </div >
                            </Col >
                        </Row >
                    </Container >

                )
            }
        </>
    )
}

export default UserDetails;
