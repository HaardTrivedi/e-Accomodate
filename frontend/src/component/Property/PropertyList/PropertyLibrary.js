import React, { useState, useEffect } from 'react';
import LoadSpinner from '../../LoadingScreen/LoadSpinner';
import PropertyList from './PropertyList';

const PropertyLibrary = () => {
        const [BAB, setBAB] = useState([]);
        const [House, setHouse] = useState([]);
        const [Apartment, setApartment] = useState([]);
        const [Cottage, setCottage] = useState([]);
        const [Cabin, setCabin] = useState([]);
        const [filterType, setFilterType] = useState({
                house: '',
                apartment: '',
                bed_breakfast: '',
                cabin: '',
                cottage: '',
        });
        const [loading, setLoading] = useState(false);

        useEffect(() => {
                const fetchData = async () => {
                        setLoading(true);
                        try {
                                const house = await fetch(
                                        'http://localhost:8080/api/property/property-list/house/4'
                                );
                                if (house.ok) {
                                        const houses = await house.json();
                                        setHouse(houses);
                                }

                                const apartment = await fetch('http://localhost:8080/api/property/property-list/apartment/4');
                                if (apartment.ok) {
                                        const apartments = await apartment.json();
                                        setApartment(apartments);
                                }
                                const bedBreakfast = await fetch('http://localhost:8080/api/property/property-list/bed_breakfast/4');
                                if (bedBreakfast.ok) {
                                        const babs = await bedBreakfast.json();
                                        setBAB(babs);
                                }

                                const cabin = await fetch('http://localhost:8080/api/property/property-list/cabin/4');
                                if (cabin.ok) {
                                        const cabins = await cabin.json();
                                        setCabin(cabins);
                                }

                                const cottage = await fetch('http://localhost:8080/api/property/property-list/cottage/4');
                                if (cottage.ok) {
                                        const cottages = await cottage.json();
                                        setCottage(cottages);
                                }
                                setLoading(false);
                        } catch (err) {
                                console.log(err);
                                setLoading(false);
                        }
                };
                fetchData();
        }, []);
        const handleFilterChange = (type, value) => {
                setFilterType({ ...filterType, [type]: value });
                filterProperty(type, value);
        };


        const loadAllHouses = async () => {
                const houses = await loadAllProperty('house', House);
                setHouse(houses);
        };

        const loadAllApartments = async () => {
                const apartments = await loadAllProperty('apartment', Apartment);
                setApartment(apartments);
        };

        const loadAllBAB = async () => {
                const bab = await loadAllProperty('bed_breakfast', BAB);
                setBAB(bab);
        };

        const loadAllCabins = async () => {
                const cabins = await loadAllProperty('cabin', Cabin);
                setCabin(cabins);
        };

        const loadAllCottages = async () => {
                const cottages = await loadAllProperty('cottage', Cottage);
                setCottage(cottages);
        };

        const loadAllProperty = async (category, oldProperties) => {
                setLoading(true);
                if (oldProperties.length > 4) {
                        setLoading(false);
                        return oldProperties.slice(0, 4);
                }
                try {
                        const response = await fetch(
                                `http://localhost:8080/api/property/property-list/${category}`
                        );
                        if (response.ok) {
                                const properties = await response.json();
                                setLoading(false);
                                return properties;
                        }
                } catch (err) {
                        console.log(err);
                }
                setLoading(false);
                return oldProperties;
        };

        const filterProperty = (type, value) => {
                console.log(type, ': ', value);
        };

        return (
                <div>
                        <LoadSpinner loading={loading} />
                        <PropertyList
                                properties={House}
                                type={'House'}
                                loadAllProperty={loadAllHouses}
                                onFilter={handleFilterChange}
                        />
                        <PropertyList
                                properties={Apartment}
                                type={'Apartment'}
                                loadAllProperty={loadAllApartments}
                                onFilter={handleFilterChange}
                        />
                        <PropertyList
                                properties={BAB}
                                type={'Bed & Breakfast'}
                                loadAllProperty={loadAllBAB}
                                onFilter={handleFilterChange}
                        />
                        <PropertyList
                                properties={Cabin}
                                type={'Cabin'}
                                loadAllProperty={loadAllCabins}
                                onFilter={handleFilterChange}
                        />
                        <PropertyList
                                properties={Cottage}
                                type={'Cottage'}
                                loadAllProperty={loadAllCottages}
                                onFilter={handleFilterChange}
                        />
                </div>
        );
};

export default PropertyLibrary;
