const fs = require('fs');
const cssPath = 'C:/Users/iwaku/pro/shortcut2/components/exam/mocks/Mocks.module.css';
let css = fs.readFileSync(cssPath, 'utf8');

const newCss = `
/* Mac Buttons Helper */
.macButtons {
  display: flex;
  gap: 8px;
  padding-right: 12px;
}

/* VsCodeMock */
.vscodeContainer {
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  margin: 20px auto 0;
  background-color: #1e1e1e;
  color: #cccccc;
  font-family: Consolas, monospace;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  text-align: left;
}
.vscodeHeader {
  background-color: #333333;
  display: flex;
  padding: 8px 12px;
  align-items: center;
  border-bottom: 1px solid #111;
}
.vscodeTitle {
  flex: 1;
  text-align: center;
  font-size: 12px;
  color: #cccccc;
}
.vscodeBody {
  display: flex;
  height: 200px;
}
.vscodeSidebar {
  width: 120px;
  background-color: #252526;
  border-right: 1px solid #333;
  padding: 8px;
  font-size: 12px;
}
.vscodeFile {
  margin-bottom: 4px;
  cursor: pointer;
}
.vscodeEditor {
  flex: 1;
  padding: 12px;
  background-color: #1e1e1e;
  font-size: 14px;
  line-height: 1.5;
}
.vscodeLine {
  display: flex;
}
.vscodeLineNum {
  width: 24px;
  color: #858585;
  text-align: right;
  margin-right: 16px;
  user-select: none;
}
.vscodeKeyword { color: #569cd6; }
.vscodeVar { color: #9cdcfe; }
.vscodeString { color: #ce9178; }
.vscodeFunc { color: #dcdcaa; }
.vscodeComment { color: #6a9955; font-style: italic; }
.vscodeStatusBar {
  background-color: #007acc;
  color: white;
  display: flex;
  justify-content: space-between;
  padding: 2px 12px;
  font-size: 10px;
}

/* PowerpointMock */
.pptContainer {
  border: 1px solid #b7472a;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  margin: 20px auto 0;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: left;
}
.pptHeader {
  background-color: #c43e1c;
  color: white;
  display: flex;
  padding: 8px 12px;
  align-items: center;
}
.pptTitle {
  flex: 1;
  text-align: center;
  font-size: 12px;
}
.pptRibbon {
  background-color: #f3f2f1;
  border-bottom: 1px solid #e1dfdd;
  padding: 8px 12px;
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #323130;
}
.pptBody {
  display: flex;
  height: 200px;
  background-color: #e1dfdd;
}
.pptSidebar {
  width: 100px;
  background-color: #f3f2f1;
  border-right: 1px solid #d2d0ce;
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.pptSlideThumb {
  height: 50px;
  background-color: white;
  border: 1px solid #c8c6c4;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #a19f9d;
}
.pptSlideThumbActive {
  height: 50px;
  background-color: white;
  border: 2px solid #c43e1c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #a19f9d;
}
.pptMain {
  flex: 1;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.pptSlide {
  width: 100%;
  height: 100%;
  background-color: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}
.pptSlide h2 {
  font-size: 18px;
  margin: 0 0 16px 0;
  color: #323130;
  text-align: center;
}
.pptContentBox {
  flex: 1;
  border: 1px dashed #a19f9d;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #605e5c;
  font-size: 14px;
}

/* SlackMock */
.slackContainer {
  border: 1px solid #4a154b;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 600px;
  margin: 20px auto 0;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: left;
}
.slackHeader {
  background-color: #350d36;
  color: white;
  display: flex;
  padding: 8px 12px;
  align-items: center;
}
.slackSearch {
  flex: 1;
  margin: 0 40px;
  background-color: rgba(255,255,255,0.2);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 12px;
  text-align: center;
}
.slackBody {
  display: flex;
  height: 220px;
}
.slackSidebar {
  width: 140px;
  background-color: #3f0e40;
  color: #cfc3cf;
  padding: 12px 0;
  font-size: 13px;
}
.slackChannel {
  padding: 4px 16px;
  cursor: pointer;
}
.slackChannelActive {
  padding: 4px 16px;
  background-color: #1164a3;
  color: white;
  font-weight: bold;
}
.slackMain {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: white;
}
.slackMessages {
  flex: 1;
  padding: 16px;
  overflow: hidden;
}
.slackMessage {
  margin-bottom: 16px;
}
.slackMessage strong {
  color: #1d1c1d;
  font-size: 14px;
}
.slackTime {
  color: #616061;
  font-size: 11px;
  margin-left: 8px;
}
.slackMessage p {
  margin: 4px 0 0 0;
  color: #1d1c1d;
  font-size: 14px;
}
.slackInputBox {
  margin: 0 16px 16px 16px;
  border: 1px solid #868686;
  border-radius: 4px;
  padding: 8px 12px;
  color: #616061;
  font-size: 13px;
}
`;

fs.writeFileSync(cssPath, css + '\n' + newCss);
