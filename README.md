# BankConverts

A powerful and easy-to-use tool to convert bank statements from PDF or images into Excel or CSV files in seconds. This project uses a React frontend and a Cloudflare serverless function backend powered by the Google Gemini API.

## Prerequisites

- [Node.js](https://nodejs.org/en) (v22.x or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) (for deployment)

## Getting Started

Follow these steps to get your development environment set up and running.

### 1. Install Dependencies

This command will install all necessary libraries into a `node_modules` folder.

```bash
npm install
```

### 2. Set Up Local Environment Variables

The application requires API keys to function.

a. In your project's root directory, create a new file named `.dev.vars`.

b. Add your Google Gemini API key and your Razorpay Key ID in the following format.

```
# .dev.vars - Do NOT include quotes

API_KEY=PASTE_YOUR_GOOGLE_GEMINI_API_KEY_HERE
VITE_RAZORPAY_KEY_ID=PASTE_YOUR_RAZORPAY_KEY_ID_HERE
```
> **Note:** This file is included in `.gitignore` and should never be committed. The `VITE_` prefix is required by Vite to expose the Razorpay key to the frontend during development.

### 3. Run the Development Server

This command starts both the frontend Vite server and the backend serverless function proxy.

```bash
npm run dev
```

Your application should now be running at `http://localhost:8788`.

## Deployment to Cloudflare Pages

This project is configured for easy deployment to Cloudflare Pages.

### 1. Connect Your Repository

In the Cloudflare dashboard, create a new Pages project and connect it to your GitHub repository.

### 2. Configure Build Settings

Use the following build settings:
- **Framework preset:** `Vite`
- **Build command:** `npm run build`
- **Build output directory:** `dist`

### 3. Set Production Environment Variables (CRITICAL)

This is the most important step for a successful deployment. In your Pages project settings (**Settings > Environment variables**), you must add your keys. Cloudflare has two types of variables, and they must be used correctly.

- **`VITE_RAZORPAY_KEY_ID`**:
  - **Type**: `Plaintext`
  - **Why**: This key is needed by the Vite build process to be included in the frontend code. Plaintext variables are available at **build time**.

- **`API_KEY`**:
  - **Type**: `Secret text`
  - **Why**: The Google Gemini API key is used by your live serverless function. It must be kept secure and is only needed at **runtime**. `Secret text` variables are encrypted and only made available to the running function, not the build process.

**If you set `API_KEY` as `Plaintext`, your live application will fail.**

After setting the variables, re-deploy your project to apply the changes.
