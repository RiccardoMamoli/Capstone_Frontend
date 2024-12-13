import { Col, Container, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

const Dashboard = () => {

    const utenti = useSelector((state) => state.utenti.allUsers);


    return (
        <>
            <div className="info-box w-100">
                <Container className="p-2">
                    <Row className="py-1">
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <p style={{ fontWeight: "500" }}> Utenti  </p>
                            <p> {utenti.length}</p>
                        </Col>
                        <Col lg={6} className="d-flex align-items-center justify-content-center">
                            <p style={{ fontWeight: "500" }}> Oggetti </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default Dashboard;