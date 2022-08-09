import { useContext } from 'react';
import { UserContext } from '../common/UserContext';
import './index.css';
import DropdownSelect from './select';
import logout from '../../assets/images/logout.svg';
import logo from '../../assets/images/Cognitgo_Logo-Dark.png';
import { useHistory } from 'react-router';

const Topbar = () => {
    const { name, role } = useContext(UserContext);
    const history = useHistory();

    const logoutHandler = () => {
        localStorage.clear();
        history.push('/login');
    };
    let word: string = name
        ?.split(/\s/)
        .reduce((response, word) => (response += word.slice(0, 1)), '')
        .toUpperCase();
    word = word.length === 1 ? name.substring(0, 2).toUpperCase() : word;
    const array = [
        {
            name: role,
        },
        {
            name: 'Logout',
            image: logout,
            clickEvent: logoutHandler,
        },
    ];

    return (
        <div className='topbar-height shadow-sm d-flex align-items-center'>
            <div className='top-bar-container'>
                <div>
                    {/* <p style={{ marginBottom: '0rem', fontSize: '1.125rem' }}>Cognitgo</p> */}
                    <img src={logo} alt='cognitgo logo' width='150' />
                </div>
                <div>
                    {name?.charAt(0).toUpperCase() + name?.substring(1).split(' ')[0]} {'  '}
                </div>
            </div>
            <DropdownSelect
                data={name.split(' ')[0][0]}
                role={array}
                className='rounded-circle p-2'
            />
        </div>
    );
};
export default Topbar;
