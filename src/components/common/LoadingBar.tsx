import React from "react";
import { Spinner } from "react-bootstrap";

import RapIcon from '../../assets/icons/rapIcon.png'
import './LoadingBar.css'

const LoadingBar = (props: any) => {
    return (
        <>
            {props.isActive && <div className="d-flex justify-content-center align-items-center bg-light loading-bar-main" >
                <div className="loader1">
                    <Spinner animation="border" role="status" variant="primary" />
                    {/* <img src={RapIcon} alt="Spinner" className="spinner-img"/> */}
                </div>

            </div>}
        </>
    )
}

export default LoadingBar;
