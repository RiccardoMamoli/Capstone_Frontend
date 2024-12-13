import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setToken } from "../../redux/actions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleClick = () => {
        navigate("/register")
    }

    const goHomepage = () => {
        navigate("/homepage/main")
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
                goHomepage();
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
        <div className="w-100 vh-100 d-flex align-items-center">
                <Container className="p-2 login-box">
                    <Row className="py-1">
                        <Col className="d-flex justify-content-center">
                            <p> Mmh, sembra che tu non abbia effetuato l'accesso.</p>
                        </Col>
                    </Row>
                    <Row>
                        <Container fluid className="d-flex align-items-center justify-content-center">
                            <Row className="w-100 d-flex justify-content-center">
                                <Col className="d-flex align-items-center justify-content-center">
                                    <form className="py-3" onSubmit={handleSubmit}>
                                        <div data-mdb-input-init className="py-2 px-3">
                                            <input
                                                placeholder="Inserisci email"
                                                type="email"
                                                id="form2Example1"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="form-input"
                                            />
                                        </div>
                                        <div data-mdb-input-init className="py-2 px-3">
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
                                                data-mdb-button-init
                                                data-mdb-ripple-init
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
                                                <p className="text-light">oppure </p>
                                            </div>
                                            <div className="px-1">
                                                <div onClick={handleClick}>
                                                    <p> registrati qui.</p>
                                                </div>
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
    )
}

export default LoginPage;