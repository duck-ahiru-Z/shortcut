const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/iwaku/pro/shortcut2/components/exam/mocks';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx') && f !== 'LegacyGimmicks.tsx');

files.forEach(f => {
  const p = path.join(dir, f);
  let content = fs.readFileSync(p, 'utf8');
  if (!content.includes('isSuccess?: boolean')) {
    content = content.replace(/type Props = \{/, 'type Props = {\n  isSuccess?: boolean;');
    
    const fnMatch = content.match(/export default function \w+\(\{([^\}]+)\}\s*\:\s*Props\)\s*\{/);
    if (fnMatch) {
       let params = fnMatch[1];
       if (!params.includes('isSuccess')) {
           content = content.replace(fnMatch[0], fnMatch[0].replace(params, params + ', isSuccess'));
       }
    }
    
    fs.writeFileSync(p, content);
  }
});
console.log('Added isSuccess to props');
