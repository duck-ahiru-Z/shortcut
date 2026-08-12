const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
env.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) process.env[match[1].trim()] = match[2].trim().replace(/['"]/g, '');
});
require('child_process').execSync('node scripts/seed_all_grades.mjs', {stdio:'inherit', env: process.env});
