# Fennec Tech Labs — Deployment Guide
# www.fennectechlabs.com

═══════════════════════════════════════════════════════════════
  PART 1 — GOOGLE APPS SCRIPT (form backend, ~5 minutes)
═══════════════════════════════════════════════════════════════

STEP 1 — Create the Google Sheet
─────────────────────────────────
1. Go to https://sheets.google.com
2. Click "+ Blank" to create a new sheet
3. Rename it (click "Untitled spreadsheet" at top):
   → "Fennec Tech Labs - Leads"

STEP 2 — Open Apps Script
──────────────────────────
1. In the sheet menu: Extensions → Apps Script
2. A new tab opens with a code editor

STEP 3 — Paste the script
───────────────────────────
1. Select ALL existing code in the editor (Ctrl+A)
2. Delete it
3. Open "google-apps-script.js" from this folder
4. Copy the entire contents and paste into the editor
5. Change line 8 if needed:
   const NOTIFY_EMAIL = 'hello@fennectechlabs.com';

STEP 4 — Save
──────────────
1. Click the floppy disk icon (or Ctrl+S)
2. Name the project: "Fennec Forms"
3. Click OK

STEP 5 — Deploy as Web App
────────────────────────────
1. Click "Deploy" (top right) → "New deployment"
2. Click the gear icon ⚙ next to "Type" → select "Web app"
3. Fill in:
   Description:     Fennec Tech Labs Forms v1
   Execute as:      Me
   Who has access:  Anyone         ← IMPORTANT: must be "Anyone"
4. Click "Deploy"
5. Click "Authorize access"
   → Choose your Google account
   → Click "Advanced" → "Go to Fennec Forms (unsafe)" → "Allow"
6. You'll see a URL like:
   https://script.google.com/macros/s/AKfycb.../exec
7. COPY THIS URL — you'll need it in the next step

STEP 6 — Test the Web App URL
──────────────────────────────
Paste the URL in your browser address bar and press Enter.
You should see JSON like:
  {"status":"live","service":"Fennec Tech Labs API",...}

If you see that → your backend is live ✓

STEP 7 — Add URL to your HTML files
──────────────────────────────────────
Open each file and replace YOUR_GOOGLE_APPS_SCRIPT_URL_HERE
with the URL you copied:

  index.html                → hero email form
  pages/contact.html        → contact form
  pages/yrpsphere.html      → apply form

Search for: YOUR_GOOGLE_APPS_SCRIPT_URL_HERE
Replace with your URL (3 files, 1 replacement each)


═══════════════════════════════════════════════════════════════
  PART 2 — GITHUB PAGES (hosting, ~10 minutes)
═══════════════════════════════════════════════════════════════

STEP 1 — Create GitHub account (skip if you have one)
───────────────────────────────────────────────────────
Go to https://github.com → Sign up (free)

STEP 2 — Create a new repository
──────────────────────────────────
1. Click "+" (top right) → "New repository"
2. Repository name: fennectechlabs.com
3. Visibility: Public
4. DO NOT check "Add README"
5. Click "Create repository"

STEP 3 — Upload your files
────────────────────────────
Option A — Drag & Drop (easiest, no Git needed):
  1. In the new repo page, click "uploading an existing file"
  2. Drag your entire "fennec-tech-labs" folder contents
     (select all files and folders inside it, NOT the folder itself)
  3. Scroll down → click "Commit changes"

Option B — GitHub Desktop:
  1. Download https://desktop.github.com
  2. File → Clone repository → your new repo
  3. Copy all files into the cloned folder
  4. Click "Commit to main" → "Push origin"

STEP 4 — Enable GitHub Pages
──────────────────────────────
1. In your repo → click "Settings" tab
2. Left sidebar → "Pages"
3. Under "Branch": select "main" → folder: "/ (root)"
4. Click "Save"
5. Wait 2-3 minutes
6. You'll see: "Your site is live at https://YOUR_USERNAME.github.io/fennectechlabs.com"

STEP 5 — Connect your domain (www.fennectechlabs.com)
───────────────────────────────────────────────────────
In GitHub Pages Settings:
1. Under "Custom domain" → type: www.fennectechlabs.com
2. Click "Save"
3. Check "Enforce HTTPS" (after DNS propagates)

At your domain registrar (GoDaddy / Namecheap / etc):
Add these DNS records:

  Type    Name    Value
  ──────────────────────────────────────────────────
  A       @       185.199.108.153
  A       @       185.199.109.153
  A       @       185.199.110.153
  A       @       185.199.111.153
  CNAME   www     YOUR_GITHUB_USERNAME.github.io

Wait 15-60 minutes for DNS to propagate.
Then visit www.fennectechlabs.com — your site will be live.

STEP 6 — Verify forms work on live domain
───────────────────────────────────────────
1. Go to www.fennectechlabs.com
2. Submit the hero email form with a test email
3. Open your Google Sheet → check "Homepage Leads" tab
4. You should see the submission appear within seconds
5. Check your email for the notification (if SEND_EMAIL = true)


═══════════════════════════════════════════════════════════════
  WHAT YOU'LL SEE IN YOUR GOOGLE SHEET
═══════════════════════════════════════════════════════════════

Tab 1 — "Homepage Leads" (fox orange header)
  Columns: Timestamp | Email | Source | Page

Tab 2 — "Contact Form" (bright orange header)
  Columns: Timestamp | First Name | Last Name | Email | Phone
           | Company | Service | Message | Referral

Tab 3 — "YRPSphere Apply" (YRP blue header)
  Columns: Timestamp | Name | Email | Phone | City
           | Background | Program | Referral


═══════════════════════════════════════════════════════════════
  TROUBLESHOOTING
═══════════════════════════════════════════════════════════════

Problem: Form submits but nothing appears in sheet
Fix: Re-deploy the script
  → Apps Script → Deploy → Manage deployments
  → Edit (pencil icon) → Version: "New version" → Deploy

Problem: "Script function not found: doPost"
Fix: Make sure you saved the script before deploying (Ctrl+S)

Problem: No email notification arriving
Fix: Check spam folder. Or set SEND_EMAIL = false in the script
     to rule out email as the issue.

Problem: CORS error in browser console
Fix: Ensure "Who has access" = "Anyone" (not "Anyone with Google account")
     Redeploy after changing this.

Problem: DNS not resolving after adding records
Fix: DNS can take up to 48hrs but usually 15-60 mins.
     Check propagation at https://dnschecker.org

Need help? Email: hello@fennectechlabs.com
