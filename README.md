# Finance Manager

Offline expense-splitting app (installable web app). Live at https://wildcard-001.github.io/Finance-Manager/

## Setup

There's no database and no sign-in. Your data lives only on your phone and your PC, and you move it between them yourself.

## 1. Put the app online, once (GitHub Pages, free)
The iPhone can only install an offline app from a web link, so the app's files need a home. GitHub holds **only the app's code, never your data**.

1. Sign up at https://github.com (skip this if you have an account).
2. Click **+ → New repository**. Name it `finance-manager`, choose **Public**, then click **Create repository**.
3. Click **uploading an existing file**. Drag in all the files from this folder (index.html, sw.js, manifest.json, xlsx.full.min.js and the three .png icons), then click **Commit changes**.
4. Go to **Settings → Pages**. Set Branch to **main** and **/ (root)**, then click **Save**.
5. After 1–2 minutes the app is live at `https://YOUR-USERNAME.github.io/finance-manager/`.

## 2. PC: move your data from the old app
1. In the old app on claude.ai, open **Settings → Copy backup**.
2. Open your new link in Chrome or Edge. Go to **Settings → Restore from a backup**, paste the backup and tap **Restore**.
3. Optional: click the install icon in the address bar to get it as a desktop app.

## 3. iPhone: install it
1. Open the link in **Safari**, then tap **Share → Add to Home Screen → Add**.
2. From now on, always open it **from the home-screen icon**. The iPhone keeps that icon's data separate from Safari's.
3. Do your first sync from the PC (see below) to get your data onto the phone.

## Syncing (whenever you like)
On the device that has the changes, go to **Settings → Sync**:
- **Send sync file.** On iPhone this opens the share sheet, so send it to yourself on WhatsApp, email or Save to Files. On PC the file goes to your Downloads folder.
- Or use **Copy as text** and paste it into a WhatsApp chat with yourself.

On the other device, go to **Settings → Sync**:
- **Open sync file** and pick the file, or paste the text and tap **Merge**.

It **merges**, it doesn't replace. Anything new on either device is kept. If the same expense was edited on both, the later edit wins. Deletions carry over.

To bring **both** devices fully up to date: send phone → PC, then send PC → phone.

The red "N changes not sent" at the top reminds you when this device has changes the other one hasn't received yet.

## Updating the app later
The app updates itself. Whenever it's opened, brought back to the screen, or comes back online, it checks `version.json`. If there's a newer version it reloads into it straight away, or once you finish the screen you're on, such as an expense you're typing. Your data isn't affected.

To publish a change, upload the changed files and raise the version number in **three** places, all by one:
1. `version.json`: `"version"`
2. `index.html`: `var APP_VERSION=`
3. `sw.js`: `VERSION = 'fm-v…'`

GitHub Pages can take a few minutes to serve the new files. The app waits and tries again rather than reloading repeatedly.

Data still moves between devices with **Settings → Sync** (there's no online database).
