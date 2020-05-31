// Connect to Database
const { Pool } = require('pg');
const connection = require('./connection');
const db_pool = new Pool({
        host: connection.host,
        user: connection.user,
        password: connection.password,
        database: connection.database,
        port: 15432
});

// Server Setup
const express = require('express');
const cors = require('cors');
const app = express();

// Modules
const Joi = require('joi');
const CryptoJS = require('crypto-js');

// Controllers
const login = require('./controller/login');
const registerGuest = require('./controller/Account/guest');
const registerHost = require('./controller/Account/host');
const registerEmployee = require('./controller/Account/employee');

const profile = require('./controller/Account/profile');
const profileUpdate = require('./controller/Account/updateProfile');
const employeeList = require('./controller/Manage/empListView');

const property = require('./controller/Property/property');
const propertyList = require('./controller/Property/propertyList');
const booking = require('./controller/Rental/rental');
const bookingList = require('./controller/Rental/rentalList');
const payment = require('./controller/Rental/payment');
const review = require('./controller/Review/review');
const reviewList = require('./controller/Review/reviewList');






app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
        res.end('The server is active on localhost:8080');
});
const port = process.env.PORT || 8080;
app.listen(port, () => { console.log(`Server active on localhost:${port}`); });

// Register
app.post('/api/guest-register', (req, res) =>
        registerGuest.handleRegister(req, res, db_pool, Joi, CryptoJS)
);
app.post('/api/host-register', (req, res) =>
        registerHost.handleRegister(req, res, db_pool, Joi)
);
app.post('/api/employee-register', (req, res) =>
        registerEmployee.handleRegister(req, res, db_pool, Joi, CryptoJS)
);

// Login
app.post('/api/login', (req, res) =>
        login.handleLogin(req, res, db_pool, Joi, CryptoJS)
);

// Profile
app.get('/api/profile/:pid', (req, res) =>
        profile.handleProfile(req, res, db_pool)
);
app.put('/api/profile/update/email', (req, res) =>
        profileUpdate.handleUpdateEmail(req, res, db_pool, Joi)
);
app.put('/api/profile/update/name', (req, res) =>
        profileUpdate.handleUpdateName(req, res, db_pool, Joi)
);
app.put('/api/profile/update/address', (req, res) =>
        profileUpdate.handleUpdateAddress(req, res, db_pool, Joi)
);
app.put('/api/profile/update/phonenum', (req, res) =>
        profileUpdate.handleUpdatePhone(req, res, db_pool, Joi)
);
app.get('/api/profile/review/review-list/:guestid/:num?', (req, res) =>
        reviewList.handleReviewProfile(req, res, db_pool)
);
app.get('/api/profile/:pid/my-property', (req, res) =>
        profile.handleHostProperty(req, res, db_pool)
);
app.get('/api/profile/:pid/my-property/:propertyid', (req, res) =>
        profile.handlePropertyGuest(req, res, db_pool)
);

// Employee
app.get('/api/employee/:employeeid/property-list', (req, res) =>
        employeeList.handleEmpPropertyList(req, res, db_pool)
);
app.get('/api/employee/:employeeid/guest-list', (req, res) =>
        employeeList.handleGuestList(req, res, db_pool)
);

// Property
app.get('/api/property/:propertyid', (req, res) =>
        property.handleViewProperty(req, res, db_pool)
);
app.post('/api/property/add-property', (req, res) =>
        property.handleAddProperty(req, res, db_pool, Joi)
);
app.get('/api/property/property-list/:category/:num?', (req, res) =>
        propertyList.handlePropertyList(req, res, db_pool, Joi)
);

// Booking
app.post('/api/booking/reserve', (req, res) =>
        booking.handleAddRentalAgreement(req, res, db_pool, Joi)
);
app.get('/api/booking/reservation/host/:hostid', (req, res) =>
        bookingList.handleHostRentalList(req, res, db_pool)
);
app.post('/api/booking/reservation/host/:hostid', (req, res) =>
        booking.handleApproval(req, res, db_pool, Joi)
);
app.get('/api/booking/reservation/guest/:guestid', (req, res) =>
        bookingList.handleGuestRentalList(req, res, db_pool)
);
app.post('/api/booking/reservation/guest/:guestid/payment', (req, res) =>
        payment.handlePayment(req, res, db_pool, Joi)
);

// Review
app.post('/api/review/add-review', (req, res) =>
        review.handleAddReview(req, res, db_pool, Joi)
);
app.get('/api/property/review/review-list/:propertyid/:num?', (req, res) =>
        reviewList.handleReviewProperty(req, res, db_pool)
);
