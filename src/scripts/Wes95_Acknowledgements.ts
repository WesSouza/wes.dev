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
      const licenses = [preamble];

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
