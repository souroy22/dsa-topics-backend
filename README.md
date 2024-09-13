# Express Backend Sample with TypeScript, Mongoose, and Vercel

This repository provides a sample setup for creating an Express backend using TypeScript, Mongoose, and Vercel, along with Husky for Git hooks and Jest for testing. It includes a basic user model and authentication routes for signing in and signing up.

## Prerequisites

Before you begin, make sure you have the following installed:

- Node.js
- npm
- MongoDB

## Setup

Follow these steps to set up the project:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/souroy22/backend-sample.git
   cd backend-sample
   ```

2. **Install the dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Add your MongoDB URI to the `.env` file:

     ```env
     MONGO_URI=your_mongodb_uri_here
     ```

   - Uncomment the `.env` line in the `.gitignore` file:

     ```plaintext
     # .env
     ```

4. **Customize the user model:**

   Update the user model in `src/models/user.ts` according to your requirements.

## Usage

### Development

To run the development server, use:

```bash
npm run dev
```
