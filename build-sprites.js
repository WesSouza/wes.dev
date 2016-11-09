const fs = require('fs');
const Spritesmith = require('spritesmith');

const sprites = [
  'logo-bookingcom',
  'logo-html5',
  'logo-javascript',
  'logo-mtv',
  'logo-nodejs',
  'logo-scup',
  'logo-univision',
  'logo-wesley',
  'logo-workandco',
];

const spriteMap = {};
sprites.forEach((sprite) => {
  spriteMap[`src/images/sprites/${sprite}.png`] = sprite.replace(/[^a-z0-9-]+/gi, '-');
});

Spritesmith.run({ src: Object.keys(spriteMap) }, (err, result) => {
  if (err) {
    throw err;
  }

  fs.writeFile('src/images/sprite.png', result.image);

  const sassWrite = (err, fd) => {
    Object.keys(result.coordinates).forEach((path) => {
      const sprite = result.coordinates[path];
      const spriteName = spriteMap[path];
      fs.write(fd, `$sprite-${spriteName}-x: ${sprite.x / 2}px;
$sprite-${spriteName}-y: ${sprite.y / 2}px;
$sprite-${spriteName}-offset-x: -${sprite.x / 2}px;
$sprite-${spriteName}-offset-y: -${sprite.y / 2}px;
$sprite-${spriteName}-width: ${sprite.width / 2}px;
$sprite-${spriteName}-height: ${sprite.height / 2}px;
$sprite-${spriteName}-total-width: ${result.properties.width / 2}px;
$sprite-${spriteName}-total-height: ${result.properties.height / 2}px;
$sprite-${spriteName}-image: '/images/sprite.png';
$sprite-${spriteName}: ${sprite.x / 2}px ${sprite.y / 2}px -${sprite.x / 2}px -${sprite.y / 2}px ${sprite.width / 2}px ${sprite.height / 2}px ${result.properties.width / 2}px ${result.properties.height / 2}px '/images/sprite.png';
`);
    });
  }

  const sassFile = fs.open('src/styles/_sprite.scss', 'w', sassWrite);
});
