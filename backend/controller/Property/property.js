// GET: /api/property/:propertyid
const handleViewProperty = async (req, res, db_pool) => {
  const { propertyid } = req.params;
  let propertyID = propertyid;
  try {
    const client = await db_pool.connect();
    try {
      const propertyQueryText = "SELECT * FROM eaccomodate.Property WHERE propertyID = $1;";
      const res1 = await client.query(propertyQueryText, [propertyID]);
      const hostID = res1.rows[0]['hostid'];

      const getHost = "SELECT pID FROM eaccomodate.Host WHERE hostID = $1;";
      const res2 = await client.query(getHost, [hostID]);
      const pID = res2.rows[0]['pid'];

      const usrQueryText = "SELECT firstName, midName, lastName FROM eaccomodate.Person WHERE pID = $1;";
      const res3 = await client.query(usrQueryText, [pID]);
      const { firstname, midname, lastname } = res3.rows[0];
      const getAddress = "SELECT * FROM eaccomodate.Property WHERE propertyID = $1;";
      const address = await client.query(getAddress, [propertyID]);
      const { housenum, street, province, city, country } = address.rows[0];

      const bedQueryText = "SELECT accomodates, bedrooms, bathrooms FROM eaccomodate.Property WHERE propertyID = $1;";
      const res4 = await client.query(bedQueryText, [propertyID]);
      const { accomodates, bedrooms, bathrooms } = res4.rows[0];

      const getPrice = "SELECT amount FROM eaccomodate.Price WHERE priceID = (SELECT priceID FROM eaccomodate.Property WHERE propertyID = $1);";
      const res6 = await client.query(getPrice, [propertyID]);

      const amount = res6.rows[0]['amount'];

      const getReview = "SELECT rating, comment, Review.guestID, firstName, lastName FROM eaccomodate.Review, eaccomodate.Person, eaccomodate.Guest WHERE propertyID = $1 AND eaccomodate.Person.pID = eaccomodate.Guest.pID AND eaccomodate.Review.guestID = eaccomodate.Guest.guestID";
      const res7 = await client.query(getReview, [propertyID]);
      const reviews = res7.rows;

      const avgsQueryText = "SELECT AVG(rating) AS rating, AVG(ratingCommunication) AS communication, AVG(ratingCleanliness) AS cleanliness, AVG(ratingValue) AS value FROM eaccomodate.Review WHERE propertyID = $1 GROUP BY reviewID;";
      const res8 = await client.query(avgsQueryText, [propertyID]);
      const avgs = res8.rows[0];

      const unavaibleDatesQueryText = 'SELECT dateFrom, dateTo FROM eaccomodate.Booking WHERE propertyID = $1;';
      const res9 = await client.query(unavaibleDatesQueryText, [propertyID]);

      const unavailDate = [];
      for (i in res9.rows) {
        const { datefrom, dateto } = res9.rows[i];
        const diff_days = Math.floor((dateto - datefrom) / 1000 / 86400) + 1;

        for (let j = 0; j < diff_days; ++j) {
          const cur = new Date(datefrom);
          cur.setDate(cur.getDate() + j);
          unavailDate.push(cur);
        }
      }

      res.status(200).jsonp({
        address: housenum + ' ' + street + ' ' + city + ', ' + province + ', ' + country,
        hostName: firstname + ' ' + lastname,
        accomodates: accomodates,
        amount: amount,
        reviews: reviews,
        avgs: avgs,
        unavailDate: unavailDate,
        bathrooms: bathrooms,
        bedrooms: bedrooms
      });
    } catch (err) {
      console.error("Query Execution Error", err.stack);
      res.status(400).json("Unable to get property.");
    } finally {
      client.release();
    }
  } catch (err) {
    res.status(503).json("Service Unavailable");
    console.error("Database Connection Error", err.stack);
  }
};

// POST: /api/property/add-property
const handleAddProperty = async (req, res, db_pool, Joi) => {
  const { property, price } = req.body;
  const { code, message } = await addProperty(db_pool, property, price, Joi);
  res.status(code).json(message);
};

const addProperty = async (db_pool, property, rooms, pricing, Joi) => {
  const propertySchema = {
    address: Joi.string()
      .max(255)
      .required(),
    propType: Joi.string()
      .max(25)
      .valid(["House", "Apartment", "Cabin", "Cottage", "Bed and Breakfast"])
      .required(),
    hostID: Joi.number()
      .required(),
    country: Joi.string()
      .max(30)
      .required()
  };
  const res1 = Joi.validate(property, propertySchema);
  const pricingSchema = {
    accomodates: Joi.number()
      .integer()
      .required()
  };
  const res2 = Joi.validate(pricing, pricingSchema);
  if (res1.error || res2.error) {
    return {
      code: 400,
      message: res1.error.details[0].message + "\n" + res2.message.error.details[0].message
    };
  }
  const { houseNum, street, city, province, propType, hostID, country } = Property;
  const { accomodates } = Price;

  let branchID = '';
  if (country == 'Canada') {
    branchID = 1;
  } else {
    branchID = 2;
  }

  let priceID = 0;
  if (accomodates === 1) {
    priceID = 1;
  } else if (accomodates === 2) {
    priceID = 2;
  } else if (accomodates === 3) {
    priceID = 3;
  } else if (accomodates === 4) {
    priceID = 4;
  } else if (accomodates === 6) {
    priceID = 5;
  } else if (accomodates === 8) {
    priceID = 6;
  } else {
    priceID = 7;
  }

  let propertyType = '';
  if (propType == 'House') {
    propertyType = 'house';
  } else if (propType == 'Apartment') {
    propertyType = 'apartment';
  } else if (propType == 'Cabin') {
    propertyType = 'cabin';
  } else if (propType == 'Cottage') {
    propertyType = 'cottage';
  } else if (propType == 'Bed and Breakfast') {
    propertyType = 'bed_breakfast';
  }


  try {
    const client = await db_pool.connect();
    try {

      await client.query("BEGIN");
      const addPropertyText =
        'INSERT INTO eaccomodate.Property(houseNum, street, city, province, country, propType, roomType, accomodates, amenities, bedrooms, bathrooms, country, branchID, priceID, hostID) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING propertyID;';
      const prop = await client.query(addPropertyText, [houseNum, street, city, province, country, propertyType, roomType, accomodates, amenities, bedrooms, bathrooms, country, branchID, priceID, hostID]);
      const propertyID = prop.rows[0]['propertyid'];

      await client.query("COMMIT");
      return { code: 200, message: "Property was added." };
    } catch (err) {
      console.error("Error during the transaction, ROLLBACK.", err.stack);
      await client.query("ROLLBACK");
      return {
        code: 400,
        message: "Unable to add property"
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database Connection Error", err.stack);
    return {
      code: 503,
      message: "Database Connection Error"
    };
  }
};

const handleAddRooms = async (req, res, db_pool) => {
  const { propertyID, rooms } = req.body;
  const { code, message } = await addRooms(db_pool, propertyID, rooms);
  res.status(code).json(message);
};

const addRooms = async (db_pool, propertyID, rooms) => {
  try {
    const client = await db_pool.connect();
    try {
      return { code: 200, message: "Property was added." };
    } catch (err) {
      console.error(
        "Error during inserting values to the room table.",
        err.stack
      );
      return {
        code: 400,
        message: "Unable to add rooms"
      };
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Database Connection Error", err.stack);
    return {
      code: 503,
      message: "Database Connection Error"
    };
  }
};

module.exports = { handleViewProperty, handleAddProperty, addProperty, handleAddRooms, addRooms };
