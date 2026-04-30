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

1. Ensure Node.js is installed.
2. Clone the repository and navigate into the folder.
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
