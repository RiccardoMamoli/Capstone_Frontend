import { Col, Row } from "react-bootstrap";
import InfoBox from "./InfoBox";
import UserDetails from "./UserDetails";
import LoginBox from "./LoginBox";
import CustomMapbox from "./CustomMapbox";
import ObjectList from "./ObjectList";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ScrollingReview from "../tools/ScrollingReview";

const HomepageContent = ({ selectedTheme, setSelectedTheme, query }) => {

    const [isLogged, setIsLogged] = useState(false)
    const token = useSelector((state) => state.token.token);

    useEffect(() => {

        if (token || localStorage.getItem('token') || sessionStorage.getItem('token')) {
            setIsLogged(true);
        } else {
            setIsLogged(false);
        }
    }, [token]);




    return (
        <>
            <Row className="w-100" style={{ paddingLeft: "27.5px", paddingRight: "27.5px", overflowY: "visible" }}>
                <Col style={{ overflowY: "visible" }} md={3} className="d-flex justify-content-center p-0">
                    <div style={{ overflowY: "visible" }} className="w-100">
                        <InfoBox />
                        {
                            isLogged ?
                                (
                                    <UserDetails token={token} />
                                    // <AnimatedDashboard token={token} />
                                )
                                :
                                (<LoginBox />)
                        }

                    </div>

                </Col>
                <Col md={6} className="d-flex align-items-start justify-content-center p-0">
                    <div className="h-100" style={{ width: "100%", paddingLeft: "27.5px", paddingRight: "27.5px" }}>
                        <CustomMapbox query={query} />
                    </div>
                </Col>
                <Col md={3} className="p-0 d-flex flex-column justify-content-between">
                    <ObjectList />
                    <ScrollingReview />
                </Col>
            </Row>
        </>
    )
}

export default HomepageContent;