SET search_path = eaccomodate;

/* SQL Queries that we used in the project */

SELECT * FROM eaccomodate.Person WHERE pID = 1;

SELECT hostID FROM eaccomodate.Host WHERE pID = 4;

SELECT bookingID FROM eaccomodate.Booking WHERE propertyID = 1;

UPDATE eaccomodate.Person SET firstName = 'Dave', midNAME = 'K', lastName = 'Rowling' WHERE pID = 4;

SELECT * FROM eaccomodate.Property WHERE country = 'Canada';

SELECT amount FROM eaccomodate.Price WHERE priceID = 1;

SELECT AVG(rating) AS rating FROM eaccomodate.Review WHERE propertyID = 2 GROUP BY propertyID;

SELECT * FROM eaccomodate.Guest NATURAL JOIN eaccomodate.Person WHERE country = 'Canada' ORDER BY guestID;

SELECT * FROM eaccomodate.Property WHERE propertyID = 1;

SELECT firstName, lastName FROM eaccomodate.Person WHERE pID = 5;

SELECT guestsAllowed, amount FROM eaccomodate.Price WHERE priceID = 2;

SELECT R.rating, R.comment, R.guestID, P.firstName, P.lastName FROM 
eaccomodate.Review as R, 
eaccomodate.Person as P, 
eaccomodate.Guest as G 
WHERE R.propertyID = 3 AND P.pID = G.guestID AND R.guestID = G.guestID;

SELECT AVG(rating) AS rating, AVG(ratingCommunication) AS communication, AVG(ratingCleanliness) AS cleanliness, AVG(ratingValue) AS value FROM eaccomodate.Review WHERE propertyID = 5 GROUP BY propertyID;

SELECT dateFrom, dateTo FROM eaccomodate.Booking WHERE propertyID = 4;

SELECT dateSign FROM eaccomodate.Booking WHERE bookingID = 3;

UPDATE eaccomodate.Payment SET paymentType = 'cash', paymentStatus = 'completed'
WHERE bookingID = 10;

UPDATE eaccomodate.Booking SET dateSign = CAST('2020-10-05' AS DATE) WHERE bookingID = 10 AND hostID = 3;

SELECT CONCAT(firstName, ' ', lastName) AS guestName
FROM eaccomodate.Guest NATURAL JOIN eaccomodate.Person WHERE guestID = 5;

SELECT pID FROM eaccomodate.Person WHERE email = 'whitedp@yahoo.com';

SELECT employeeID FROM eaccomodate.Employee WHERE branchID = 2;
