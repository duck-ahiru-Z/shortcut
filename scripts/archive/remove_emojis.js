const fs = require('fs');
const path = require('path');

// --- app/page.tsx ---
const pagePath = path.join(process.cwd(), 'app', 'page.tsx');
let pageContent = fs.readFileSync(pagePath, 'utf8');

// Replace feature 1 emoji
pageContent = pageContent.replace(
  '<div style={{ fontSize: \'48px\', marginBottom: \'16px\' }}>🖱️🚫</div>',
  \`<div style={{ marginBottom: '16px', color: '#00a4ef' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
                <path d="M6 8h.001"></path><path d="M10 8h.001"></path><path d="M14 8h.001"></path><path d="M18 8h.001"></path>
                <path d="M8 12h.001"></path><path d="M12 12h.001"></path><path d="M16 12h.001"></path>
                <path d="M7 16h10"></path>
              </svg>
            </div>\`
);

// Replace feature 2 emoji
pageContent = pageContent.replace(
  '<div style={{ fontSize: \'48px\', marginBottom: \'16px\' }}>📖✨</div>',
  \`<div style={{ marginBottom: '16px', color: '#8a2be2' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>\`
);

// Replace feature 3 emoji
pageContent = pageContent.replace(
  '<div style={{ fontSize: \'48px\', marginBottom: \'16px\' }}>⚡️💻</div>',
  \`<div style={{ marginBottom: '16px', color: '#27c93f' }}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
            </div>\`
);

fs.writeFileSync(pagePath, pageContent, 'utf8');


// --- app/exams/page.tsx ---
const examsPath = path.join(process.cwd(), 'app', 'exams', 'page.tsx');
let examsContent = fs.readFileSync(examsPath, 'utf8');

examsContent = examsContent.replace(
  '<div style={{ fontSize: \'40px\' }}>🪟</div>',
  \`<div style={{ marginBottom: '8px', color: '#00a4ef' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.951-1.801"/>
                  </svg>
                </div>\`
);

examsContent = examsContent.replace(
  '<div style={{ fontSize: \'40px\' }}>🍎</div>',
  \`<div style={{ marginBottom: '8px', color: 'var(--text-color)' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"></path>
                  </svg>
                </div>\`
);

fs.writeFileSync(examsPath, examsContent, 'utf8');
console.log('Successfully replaced emojis with SVGs.');
