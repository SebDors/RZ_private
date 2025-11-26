# Rubin & Zonen Diamond Management Platform

Welcome to the Rubin & Zonen project! This is a comprehensive web application designed for managing and showcasing a diamond inventory. It features a modern frontend for browsing and searching diamonds, and a robust backend for managing data, users, and business logic.

This document will guide you through the setup, installation, and main features of the project.

## ✨ Features

- **Frontend**: A responsive and user-friendly interface built with **React** and **Vite**.
- **Backend**: A powerful API built with **Node.js** and **Express**.
- **Database**: A reliable **PostgreSQL** database to store all application data.
- **Containerization**: The entire application is containerized using **Docker** for easy setup and deployment.
- **Real-time Inventory**: The diamond database is automatically synchronized with an FTP server every 5 minutes, ensuring the inventory is always up-to-date.
- **Admin Panel**: A dedicated section for administrators to manage users, site settings, and data imports.
- **User Accounts**: Secure user registration and authentication with JWT.

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### 1. Prerequisites

First, you need to have **Docker** and **Docker Compose** installed on your system. If you don't have them, you can download them from the official Docker website:

- [Install Docker Engine](https://docs.docker.com/engine/install/)

### 2. Environment Configuration

The project uses environment variables to manage sensitive information like database credentials and API keys.

1. You will find a file named `.env.shared`. Rename this file to `.env`.
2. Open the new `.env` file and fill in the required values. These are crucial for the application to run correctly.

```env
# Database Configuration
DATABASE_USER=your_database_user
DATABASE_NAME=your_database_name
DATABASE_PASSWORD=your_database_password
HOST=db
PORT_SERV=5432

# JWT Secret for Authentication
JWT_SECRET=your_super_secret_jwt_key

# FTP Server Details for Diamond Sync
FTP_HOST=your_ftp_host
FTP_PORT=21
FTP_USER=your_ftp_user
FTP_PASSWORD=your_ftp_password
FTP_REMOTE_PATH=/path/to/your/diamond_file.csv

# Emailing Service (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_EMAIL_SENDER=sender@example.com
```

**Note**: The `HOST` for the database should typically be set to `db`, which is the service name defined in the `compose.yaml` file.

### 3. Launching the Application

Once you have configured your `.env` file, you can start the application using Docker Compose.

Open a terminal in the root directory of the project and run the following command:

```bash
docker compose up -d --build
```

This command will build the Docker images for the frontend and backend services and run them in the background.

### 4. Accessing the Application

After the containers have started, you can access the different parts of the application:

- **Frontend Application**: Open your web browser and navigate to **[http://localhost:4173](http://localhost:4173)**. This is where you can interact with the user interface.
- **Backend API Documentation**: The API is documented using Swagger. You can explore all the available endpoints by visiting **[http://localhost:3000/api-docs/](http://localhost:3000/api-docs/)**.

## ⚙️ How It Works

### Database Initialization

The database is automatically initialized when the Docker container starts for the first time. It creates the necessary tables and populates them with some initial data. You don't need to run any manual scripts to set it up.

### Automatic Diamond Synchronization

A key feature of this platform is the automatic synchronization of the diamond inventory. A scheduled task runs every 5 minutes to:

1. Connect to the specified FTP server.
2. Download the diamond data file (in CSV format).
3. Process the file and update the `diamants` table in the PostgreSQL database.

This ensures that the diamond data displayed on the frontend is always current.

## Troubleshooting

- If the containers fail to start, run `docker compose logs` to check the logs for any errors. The backend logs can be seen with `docker compose logs backend-rubin-zonen`.
- If you make changes to the database structure or need to reset the data, you can use the following command to completely rebuild the containers and volumes:

  ```bash
  docker compose down -v ; docker compose up --build -d
  ```

- To check the status of your running containers, use:

  ```bash
  docker compose ps
  ```

Thank you for using the Rubin & Zonen platform!
