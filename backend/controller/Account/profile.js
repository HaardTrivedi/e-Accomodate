// GET: /api/profile/:pid
const handleProfile = async (req, res, db_pool) => {
        const pID = req.params.pid;
        try {
                const client = await db_pool.connect();
                try {
                        const queryText = 'SELECT * FROM eaccomodate.Person WHERE pID = $1;';
                        const { rows } = await client.query(queryText, [pID]);
                        if (rows.length > 0) {
                                res.status(200).json(rows[0]);
                        } else {
                                res.status(400).json('User Not Found');
                        }
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        res.status(400).json('Invalid Inputs.');
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(503).json('Service Unavailable');
                console.error(
                        'Database Connection Error',
                        err.stack
                );
        }
};

// GET: /api/profile/:pid/my-property
const handleHostProperty = async (req, res, db_pool) => {
        const pID = req.params.pid;

        try {
                const client = await db_pool.connect();
                try {
                        const hostQueryText = 'SELECT hostID FROM eaccomodate.Host WHERE pID = $1;';
                        const res1 = await client.query(hostQueryText, [pID]);
                        if (res1.rows.length == 0) {
                                res.status(400).json('You are not a host yet');
                                await client.release();
                                return;
                        }
                        const hostID = res1.rows[0]['hostid'];
                        
                        const propertyQueryText = 'SELECT eaccomodate.Property.propertyID, eaccomodate.Property.houseNum, eaccomodate.Property.street, eaccomodate.Property.city, eaccomodate.Property.province, eaccomodate.Property.country, eaccomodate.Price.amount, Review.rating, Review.reviewNum FROM (eaccomodate.Property NATURAL JOIN eaccomodate.Price) NATURAL LEFT OUTER JOIN (SELECT propertyID, AVG(rating) as rating, COUNT(eaccomodate.Review.rating) AS reviewNum FROM eaccomodate.Review GROUP BY propertyID) as Review WHERE hostID = $1;';
                        const res2 = await client.query(propertyQueryText, [hostID]);
                        res.status(200).json(res2.rows);
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        res.status(400).json('Invalid Inputs.');
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(503).json('Service Unavailable');
                console.error(
                        'Database Connection Error',
                        err.stack
                );
        }
};

// GET: /api/profile/:pid/my-property/:propertyid
const handlePropertyGuest = async (req, res, db_pool) => {
        const { propertyID } = req.params;

        try {
                const client = await db_pool.connect();
                try {
                        const rentalAgreementQueryText = 'SELECT bookingID FROM eaccomodate.Booking WHERE bookingID = $1;';
                        const res1 = await client.query(rentalAgreementQueryText, [propertyID]);
                        const joinQueryText = "SELECT CONCAT(firstName, ' ', lastName) AS guestName, amount AS rentalPrice, signDate, country, paymentType, paymentStatus FROM eaccomodate.Booking NATURAL JOIN eaccomodate.Payment NATURAL JOIN eaccomodate.Guest NATURAL JOIN eaccomodate.Person WHERE bookingID = $1 ORDER BY paymentType ASC, dateSign DESC;";
                        var guest_list = [];
                        for (i in res1.rows) {
                                const { bookingID } = res1.rows[i]['bookingid'];
                                const res2 = await client.query(joinQueryText, [bookingidID]);
                                guest_list.push(res2.rows[0]);
                        }
                        res.status(200).jsonp({ guest_list: guest_list });
                } catch (err) {
                        console.error('Query Execution Error', err.stack);
                        res.status(400).json('Invalid Inputs.');
                } finally {
                        client.release();
                }
        } catch (err) {
                res.status(503).json('Service Unavailable');
                console.error(
                        'Database Connection Error',
                        err.stack
                );
        }
};

module.exports = { handleProfile, handleHostProperty, handlePropertyGuest };
