# ShopAdmin — Product & Order Management Dashboard

A React (Vite) admin dashboard for a small e-commerce store, built with **Bootstrap 5**,
**React Router**, **Axios**, and **JSON Server** as a mock REST API.

## Features

- **Landing page** — a marketing/welcome screen at `/` introducing the app, with
  live counts pulled from the API and links into the admin screens.
- **Dashboard** (`/dashboard`) — total products, total orders, total revenue,
  out-of-stock count, and a bar chart of the top 5 best-selling products (Recharts).
- **Products** — search by name, filter by category & stock availability, sort by
  price, pagination, table/card view toggle, view details, add, edit, delete.
- **Product Form** — reusable Add/Edit form with validation (required fields, price > 0,
  stock >= 0 integer, rating 0-5), Submit and Reset buttons.
- **Orders** — search by customer/order id, filter by status, sort by date, view order
  details in a modal, running total of filtered orders.
- Loading and error states, empty states, and confirm-before-delete modals throughout.

## Tech Stack

- React 19 + Vite
- React Router v7
- Axios
- Bootstrap 5 + Bootstrap Icons
- Recharts (dashboard chart)
- JSON Server (mock REST API)

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.js   # axios instance + base URL + interceptor
│   └── axiosService.js    # generic CRUD helpers
├── services/
│   └── apiService.js      # product/order specific API calls
├── context/
│   └── ProductContext.jsx # global product state + CRUD (useCallback)
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── ProductCard.jsx
│   ├── ProductTable.jsx
│   ├── ProductForm.jsx
│   ├── Pagination.jsx
│   ├── StatCard.jsx
│   ├── StatusBadge.jsx
│   ├── ConfirmModal.jsx
│   ├── Loading.jsx
│   └── ErrorAlert.jsx
├── pages/
│   ├── Landing.jsx
│   ├── Landing.css
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── AddProduct.jsx
│   ├── EditProduct.jsx
│   ├── ProductDetails.jsx
│   └── Orders.jsx
├── App.jsx
└── main.jsx
db.json    # JSON Server database (products + orders)
```

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Run the app (API + frontend together)**

   ```bash
   npm run dev:all
   ```

   This starts:
   - JSON Server on `http://localhost:4000` (serves `/products` and `/orders`)
   - Vite dev server on `http://localhost:5173`

   Or run them separately in two terminals:

   ```bash
   npm run server   # JSON Server on port 4000
   npm run dev      # Vite dev server on port 5173
   ```

3. Open `http://localhost:5173` in your browser.

## API Endpoints (via JSON Server)

| Method | Endpoint         | Description          |
|--------|------------------|-----------------------|
| GET    | /products        | List all products     |
| GET    | /products/:id    | Get a single product  |
| POST   | /products        | Create a product      |
| PUT    | /products/:id    | Update a product      |
| DELETE | /products/:id    | Delete a product      |
| GET    | /orders          | List all orders       |
| GET    | /orders/:id      | Get a single order    |

## Build for production

```bash
npm run build
npm run preview
```

> Note: `npm run preview` only serves the built frontend — you still need
> `npm run server` running separately for API calls to work.

## Customizing the API URL

The base URL is set in `src/api/axiosInstance.js` (`http://localhost:4000` by
default). Change it there if you deploy JSON Server elsewhere.
