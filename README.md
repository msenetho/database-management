# Concert Database Management System

A full-stack web application for managing concert information, ticket sales, customers, and merchandise. The project demonstrates relational database design, SQL query development, and deployment of a Node.js web application backed by PostgreSQL.

**Live Demo:** https://database-management-o7tw.onrender.com

---

## Overview

This application was developed as part of **CSCE 45203 – Database Management Systems** at the University of Arkansas.

The system allows users to manage artists, concerts, customers, ticket purchases, and merchandise through a web interface while demonstrating concepts such as:

- Relational database design
- Primary and foreign keys
- SQL joins
- Aggregate queries
- CRUD operations
- Full-stack web development

---

## Features

### Data Entry

- Add new artists
- Add new concerts
- Add customers
- Add ticket purchases

### Database Queries

- View concerts by city
- View concerts by artist
- Calculate total customer spending
- Display the Top 3 revenue-generating artists

### Bonus Feature

- Merchandise revenue by artist

---

## Tech Stack

### Frontend

- HTML
- JavaScript

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Supabase

### Hosting

- Render

---

## Database Design

The database consists of five related tables:

- Artist
- Concert
- Customer
- Ticket
- Merchandise

Relationships are enforced using foreign keys with cascading deletes where appropriate.

Example:

```
Artist
   │
   ├────────── Concert
                   │
                   ├──────── Ticket
                   │
                   └──────── Merchandise
```

---

## Example SQL Concepts Demonstrated

- INSERT statements
- INNER JOIN
- GROUP BY
- Aggregate functions
- SUM()
- ORDER BY
- LIMIT
- Foreign key constraints
- Cascading deletes

---

# Screenshots

## Home Page

*Insert screenshot here*

---

## Add Artist

*Insert screenshot here*

---

## Add Concert

*Insert screenshot here*

---

## Customer Spending Report

*Insert screenshot here*

---

## Top 3 Artists

*Insert screenshot here*

---

## Merchandise Revenue

*Insert screenshot here*

---

## Running Locally

Clone the repository.

```bash
git clone https://github.com/msenetho/database-management.git
```

Move into the project.

```bash
cd database-management
```

Install dependencies.

```bash
npm install
```

Create a `.env` file containing your PostgreSQL connection information.

Example:

```env
DATABASE_URL=your_database_url
```

Start the application.

```bash
npm start
```

The application will be available at

```
http://localhost:3000
```

---

## Project Structure

```
database-management/
│
├── public/
├── routes/
├── views/
├── sql/
├── website.js
├── package.json
└── README.md
```

---

## Future Improvements

- Improve UI using CSS or a frontend framework
- User authentication
- Edit/Delete functionality
- Pagination for query results
- Search functionality
- Dashboard with charts
- Responsive mobile layout

---

## What I Learned

Through this project I gained experience with:

- Relational database modeling
- PostgreSQL
- SQL query optimization
- Building REST-style backend logic
- Connecting a Node.js application to a cloud database
- Deploying a full-stack application with Render and Supabase

---

## Author

**Matthew Senetho**

Computer Science & Computer Engineering

University of Arkansas

GitHub: https://github.com/msenetho

---

## License

This project was created for educational purposes.
