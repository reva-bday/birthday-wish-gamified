# The Enigma of Hearts

A customized interactive web experience built in React (Vite) as a scavenger hunt containing multiple levels, puzzles, and a finale.

## Project Structure

- **`src/`**: Contains the main React source code.
  - **`components/`**: Reusable UI components (like the layout and amulets).
  - **`levels/`**: The core levels of the game (Chronology, Music, MCQ, Puzzle, Matching, Finale).
  - **`lib/`**: Utility constants and helper functions.
  - **`App.tsx`**: Main game state manager (levels, amulets acquired).
  - **`main.tsx`**: React DOM entry.
  - **`index.css`**: TailwindCSS styling and imported elegant typography.
- **`public/`**: Public static assets.
  - **`assets/`**: Contains all images and audio associated with each level.

## Hosting with GitHub Pages

This project is configured out-of-the-box to work with GitHub Pages (static deployments) or any generic static web host.

1. Enable **GitHub Actions** for your repository.
2. In the repository settings, go to **Pages**, select **GitHub Actions** as the source.
3. Use the standard **Static HTML** or **Node.js** workflow for deploying Vite. 
4. Below is a sample GitHub Actions `deploy.yml` workflow:

```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ['main']
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Running Locally

To run the project on your local machine, make sure you have Node.js installed, then follow these steps:

1. **Clone the repository** and navigate into the project folder.
2. **Install all dependencies** (You must do this first!):
   ```bash
   npm install
   ```

### Development Mode

To start the local development server with hot-reloading:
```bash
npm run dev
```

### Testing the Production Build Locally

To test the application exactly as it will appear when hosted on GitHub Pages (to verify asset paths and production optimizations):

1. **Build the project**:
   ```bash
   npm run build
   ```
2. **Preview the build**:
   ```bash
   npm run preview
   ```
   Open your browser to the URL provided by Vite (e.g., `http://localhost:4173/birthday-wish-gamified/`) to verify everything works smoothly.
