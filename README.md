# Book Rental Frontend (React + TypeScript + Vite)

## Introduction

This is the frontend application for the Book Rental system. It is built using **React** with **TypeScript** for type safety and enhanced development experience. **Vite** is used as the development server and build tool, which provides fast bundling and optimized builds.

---

## Prerequisites

Before running the application, make sure the following tools are installed:

- **Node.js**: Download and install Node.js from [here](https://nodejs.org/).
- **npm** or **yarn**: Node.js includes npm by default. Alternatively, you can install Yarn from [here](https://yarnpkg.com/).

---

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd book-rental-app
```

### 2. Install Dependencies

Use **npm** or **yarn** to install the necessary dependencies:

```bash
# Using npm
npm install

# Using yarn
yarn install
```

---

## Development

To start the development server, use the following command:

```bash
# Using npm
npm run dev

# Using yarn
yarn dev
```

This will start the **Vite** development server, and the application will be available at:

```
http://localhost:5173/
```

You can now access the frontend, and any changes made to the source files will hot-reload in the browser.

---

## Build for Production

To build the project for production, use the following command:

```bash
# Using npm
npm run build

# Using yarn
yarn build
```
---

## Project Structure

Here is an overview of the project structure:

```
book-rental-app/
├── public/              # Static assets
├── src/                 # Source code
│   ├── components/      # Reusable React components
│   ├── App.tsx          # Main application component
│   ├── main.tsx         # Entry point of the application
│   └── ...
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── package.json         # Project dependencies and scripts
└── ...
```

---

## Technologies Used

- **React**: For building the user interface.
- **TypeScript**: Provides static typing and type safety to the project.
- **Vite**: Fast bundler and development server for optimized builds.
- **npm or Yarn**: For dependency management and scripts.

---

## Scripts

Here are the available scripts for this project:

```bash
# Start the development server
npm run dev

```

---