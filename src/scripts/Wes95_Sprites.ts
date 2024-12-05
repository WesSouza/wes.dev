import { readdir, writeFile } from 'fs/promises';
import { resolve } from 'path';
import Spritesmith from 'spritesmith';
import { SRC_PATH, WES95_SYSTEM_PATH } from '../config';

const imagesPath = resolve(SRC_PATH, '../public' + WES95_SYSTEM_PATH);
const cssPath = resolve(SRC_PATH, './styles/Wes95/Icons.generated.css');

const images = (await readdir(imagesPath))
  .filter(
    (item) =>
      item.endsWith('.png') &&
      !item.endsWith('Huge.png') &&
      item !== 'shell32.png',
  )
  .map((item) => imagesPath + '/' + item);

Spritesmith.run({ src: images }, function handleResult(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  writeFile(imagesPath + '/shell32.png', result.image).catch(console.error);

  const css = Object.entries(result.coordinates)
    .map(([file, rect]) => {
      const name = file.substring(
        file.lastIndexOf('/') + 1,
        file.lastIndexOf('.'),
      );
      return `.Icon_${name} { background-position: -${rect.x}px -${rect.y}px; width: ${rect.width}px; height: ${rect.height}px }`;
    })
    .join('\n\n');

  writeFile(cssPath, css, 'utf-8').catch(console.error);
});
