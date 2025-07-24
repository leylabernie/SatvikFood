# Vegetarian Indian Recipe Hub

This project is a web application for browsing, planning, and managing vegetarian Indian recipes.

## How to Update the Live Application on Vercel

If you have made changes to the code on your local computer and want to see them live on your Vercel-hosted website, you need to commit them to `git` and push them to GitHub. Vercel will automatically handle the rest.

Here is the step-by-step process:

### Step 1: Save Your Code Changes

First, ensure you have saved all the file changes in your code editor (like VS Code). For example, if you were given new content for `App.tsx` and `services/geminiService.ts`, make sure you have pasted that content into the correct files and saved them.

### Step 2: Open a Terminal in Your Project Directory

Open your command line tool (Terminal on Mac/Linux, or Command Prompt/PowerShell/Git Bash on Windows) and make sure you are in the project's root folder. You can navigate to it using the `cd` command.

Example:
```bash
cd path/to/your/project-folder
```

### Step 3: Stage Your Changes

This step prepares your saved changes to be recorded in the project's history. The command `git add .` stages all modified files in the current directory.

```bash
git add .
```

### Step 4: Commit Your Changes

A "commit" is like a snapshot of your staged changes at a specific point in time. You must provide a message with every commit to describe what you changed. This helps you and others understand the project's history.

```bash
# You can replace the message with your own description
git commit -m "Refactor AI service and fix shopping cart logic"
```

### Step 5: Push Your Changes to GitHub

This final step sends your committed changes from your local computer up to your repository on GitHub.

```bash
git push
```

### What Happens Next? The Vercel Magic ✨

Because your Vercel project is linked to your GitHub repository, pushing changes to GitHub automatically triggers a new deployment on Vercel.

1.  Go to your Vercel dashboard.
2.  You should see a new build has started for your project.
3.  Vercel will build your app and deploy it. Once it's finished, your changes will be live!
4.  The original error `Could not resolve "./context/AuthContext"` should now be resolved, as your latest code has been deployed.
