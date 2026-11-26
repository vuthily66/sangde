const { chromium } = require('playwright'); const fs=require('fs');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ deviceScaleFactor: 1 });
for (const n of ['tangerine','cabbage']) { await p.setContent(`<body style="margin:0;background:transparent">${fs.readFileSync(n+'.svg','utf8').replace('width="400" height="400"','width="480" height="480"')}</body>`); await p.locator('svg').screenshot({ path: n+'.png', omitBackground: true }); }
await p.setContent(`<body style="margin:0;background:#FFEDD5;display:flex">${['tangerine','cabbage'].map(n=>`<img src="data:image/png;base64,${fs.readFileSync(n+'.png').toString('base64')}" width=360 height=360 style="flex:none">`).join('')}</body>`); await p.screenshot({path:'preview.png'}); await b.close(); })();
