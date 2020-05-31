// GET: /api/booking/reservation/host/:hid
const handleHostRentalList = async (req, res, db_pool) => {
    const hostID = req.params.hostid;

    try {
        const client = await db_pool.connect();
        try {
            const rentalAgreementQueryText = 'SELECT * FROM eaccomodate.Booking WHERE hostID = $1;';
            const res1 = await client.query(rentalAgreementQueryText, [hostID]); 
            
            const paymentQueryText = 'SELECT pID, paymentStatus FROM eaccomodate.Payment NATURAL JOIN eaccomodate.Host WHERE bookingID = $1 AND hostID=$2;';
            for (i in res1.rows) {
                const bookingID  = res1.rows[i]['bookingid'];
                const res2 = await client.query(paymentQueryText, [bookingID, hostID]);

                const { pid, paymentstatus } = res2.rows[0];
                res1.rows[i].paymentstatus = paymentstatus;
                res1.rows[i].pid = pid;
            }

            const guestNameQueryText = "SELECT CONCAT(firstName, ' ', lastName) AS guestName FROM eaccomodate.Guest NATURAL JOIN eaccomodate.Person WHERE guestID = $1;";
            for (i in res1.rows) {
                const { guestid } = res1.rows[i];
                const res4 = await client.query(guestNameQueryText, [guestid]);
                const { guestname } = res4.rows[0];
                res1.rows[i].guestname = guestname;
            }
            res.status(200).jsonp({
                rental_agreement_list: res1.rows
            });
        } catch (err) {
            console.error('Query Execution Error', err.stack);
            res.status(400).json('Unable to get rental agreements');
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
}

// GET: /api/booking/reservation/guest/:gid
const handleGuestRentalList = async (req, res, db_pool) => {
    const { guestid } = req.params;

    try {
        const client = await db_pool.connect();
        try {
            const queryText = 'SELECT * FROM eaccomodate.Booking WHERE guestID = $1;';
            const res1 = await client.query(queryText, [guestid]);

            const paymentQueryText = 'SELECT propertyID, paymentStatus FROM eaccomodate.Payment NATURAL JOIN eaccomodate.Booking WHERE bookingID = $1;';
            for (i in res1.rows) {
                const { bookingid } = res1.rows[i];
                const res2 = await client.query(paymentQueryText, [bookingid]);
                const { pid, paymentstatus } = res2.rows[0];
                res1.rows[i].paymentstatus = paymentstatus;
                res1.rows[i].pid = pid;
            }
            const hostNameQueryText = "SELECT CONCAT(firstName, ' ', lastName) AS hostName FROM eaccomodate.Host NATURAL JOIN eaccomodate.Person WHERE hostID = $1;";
            for (i in res1.rows) {
                const { hostid } = res1.rows[i];
                const res4 = await client.query(hostNameQueryText, [hostid]);
                const { hostname } = res4.rows[0];
                res1.rows[i].hostname = hostname;
            }
            res.status(200).jsonp({
                rental_agreement_list: res1.rows
            });
        } catch (err) {
            console.error('Query Execution Error', err.stack);
            res.status(400).json('Unable to get rental agreements');
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
}

module.exports = { handleHostRentalList, handleGuestRentalList }
