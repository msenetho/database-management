<div align="center">

# Concert Database Management System

*A full-stack web application for managing concerts, ticket sales, customers, and merchandise using PostgreSQL.*

![Language](https://img.shields.io/github/languages/top/msenetho/database-management)
![Repo Size](https://img.shields.io/github/repo-size/msenetho/database-management)
![Last Commit](https://img.shields.io/github/last-commit/msenetho/database-management)
![Issues](https://img.shields.io/github/issues/msenetho/database-management)
![License](https://img.shields.io/github/license/msenetho/database-management)

</div>

> **Website Notice**
>
> This project is no longer hosted online. Please refer to the screenshots below for examples of the application's interface and functionality.

---

## Overview

This application was developed as part of **CSCE 45203 – Database Management Systems** at the **University of Arkansas**.

The system provides a web interface for managing artists, concerts, customers, ticket purchases, and merchandise while demonstrating fundamental database concepts including relational modeling, SQL query development, and full-stack web application design.

Key concepts demonstrated include:

- Relational database design
- Primary and foreign keys
- SQL joins
- Aggregate queries
- CRUD operations
- Full-stack web development

---

## Features

### Data Management

- Add new artists
- Add new concerts
- Register customers
- Record ticket purchases

### Reports & Queries

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

### Deployment

- Render

---

## Database Design

The application is built around a relational database consisting of five primary tables:

- Artist
- Concert
- Customer
- Ticket
- Merchandise

Relationships are enforced using primary and foreign keys with cascading deletes where appropriate.

```text
Artist
   │
   ├────────── Concert
                   │
                   ├──────── Ticket
                   │
                   └──────── Merchandise
```

---

## SQL Concepts Demonstrated

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

## Screenshots (TBD)

### Home Page

*Insert screenshot here*

---

### Add Artist

*Insert screenshot here*

---

### Add Concert

*Insert screenshot here*

---

### Customer Spending Report

*Insert screenshot here*

---

### Top 3 Artists

*Insert screenshot here*

---

### Merchandise Revenue

*Insert screenshot here*

---

## Running Locally

Clone the repository.

```bash
git clone https://github.com/msenetho/database-management.git
```

Navigate to the project directory.

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

The application will be available at:

```text
http://localhost:3000
```

---

## Project Structure

```text
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

## What I Learned

This project strengthened my experience with:

- Relational database modeling
- PostgreSQL
- SQL query development and optimization
- Express.js and Node.js backend development
- Connecting a web application to a cloud-hosted database
- Deploying full-stack applications with Render and Supabase

---

## Author

**Matthew Senetho**

Computer Science & Computer Engineering  
University of Arkansas

GitHub: https://github.com/msenetho

---

## License

This project was created for educational purposes.
