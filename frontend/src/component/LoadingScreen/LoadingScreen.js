import React from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ loading, children }) => {
        return loading ? <div className='loader'></div> : <div>{children}</div>;
};

export default LoadingScreen;
