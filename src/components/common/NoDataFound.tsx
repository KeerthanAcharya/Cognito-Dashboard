import React from 'react';
import NoDataImg from '../../assets/icons/noData.svg';
import './index.css';

type NoDataFoundPropsT = {
    message1: string;
    message2: string;
};

const NoDataFound: React.FC<NoDataFoundPropsT> = ({ message1, message2 }) => {
    return (
        <div className='noDataContainer'>
            <img src={NoDataImg} alt='No Data' width={200} height={200} />
            <div className='noDataMessageConatiner'>
                <p className='noDataMessage'>{message1}</p>
                <p className='noDataMessage'>{message2}</p>
            </div>
        </div>
    );
};

export default NoDataFound;
