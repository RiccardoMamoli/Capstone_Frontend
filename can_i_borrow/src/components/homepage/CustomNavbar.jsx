import { Button, Col, Container, Modal, Row } from "react-bootstrap";
import { IoListOutline } from "react-icons/io5";
import { FaMapLocationDot } from "react-icons/fa6";
import { IoIosSearch } from "react-icons/io";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearBooking, clearFav, clearMyProfile, clearObject, clearToken, getOggetti } from "../../redux/actions";
import CanIBorrowMoving from "../tools/CanIBorrowMoving";
import { FaUser } from "react-icons/fa";
import { MdFavorite } from "react-icons/md";
import { TbLogout } from "react-icons/tb";


const CustomNavbar = ({query, setQuery}) => {

    const [largeSearch, setLargeSearch] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const token = useSelector((store) => store.token.token);
    const favObjects = useSelector((store) => store.oggetti.favObjects);
    const [debouncedQuery, setDebouncedQuery] = useState(query);


    const goHomepage = () => {
        navigate("/homepage/main")
    }

    const handleClick = () => {
        setLargeSearch(!largeSearch)
    }

    const handleClose = () => {
        setLargeSearch(false)
    }

    const handleShowModal = () => {
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogOut = () => {
        dispatch(clearToken());
        dispatch(clearMyProfile());
        dispatch(clearBooking());
        dispatch(clearFav());
        dispatch(getOggetti());
        setShowModal(false);
    }

    const handleChangeQuery = (e) => {
        setQuery(e.target.value)
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500); 

        return () => clearTimeout(timer);
    }, [query]);
    

    return (
        <>
            <Row className="d-flex align-items-center justify-content-center py-4" style={{ paddingLeft: "38px", paddingRight: "38px" }}>
                <Col md={4} lg={4} className="p-0">
                    <CanIBorrowMoving />
                </Col>
                <Col className="border custom-navbar d-flex" md={4} lg={4}>
                    <Container className="m-0 p-0">
                        <Row className="container-icons m-0 d-flex align-items-center h-100">
                            <Col style={{ transition: "all 0.5s ease", margin: "0 auto" }} className="d-flex align-items-center justify-content-center" md={3} lg={`${largeSearch ? 2 : 3}`}>
                                <Link to="/homepage/main">
                                    <div className="icon-location d-flex align-items-center p-2" onClick={handleClose}>
                                        <FaMapLocationDot />
                                    </div>
                                </Link>
                            </Col>
                            <Col style={{ transition: "all 0.5s ease", margin: "0 auto" }} className="d-flex align-items-center justify-content-center"  md={3} lg={`${largeSearch ? 2 : 3}`}>
                                <div className="icon-list d-flex align-items-center p-2" onClick={handleClose}>
                                    <IoListOutline />
                                </div>
                            </Col>

                            {
                                largeSearch ?
                                    (
                                        <Col style={{ transition: "all 0.5s ease-in-out", margin: "0 auto" }} md={3} lg={6}>
                                            <div className="search-box">
                                                <input 
                                                type="searchbox" 
                                                className="search-input"
                                                value={debouncedQuery}
                                                onChange={handleChangeQuery} />
                                                <div className="icon-search-large d-flex align-items-center p-2" onClick={handleClose}>
                                                    <IoIosSearch />
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                    :
                                    (
                                        <Col style={{ transition: "all 0.5s ease", margin: "0 auto" }} className="d-flex align-items-center justify-content-center" md={3} lg={3}>
                                            <div className="icon-cart d-flex align-items-center p-2" onClick={handleClick}>
                                                <IoIosSearch />
                                            </div>
                                        </Col>
                                    )
                            }
                            {
                                token === null ?
                                    ("")
                                    :
                                    (
                                        <Col style={{ transition: "all 0.5s ease", margin: "0 auto" }} className="d-flex align-items-center justify-content-center" md={3} lg={`${largeSearch ? 2 : 3}`}>
                                            <Link to="/homepage/profile">
                                                <div className="icon-location d-flex align-items-center p-2" onClick={handleClose}>
                                                    <FaUser />
                                                </div>
                                            </Link>
                                        </Col>
                                    )
                            }
                        </Row>
                    </Container>
                </Col>
                <Col md={4} lg={4} className="d-flex justify-content-end p-0">
                    {
                        token === null ?
                            ("")
                            :
                            (
                                <>
                                    <Link to="favorites">
                                        <div className="icon-cart-navbar me-3 position-relative">

                                            <MdFavorite />

                                            <div className={`${favObjects?.length === 0 || favObjects === null ? "d-none" : ""}size-cart`}>
                                                {
                                                    favObjects?.length === 0 || favObjects === null ?
                                                        ("")
                                                        :
                                                        (favObjects.length)
                                                }
                                            </div>
                                        </div>
                                    </Link>
                                    <div className="icon-cart-navbar">
                                        <TbLogout onClick={handleShowModal} />
                                    </div>
                                </>
                            )
                    }

                    <Modal centered show={showModal} onHide={handleCloseModal}>
                        <Modal.Header className="border-0" closeButton>
                            <Modal.Title>Sei sicuro di voler uscire?</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="border-0">
                            Vuoi davvero fare il logout? Tutte le modifiche non salvate andranno perse.
                        </Modal.Body>
                        <Modal.Footer className="border-0 d-flex align-items-center justify-content-around">
                            <div className="w-100 d-flex align-items-center justify-content-around">
                                <div className="w-50 pe-1">
                                    <Button className="border-0 w-100" style={{ backgroundColor: "var(--pinkCIB)" }} onClick={handleCloseModal}>
                                        Annulla
                                    </Button>
                                </div>
                                <div className="w-50 ps-1">
                                    <Button className="border-0 w-100" style={{ backgroundColor: "var(--pinkCIB)" }} onClick={() => {
                                        handleLogOut();
                                        goHomepage();
                                    }}>
                                        Esci
                                    </Button>
                                </div>
                            </div>
                        </Modal.Footer>
                    </Modal>

                </Col>
            </Row>
        </>
    )
}

export default CustomNavbar;