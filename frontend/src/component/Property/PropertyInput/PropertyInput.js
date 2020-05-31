import React, { Component } from 'react';
import Select from 'react-select';
import './PropertyInput.css';

const guestOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 6, label: '6' },
        { value: 8, label: '8' },
        { value: 10, label: '10' }
];

const roomOptions = [
        { value: 1, label: '1' },
        { value: 2, label: '2' },
        { value: 3, label: '3' },
        { value: 4, label: '4' },
        { value: 5, label: '5' }
];

const roomTypeOptions = [
        { value: 'private', label: 'Private' },
        { value: 'shared', label: 'Shared' },
        { value: 'entire_property', label: 'Entire Property' }
]

const propTypeOptions = [
        { value: 'Apartment', label: 'Apartment' },
        { value: 'Bed_Breakfast', label: 'Bed & Breakfast' },
        { value: 'Cabin', label: 'Cabin' },
        { value: 'Cottage', label: 'Cottage' },
        { value: 'House', label: 'House' },
];

const country = [
        { value: 'Canada', label: 'Canada' },
        { value: 'United States', label: 'United States' }
];

export class PropertyInput extends Component {
        state = {
                listOpen1: false
        };

        toggle = (index) => {
                let collapse = 'listOpen' + index;
                this.setState((prevState) => ({
                        [collapse]: !prevState[collapse]
                }));
        };

        handlePropertyChange = (event) => {
                const { name, value } = event.target;
                this.props.onPropertyChange(name, value);
        };

        handleSelectPropertyChange = (name) => {
                return (newValue) => {
                        this.props.onPropertyChange(name, newValue.value);
                };
        };

        handlePriceChange = (event) => {
                const { name, value } = event.target;
                this.props.onPriceChange(name, value);
        };

        handleSelectPriceChange = (name) => {
                return (newValue) => {
                        this.props.onPriceChange(name, newValue.value);
                };
        };

        handleRoomsChange = (event) => {
                const { name, value } = event.target;
                this.props.onRoomsChange(name, value);
        };

        handleSelectRoomsChange = (name) => {
                return (newValue) => {
                        this.props.onRoomsChange(name, newValue.value);
                };
        };

        render() {
                return (
                        <div>
                                <div>
                                        <div>
                                                <p className='register-title'>  Property Information  </p>
                                        </div>
                                        <div>
                                                <input
                                                        className='login-input register-addr'
                                                        name='houseNum'
                                                        type='houseNum'
                                                        placeholder='Apt Number'
                                                        onChange={(e) => this.handlePropertyChange(e)}
                                                />
                                        </div>
                                        <div>
                                                <input
                                                        className='login-input register-addr'
                                                        name='street'
                                                        type='street'
                                                        placeholder='Street'
                                                        onChange={(e) => this.handlePropertyChange(e)}
                                                />
                                        </div>
                                        <div>
                                                <input
                                                        className='login-input register-addr'
                                                        name='city'
                                                        type='city'
                                                        placeholder='City'
                                                        onChange={(e) => this.handlePropertyChange(e)}
                                                />
                                        </div>
                                        <div>
                                                <input
                                                        className='login-input register-addr'
                                                        name='province'
                                                        type='province'
                                                        placeholder='Province'
                                                        onChange={(e) => this.handlePropertyChange(e)}
                                                />
                                        </div>
                                        <div className='opt-prop'>
                                                <p className='subtitle-prop'> Country:  </p>
                                                <Select
                                                        name='bed'
                                                        className='select'
                                                        placeholder='Select...'
                                                        options={country}
                                                        onChange={this.handleSelectPropertyChange(
                                                                'country'
                                                        )}
                                                />
                                        </div>
                                        <div className='opt-prop'>
                                                <p className='subtitle-prop'>  Property Type: </p>
                                                <Select
                                                        name='propertyType'
                                                        className='select'
                                                        placeholder='Select...'
                                                        options={propTypeOptions}
                                                        onChange={this.handleSelectPropertyChange('propType')}
                                                />
                                        </div>
                                        <p className='subtitle-prop'> Room Type: </p>
                                        <Select
                                                name='roomType'
                                                className='select'
                                                placeholder='Select...'
                                                options={roomTypeOptions}
                                                onChange={this.handleSelectPropertyChange('roomType')}
                                        />
                                </div>

                                <div className='opt-prop'>
                                        <p className='subtitle-prop'>Guests (Number of):</p>
                                        <Select
                                                name='accomodates'
                                                className='select'
                                                placeholder='Select...'
                                                options={guestOptions}
                                                onChange={this.handleSelectPriceChange(
                                                        'accomodates'
                                                )}
                                        />
                                </div>
                                <div className='opt-prop'>
                                        <p className='subtitle-prop'>Beds:</p>
                                        <Select
                                                name='bedrooms'
                                                className='select'
                                                placeholder='Select...'
                                                options={roomOptions}
                                                onChange={this.handleSelectRoomsChange('bedrooms')}
                                        />
                                </div>
                                <div className='opt-prop'>
                                        <p className='subtitle-prop'>Bathrooms:</p>
                                        <Select
                                                name='bathrooms'
                                                className='select'
                                                placeholder='Select...'
                                                options={roomOptions}
                                                onChange={this.handleSelectRoomsChange('bathrooms')}
                                        />
                                </div>
                                <div>
                                        <input
                                                className='login-input register-addr'
                                                name='amenities'
                                                type='amenities'
                                                placeholder='Amenities Included'
                                                onChange={(e) => this.handlePropertyChange(e)}
                                        />
                                </div>
                                <div>
                                        <input
                                                className='login-input register-addr'
                                                name='rules'
                                                type='rules'
                                                placeholder='Rules'
                                                onChange={(e) => this.handlePropertyChange(e)}
                                        />
                                </div>
                                <div>
                                        <input
                                                className='login-input register-addr'
                                                name='amenities'
                                                type='amenities'
                                                placeholder='Amenities Included'
                                                onChange={(e) => this.handlePropertyChange(e)}
                                        />
                                </div>
                                <div>
                                        <input
                                                className='login-input register-addr'
                                                name='availDate'
                                                type='availDate'
                                                placeholder='YYYY-MM-DD'
                                                onChange={(e) => this.handlePropertyChange(e)}
                                        />
                                </div>

                                <div style={{ marginBottom: 10 + 'px' }}></div>
                        </div>
                );
        }
}

export default PropertyInput;
