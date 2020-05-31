import React from 'react';
import './LoadingScreen.css';

const LoadSpinner = ({ loading }) => {
        return loading ? (
                <div className='darken'>
                        <div className='loader'></div>{' '}
                </div>
        ) : null;
};

export default LoadSpinner;
