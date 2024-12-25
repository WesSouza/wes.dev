import checker from 'license-checker';
import { fileURLToPath } from 'node:url';
import { readFile, writeFile } from 'node:fs/promises';

const root = fileURLToPath(new URL('../..', import.meta.url));
const output = fileURLToPath(
  new URL('../../public/acknowledgements.txt', import.meta.url),
);

const preamble = [
  'Acknowledgements',
  '',
  'Portions of this software may utilize the following copyrighted material, the use of which is hereby acknowledged.',
  '',
  new Date().toUTCString(),
].join('\n');

const perfectDos = [
  'Perfect DOS VGA 437 by Zeh Fernando',
  '',
  ' This is a free font/file, distribute as you wish to who you wish. You are free',
  ' to use it on a movie, a videogame, a video, a broadcast, without having to ask',
  ' my permission.',
  '',
  ' Please do not send me emails asking me to sign release forms if it require',
  " any sort of scanning or digital compositing. It's a big chore. This license",
  ' file and a simple confirmation email should suffice as proof that you are',
  ' allowed to use it.',
  '',
  " Of course I don't mind emails letting me know where something has been used.",
  ' Those are always gratifying!',
  '',
  " Do NOT sell this font. It's not yours and you can't make money of it.",
].join('\n');

checker.init(
  {
    start: root,
  },
  (err, packages) => {
    if (err) {
      console.error(err);
      return;
    }

    (async () => {
      const licenses = [preamble, perfectDos];

      for (const pkg of Object.values(packages)) {
        if (!pkg.licenseFile) {
          continue;
        }

        const licenseContent = await readFile(pkg.licenseFile, 'utf-8');
        licenses.push(licenseContent.trim());
      }

      const acknowledgements = licenses.join('\n\n\n---\n\n\n');
      await writeFile(output, acknowledgements, 'utf-8');
    })().catch(console.error);
  },
);
