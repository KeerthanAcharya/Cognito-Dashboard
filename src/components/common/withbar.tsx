import React from 'react';
import Sidebar from './sidebar';
import Topbar from './topbar';
import './index.css';

const WithBars = ({ render }: { render: Function }) => {
    return (
        <div className='container-div'>
            <div className='sidebar'>
                <Sidebar />
            </div>
            <Topbar />
            <div className='content'>{render()}</div>
        </div>
    );
};

export default WithBars;
