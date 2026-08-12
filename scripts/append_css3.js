const fs = require('fs');
let css = fs.readFileSync('components/exam/mocks/VsCodeMock.module.css', 'utf8');

css = css.replace(/\.vscodeEditor \{[\s\S]*?\}/, '.vscodeEditor { padding: 10px; background-color: #1e1e1e; flex: 1; position: relative; display: flex; }');

// add .vscodeTextArea and .successToast
css += `
.vscodeTextArea {
  flex: 1;
  background-color: transparent;
  color: #d4d4d4;
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 14px;
  border: none;
  outline: none;
  resize: none;
  line-height: 1.5;
}

.successToast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 122, 204, 0.9);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: bold;
  animation: popIn 0.3s ease-out;
  pointer-events: none;
}

@keyframes popIn {
  0% { transform: translate(-50%, -40%); opacity: 0; }
  100% { transform: translate(-50%, -50%); opacity: 1; }
}
`;

fs.writeFileSync('components/exam/mocks/VsCodeMock.module.css', css, 'utf8');
console.log('Fixed VsCodeMock CSS');
