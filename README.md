# My Finance Tracker

A mobile-first, offline-capable personal finance tracker. The app has no backend, login, analytics, account linking, or cloud database. Individual financial records are stored in IndexedDB in the browser profile where the app is installed.

## Included

- Income, expenses, refunds, and neutral transfer records
- Integer minor-unit storage (paise/cents) for amounts
- Monthly overview, carried-forward balance, category breakdown, six-month chart
- Full searchable/filterable/editable transaction history
- Monthly reports, budgets, savings goals
- Currency and theme preferences, editable categories
- JSON backup/restore and CSV export
- IndexedDB schema and offline service worker cache
- Automated calculation/backup-validation tests

## Run locally for development

Service workers and PWA installation require a secure context: HTTPS, or localhost during development. Do not open `index.html` as a `file://` URL and expect installation/offline caching to work.

If Node.js is installed, from this folder run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in a browser on the same computer. This localhost route is for testing. For phone installation, deploy the folder to an HTTPS host.

## Free HTTPS deployment (static files only)

One straightforward option is GitHub Pages:

1. Sign in to GitHub and create a new **private or public** repository. The app contains no personal finance records; never commit a backup JSON file.
2. Upload the contents of this folder (not the folder wrapper) to the repository's root.
3. In repository **Settings → Pages**, choose deployment from the `main` branch and `/ (root)` and save.
4. Wait for GitHub Pages to show the HTTPS URL. Open that URL and confirm the app loads. If the repository is public, its source code is public, but financial data entered into the app remains in each user's browser storage.
5. Service worker scope is the deployed directory. Keep the file names and directory structure intact.

Other static HTTPS hosts such as Cloudflare Pages or Netlify can also host the static files. Deployment is not performed by this project; no live URL is claimed here.

## Install on Android

1. Deploy to HTTPS and open the resulting URL in **Chrome on Android**.
2. Wait for the app to load once while online, then use Chrome's menu (⋮) → **Install app** or **Add to Home screen** (wording depends on Chrome/version).
3. Launch it from the home screen. After the initial successful load, its shell is cached for offline use.
4. In Settings, tap **Backup now** and keep the JSON file in a safe location. Test restoring a backup before relying on it.

## Data persistence and privacy

- IndexedDB is the primary source of truth. Changes are only shown as saved after the database transaction completes.
- The app requests persistent browser storage when supported and reports whether it was granted. Browser storage is not an absolute guarantee.
- Clearing site data, uninstalling the PWA, browser eviction, losing the device, or device damage can destroy the local records. A backup is essential.
- The JSON backup contains transactions, categories, budgets, goals, and preferences. CSV contains transaction rows only. No backup is automatically uploaded anywhere.
- A restore **Replace** clears the current finance records/settings before restoring the backup. **Import** retains current data and skips records with matching IDs. It does not attempt fuzzy duplicate detection for the same real-world transaction saved under different IDs.
- Do not keep backup files in a public repository or shared folder.

## Financial rules

- Transactions are the source of truth; summaries are recalculated from individual rows.
- Amounts are integer minor units (`amountMinor`), not floating-point currency values.
- Opening balance = configured starting balance + all earlier dated income/refunds minus expenses. Closing balance = opening balance + period income + refunds minus expenses.
- Net savings = income + refunds − expenses. Savings rate is unavailable when income is zero.
- Transfers are neutral records in consolidated balance, income, and expense totals; they are not a substitute for account-level transfer accounting. This app does not implement separate account balances.
- A refund is recorded as a positive `refund` and increases available balance; it is shown separately and does not inflate income. Category expense totals are gross expenses, so refund-by-category netting is not currently provided.
- Backdated transactions automatically change the current and later calculated balances because balances are recomputed from dated records.
- Budgets count recorded expense transactions only; refunds do not reduce category budget spend in this version. Goal progress is planning-only and never changes account balance.
- Dates use local calendar dates (`YYYY-MM-DD`) and are formatted without parsing as UTC.

## Tests

Run calculation and backup-validation tests with:

```bash
node tests/core.test.js
```

Run syntax checks with:

```bash
node --check app.js
node --check sw.js
```

The included automated tests validate core amount/sum/refund/transfer behavior and backup schema validation. They do **not** replace a real Android/browser acceptance test. This workspace did not run Chrome on Android, verify installation on a physical phone, or perform a true browser-close/offline/reopen IndexedDB test. Test those steps on your device after deploying before entering important records.

## Known limitations

- No separate account ledger, recurring transactions, debt tracking, or account reconciliation.
- Transfers are neutral consolidated records only and do not move balances between tracked accounts.
- Refunds are handled in overall cash balance but not netted against category-level expense charts/budgets.
- Backup import duplicate detection is by record ID only, not by matching date/amount/description.
- The interface uses locally drawn CSS charts, so no external chart CDN is required.
- Budget warning thresholds are visually indicated in the budget view; push notifications are not implemented.
# finance
