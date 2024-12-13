import { Col, Container, Row } from "react-bootstrap";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { FaGithub } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";


const SocialLinks = () => {
    return (
        <>
            <Container fluid>
                <Row className="d-flex align-items-center justify-content-center px-3">
                    <Col md={4} className="p-0 w-100 justify-content-center d-flex align-items-center">
                        <div className="pe-4 icon-socials">
                            <FaInstagram />
                        </div>
                        <div className="pe-4 icon-socials">
                            <FaLinkedin />
                        </div>
                        <div className="pe-4 icon-socials">
                            <FaGithub />
                        </div>
                        <div className="icon-socials">
                            <FaFacebookSquare />
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default SocialLinks;