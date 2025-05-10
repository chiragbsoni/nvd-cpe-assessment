# 🚀 NVD CPE Assessment

This project provides a full solution to parse, store, and serve Common Platform Enumeration (CPE) data from the National Vulnerability Database (NVD). It includes:

- ✅ Flask backend API
- ✅ React frontend UI

---

## 📋 Problem Statement & Approach

**Goal:**

1. Parse the official CPE XML dictionary from NVD.
2. Store fields: `cpe_title`, `cpe_22_uri`, `cpe_23_uri`, `deprecation dates`, `reference links`.
3. Serve the data via RESTful API:
   - Paginated CPE list
   - Search (by title, URIs, deprecation date)
4. Build a user-friendly frontend:
   - Table view with filters & pagination
   - Tooltip + popover for long data
   - Fallback message for no data

---

## 🔧 Tech Stack

- **Backend:** Flask, Flask-CORS, SQLAlchemy ORM, PostgreSQL
- **Frontend:** React, Axios, Material-UI

---

## 📦 API Endpoints

1️⃣ **Paginated CPE List**


2️⃣ **Search CPEs**


Supports filters:
- `cpe_title`
- `cpe_22_uri`
- `cpe_23_uri`
- `deprecation_date`

---

## 🖥️ Frontend Features

- Table view:
    - Title, URIs, deprecation dates, references
    - Popover for extra links
- Filters (title, URI, deprecation date)
- Pagination (15 / 20 / 30 / 50 per page)
- Tooltip for long titles
- No data fallback message

---

## 🚀 How to Run

### Backend (Flask)

```bash
cd nvd-cpe-api
python -m venv venv
venv\Scripts\activate  # or source venv/bin/activate
pip install -r requirements.txt
python app.py


cd cpe-frontend
npm install
npm start


---
## 👤 Author

Chirag Soni
