import { useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { getBookings, getBookingsIn, setToken } from "../../redux/actions";
import { useNavigate } from "react-router-dom";
import logoScontortnato from "../../assets/logos/Logo_Orange-Photoroom.png";

const LoginBox = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/register")
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = "http://localhost:3001/auth/login";

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                throw new Error("Errore nella fetch!");
            }

            const data = await response.json();
            console.log("I tuoi dati", data);


            if (data.accessToken && typeof data.accessToken === 'string' && data.accessToken.length > 0) {
                dispatch(setToken(data.accessToken));
                dispatch(getBookings(data.accessToken));
                dispatch(getBookingsIn(data.accessToken));
            } else {
                console.error("Token non presente nella risposta");
                throw new Error("Token non ricevuto");
            }

        } catch (err) {
            console.error("Errore durante il login", err);
        }
    };

    return (
        <>
            <div className="w-100" style={{paddingTop: "31px"}}>
                <Container className="p-2 w-100 login-box">
                    <Row className="position-relative">
                        <Col md={12}>
                            <div className="box-logo-login">
                                <img src={logoScontortnato} alt="logo" />
                            </div>
                            <div className="white-circle-box" />
                        </Col>
                    </Row>
                    <Row className="pt-5">
                        <Col md={12} className="d-flex justify-content-center">
                            <p> Accedi per cominciare!</p>
                        </Col>
                    </Row>
                    <Row>
                        <Container fluid className="d-flex align-items-center justify-content-center">
                            <Row className="w-100 d-flex justify-content-center">
                                <Col className="d-flex align-items-center justify-content-center">
                                    <form className="py-3" onSubmit={handleSubmit}>
                                        <div className="py-2">
                                            <input
                                                placeholder="Inserisci email"
                                                type="email"
                                                id="form2Example1"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div className="py-2">
                                            <input
                                                placeholder="Inserisci password"
                                                type="password"
                                                id="form2Example2"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="form-input"
                                            />
                                        </div>

                                        <div className="py-2 d-flex align-items-center justify-content-center">
                                            <button
                                                className="sign-in-button"
                                                type="submit"
                                            >
                                                Login
                                            </button>
                                        </div>

                                        {errorMessage && (
                                            <div className="error-message py-2">
                                                <p style={{ color: "red" }}>{errorMessage}</p>
                                            </div>
                                        )}

                                        <div className="text-center py-2 d-flex align-items-center justify-content-center">
                                            <div className="px-1">
                                                <p className="text-dark">oppure <span onClick={handleClick} className="register-word"> registrati qui.</span> </p>
                                            </div>
                                        </div>
                                    </form>
                                </Col>
                            </Row>
                        </Container>
                    </Row>
                </Container>
            </div>
        </>
    );
};

export default LoginBox;
