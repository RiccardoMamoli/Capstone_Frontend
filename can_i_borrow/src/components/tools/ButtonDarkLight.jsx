import { IoSunny } from "react-icons/io5";
import { IoMdMoon } from "react-icons/io";
import { Row } from "react-bootstrap";


const ButtonDarkLight = ({ selectedTheme, setSelectedTheme }) => {



    const changeTheme = () => {
        setSelectedTheme(!selectedTheme);
    }


    return (
        <>
            <div className="dark-mode-button d-flex align-items-center justify-content-between">
                <div onClick={changeTheme} className={`${selectedTheme ? "sun-button" : "unselected-light-button"}`}>
                    <IoSunny />
                </div>
                <div onClick={changeTheme} className={`${selectedTheme ? "unselected-light-button" : "moon-button"}`}>
                    <IoMdMoon />
                </div>
            </div>
        </>
    )
}

export default ButtonDarkLight;