# 🚀 Deployment Guide for GitHub Pages

## Prerequisites
- A GitHub account
- Git installed on your computer

## Step-by-Step Deployment

### 1. Create a New GitHub Repository
1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name it something like `lucky-winner` or `lucky-user-picker`
5. Make it **Public** (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Initialize Git and Push Your Code
```bash
# Initialize git repository
git init

# Add all files
git add .

# Make first commit
git commit -m "Initial commit: Lucky User Picker app"

# Add remote origin (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to main branch
git branch -M main
git push -u origin main
```

### 3. Enable GitHub Pages
1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" section (left sidebar)
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Wait for Deployment
- GitHub will build and deploy your site
- This usually takes 1-5 minutes
- You'll see a green checkmark when it's ready

### 5. Access Your Live Site
- Your site will be available at: `https://YOUR_USERNAME.github.io/REPO_NAME`
- Update the README.md with this URL

## File Structure for GitHub Pages
```
your-repo/
├── index.html          # Main entry point (required)
├── style.css           # Stylesheet
├── app.js              # JavaScript logic
├── README.md           # Repository documentation
└── DEPLOYMENT.md       # This file
```

## Important Notes
- **index.html must be in the root directory** - this is your entry point
- **All file paths must be relative** (no `/static/` prefixes)
- **The app works entirely client-side** - no server needed
- **GitHub Pages serves static files only** - perfect for this app

## Troubleshooting
- If you see a 404 error, make sure `index.html` is in the root directory
- If styles don't load, check that `style.css` is in the root directory
- If JavaScript doesn't work, check that `app.js` is in the root directory
- Make sure all files are committed and pushed to GitHub

## Custom Domain (Optional)
You can set up a custom domain in the Pages settings if you have one.

---

**Your Lucky User Picker will be live on the web! 🎉** 