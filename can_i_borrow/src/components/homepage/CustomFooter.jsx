import { Col, Row } from "react-bootstrap";
import ButtonDarkLight from "../tools/ButtonDarkLight";
import SocialLinks from "../tools/SocialLinks";

const CustomFooter = ({ selectedTheme, setSelectedTheme }) => {
    return (
        <>
            <Row className="py-4" style={{ paddingLeft: "38px", paddingRight: "38px" }}>
                <Col md={3}>

                </Col>
                <Col md={6} className="d-flex align-items-center justify-content-center">
                    <SocialLinks />
                </Col>
                <Col md={3} className="d-flex align-items-center justify-content-end">
                    <ButtonDarkLight selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />
                </Col>
            </Row>
        </>
    )
}

export default CustomFooter;