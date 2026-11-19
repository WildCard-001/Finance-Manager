# Finance Manager

Offline expense-splitting app (installable web app). Live at https://wildcard-001.github.io/Finance-Manager/

There is also a **Local version with no sync at all**: https://wildcard-001.github.io/Finance-Manager/local/ — see [Local version](#local-version-no-sync) below.

## Setup

Works fully offline. Data is saved on each device, and syncs between your phone and PC automatically through your own free Firebase database (optional — manual sync with a file still works).

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


## Automatic sync (Firebase, free, about 10 minutes)
Do this once, on your PC.

### A. Create the database
1. Go to https://console.firebase.google.com and sign in with your Google account.
2. Click **Create a project** (or **Add project**). Name it e.g. `finance-manager`. You can turn off Google Analytics. Click **Create project**.
3. In the left menu: **Build → Authentication → Get started**. Under **Sign-in method**, click **Email/Password**, turn on **Enable** (the first switch only), click **Save**.
4. In the left menu: **Build → Firestore Database → Create database**. Pick a location near you (e.g. `asia-south1` Mumbai), choose **Start in production mode**, click **Create**.
5. Open the **Rules** tab, replace everything with the text below, then click **Publish**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{doc=**} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```
This means only you, signed in, can read or write your data.

6. Click the ⚙ next to **Project Overview → Project settings**. Under **Your apps**, click the **</>** (Web) icon, give it a nickname, click **Register app** (leave Firebase Hosting unticked). Copy the `const firebaseConfig = { … };` block it shows. Send it to yourself (Notes or WhatsApp) so you can paste it on your phone too.

### B. Turn it on in the app
1. **PC** (the device that has your data): open the app → **Settings → Automatic sync**. Paste the config, tap **Save config**. Enter an email and a password (6+ characters) and tap **Create account**. The top of the screen shows **Synced ✓**.
2. **iPhone**: open the app **from the home-screen icon** → **Settings → Automatic sync**. Paste the same config, tap **Save config**, enter the same email and password and tap **Sign in**. Your data appears.

From then on:
- Each change syncs within a couple of seconds when you're online, and when you open the app or come back online.
- Offline, changes are saved on the device; the top shows **Offline · N waiting to sync** until they're sent.
- If the same item was changed on both devices, the later change wins. Deleting on one device deletes on the other.
- **Sign out** stops syncing on that device; its data stays.

The apiKey in the config isn't a secret — Firebase uses it to know which project you mean. Your data is protected by your sign-in and the rules above.

## Manual sync (backup, no account needed)

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

With automatic sync on, data moves on its own; manual sync stays available as a backup.

## Local version (no sync)
https://wildcard-001.github.io/Finance-Manager/local/ (files in the `local/` folder)

The same app with every sync feature removed: no Firebase, no account, no sync files, and nothing is ever sent online. Data stays only on the device it was entered on. Good for anyone who wants to use the app without a database. Everything else works the same: trackers, splits, paid-back marks, My spending, Excel, reminders, dark mode, offline use and installing to the home screen or PC.

- **Separate data.** It keeps its data under its own storage keys (`fml-…`), so it never sees or changes the main app's data, even on the same device and browser. It has its own service worker and cache (`fml-v…`) and installs as a separate app called **Finance Local**.
- **Backups matter.** With no sync, a backup is the only copy outside the device. Use **Settings → Backup → Save backup file** now and then. **Open backup file** restores one, and it also accepts a backup or a **sync file** from the main app (this *replaces* all data in the Local version).
- **Shared files.** It uses the main app's `xlsx.full.min.js` and icons from the folder above, so keep those in the root.
- **Updating it:** raise the number in the three places inside `local/` — `local/version.json`, `var APP_VERSION=` in `local/index.html`, and `VERSION = 'fml-v…'` in `local/sw.js`. Changes made to the main `index.html` aren't copied over automatically; port them to `local/index.html` as well.
