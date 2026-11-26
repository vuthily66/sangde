const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage();
const names=['broccoli','beet','kohlrabi'];
for (const n of names) { await p.setContent(`<body style="margin:0;background:transparent">${fs.readFileSync(n+'.svg','utf8').replace('width="400" height="400"','width="480" height="480"')}</body>`); await p.locator('svg').screenshot({ path: n+'.png', omitBackground: true });
  const src='data:image/png;base64,'+fs.readFileSync(n+'.png').toString('base64');
  const url = await p.evaluate(async (s)=>{const i=new Image(); i.src=s; await i.decode(); const c=document.createElement('canvas'); c.width=i.width;c.height=i.height; c.getContext('2d').drawImage(i,0,0); return c.toDataURL('image/webp',0.86);}, src);
  fs.writeFileSync(`../src/assets/${n}.webp`, Buffer.from(url.split(',')[1],'base64')); }
await p.setContent(`<body style="margin:0;background:#F5F5F4;display:flex;gap:10px">${[...names,'cabbage'].map(n=>`<img src="data:image/${n==='cabbage'?'png':'png'};base64,${fs.readFileSync(n+'.png').toString('base64')}" width=300 height=300 style="flex:none;background:#fff">`).join('')}</body>`);
await p.setViewportSize({width:1260,height:320}); await p.screenshot({path:'preview2.png'}); await b.close(); })();
