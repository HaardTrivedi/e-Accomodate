SET search_path = eaccomodate;

-- Test Query 1
SELECT DISTINCT CONCAT(Person.firstName, ' ', Person.lastName) AS guestName, 
Property.propType AS rentalType, 
Price.amount AS rentalPrice, 
Booking.dateSign AS signDate, 
Branch.country AS branch, 
Payment.paymentType AS paymentType, 
Payment.paymentStatus AS paymentStatus
FROM Property, Person, Branch, Price NATURAL JOIN Payment INNER JOIN Booking ON Payment.bookingID = Booking.bookingID 
WHERE Property.propertyID = Booking.propertyID AND Price.priceID = Property.priceID AND Property.branchID = Branch.branchID 
ORDER BY paymentType ASC, signDate DESC;


-- Test Query 2
CREATE view GuestListView AS 
SELECT firstName, midName, lastName, houseNum, street, city, province, country, email, phoneNumber 
FROM (SELECT * FROM eaccomodate.Booking INNER JOIN Person 
	  ON eaccomodate.Booking.guestID = Person.pID ORDER BY branchID, guestID) as t1;


-- Test Query 3
SELECT * FROM Booking INNER JOIN Payment ON Booking.bookingID = payment.bookingID WHERE paymentStatus = 'completed' 
ORDER BY amount DESC LIMIT 1;


-- Test Query 4
SELECT DISTINCT Property.propertyID AS propID, Branch.branchID, (SELECT AVG(Rating) FROM Review JOIN Property ON Review.propertyID = Property.propertyID) AS avgRating, 
Property.houseNum, Property.street, Property.city, Property.province, Property.country, Property.propType, Property.roomType, Property.bedrooms, 
Property.bathrooms, Property.accomodates, Property.availDate FROM Property 
INNER JOIN Booking ON Booking.propertyID = Property.propertyID 
INNER JOIN Branch ON Branch.branchID = Property.branchID 
ORDER BY branchID ASC, avgRating DESC;


-- TEST QUERY 5
SELECT * FROM Property WHERE Property.propertyID NOT IN (SELECT propertyID FROM Booking);


-- TEST QUERY 6
SELECT eaccomodate.Property.*, dateFrom, dateTo
FROM eaccomodate.Property NATURAL JOIN eaccomodate.Booking
WHERE (EXTRACT(DAY FROM dateFrom) <= 10 AND EXTRACT(DAY FROM dateTo) >= 10) OR
(EXTRACT(MONTH FROM dateFrom) < EXTRACT(MONTH FROM dateTo) AND EXTRACT(DAY FROM dateTo) >= 10);


-- TEST QUERY 7
SELECT * FROM (SELECT Person.pID AS empID, CONCAT(Person.firstName, ' ', Person.lastName) AS empName, Employee.branchID, Employee.employeeType AS eType, Branch.country, Employee.salary FROM Employee 
INNER JOIN Person ON Person.pID = Employee.employeeID 
INNER JOIN Branch ON Branch.branchID = Employee.branchID) AS t1 WHERE t1.salary>=15000 
ORDER BY t1.eType = 'M' DESC, t1.empID ASC;


-- TEST QUERY 8
SELECT propType, hostID, street, city, province, country, amount, paymentType
FROM eaccomodate.Property NATURAL JOIN eaccomodate.Booking NATURAL JOIN eaccomodate.Payment
LIMIT 1;


-- TEST QUERY 9
UPDATE eaccomodate.Person
SET phoneNumber[0] = '123-456-7890'
WHERE pID = 1;


-- TEST QUERY 10
CREATE FUNCTION firstNameFirst() 
   RETURNS TABLE (
      fullName text
) 
AS $$
BEGIN
   RETURN QUERY SELECT
      concat(firstName, ' ', lastName) as fullName
   FROM
      eaccomodate.Person;
END; $$ 
LANGUAGE 'plpgsql';
