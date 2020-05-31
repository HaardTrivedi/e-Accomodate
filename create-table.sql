DROP SCHEMA IF EXISTS eaccomodate CASCADE;
CREATE SCHEMA eaccomodate;
GRANT ALL ON SCHEMA eaccomodate TO postgres;
GRANT ALL ON SCHEMA eaccomodate TO public;
SET search_path = eaccomodate;

--SQL QUERIES FOR OUR PROJECT

--CREATE TYPE PERSONTYPE AS ENUM ('host', 'guest');
CREATE TYPE PAYMENTTYPE AS ENUM ('cash', 'check', 'direct_debit', 'credit_card');
CREATE TYPE PAYMENTSTATUS AS ENUM ('pending', 'completed', 'approved');
CREATE TYPE PROPERTYTYPE AS ENUM ('apartment', 'house', 'cottage', 'bed_breakfast', 'cabin');
CREATE TYPE ROOMTYPE AS ENUM ('private', 'shared', 'entire_property');
CREATE TYPE EMPTYPE AS ENUM ('employee', 'manager');

CREATE TABLE eaccomodate.Person (
    pID SERIAL PRIMARY KEY,
    firstName VARCHAR(50) NOT NULL,
    midNAME VARCHAR(50),
    lastName VARCHAR(50) NOT NULL,
    houseNum VARCHAR(5),
    street VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    phoneNumber VARCHAR(100)[] NOT NULL
);
ALTER SEQUENCE Person_pID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Branch (
    branchID SERIAL PRIMARY KEY,
    country VARCHAR(30) NOT NULL
);
ALTER SEQUENCE Branch_branchID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Price (
    priceID SERIAL PRIMARY KEY,
    amount NUMERIC(12, 2) NOT NULL,
    guestsAllowed INT NOT NULL
);
ALTER SEQUENCE Price_priceID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Host(
    hostID SERIAL PRIMARY KEY,
    pID INTEGER NOT NULL,
    FOREIGN KEY (pID) REFERENCES eaccomodate.Person (pID)
);
ALTER SEQUENCE Host_hostID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Guest(
    guestID SERIAL PRIMARY KEY,
    pID INTEGER NOT NULL,
    FOREIGN KEY (pID) REFERENCES eaccomodate.Person (pID)
);
ALTER SEQUENCE Guest_guestID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Property (
    propertyID SERIAL PRIMARY KEY,
    branchID INTEGER NOT NULL,
    priceID INTEGER NOT NULL,
    hostID INTEGER NOT NULL,
    houseNum INTEGER NOT NULL,
    street VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    country VARCHAR(50) NOT NULL,
    propType PROPERTYTYPE NOT NULL,
    roomType ROOMTYPE NOT NULL,
    bedrooms INTEGER NOT NULL,
    bathrooms INTEGER NOT NULL,
    accomodates INTEGER NOT NULL,
    rules VARCHAR(300),
    amenities VARCHAR(300) NOT NULL,
    availDate DATE NOT NULL, 
    FOREIGN KEY (branchID) REFERENCES eaccomodate.Branch (branchID),
    FOREIGN KEY (priceID) REFERENCES eaccomodate.Price (priceID),
    FOREIGN KEY (hostID) REFERENCES eaccomodate.Host (hostID) 
);
ALTER SEQUENCE Property_propertyID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Review (
    reviewID SERIAL PRIMARY KEY,
    guestID INTEGER NOT NULL,
    propertyID INTEGER NOT NULL,
    rating REAL NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    ratingCommunication INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    ratingCleanliness INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    ratingValue INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment VARCHAR(150),
    FOREIGN KEY (guestID) REFERENCES eaccomodate.Guest (guestID),
    FOREIGN KEY (propertyID) REFERENCES eaccomodate.Property (propertyID)
);
ALTER SEQUENCE Review_reviewID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Booking (
    bookingID SERIAL PRIMARY KEY,
    hostID INTEGER NOT NULL,
    guestID INTEGER NOT NULL,
    propertyID INTEGER NOT NULL,
    branchID INTEGER NOT NULL,
    dateSign DATE NOT NULL,
    dateFrom DATE NOT NULL,
    dateTo DATE NOT NULL,
    FOREIGN KEY (hostID) REFERENCES eaccomodate.Host (hostID),
    FOREIGN KEY (guestID) REFERENCES eaccomodate.Guest (guestID),
    FOREIGN KEY (propertyID) REFERENCES eaccomodate.Property (propertyID),
    FOREIGN KEY (branchID) REFERENCES eaccomodate.Branch (branchID)
);
ALTER SEQUENCE Booking_bookingID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Payment (
    paymentID SERIAL PRIMARY KEY,
    bookingID INTEGER NOT NULL,
    amount NUMERIC(12, 2) NOT NULL,
    paymentType PAYMENTTYPE NOT NULL,
    paymentStatus PAYMENTSTATUS NOT NULL,
    paymentDate DATE NOT NULL,
    FOREIGN KEY (bookingID) REFERENCES eaccomodate.Booking (bookingID)
);
ALTER SEQUENCE Payment_paymentID_seq RESTART WITH 1 INCREMENT BY 1;

CREATE TABLE eaccomodate.Employee(
    employeeID SERIAL PRIMARY KEY,
    branchID INTEGER NOT NULL,
    position VARCHAR(25) NOT NULL,
    salary NUMERIC(12, 2) NOT NULL,
	employeeType EMPTYPE NOT NULL,
    FOREIGN KEY (branchID) REFERENCES eaccomodate.Branch (branchID),
    FOREIGN KEY (employeeID) REFERENCES eaccomodate.Person (pID)
);

CREATE TABLE eaccomodate.Manager(
	managerID SERIAL PRIMARY KEY,
	FOREIGN KEY (managerID) REFERENCES eaccomodate.Employee (employeeID)
);

CREATE TABLE eaccomodate.Login(
    pID SERIAL PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    pass VARCHAR(24) NOT NULL,
    FOREIGN KEY (pID) REFERENCES eaccomodate.Person (pID)
);