const handleLogin = async (req, res, db_pool, Joi, CryptoJS) => {
	const schema = {
		email: Joi.string()
			.min(3)
			.email()
			.required(),
		password: Joi.string()
			.min(6)
			.required()
			.max(24)
	};
	const { error } = Joi.validate(req.body, schema);
	if (error) {
		res.status(400).json(error.details[0].message);
		return;
	}
	const { email, password } = req.body;

	try {
		const client = await db_pool.connect();
		var pass = '';
		await getPassword(client, email, password);
		if (await getPassword(client, email, password)) {
			try {
				var ids = { pID: null, guestID: null, hostID: null, employeeID: null };
				try {
					await getPID(client, email, ids);
					await getGuestID(client, ids);
					await getHostID(client, ids);
					await getEmployeeID(client, ids);
					res.status(200).json(ids);
				} catch (err) {
					console.error('Query Execution Error', err.stack);
					res.status(400).json('Internal Error 400');
				}
			} catch (err) {
				console.error('Query Execution Error', err.stack);
				res.status(400).json('Invalid Inputs.');
			} finally {
				client.release();
			}
		} else {
			console.error(pass, 'Invalid Password');
		}
	} catch (err) {
		res.status(503).json('Service Unavailable');
		console.error('Database Connection Error', err.stack);
	}
};

const getPassword = async (client, email, password) => {
	const queryPID = 'SELECT pass FROM eaccomodate.Login WHERE email = $1;';
	const { rows } = await client.query(queryPID, [email]);
	if (rows[0] != undefined) {
		pass = rows[0]['pass'];
		if (pass == password) {
			return true;
		}
	}
};

const getPID = async (client, email, ids) => {
	const queryPID = 'SELECT pID FROM eaccomodate.Person WHERE email = $1;';
	const { rows } = await client.query(queryPID, [email]);
	if (rows[0] != undefined) {
		ids.pID = rows[0]['pid'];
	}
};

const getGuestID = async (client, ids) => {
	const gidQueryText = 'SELECT guestID FROM eaccomodate.Guest WHERE pID = $1;';
	const { rows } = await client.query(gidQueryText, [ids.pID]);
	if (rows[0] != undefined) {
		ids.guestID = rows[0]['guestid'];
	}
};

const getHostID = async (client, ids) => {
	const hidQueryText = 'SELECT hostID FROM eaccomodate.Host WHERE pID = $1;';
	const { rows } = await client.query(hidQueryText, [ids.pID]);
	if (rows[0] != undefined) {
		ids.hostID = rows[0]['hostid'];
	}
};

const getEmployeeID = async (client, ids) => {
	const empidQueryText = 'SELECT employeeID FROM eaccomodate.Employee WHERE employeeID = $1;';
	const { rows } = await client.query(empidQueryText, [ids.pID]);
	if (rows[0] != undefined) {
		ids.employeeID = rows[0]['employeeid'];
	}
}

module.exports = { handleLogin };
