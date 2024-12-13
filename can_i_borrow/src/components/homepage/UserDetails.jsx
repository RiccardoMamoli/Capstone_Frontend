import { useEffect, useState } from "react";
import { Col, Row, Container } from "react-bootstrap";
import { FaStar } from "react-icons/fa6";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { getPersonalProfile } from "../../redux/actions";
import { Link, useNavigate } from "react-router-dom";
import { div } from "framer-motion/client";

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
                                        <p style={{ fontSize: "21px" }}> Ciao
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
                                            <div className={` ${selected === 0 ? "dash-notification-number-not-active" : "dash-notification-number"}`}>  {notification}</div>
                                        </div>
                                    </div>
                                    {
                                        selected === 0 ?
                                            (
                                                <div className={`selected-board ${bookings === null || bookings.length === 0 ? "" : "py-3 px-2"}`} style={{ borderTopRightRadius: selected === 0 ? "4px" : "0px" }}>
                                                    <Container>
                                                        <Row className="flex-nowrap" style={{ overflowX: "auto" }}>
                                                            {
                                                                bookings === null || bookings.length === 0 ?
                                                                    (
                                                                        <Col className="text-center py-3" style={{ opacity: "0.8" }}>
                                                                            <p> Non hai preso in presito nulla ancora.</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    (
                                                                        bookings.map((b, i) => (
                                                                            <Col lg={6} key={i}>
                                                                                <div className="card-dashboard d-flex flex-column">
                                                                                    <div className="box-img-dashboard-card">
                                                                                        <div className="img-dashboard-card" />
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center justify-content-start flex-grow-1">
                                                                                        <p style={{fontSize: "14px"}}> {b.oggetto.nomeOggetto}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        )
                                                                        )
                                                                    )
                                                            }
                                                        </Row>
                                                    </Container>
                                                </div>

                                            )
                                            :
                                            (
                                                <div className={`selected-board ${bookingsIn === null || bookingsIn.length === 0 ? "" : "py-3 px-2"}`} style={{ borderTopLeftRadius: selected === 1 ? "4px" : "0px", maxHeight: "232px", overflowY: "auto" }}>
                                                    <Container>
                                                        <Row>
                                                            {
                                                                bookingsIn === null || bookingsIn.length === 0 ?
                                                                    (
                                                                        <Col className="text-center py-3" style={{ opacity: "0.8" }}>
                                                                            <p> Non hai ricevuto nuove prenotazioni.</p>
                                                                        </Col>
                                                                    )
                                                                    :
                                                                    (
                                                                        bookingsIn.map((b, i) => (
                                                                            <Col key={i} className="d-flex align-items-center justify-content-center">
                                                                                <div className={`d-flex flex-column justify-content-center ${i === bookingsIn.length - 1 ? "" : "pb-3"}`}>
                                                                                    <div>
                                                                                        <p> Nuova prenotazione per il tuo oggetto {b.oggetto.nomeOggetto}. </p>
                                                                                    </div>
                                                                                    <div className="d-flex align-items-center justify-content-between pt-2">
                                                                                        <div className="w-50 pe-1">
                                                                                            <button style={{fontSize: "15px"}} className="notification-view-button"> Visualizza</button>
                                                                                        </div>
                                                                                        <div className="w-50 ps-1">
                                                                                            <button  style={{fontSize: "15px"}} className="notification-view-button"> Segna come letto</button>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        ))
                                                                    )
                                                            }

                                                        </Row>
                                                    </Container>
                                                </div>
                                            )
                                    }
                                </div>
                            </Col>
                        </Row>















                        {/* <Row className="py-3">
                                <Col>
                                <Col lg={3} className="d-flex align-items-center justify-content-center">
                                    <div className="px-1">
                                        <p style={{ opacity: "0.8" }}> 5 </p>
                                    </div>
                                    <div className="icon-star">
                                        <FaStar />
                                    </div>
                                </Col>
                                    <div className="py-1 d-flex align-items-center justify-content-between" style={{ fontSize: "14px" }}>
                                        <div>
                                            <p> Prestiti in scadenza: </p>
                                        </div>
                                        <div>
                                            <FaArrowRightArrowLeft className="order-icon" />
                                        </div>
                                    </div>
                                </Col>
                            </Row> */}
                    </Container>

                )
            }
        </>
    )
}

export default UserDetails;
