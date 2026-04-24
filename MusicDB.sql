-- clear tables for fresh start
DROP TABLE IF EXISTS merchandise;
DROP TABLE IF EXISTS ticket;
DROP TABLE IF EXISTS concert;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS artist;

-- create tables
CREATE TABLE artist (
    artist_id       SERIAL          PRIMARY KEY,
    artist_name     VARCHAR(20)     NOT NULL,
    genre           VARCHAR(20)
);
CREATE TABLE customer (
    customer_id     SERIAL          PRIMARY KEY,
    customer_name   VARCHAR(20)     NOT NULL
);
CREATE TABLE concert (
    concert_id      SERIAL          PRIMARY KEY,
    venue_name      VARCHAR(30)     NOT NULL,
    city            VARCHAR(20)     NOT NULL,
    concert_date    DATE            NOT NULL,
    artist_id       INT             NOT NULL,

    FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE CASCADE
);
CREATE TABLE ticket (
    ticket_id       SERIAL          PRIMARY KEY,
    concert_id      INT             NOT NULL,
    customer_id     INT             NOT NULL,
    seat_number     INT             NOT NULL,
    price           DECIMAL(5, 2)   NOT NULL,

    FOREIGN KEY (concert_id)  REFERENCES concert(concert_id)   ON DELETE CASCADE,
    FOREIGN KEY (customer_id) REFERENCES customer(customer_id) ON DELETE RESTRICT
);
-- bonus table
CREATE TABLE merchandise (
    merch_id        SERIAL          PRIMARY KEY,
    artist_id       INT             NOT NULL,
    concert_id      INT             NOT NULL,
    item_name       VARCHAR(20)     NOT NULL,
    merch_price     DECIMAL(5, 2)   NOT NULL,
    quantity_sold   INT,

    FOREIGN KEY (concert_id)  REFERENCES concert(concert_id)   ON DELETE CASCADE,
    FOREIGN KEY (artist_id)   REFERENCES artist(artist_id)     ON DELETE CASCADE
);

-- Test Values
-- Artists
INSERT INTO artist (artist_name, genre) VALUES
('Lil Wayne', 'Rap'),
('Taylor Swift', 'Pop'),
('Metallica', 'Metal'),
('Beyonce', 'R&B');

-- Customers
INSERT INTO customer (customer_name) VALUES
('John Smith'),
('Jane Doe'),
('Bob Johnson'),
('Alice Brown');

-- Concerts (using artist_ids 1-4)
INSERT INTO concert (venue_name, city, concert_date, artist_id) VALUES
('Madison Square', 'New York', '2026-06-15', 1),
('Staples Center', 'Los Angeles', '2026-07-20', 2),
('Wembley Arena', 'London', '2026-08-10', 3),
('Toyota Center', 'Houston', '2026-09-05', 4);

-- Tickets
INSERT INTO ticket (concert_id, customer_id, seat_number, price) VALUES
(1, 1, 10, 49.99),
(1, 2, 11, 49.99),
(2, 3, 5, 99.99),
(3, 4, 22, 74.99),
(4, 1, 33, 59.99);

-- Merchandise
INSERT INTO merchandise (artist_id, concert_id, item_name, merch_price, quantity_sold) VALUES
(1, 1, 'shirt', 23.99, 4),
(2, 2, 'cookbook', 49.99, 2),
(3, 3, 'poster', 14.99, 10),
(4, 4, 'hat', 29.99, 6);