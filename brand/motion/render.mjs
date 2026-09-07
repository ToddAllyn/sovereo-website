// Render source-convergence.html to a PNG sequence, then to ProRes 4444 for Final Cut.
//
//   npm i playwright && npx playwright install chromium
//   node render.mjs                       # 3840x2160, 30 fps, 6.0 s  ->  ./frames
//   node render.mjs --w 1920 --fps 24     # smaller, cheaper
//   node render.mjs --dur 4000            # intro cut only
//
// Then, with a full ffmpeg build (brew install ffmpeg):
//   ffmpeg -framerate 30 -i frames/f%04d.png -c:v prores_ks -profile:v 4444 \
//          -pix_fmt yuva444p10le source-convergence.mov
//
// Drop the .mov on the timeline at 0:05. The background is house ink, so it needs
// no key. To composite it over other footage instead, set the #stage background to
// transparent in the HTML and pass omitBackground below.

import { chromium } from 'playwright';
import { mkdir } from 'fs/promises';
import { pathToFileURL } from 'url';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const here = dirname(fileURLToPath(import.meta.url));
const arg = (k, d) => {
  const i = process.argv.indexOf(`--${k}`);
  return i === -1 ? d : Number(process.argv[i + 1]);
};

const W = arg('w', 3840), FPS = arg('fps', 30), DUR = arg('dur', 6000);
const H = Math.round(W * 9 / 16);
const out = join(here, 'frames');
const page_url = pathToFileURL(join(here, 'source-convergence.html')).href;
const total = Math.round(DUR / 1000 * FPS);

await mkdir(out, { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });

for (let i = 0; i < total; i++) {
  const t = Math.round(i / FPS * 1000);
  await page.goto(`${page_url}?t=${t}`);
  await page.waitForFunction(() => window.__frameReady === true);
  await page.screenshot({ path: join(out, `f${String(i).padStart(4, '0')}.png`) });
  if (i % 15 === 0) process.stdout.write(`\r${i + 1}/${total}`);
}
await browser.close();
console.log(`\n${total} frames at ${W}x${H} in ${out}`);
