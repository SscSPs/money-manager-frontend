# Money Manager Frontend

This is the frontend application for the Money Manager app, built using React, TypeScript, and Vite.

## Features Implemented

*   User Authentication (Login/Logout)
*   JWT Handling (Storing token, decoding user info)
*   Workplace Management (Create, List, Select via Modal)
*   Journal Viewing (List with pagination, Transactions view, Balance check)
*   Sticky Top Navigation Bar
*   Basic Dark Theme Styling

## Prerequisites

*   Node.js (Version compatible with Vite - check `package.json` `engines` field or Vite docs, e.g., ^18 || ^20 || >=22)
*   npm or yarn
*   A running instance of the corresponding [Money Manager Backend](https://github.com/SscSPs/money_managemet_app)

## Setup & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/SscSPs/money-manager-frontend
    cd money-manager-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Configure API Base URL:**
    *   Create a `.env` file in the project root directory (`money-manager-frontend/.env`).
    *   Add the following line, replacing the URL with your actual backend API base URL:
        ```
        VITE_API_BASE_URL=http://localhost:8080/api/v1
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The application should now be running, typically at `http://localhost:5173` (check the terminal output).

## Project Structure Overview

*   `src/components/`: Contains React UI components (Navbar, Modal, pages content, etc.).
*   `src/context/`: Holds React Context for global state management (e.g., `AuthContext`).
*   `src/services/`: Contains API interaction logic (`api.ts`).
*   `src/types/`: Defines shared TypeScript interfaces (`index.ts`).
*   `src/utils/`: Utility functions (e.g., `journalUtils.ts`).
*   `src/App.tsx`: Main application component defining routes.
*   `src/main.tsx`: Entry point of the React application.
