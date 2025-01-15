import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteBooking, getBookings } from "../../redux/actions";
import { useState } from "react";
import { CiCircleCheck } from "react-icons/ci";

const BookingBanner = ({ specificObjectBooking }) => {
    const dispatch = useDispatch();
    const token = useSelector((store) => store.token.token)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [selectedBooking, setSelectedBooking] = useState(null)

    const handleCloseDelete = () => {
        setShowDeleteModal(false)
        setSelectedBooking([])
    }

    const formatDate = (d) => {
        const date = new Date(d).toLocaleDateString("it-IT", { day: "2-digit", month: "long", year: "numeric" })
        return date;
    }

    const handleShowDelete = (b) => {
        setSelectedBooking(b)
        setShowDeleteModal(true)
    }

    const deleteSelectedBooking = () => {
        dispatch(deleteBooking(selectedBooking.id, token))
        dispatch(getBookings())
    }


    return (
        <>
            <Container fluid className="d-flex h-100 w-100 flex-column flex-grow-1">
                <Row className="h-25 pb-2">
                    <Col className="m-0 p-0 d-flex align-items-center">
                        <h5 className="m-0 p-0"> Hai fatto {specificObjectBooking.length} {specificObjectBooking.length > 1 ? "prenotazioni" : "prenotazione"} per questo oggetto: </h5>
                    </Col>
                </Row>
                <Row className="h-75 flex-nowrap" style={{ overflowX: "auto" }}>
                    {
                        specificObjectBooking.map((b, index) => (
                            <Col sm={6} md={6} lg={6} xl={4} key={index} className={`${index === specificObjectBooking.length - 1 ? "" : "pe-1"} m-0 p-0 h-100`}>
                                <div className="card-booking d-flex p-2 h-100 align-itmes-center">
                                    <div style={{ fontSize: "14px", width: "80%" }} className="d-flex pe-3 flex-column h-100 justify-content-between">
                                        <div className="pt-1">
                                            <div className="d-flex justify-content-between">
                                                <div style={{ opacity: "0.4" }}>
                                                    <p> dal</p>
                                                </div>
                                                <div>
                                                    <p> {formatDate(b.dataPrenotazione)}</p>
                                                </div>
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div style={{ opacity: "0.4" }}>
                                                    <p> al</p>
                                                </div>
                                                <div>
                                                    <p> {formatDate(b.dataFinePrenotazione)}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex h-100" style={{ fontSize: "22px" }}>
                                                <p className="m-0 p-0"> {(b.oggetto.prezzoGiornaliero) * (b.durataPrenotazione)}€</p>
                                            </div>
                                            <div className="d-flex align-items-center h-100" style={{ fontSize: "13px" }}>
                                                <p className="m-0 p-0"> {b.stato === "IN_ATTESA" ? "Non confermata" : "Confermata"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ width: "20%", borderLeft: "1px solid var(--greyImgFake)" }} className="d-flex ps-1 flex-column justify-content-around">
                                        {
                                            b?.stato === "ACCETTATA" ?
                                                (
                                                    <div className="d-flex justify-content-center">
                                                        <div style={{ fontSize: "25px", color: "green" }} className="d-flex box-button-booking justify-content-center">
                                                            <CiCircleCheck />
                                                        </div>
                                                    </div>
                                                )
                                                :
                                                (
                                                    <>
                                                        <div className="d-flex justify-content-center">
                                                            <div style={{ fontSize: "18px" }} className="d-flex box-button-booking justify-content-center">
                                                                <MdEdit />
                                                            </div>
                                                        </div>
                                                        <div style={{ paddingRight: "2px" }} className="d-flex justify-content-center">
                                                            <div style={{ fontSize: "21px" }} className="d-flex box-button-booking justify-content-center" onClick={() => handleShowDelete(b)}>
                                                                <MdOutlineDeleteOutline />
                                                            </div>
                                                        </div>
                                                    </>
                                                )
                                        }
                                    </div>
                                </div>
                            </Col>
                        ))
                    }
                </Row >
            </Container >

            <Modal show={showDeleteModal} onHide={handleCloseDelete} backdropClassName=" custom-backdrop" centered>
                <Modal.Header className="border-0" closeButton>
                    <Modal.Title> Sei sicuro di voler procedere?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p> Stai per eliminare la prenotazione per <span style={{ fontWeight: "500" }}> {selectedBooking?.oggetto?.nomeOggetto}</span> di {selectedBooking?.oggetto?.utente?.usernameUtente}. L'azione è irreversibile!</p>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <Button variant="secondary" onClick={handleCloseDelete}>Annulla</Button>
                    <button className="edit-object-button" onClick={() => {
                        deleteSelectedBooking();
                        handleCloseDelete();
                    }}> Elimina prenotazione</button>
                </Modal.Footer>
            </Modal >
        </>
    )
}

export default BookingBanner;