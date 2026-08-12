const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/iwaku/pro/shortcut2/components/exam/mocks';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && !['ExcelMock.tsx', 'WordMock.tsx', 'VsCodeMock.tsx', 'LegacyGimmicks.tsx'].includes(f));

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  
  const regex = /export default function (\w+)\(\{\s*os\s*=\s*"windows"\s*\}\s*:\s*\{\s*os\?\:\s*"windows"\s*\|\s*"mac"\s*\}\)\s*\{/;
  if (regex.test(content)) {
    content = content.replace(regex, 'type Props = { os?: "windows" | "mac"; isSuccess?: boolean; };\nexport default function $1({ os = "windows", isSuccess }: Props) {');
    fs.writeFileSync(p, content);
  }
});
console.log('Fixed inline props');
