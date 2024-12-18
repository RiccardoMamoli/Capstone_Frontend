import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { IoIosArrowForward } from "react-icons/io";

const InfoBox = () => {

    const [show, setShow] = useState(false)
    const [showSecond, setShowSecond] = useState(false)

    const handleShow = () => {
        setShow(!show);
    }

    const handleShowSecond = () => {
        setShowSecond(!showSecond);
    }




    return (
        <>
            <div className="w-100">
                <div>
                    <Container className="p-2 w-100 info-box" onClick={handleShow}>
                        <Row className="py-1">
                            <Col lg={12} className="w-100">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <p style={{fontWeight: "500"}}> Hey, dove mi trovo? </p>
                                    <IoIosArrowForward className={`${show ? "show-icon-rotate" : ""} show-icon`} onClick={handleShow} />
                                </div>
                            </Col>
                            <Col lg={12} className={`${show ? "show-text" : "hidden-text"} w-100 d-flex align-items-center`} style={{ fontWeight: "300" }}>
                                Sei sulla prima piattaforma che permette ai propri utenti di poter prestare e prendere in prestito
                                oggetti di uso comune.
                            </Col>
                        </Row>
                    </Container>
                </div>
                <div className="py-3">
                    <Container className="p-2 w-100 info-box" onClick={handleShowSecond}>
                        <Row className="py-1">
                            <Col lg={12} className="w-100">
                                <div className="d-flex align-items-center justify-content-between w-100">
                                    <p style={{ fontWeight: "500" }}> Perchè dovrei utilizzarla? </p>
                                    <IoIosArrowForward className={`${showSecond ? "show-icon-rotate" : ""} show-icon`} onClick={handleShowSecond} />
                                </div>
                            </Col>
                            <Col lg={12} className={`${showSecond ? "show-text" : "hidden-text"} w-100 d-flex align-items-center`} style={{ fontWeight: "300" }}>
                                Così da poter riutilizzare oggetti che abbiamo in casa, favorendo un economica circolare che mira a ridurre gli sprechi.
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    )
}

export default InfoBox;