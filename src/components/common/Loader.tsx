import React from "react";

import RapIcon from '../../assets/icons/rapIcon.png'
import './index.css'

const Loader = () => {
    return (
        <div className="d-flex justify-content-center align-items-center bg-light" style={{ height: "73vh" }}>
            <div className="loader">
                <img src={RapIcon} alt="Spinner" className="spinner-img"/>
            </div>
        </div>
    )
}

export default Loader;
