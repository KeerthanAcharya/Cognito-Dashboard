import React, { useState } from 'react';
import { useContext } from 'react';
import './index.css';
import { agentTypes } from '../common/globalValues';
import { UserContext } from '../common/UserContext';
import { useHistory } from 'react-router';
import logout from '../../assets/images/logout.svg';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';

interface Props {
    data: string;
    role: any;
    className: any;
}

const DropdownSelect = ({ data }: Props) => {
    const { name, role, email } = useContext(UserContext);
    const history = useHistory();

    const value: any = agentTypes;

    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);
    const logoutHandler = () => {
        localStorage.clear();
        history.push('/login');
    };

    const trimmedMail = email.substring(0, 15);

    const renderTooltip = (props: any) => (
        <Tooltip id='button-tooltip' {...props}>
            {email}
        </Tooltip>
    );

    return (
        <div className='logoutListdiv'>
            <button
                className={
                    data.length === 2
                        ? 'user-logo rounded-circle p-2'
                        : 'user-logo-length rounded-circle p-2'
                }
                type='button'
                onClick={() => handleShow()}>
                {data}
            </button>
            <div className={show ? 'showDiv' : 'closeDiv'} onMouseLeave={handleClose}>
                <div className='user-img-cont'>
                    <button
                        className='lg-user-logo rounded-circle'
                        type='button'
                        onClick={() => handleShow()}>
                        {data}
                    </button>
                </div>
                <div className='details-con'>
                    {/* <p className='lg-user-name'>{name}</p> */}
                    <p className='lg-user-role'>{value[role]}</p>
                    {email.length > 19 ? (
                        <OverlayTrigger
                            placement='bottom'
                            delay={{ show: 250, hide: 400 }}
                            overlay={renderTooltip}>
                            <Button
                                variant='lite'
                                style={{ paddingRight: '42px', paddingLeft: '0px' }}>
                                <span>{trimmedMail}...</span>
                            </Button>
                        </OverlayTrigger>
                    ) : (
                        <p className='lg-user-mail'>{email}</p>
                    )}
                    {/* <div className="logoutButton">
            <img style={{cursor: "pointer", width: "30px"}} src={logout} onClick={() => logoutHandler()} alt="logout" width="100%" height="15px" />
            <p>Logout</p>
        </div> */}
                </div>
            </div>
        </div>
    );
};

export default DropdownSelect;
