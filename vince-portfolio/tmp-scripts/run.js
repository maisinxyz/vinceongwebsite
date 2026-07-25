const puppeteer = require('puppeteer');
const fs = require('fs');
const pdf = require('pdf-parse');

(async () => {
  console.log("Taking screenshot...");
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://github.com/maisinxyz/CyberBug2077', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: '/Users/vincee_ong/Desktop/Repos/vinceongwebsite/vince-portfolio/public/cyberbug.png' });
  await browser.close();
  console.log('Screenshot saved to public/cyberbug.png');

  console.log("Parsing PDF...");
  const dataBuffer = fs.readFileSync('/Users/vincee_ong/Desktop/Repos/vinceongwebsite/Vince_Ong_Tech_Resume copy.pdf');
  const data = await pdf(dataBuffer);
  const text = data.text;
  const match = text.match(/Algorithmic Web Runner[\s\S]{0,500}/i);
  console.log('--- RESUME TEXT ---');
  console.log(match ? match[0] : 'Not found');
})();
