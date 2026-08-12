const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/iwaku/pro/shortcut2/components/exam/mocks';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !['ExcelMock.tsx', 'WordMock.tsx', 'VsCodeMock.tsx', 'LegacyGimmicks.tsx'].includes(f));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  if (!content.includes('successToast')) {
    // Inject right before the very last </div>
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      content = content.slice(0, lastDivIndex) + '\n        {isSuccess && <div className={styles.successToast}>実行しました！</div>}\n      ' + content.slice(lastDivIndex);
      fs.writeFileSync(p, content);
    }
  }
  
  const cssP = p.replace('.tsx', '.module.css');
  if (fs.existsSync(cssP)) {
    let css = fs.readFileSync(cssP, 'utf8');
    if (!css.includes('successToast')) {
      css += `
.successToast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 140, 0, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  animation: popIn 0.3s ease-out;
  pointer-events: none;
  z-index: 100;
}
@keyframes popIn {
  0% { transform: translate(-50%, -40%); opacity: 0; }
  100% { transform: translate(-50%, -50%); opacity: 1; }
}
`;
      // ensure the root container has position: relative
      // most of them have .somethingContainer as the first block
      const rootMatch = css.match(/\.(\w+Container) \{/);
      if (rootMatch && !css.includes('position: relative')) {
        css = css.replace(rootMatch[0], rootMatch[0] + '\n  position: relative;');
      }
      fs.writeFileSync(cssP, css);
    }
  }
});
console.log('Updated remaining mocks');
