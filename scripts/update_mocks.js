const fs = require('fs');
const path = require('path');

const mocksDir = path.join(process.cwd(), 'components', 'exam', 'mocks');

const macControls = `
        {os === "mac" ? (
          <div style={{ display: 'flex', gap: '6px', marginRight: '12px' }}>
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
          </div>
        ) : null}`;

function updateExplorer() {
  const file = path.join(mocksDir, 'ExplorerMock.tsx');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('export default function ExplorerMock() {', 'export default function ExplorerMock({ os = "windows" }: { os?: "windows" | "mac" }) {');
  content = content.replace('<div className={styles.explorerHeader}>', \`<div className={styles.explorerHeader}>\${macControls}\`);
  content = content.replace('<span className={styles.explorerTitle}>PC &gt; ドキュメント</span>', '<span className={styles.explorerTitle}>{os === "mac" ? "Finder" : "PC > ドキュメント"}</span>');
  fs.writeFileSync(file, content);
}

function updateExcel() {
  const file = path.join(mocksDir, 'ExcelMock.tsx');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('export default function ExcelMock() {', 'export default function ExcelMock({ os = "windows" }: { os?: "windows" | "mac" }) {');
  content = content.replace('<div className={styles.excelHeader}>', \`<div className={styles.excelHeader}>\${macControls}\`);
  content = content.replace('スプレッドシート', '{os === "mac" ? "Numbers / Excel" : "スプレッドシート"}');
  fs.writeFileSync(file, content);
}

function updateWord() {
  const file = path.join(mocksDir, 'WordMock.tsx');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('export default function WordMock() {', 'export default function WordMock({ os = "windows" }: { os?: "windows" | "mac" }) {');
  content = content.replace('<div className={styles.wordHeader}>', \`<div className={styles.wordHeader}>\${macControls}\`);
  content = content.replace('文書 - ワープロ', '{os === "mac" ? "Pages / Word" : "文書 - ワープロ"}');
  fs.writeFileSync(file, content);
}

function updateWindows() {
  const file = path.join(mocksDir, 'WindowsMock.tsx');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('export default function WindowsMock() {', 'export default function WindowsMock({ os = "windows" }: { os?: "windows" | "mac" }) {');
  content = content.replace('<div className={styles.windowsContainer}>', \`<div className={styles.windowsContainer}>\${macControls.replace('marginRight: \\'12px\\'', 'margin: \\'8px\\'')}\`);
  fs.writeFileSync(file, content);
}

function updateBrowser() {
  const file = path.join(mocksDir, 'BrowserMock.tsx');
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace('export default function BrowserMock() {', 'export default function BrowserMock({ os = "windows" }: { os?: "windows" | "mac" }) {');
  // Browser already has dots, we conditionally render windows controls vs mac controls
  const newHeader = \`
      <div className={styles.browserHeader}>
        {os === "mac" ? (
          <>
            <div className={styles.browserDotRed}></div>
            <div className={styles.browserDotYellow}></div>
            <div className={styles.browserDotGreen}></div>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '4px', paddingRight: '8px' }}>
             {/* Windows style fake buttons */}
          </div>
        )}
        <div className={styles.browserAddress}>
          https://example.com
        </div>
      </div>\`;
  content = content.replace(/<div className=\{styles\.browserHeader\}>[\s\S]*?<\/div>\s*<\/div>\s*<div className=\{styles\.browserBody\}>/, newHeader + '\\n      <div className={styles.browserBody}>');
  fs.writeFileSync(file, content);
}

updateExplorer();
updateExcel();
updateWord();
updateWindows();
updateBrowser();
console.log('Updated Mock components!');
