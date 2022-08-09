import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
// import env from "dotenv";

import CognitoIcon from '../../assets/images/Cognitgo_Logo-Dark.png';

import './Login.css';

const LeftPanel = () => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                justifyContent: 'space-between',
            }}>
            <div className='rapIconContainer'>
                <img src={CognitoIcon} alt='Cognitgo icon' className='' />
            </div>
            <Container fluid style={{ marginBottom: '5%' }} className='infoContainer'>
                <Row>
                    <Col md={3} xs={3}>
                        <p style={{ color: '#FFFF' }}>&#169; 2022 Cognitgo</p>
                    </Col>
                    <Col>
                        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                            <div></div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default LeftPanel;
