# 🐄 KAMBAC Livestock Management Module

Independent module repository for the **Livestock Management System** of the **KAMBAC** (Kababaihang Masipag ng Barangay Aurora MPC) Agricultural Cooperative.

---

## 📌 Overview

This repository contains the complete, self-contained **Livestock Management Module** extracted from the main KAMBAC system. It provides comprehensive tracking of cooperative livestock, health logs, weight histories, and archiving/restoration workflows with full database transaction safety.

---

## ✨ Features

- **Livestock Registration & Modal:** Add livestock with automatic, collision-safe code generation (`LS-YYYY-XXXX`).
- **Real-Time Livestock Inventory Dashboard:** Instant statistics for Total Herd, Healthy, Needs Monitoring, and Total Estimated Herd Value.
- **Detailed Animal Profile Modal:** View complete health history, weight trends, owner details, and animal attributes via AJAX/JSON API.
- **Livestock Information Editing:** Update weight and health status with automated audit logs into history tables.
- **Livestock Archiving & Restoration:** Soft-archive livestock (e.g. sold, deceased, transferred) with reason tracking and full restoration capability.
- **Transaction Safety:** Multi-table registration (Livestock, Weight History, Health Record) wrapped in MySQL database transactions.
- **Theme Support:** Dark / Light mode toggle with state persistence.

---

## 🗄️ Database Architecture

The module utilizes **Sequelize ORM** over **MySQL** with the following models:

| Model | Table Name | Purpose |
|---|---|---|
| `Livestock` | `livestock` | Core livestock profile, codes, types, weights, values, and archive status |
| `LivestockHealthRecord` | `livestock_health_records` | Diagnostic notes, treatments, conditions, and veterinary inspection dates |
| `LivestockWeightHistory` | `livestock_weight_history` | Weight measurements and growth progression tracking |
| `LivestockArchiveHistory` | `livestock_archive_history` | Audit trail for archived and restored animals |
| `Member` | `members` | Supporting cooperative member model (livestock owners) |
| `User` | `users` | Administrator authentication and session management |

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18 or later
- **MySQL:** v8.0 or compatible (XAMPP / Laragon / Docker)

### 2. Installation
```bash
git clone https://github.com/Bonuel12142005/Livestock-Module.git
cd Livestock-Module
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env` and configure your database credentials:
```bash
cp .env.example .env
```
Default parameters:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kambac_livestock_db
```

### 4. Database Setup & Seeding
Run automated migrations and seeders:
```bash
npm run migrate
npm run seed
```

### 5. Launch the Application
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

**Default Administrator Credentials:**
- **Email:** `admin@kambac.com`
- **Password:** `AdminPassword123!`

---

## 📁 Repository Structure

```
Livestock-Module/
├── app/
│   ├── controllers/
│   │   ├── authController.js       # Admin authentication handler
│   │   └── livestockController.js  # Complete livestock CRUD & business logic
│   ├── middleware/
│   │   └── authMiddleware.js       # Session authentication guards & locals
│   └── models/
│       ├── index.js                # Database associations & exports
│       ├── Livestock.js             # Livestock core entity
│       ├── LivestockArchiveHistory.js
│       ├── LivestockHealthRecord.js
│       ├── LivestockWeightHistory.js
│       ├── Member.js               # Livestock owner relation
│       └── User.js                 # System user relation
├── config/
│   └── database.js                 # MySQL Sequelize & connection manager
├── database/
│   ├── migrate.js                  # Schema sync script
│   └── seed.js                     # Initial admin & sample herd seeder
├── public/
│   └── assets/                     # Styles and client scripts
├── routes/
│   └── index.js                    # Livestock module route definitions
├── storage/
│   ├── logs/                       # Application logs (gitignored)
│   └── uploads/                    # Animal photo attachments (gitignored)
├── views/
│   ├── dashboard.xian              # Main livestock inventory & registration view
│   ├── login.xian                  # Authentication page
│   ├── profile.xian                # User profile & settings view
│   ├── livestock/
│   │   └── archived.xian           # Archived livestock herd management
│   └── partials/
│       ├── head.xian               # HTML header, Tailwind CDN, Lucide
│       ├── nav.xian                # Livestock top navigation bar
│       └── footer.xian             # Scripts, modals, theme toggles
├── .env.example
├── .gitignore
├── index.js                        # Express server entry point
├── package.json
└── README.md
```

---

## 🔒 Security & Data Integrity

- Passwords hashed using `bcrypt` (10 salt rounds).
- Database operations enforce foreign key constraints with `RESTRICT` on owner deletion and `CASCADE` on child records.
- SQL injection protection via Sequelize parameterized queries.
- Environment variables isolated from version control.
