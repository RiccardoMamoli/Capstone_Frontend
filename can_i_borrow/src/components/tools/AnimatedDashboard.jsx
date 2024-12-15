import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaArrowDown } from "react-icons/fa";
import { FaArrowUp } from "react-icons/fa";

const AnimatedDashboard = () => {

    const myProfile = useSelector((store) => store.utenti.personalProfile)
    const bookings = useSelector((store) => store.bookings.allBookings)
    const bookingsIn = useSelector((store) => store.bookings.bookingsIn)

    const [isFlipped, setIsFlipped] = useState(false);

    const handleFlip = () => {
        setIsFlipped((prev) => !prev);
    };

    return (
        <div className="position-relative info-box px-2 pt-4 pb-2 mt-3" style={{ height: "300px" }}>
            <div className="widget-name">
                <p style={{ fontSize: "21px" }}>
                    <Link to="/homepage/profile" style={{ color: "var(--white)" }} className="text-decoration-none">
                        <span style={{ fontWeight: "600" }}>Ciao {myProfile.nomeUtente}!</span>
                    </Link>
                </p>
            </div>
            <div className="custom-card-2 h-100 position-relative" onClick={handleFlip}>
                <motion.div
                    className="flip-card-inner w-100 h-100"
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div className="flip-card-front w-100 h-100 text-light">
                        <div className="instruction-text-flip w-100 h-100 d-flex align-items-center justify-content-center">
                            {
                                bookings === null || bookings.length === 0 ?
                                    (
                                        <p> Non hai ancora effettuato una prenotazione.</p>
                                    )
                                    :
                                    (
                                        <div className="w-100 h-100 d-flex flex-column">
                                            <div className="d-flex">
                                                <div className="box-arrow px-2">
                                                    <div style={{ border: "2px solid var(--pinkCIB)" }} className="d-flex align-items-center rounded-pill p-1">
                                                        <FaArrowUp />
                                                    </div>
                                                </div>
                                                <div style={{ background: "var(--greyBack)", borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }} className="p-2 h-100 w-100">
                                                    <p className="p-0 m-0 text-center text-dark"> Prenotazioni effettuate.</p>
                                                </div>
                                            </div>
                                            <div className="box-dash-in p-2" style={{ background: "var(--greyBack)", overflowY: "scroll" }}>
                                                {
                                                    bookings.map((book, index) => (
                                                        <Row key={index} className="pb-2">
                                                            <Col>
                                                                <div className="d-flex align-items-center">
                                                                    <div className="box-img-dashboard">
                                                                        <img alt="img-book" src={book?.oggetto?.fotoUrls[0]} />
                                                                    </div>
                                                                    <div className="ps-2">
                                                                        <div>
                                                                            <p> {book?.oggetto?.nomeOggetto}</p>
                                                                            <p> <span style={{opacity: "0.7"}}> di </span><span> {book.oggetto.utente.usernameUtente} </span></p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }
                                            </div>
                                        </div>

                                    )
                            }
                        </div>
                    </div>

                    <div className="flip-card-back w-100 h-100 text-light" style={{ position: "relative" }}>
                        {
                            bookingsIn === null || bookingsIn.length === 0 ?
                                (
                                    <p> Non hai ancora ricevuto delle prenotazioni.</p>
                                )
                                :
                                (
                                    <div className="w-100">
                                        <p className="text-dark" style={{ fontWeight: "500", fontSize: "19px" }}> Prenotazioni ricevute.</p>
                                    </div>

                                )
                        }

                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default AnimatedDashboard;