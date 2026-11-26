const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
for (const n of ['tangerine','cabbage']) {
  const src='data:image/png;base64,'+fs.readFileSync(n+'.png').toString('base64');
  const url = await p.evaluate(async (s)=>{const i=new Image(); i.src=s; await i.decode(); const c=document.createElement('canvas'); c.width=i.width;c.height=i.height; c.getContext('2d').drawImage(i,0,0); return c.toDataURL('image/webp',0.86);}, src);
  fs.writeFileSync(`../src/assets/${n}.webp`, Buffer.from(url.split(',')[1],'base64'));
} await b.close(); })();
