# GitHub Daily Automation Tool

A Node.js automation script that fetches daily development tips and appends them to a markdown log file. Runs automatically every day at 12:00 AM UTC via GitHub Actions.

## Features

- ✅ Fetches random programming tips from [quotable.io](https://quotable.io) API
- ✅ Automatic fallback to hardcoded best practices if API fails
- ✅ Runs daily via GitHub Actions (cron schedule: 12:00 AM UTC)
- ✅ Prevents duplicate entries for the same day
- ✅ Auto-commits and pushes changes to main branch
- ✅ Collapsible markdown sections for readability
- ✅ Timestamps and dates for each entry

## Project Structure

```
github-contribution-scripter/
├── daily-tip.js                      # Main automation script
├── package.json                      # Dependencies and metadata
├── .gitignore                        # Git ignore rules
├── daily-logs.md                     # Log file (auto-updated)
├── README.md                         # This file
└── .github/
    └── workflows/
        └── daily-tip.yml             # GitHub Actions workflow
```

## Getting Started

### Local Setup

1. **Clone or download this repository**
   ```bash
   git clone <your-repo-url>
   cd github-contribution-scripter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the script locally**
   ```bash
   npm start
   ```

   This will:
   - Fetch a tip from the API
   - Add it to `daily-logs.md` with the current date and timestamp
   - Display success/error messages in the console

### GitHub Actions Setup

The workflow is pre-configured in `.github/workflows/daily-tip.yml` and will:
- Run automatically every day at **12:00 AM UTC**
- Install dependencies
- Execute the script
- Auto-commit changes to `daily-logs.md` with message `docs: daily contribution update`
- Push the changes to the `main` branch

**No additional setup required!** The workflow has all necessary permissions configured.

#### Manual Trigger

To test the workflow manually:
1. Go to your GitHub repository
2. Click **Actions** tab
3. Select **Daily Tip Automation**
4. Click **Run workflow**

## Configuration

### Modify Schedule

To change the run time, edit `.github/workflows/daily-tip.yml`:

```yaml
on:
  schedule:
    - cron: '0 0 * * *'  # Change this line
```

**Cron Format:** `minute hour day month day-of-week`
- `0 0 * * *` → 12:00 AM UTC (default)
- `0 12 * * *` → 12:00 PM UTC
- `30 8 * * 1-5` → 8:30 AM UTC on weekdays

### Add Custom Tips

Edit the `fallbackTips` array in `daily-tip.js` to add more fallback tips:

```javascript
const fallbackTips = [
  "Your custom tip here...",
  // ... more tips
];
```

## API Details

- **Primary API:** [quotable.io](https://quotable.io)
  - Endpoint: `https://api.quotable.io/random?tags=programming`
  - No authentication required
  - Returns random programming/wisdom quotes
  - Timeout: 5 seconds

- **Fallback:** 15 hardcoded best practices if API fails

## Output Format

Each entry in `daily-logs.md` is formatted as:

```markdown
<details>
<summary><strong>2026-05-14</strong> at <code>2026-05-14 09:30:45</code></summary>

> Write clean, readable code. Future you will thank present you.

</details>
```

This creates a collapsible section that keeps the log clean and readable.

## Permissions

The GitHub Actions workflow requires:
- `contents: write` — Permission to commit and push to the repository

This is configured in `.github/workflows/daily-tip.yml`.

## Troubleshooting

### Script fails locally

1. **Check Node.js version**
   ```bash
   node --version  # Should be 18+
   ```

2. **Reinstall dependencies**
   ```bash
   npm install
   ```

3. **Check network/firewall** if API calls fail

### Workflow doesn't run

1. Ensure `.github/workflows/daily-tip.yml` exists
2. Check **Actions** tab for workflow visibility
3. Verify your GitHub Actions are enabled (Settings → Actions)
4. Check workflow logs for errors

### Changes not pushing

1. Verify `permissions.contents: write` is set in workflow
2. Ensure the branch is named `main` (not `master`)
3. Check GitHub Actions workflow logs for git errors

## Development

### Testing locally

```bash
# Run once
npm start

# Verify daily-logs.md was updated
cat daily-logs.md
```

### Testing API fallback

Temporarily modify the API URL to break it:

```javascript
// In daily-tip.js, change the API call
const response = await axios.get('https://invalid-url.invalid/api', {
```

Then run `npm start` — it should use a fallback tip.

## License

MIT

## Notes

- Daily logs accumulate over time. New entries are added to the top of `daily-logs.md`
- Same-day duplicate entries are automatically prevented
- Workflow runs at **12:00 AM UTC**, not your local timezone
- The script exits gracefully (exit code 0) on success, (exit code 1) on fatal errors
