# IT Excuses Generator

A fun web application that generates memes from classic developer excuses! Built with Next.js and Magic Hour AI.

## Features

- Choose from different categories of IT excuses:
  - Frontend
  - Backend
  - DevOps
  - QA
  - Management
  - Funny

- Get random, humorous developer excuses for each category
- Automatically generates a meme image based on the selected excuse
- Retro-style interface with pixel font
- Responsive design that works on all devices

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Setup

1. Create a `.env` file in the root directory
2. Add your Magic Hour API token:
   ```
   TOKEN="your_magic_hour_api_token"
   ```

### Running the Application

The application will be available at [http://localhost:3000](http://localhost:3000).

## How to Use

1. Select a category of excuse (Frontend, Backend, DevOps, etc.)
2. Click "Generate Excuse" to create a meme
3. The app will:
   - Pick a random excuse from the selected category
   - Generate a custom meme image with the excuse text
   - Display the result

## Technical Stack

- **Frontend**: Next.js 13+ with App Router
- **Styling**: Tailwind CSS
- **Font**: Press Start 2P for retro styling
- **Image Generation**: Magic Hour AI API
- **Deployment**: Vercel

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
