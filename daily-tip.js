const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Hardcoded fallback best practices
const fallbackTips = [
  "Write clean, readable code. Future you will thank present you.",
  "Always write tests. Untested code is legacy code by default.",
  "DRY: Don't Repeat Yourself. Extract common patterns into reusable functions.",
  "Keep functions small and focused on a single responsibility.",
  "Document your code. Unclear code wastes more time than it saves.",
  "Use meaningful variable and function names. Self-documenting code is powerful.",
  "Commit early and often with clear commit messages.",
  "Code reviews catch bugs and improve team knowledge sharing.",
  "Performance optimization without measurement is premature optimization.",
  "Security first: validate all inputs and escape all outputs.",
  "Use version control for everything. Branches are your friends.",
  "Automate repetitive tasks. Let machines do what they're good at.",
  "Refactor regularly. Technical debt compounds like financial debt.",
  "Learn from your mistakes. Every bug is a teaching opportunity.",
  "Use the right tool for the job. Avoid over-engineering simple solutions."
];

// Function to get current timestamp
function getCurrentTimestamp() {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
}

// Function to get current date
function getCurrentDate() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// Function to fetch a random tip from API with fallback
async function fetchTip() {
  try {
    console.log('Fetching tip from quotable.io...');
    const response = await axios.get('https://api.quotable.io/random?tags=programming', {
      timeout: 5000
    });
    return response.data.content;
  } catch (error) {
    console.warn('API request failed, using fallback tip:', error.message);
    return fallbackTips[Math.floor(Math.random() * fallbackTips.length)];
  }
}

// Function to format the entry as a collapsible section
function formatEntry(tip, date, timestamp) {
  return `<details>
<summary><strong>${date}</strong> at <code>${timestamp}</code></summary>

> ${tip}

</details>

`;
}

// Function to append entry to daily-logs.md
async function appendToLog(tip) {
  try {
    const logsPath = path.join(__dirname, 'daily-logs.md');
    const date = getCurrentDate();
    const timestamp = getCurrentTimestamp();

    // Read existing content
    let content = '';
    if (fs.existsSync(logsPath)) {
      content = fs.readFileSync(logsPath, 'utf-8');
    }

    // Check if entry for today already exists (prevent duplicates)
    if (content.includes(`<summary><strong>${date}</strong>`)) {
      console.log(`Entry for ${date} already exists. Skipping duplicate.`);
      return;
    }

    // Format new entry
    const newEntry = formatEntry(tip, date, timestamp);

    // Append to content
    content = newEntry + content;

    // Write back to file
    fs.writeFileSync(logsPath, content, 'utf-8');
    console.log(`✓ Successfully appended tip for ${date} to daily-logs.md`);
  } catch (error) {
    console.error('Error writing to daily-logs.md:', error.message);
    process.exit(1);
  }
}

// Main function
async function main() {
  try {
    console.log('Starting GitHub daily automation...');
    const tip = await fetchTip();
    await appendToLog(tip);
    console.log('✓ Daily automation completed successfully');
  } catch (error) {
    console.error('Fatal error:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
