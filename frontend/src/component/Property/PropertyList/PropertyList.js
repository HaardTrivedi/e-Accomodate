import React from 'react';
import PropertyMap from './PropertyMap';
import './PropertyList.css';

const PropertyList = ({ properties, type, loadAllProperty }) => {
    return (
        <div className='list'>
            <div className='list-header'>
                <h2>{type}</h2>
            </div>
            <PropertyMap properties={properties} />
            <p className='list-button' onClick={loadAllProperty}>
                {properties.length > 4
                    ? 'View Less'
                    : 'View More'}
            </p>
        </div>
    );
};

export default PropertyList;
