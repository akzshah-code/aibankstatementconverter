# BankConverts

A powerful and easy-to-use tool to convert bank statements from PDF or images into Excel or CSV files in seconds. This project uses a React frontend and a Cloudflare serverless function backend powered by the Google Gemini API.

## Prerequisites

- [Node.js](https://nodejs.org/en) (v22.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

Follow these steps to get your development environment set up and running.

### 1. Install Dependencies

This command will read the `package.json` file and install all the necessary libraries (like React, Tailwind CSS, and the local development server) into a `node_modules` folder inside your project.

> **Note:** If you are updating dependencies or running this for the first time after cloning, it's best practice to perform a clean install. This prevents conflicts with old packages.
>
> ```bash
> # Optional: Delete old packages and the lock file
> rm -rf node_modules package-lock.json
>
> # Install all packages from scratch
> npm install
> ```

### 2. Set Up Environment Variables

The application requires your Google AI API key to function. We'll use a local environment file to manage this securely.

a. **Create a local `.dev.vars` file:**
In your project's root directory, create a copy of the example file `.dev.vars.example`. Rename the copy to `.dev.vars`.

```bash
cp .dev.vars.example .dev.vars
```

b. **Add your API key:**
Open the newly created `.dev.vars` file and replace the placeholder text with your actual Google Gemini API key.

```
# .dev.vars
API_KEY="PASTE_YOUR_GOOGLE_GEMINI_API_KEY_HERE"
```
> **Note:** This file is included in `.gitignore` and should never be committed to your repository.

### 3. Run the Development Server

Now you can start the application. This single command starts both the frontend Vite server and the backend serverless function proxy.

```bash
npm run dev
```

Your application should now be running at `http://localhost:8788` (the default port for the development server). Any changes you make to the source code will automatically reload the page.