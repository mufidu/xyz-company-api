# XYZ Company API Documentation

## Overview

XYZ Company is an event organizer that provides an online ticketing application.

## API Endpoints

### Customer Endpoints

#### Authentication

- **Register**
  - **URL:** `/api/customer/auth/register`
  - **Method:** `POST`
  - **Description:** Register a new customer.
  - **Request Body:**

    ```json
    {
      "username": "string",
      "password": "string",
      "email": "string"
    }
    ```

- **Login**
  - **URL:** `/api/customer/auth/login`
  - **Method:** `POST`
  - **Description:** Login a customer.
  - **Request Body:**

    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

#### Order

- **Create Order**
  - **URL:** `/api/customer/order`
  - **Method:** `POST`
  - **Description:** Create a new order.
  - **Request Body:**

    ```json
    {
      "eventId": "integer",
      "quantity": "integer"
    }
    ```

#### Event

- **Get Events**
  - **URL:** `/api/customer/event`
  - **Method:** `GET`
  - **Description:** Retrieve a list of events.

- **Get Event**
  - **URL:** `/api/customer/event/:id`
  - **Method:** `GET`
  - **Description:** Retrieve details of a specific event.
  - **URL Params:**
    - `id`: Event ID

### Admin Endpoints

#### Authentication

- **Register**
  - **URL:** `/api/admin/auth/register`
  - **Method:** `POST`
  - **Description:** Register a new admin.
  - **Request Body:**

    ```json
    {
      "username": "string",
      "password": "string",
      "email": "string"
    }
    ```

- **Login**
  - **URL:** `/api/admin/auth/login`
  - **Method:** `POST`
  - **Description:** Login an admin.
  - **Request Body:**

    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

#### Event Management

- **Get Events**
  - **URL:** `/api/admin/event`
  - **Method:** `GET`
  - **Description:** Retrieve a list of events.

- **Get Event**
  - **URL:** `/api/admin/event/:id`
  - **Method:** `GET`
  - **Description:** Retrieve details of a specific event.
  - **URL Params:**
    - `id`: Event ID

- **Add Event**
  - **URL:** `/api/admin/event`
  - **Method:** `POST`
  - **Description:** Add a new event.
  - **Request Body:**

    ```json
    {
      "name": "string",
      "date": "string",
      "location": "string",
      "price": "number",
      "availableTickets": "integer"
    }
    ```

- **Update Event**
  - **URL:** `/api/admin/event/:id`
  - **Method:** `PUT`
  - **Description:** Update an existing event.
  - **URL Params:**
    - `id`: Event ID
  - **Request Body:**

    ```json
    {
      "name": "string",
      "date": "string",
      "location": "string",
      "price": "number",
      "availableTickets": "integer"
    }
    ```

- **Delete Event**
  - **URL:** `/api/admin/event/:id`
  - **Method:** `DELETE`
  - **Description:** Delete an event.
  - **URL Params:**
    - `id`: Event ID

## Error Handling

All endpoints may return the following error responses:

- **400 Bad Request:** The request was invalid or cannot be served.
- **401 Unauthorized:** Authentication is required and has failed or has not yet been provided.
- **404 Not Found:** The requested resource could not be found.
- **500 Internal Server Error:** An error occurred on the server.

## Environment Variables

The following environment variables are used in the project:

- `MIDTRANS_SANDBOX_SERVER_KEY`: Midtrans sandbox server key.
- `MIDTRANS_SANDBOX_CLIENT_KEY`: Midtrans sandbox client key.

## Setup

To set up the project, follow these steps:

1. Clone the repository.
2. Install dependencies:

    ```sh
    npm install
    ```

3. Set up environment variables in a `.env` file.
4. Start the server:

    ```sh
    npm start
    ```

## License

This project is licensed under the MIT License.

Skenario:

Perusahaan XYZ adalah perusahaan event organizer yang sedang merancang sebuah aplikasi ticketing online. Aplikasi ini akan menggunakan message broker untuk memastikan komunikasi yang efisien dan handal antara berbagai layanan. Berikut ini adalah beberapa API yang akan digunakan:

1.⁠ ⁠API Event: API ini digunakan untuk mengambil data event seperti nama event, tanggal, lokasi, dan jumlah tiket yang tersedia. Ini juga memungkinkan admin untuk membuat, memperbarui, atau menghapus event. Ketika sebuah event baru dibuat atau diperbarui, detail event dikirim ke message broker, yang kemudian menyebarluaskan informasi ini ke layanan lain yang memerlukannya.

2.⁠ ⁠API Tiket: Ketika pengguna memutuskan untuk membeli tiket, permintaan mereka dikirim ke API Tiket. API ini membuat permintaan ke message broker untuk mengurangi jumlah tiket yang tersedia. Message broker kemudian mengirim permintaan ini ke layanan yang sesuai untuk diproses. Ketika tiket berhasil diproses, message broker menginformasikan API Tiket, yang kemudian mengirim konfirmasi ke pengguna.

3.⁠ ⁠API Pembayaran: Setelah pengguna menerima konfirmasi bahwa tiket mereka telah dipesan, mereka diarahkan ke API Pembayaran untuk menyelesaikan pembayaran. Detail pembayaran dikirim ke message broker, yang kemudian meneruskannya ke layanan pembayaran untuk diproses.

4.⁠ ⁠API Notifikasi: Setelah pembayaran berhasil, detail transaksi dikirim ke message broker, yang kemudian meneruskannya ke API Notifikasi. API ini bertugas mengirimkan notifikasi ke pengguna tentang status pembelian mereka, baik melalui email atau notifikasi push.

5.⁠ ⁠API Autentikasi: API ini bertugas untuk menangani proses autentikasi pengguna seperti login dan registrasi. Informasi pengguna yang diautentikasi juga dapat disimpan dan diteruskan melalui message broker jika diperlukan oleh layanan lain.

Dalam skenario ini, message broker berfungsi sebagai pusat pertukaran pesan antara berbagai layanan, memastikan bahwa semua komunikasi berjalan lancar dan tidak ada permintaan yang hilang atau tertunda, bahkan di bawah beban tinggi.
