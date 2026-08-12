const fs = require('fs');
const path = require('path');
const dir = 'C:/Users/iwaku/pro/shortcut2/components/exam/mocks';
const cssContent = fs.readFileSync(path.join(dir, 'Mocks.module.css'), 'utf8');

const blocks = cssContent.split(/(?=\/\* .* \*\/)/);
const sharedCSS = [];
const macCSS = [];

const fileMap = {};

blocks.forEach(block => {
  const match = block.match(/\/\* (.*) \*\//);
  if (!match) return;
  const name = match[1].trim();
  
  if (name === 'Shared') {
    sharedCSS.push(block);
  } else if (name === 'Mac Buttons Helper') {
    macCSS.push(block);
  } else {
    fileMap[name] = block;
  }
});

Object.keys(fileMap).forEach(name => {
  const tsxPath = path.join(dir, name + '.tsx');
  if (fs.existsSync(tsxPath)) {
    let css = fileMap[name];
    if (name === 'ExcelMock') {
      css = sharedCSS.join('\n') + '\n' + css;
    }
    if (['VsCodeMock', 'PowerpointMock', 'SlackMock'].includes(name)) {
      css = macCSS.join('\n') + '\n' + css;
    }
    fs.writeFileSync(path.join(dir, name + '.module.css'), css.trim() + '\n');
    
    let tsx = fs.readFileSync(tsxPath, 'utf8');
    tsx = tsx.replace(/import styles from "\.\/Mocks\.module\.css";/g, `import styles from "./${name}.module.css";`);
    fs.writeFileSync(tsxPath, tsx);
    console.log('Processed', name);
  }
});
