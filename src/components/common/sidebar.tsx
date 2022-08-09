import React, { useContext } from 'react';
import { Col, Image, Row, OverlayTrigger, Tooltip } from 'react-bootstrap';
import rapicon from '../../assets/images/rapIcon.png';

import logout from '../../assets/images/logout.svg';

import { UserContext } from '../common/UserContext';
import sidebarItems from '../../controllers/SidebarElements';
import { useHistory, useLocation } from 'react-router';

const Sidebar = () => {
    const { role, name } = useContext(UserContext);
    const { push } = useHistory();
    const location = useLocation();
    const history = useHistory();
    const logoutHandler = () => {
        localStorage.clear();
        history.push('/auth');
    };

    const pathCheck = location.pathname.replace('/', '').split('/');

    return (
        <div className='sidebarContainer'>
            <Row className='iconContainer'>
                <Col className='navigationIcon'>
                    <Row>
                        <Col className='icon'>
                            <Image className='logo' src={rapicon} />
                        </Col>
                        {sidebarItems
                            .filter((el) => el.users.includes(role))
                            .map((item: any, index: number) => (
                                <div
                                    key={index}
                                    className={
                                        pathCheck[0] === item.route
                                            ? 'sdr_item sdr_active'
                                            : 'sdr_item'
                                    }
                                    onClick={() => push(`/${item.route}`)}>
                                    <OverlayTrigger
                                        key={index}
                                        placement='right'
                                        overlay={
                                            <Tooltip>
                                                <strong>{item.label}</strong>
                                            </Tooltip>
                                        }>
                                        <img src={item.image} alt={item.alt} width={item.width} />
                                    </OverlayTrigger>
                                </div>
                            ))}
                    </Row>
                    <Row className='icon1'>
                        <OverlayTrigger
                            placement='right'
                            overlay={
                                <Tooltip>
                                    <strong>Logout</strong>.
                                </Tooltip>
                            }>
                            <Image
                                className='iconlogo sdr_item1'
                                onClick={logoutHandler}
                                src={logout}
                            />
                        </OverlayTrigger>
                    </Row>
                </Col>
            </Row>
        </div>
    );
};
export default Sidebar;
