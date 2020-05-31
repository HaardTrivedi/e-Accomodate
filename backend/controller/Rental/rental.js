// POST: /api/rental/add-rental-agreement
const handleAddRentalAgreement = async (req, res, db_pool, Joi) => {
        const schema = {
                guestID: Joi.number()
                        .integer()
                        .required(),
                propertyID: Joi.number()
                        .integer()
                        .required(),
                dateFrom: Joi.date().required(),
                dateTo: Joi.date()
                        .min(Joi.ref('dateFrom'))
                        .required()
        };
        const { error } = Joi.validate(req.body, schema);
        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }

        const { guestID, propertyID, dateFrom, dateTo } = req.body;
        const fromDate = new Date(dateFrom);
        const toDate = new Date(dateTo);
        const days = Math.round((toDate - fromDate) / 1000 / 86400) + 1;

        try {
                const client = await db_pool.connect();
                try {
                        await client.query('BEGIN');
                        const checkDatesQueryText = 'SELECT * FROM eaccomodate.Booking WHERE propertyID = $1 AND (dateFrom, dateTo) OVERLAPS ($2, $3);';
                        const res0 = await client.query(checkDatesQueryText, [propertyID, dateFrom, dateTo]);
                        if (res0.rows.length != 0) {
                                res.status(400).json('Dates Are Unavailable')
                                return;
                        }

                        var today = new Date();
                        var dateSign = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();

                        const getHostID = 'SELECT hostID, branchID FROM eaccomodate.Property WHERE propertyID = $1;';
                        const res1 = await client.query(getHostID, [propertyID]);
                        const hostID = res1.rows[0]['hostid'];
                        const branchID = res1.rows[0]['branchid'];

                        const book = 'INSERT INTO eaccomodate.Booking(hostID, guestID, propertyID, branchID, dateSign, dateFrom, dateTo) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING bookingID;';
                        const res2 = await client.query(book, [hostID, guestID, propertyID, branchID, dateSign, dateFrom, dateTo]);
                        const bookingID = res2.rows[0]['bookingid'];

                        const pricingQueryText = 'SELECT amount FROM eaccomodate.Price WHERE priceID = ( SELECT priceID FROM eaccomodate.Property WHERE propertyID = $1);';
                        const res3 = await client.query(pricingQueryText, [propertyID]);
                        const { amount } = res3.rows[0];

                        const createPayment = 'INSERT INTO eaccomodate.Payment(bookingID, amount, paymentType, paymentStatus, paymentDate) VALUES($1, $2, $3, $4, $5) RETURNING paymentID';
                        const res4 = await client.query(createPayment, [bookingID, amount * days, 'direct_debit', 'pending', dateSign]);
                        const { paymentID } = res4.rows[0];
                        await client.query('COMMIT');
                        res.status(200).jsonp({
                                bookingID: bookingID,
                                paymentID: paymentID
                        });
                } catch (err) {
                        console.error('Error during the transaction, ROLLBACK.', err.stack);
                        await client.query('ROLLBACK');
                        res.status(400).json(
                                'Unable to add the rental agreement.'
                        );
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(503).json('Service Unavailable');
                console.error('Database Connection Error', err.stack);
        }
};

// POST: /api/booking/reservation/host/:hostid
const handleApproval = async (req, res, db_pool, Joi) => {
        const schema = {
                bookingID: Joi.number()
                        .integer()
                        .required(),
                status: Joi.string()
                        .max(30)
                        .valid(['approved', 'disapproved'])
                        .required()
        };
        const { error } = Joi.validate(req.body, schema);
        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }
        const { bookingID, status } = req.body;

        try {
                const client = await db_pool.connect();
                try {
                        let paymentStatus = 'pending';
                        if (status == 'approved') {
                                paymentStatus = status;
                        } else if (status == 'disapproved') {
                                paymentStatus = 'completed';
                        }

                        const queryText = 'UPDATE eaccomodate.Payment SET paymentStatus = $1 WHERE bookingID = $2';
                        await client.query(queryText, [paymentStatus, bookingID]);
                        res.status(200).json('Payment Status Updated');
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        res.status(400).json('Unable to get rental agreements');
                } finally {
                        client.release()
                }
        } catch (err) {
                res.status(503).json('Service Unavailable');
                console.error(
                        'Database Connection Error',
                        err.stack
                );
        }
};

module.exports = { handleAddRentalAgreement, handleApproval };
