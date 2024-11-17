# Valdosta Medicine Telehealth Program Thing

Welcome to the Valdosta Medicine Telehealth Whatever Program I Made In 8 Hours! This project was developed during Hackathon 2024 to provide a telehealth system for Valdosta Medicine, a fictional clinic in need of connecting doctors and patients remotely. My main issue was the firewall, it broke my actual server. I was out of time when I noticed the issue, scrambling together some sort of "database" built into the website.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Patient Accounts](#patient-accounts)
  - [Doctor Accounts](#doctor-accounts)
- [Technologies Used](#technologies-used)
- [License](#license)

## Introduction

Valdosta Medicine required a telehealth solution that allows patients and doctors to communicate through messaging and note-sharing functionalities. The application distinguishes between patient and doctor accounts, ensuring that sensitive information like doctor's notes remains confidential.

## Features

- **Secure Messaging:** Real-time messaging between patients and doctors.
- **Account Types:**
  - **Patient Accounts:** Can message doctors and take personal notes.
  - **Doctor Accounts:** Can message patients and other doctors, and record patient-specific notes.
- **Notes Management:**
  - Doctors can create, view, edit, and delete notes for each patient.
  - Patients can create personal notes but cannot access doctor's notes.
- **Search Functionality:** Search for doctors or messages to find information quickly.
- **User Authentication:** Login system distinguishing between patient and doctor accounts.

## Installation

To run this application locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/Smellon69/hackathon-2024.git
   cd whatever-folder-is-made-idk
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Run the Application:**

   ```bash
   npm run dev
   ```

4. **Access the Application:**

   Open your browser and navigate to `http://localhost:3000`.

## Usage

### Patient Accounts

- **Registration:**
  - Patients can create an account by providing their details.
- **Messaging:**
  - Can initiate conversations with doctors.
  - Cannot message other patients.
- **Notes:**
  - Can create personal notes.
  - Cannot view or access doctor's notes.

### Doctor Accounts

- **Registration:**
  - Doctor account creation is restricted.
  - An admin can create doctor accounts, or specific credentials are required.
- **Messaging:**
  - Can initiate conversations with patients and other doctors.
- **Notes:**
  - Can create, view, and manage notes for each patient.
  - Notes are private and not accessible by patients.

## Technologies Used

- **Frontend:**
  - React.js with Next.js for server-side rendering.
  - Tailwind CSS for styling.
  - Lucide React Icons for UI icons.
- **State Management:**
  - React Hooks (`useState`, `useEffect`).
- **Routing:**
  - Next.js Router.
- **Storage:**
  - `localStorage` for data persistence (for demonstration purposes).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
