import { Container } from "react-bootstrap";
import CustomNavbar from "./CustomNavbar";
import { useEffect, useState } from "react";
import { getOggetti, getUtenti } from "../../redux/actions";
import { useDispatch } from "react-redux";
import HomepageContent from "./HomepageContent";
import { Route, Routes } from "react-router-dom";
import PersonalProfile from "../users/PersonalProfile";
import ObjectPage from "../objects/ObjectPage";
import FavoritesPage from "../tools/FavoritesPage";
import CustomFooter from "./CustomFooter";

const HomePageWindow = ({ progress, setIsLoaded, isLoaded, selectedTheme, setSelectedTheme }) => {

    const [firstLoad, setFirstLoad] = useState(false);
    const [query, setQuery] = useState()
    const dispatch = useDispatch();

    useEffect(() => {
        const alreadyLoaded = localStorage.getItem('isLoadedOnce');

        if (!alreadyLoaded) {
            setFirstLoad(true);
        } else {
            setIsLoaded(true);
        }
    }, []);



    useEffect(() => {

        if (firstLoad && progress === 100) {
            setTimeout(() => {
                setIsLoaded(true);

                localStorage.setItem('isLoadedOnce', 'true');
                setFirstLoad(false);
            }, 300);
        }
    }, [progress, firstLoad]);

    useEffect(() => {
        dispatch(getOggetti())
        dispatch(getUtenti())
    }, [])


    return (
        <>
            <Container fluid className={`d-flex flex-column homepage-container ${isLoaded ? "show-homepage" : ""}`}>
                <div>
                    <CustomNavbar query={query} setQuery={setQuery} />
                </div>
                <div className="flex-grow-1 d-flex w-100 justify-content-center">
                    <Routes>
                        <Route path="main" element={<HomepageContent query={query} selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme} />} />
                        <Route path="profile" element={<PersonalProfile />} />
                        <Route path="favorites" element={<FavoritesPage />} />
                        <Route path="main/item/:id" element={<ObjectPage />} />
                    </Routes>
                </div>
                <div>
                    <CustomFooter selectedTheme={selectedTheme} setSelectedTheme={setSelectedTheme}r />
                </div>
            </Container>
        </>
    )
}

export default HomePageWindow;