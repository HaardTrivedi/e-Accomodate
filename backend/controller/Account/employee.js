// POST: api/employee-register
const handleRegister = async (req, res, db_pool, Joi, CryptoJS) => {
        const schema = {
                email: Joi.string()
                        .email()
                        .min(3)
                        .max(256)
                        .required(),
                firstName: Joi.string()
                        .max(35)
                        .required(),
                midName: Joi.string()
                        .min(0)
                        .max(35),
                lastName: Joi.string()
                        .max(35)
                        .required(),
                houseNum: Joi.string()
                        .allow(null, '')
                        .max(5),
                street: Joi.string()
                        .max(255)
                        .required(),
                city: Joi.string()
                        .max(50)
                        .required(),
                province: Joi.string()
                        .max(30)
                        .required(),
                phoneNum: Joi.string()
                        .max(45)
                        .regex(/([0-9])\w+,{0,1}/)
                        .required(),
                country: Joi.string()
                        .max(30)
                        .required(),
                employeeType: Joi.string()
                        .valid(['manager', 'employee'])
                        .required(),
                position: Joi.string()
                        .max(30)
                        .required(),
                salary: Joi.number().required()
        };
        const { error } = Joi.validate(req.body, schema);
        if (error) {
                res.status(400).json(error.details[0].message);
                return;
        }
        const {
                email,
                firstName,
                midName,
                lastName,
                houseNum,
                street,
                city,
                province,
                phoneNum,
                country,
                position,
                employeeType,
                salary
        } = req.body;

        let branchID = 0;
        if (country == 'Canada') {
                branchID = 1;
        } else {
                branchID = 2;
        }

        try {
                const client = await db_pool.connect();
                try {
                        await client.query('BEGIN');
                        if (position == 'manager') {
                                const managerText = "SELECT COUNT(*) AS manager FROM eaccomodate.Employee NATURAL JOIN eaccomodate.Person WHERE country = $1 AND position = 'manager' GROUP BY country;";
                                const res2 = await client.query(managerText, [
                                        country
                                ]);
                                if (res2.rows.length != 0) {
                                        res.status(400).json('This branch already has a Manager');
                                        return;
                                }
                        } else {
                                let phoneNumber = phoneNum.split(',');
                                const queryPerson = 'INSERT INTO eaccomodate.Person(firstName, midName, lastName, email, houseNum, street, city, province, phoneNumber, country) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING pID;';
                                const res1 = await client.query(queryPerson, [firstName, midName, lastName, email, houseNum, street, city, province, phoneNumber, country]);
                                const pID = res1.rows[0]['pid'];
                                
                                const queryEmployee = 'INSERT INTO eaccomodate.Employee(employeeID, salary, position, employeeType, branchID) VALUES($1, $2, $3, $4, $5) RETURNING employeeID;';
                                const res2 = await client.query(queryEmployee, [pID, salary, position, employeeType, branchID]);
                                await client.query('COMMIT');
                                res.status(200).jsonp({
                                        pID: pID,
                                        employeeID: pID
                                });
                        }
                } catch (err) {
                        console.error(
                                'Error during the transaction, ROLLBACK.',
                                err.stack
                        );
                        await client.query('ROLLBACK');
                        res.status(400).json('Error during the registration');
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

module.exports = { handleRegister };
