const fs = require('fs');
const path = require('path');
const https = require('https');

const BALLS_DIR = path.join(__dirname, '../public/balls');

// Ensure directory exists
if (!fs.existsSync(BALLS_DIR)) {
  fs.mkdirSync(BALLS_DIR, { recursive: true });
}

// Ball ID to image URL mapping from https://ballpit.fandom.com/wiki/Balls
const ballImages = {
  // Base Balls (18)
  'bleed': 'https://static.wikia.nocookie.net/ballpit/images/a/a3/Bleed_Ball.png',
  'brood-mother': 'https://static.wikia.nocookie.net/ballpit/images/8/8d/Brood_Mother_Ball.png',
  'burn': 'https://static.wikia.nocookie.net/ballpit/images/6/65/Burn_Ball.png',
  'cell': 'https://static.wikia.nocookie.net/ballpit/images/d/d0/Cell_Ball.png',
  'charm': 'https://static.wikia.nocookie.net/ballpit/images/0/0b/Charm_Ball.png',
  'dark': 'https://static.wikia.nocookie.net/ballpit/images/6/63/Dark_Ball.png',
  'earthquake': 'https://static.wikia.nocookie.net/ballpit/images/9/92/Earthquake_Ball.png',
  'egg-sac': 'https://static.wikia.nocookie.net/ballpit/images/6/67/Egg_Sac_Ball.png',
  'freeze': 'https://static.wikia.nocookie.net/ballpit/images/c/c4/Freeze_Ball.png',
  'ghost': 'https://static.wikia.nocookie.net/ballpit/images/f/f8/Ghost_Ball.png',
  'iron': 'https://static.wikia.nocookie.net/ballpit/images/9/98/Iron_Ball.png',
  'laser-h': 'https://static.wikia.nocookie.net/ballpit/images/7/7f/Laser_%28Horizontal%29_Ball.png',
  'laser-v': 'https://static.wikia.nocookie.net/ballpit/images/c/c7/Laser_%28Vertical%29_Ball.png',
  'light': 'https://static.wikia.nocookie.net/ballpit/images/4/4a/Light_Ball.png',
  'lightning': 'https://static.wikia.nocookie.net/ballpit/images/4/41/Lightning_Ball.png',
  'poison': 'https://static.wikia.nocookie.net/ballpit/images/4/41/Poison_Ball.png',
  'vampire': 'https://static.wikia.nocookie.net/ballpit/images/f/f5/Vampire_Ball.png',
  'wind': 'https://static.wikia.nocookie.net/ballpit/images/7/77/Wind_Ball.png',

  // Evolved Balls (42)
  'assassin': 'https://static.wikia.nocookie.net/ballpit/images/b/bb/Assassin_Ball.png',
  'berserk': 'https://static.wikia.nocookie.net/ballpit/images/1/18/Berserk_Ball.png',
  'black-hole': 'https://static.wikia.nocookie.net/ballpit/images/8/84/Black_Hole_Ball.png',
  'blizzard': 'https://static.wikia.nocookie.net/ballpit/images/a/ae/Blizzard_Ball.png',
  'bomb': 'https://static.wikia.nocookie.net/ballpit/images/7/7e/Bomb_Ball.png',
  'flash': 'https://static.wikia.nocookie.net/ballpit/images/2/27/Flash_Ball.png',
  'flicker': 'https://static.wikia.nocookie.net/ballpit/images/9/96/Flicker_Ball.png',
  'freeze-ray': 'https://static.wikia.nocookie.net/ballpit/images/9/99/Freeze_Ray_Ball.png',
  'frozen-flame': 'https://static.wikia.nocookie.net/ballpit/images/2/2e/Frozen_Flame_Ball.png',
  'glacier': 'https://static.wikia.nocookie.net/ballpit/images/5/50/Glacier_Ball.png',
  'hemorrhage': 'https://static.wikia.nocookie.net/ballpit/images/0/0d/Hemorrhage_Ball.png',
  'holy-laser': 'https://static.wikia.nocookie.net/ballpit/images/1/14/Holy_Laser_Ball.png',
  'incubus': 'https://static.wikia.nocookie.net/ballpit/images/0/08/Incubus_Ball.png',
  'inferno': 'https://static.wikia.nocookie.net/ballpit/images/1/15/Inferno_Ball.png',
  'laser-beam': 'https://static.wikia.nocookie.net/ballpit/images/9/97/Laser_Beam_Ball.png',
  'leech': 'https://static.wikia.nocookie.net/ballpit/images/5/59/Leech_Ball.png',
  'lightning-rod': 'https://static.wikia.nocookie.net/ballpit/images/3/31/Lightning_Rod_Ball.png',
  'lovestruck': 'https://static.wikia.nocookie.net/ballpit/images/1/17/Lovestruck_Ball.png',
  'maggot': 'https://static.wikia.nocookie.net/ballpit/images/2/26/Maggot_Ball.png',
  'magma': 'https://static.wikia.nocookie.net/ballpit/images/f/f6/Magma_Ball.png',
  'mosquito-king': 'https://static.wikia.nocookie.net/ballpit/images/4/47/Mosquito_King_Ball.png',
  'mosquito-swarm': 'https://static.wikia.nocookie.net/ballpit/images/c/c4/Mosquito_Swarm_Ball.png',
  'noxious': 'https://static.wikia.nocookie.net/ballpit/images/8/8c/Noxious_Ball.png',
  'nuclear-bomb': 'https://static.wikia.nocookie.net/ballpit/images/8/85/Nuclear_Bomb_Ball.png',
  'overgrowth': 'https://static.wikia.nocookie.net/ballpit/images/6/6c/Overgrowth_Ball.png',
  'phantom': 'https://static.wikia.nocookie.net/ballpit/images/d/d3/Phantom_Ball.png',
  'radiation-beam': 'https://static.wikia.nocookie.net/ballpit/images/0/0a/Radiation_Beam_Ball.png',
  'sacrifice': 'https://static.wikia.nocookie.net/ballpit/images/4/47/Sacrifice_Ball.png',
  'sandstorm': 'https://static.wikia.nocookie.net/ballpit/images/9/96/Sandstorm_Ball.png',
  'satan': 'https://static.wikia.nocookie.net/ballpit/images/a/a2/Satan_Ball.png',
  'shotgun': 'https://static.wikia.nocookie.net/ballpit/images/d/dc/Shotgun_Ball.png',
  'soul-sucker': 'https://static.wikia.nocookie.net/ballpit/images/c/c6/Soul_Sucker_Ball.png',
  'spider-queen': 'https://static.wikia.nocookie.net/ballpit/images/6/69/Spider_Queen_Ball.png',
  'storm': 'https://static.wikia.nocookie.net/ballpit/images/4/48/Storm_Ball.png',
  'succubus': 'https://static.wikia.nocookie.net/ballpit/images/f/f0/Succubus_Ball.png',
  'sun': 'https://static.wikia.nocookie.net/ballpit/images/9/9c/Sun_Ball.png',
  'swamp': 'https://static.wikia.nocookie.net/ballpit/images/1/12/Swamp_Ball.png',
  'vampire-lord': 'https://static.wikia.nocookie.net/ballpit/images/1/11/Vampire_Lord_Ball.png',
  'virus': 'https://static.wikia.nocookie.net/ballpit/images/c/cd/Virus_Ball.png',
  'voluptuous-egg-sac': 'https://static.wikia.nocookie.net/ballpit/images/4/4f/Voluptuous_Egg_Sac_Ball.png',
  'wraith': 'https://static.wikia.nocookie.net/ballpit/images/1/11/Wraith_Ball.png',
  'nosferatu': 'https://static.wikia.nocookie.net/ballpit/images/d/d0/Nosferatu_Ball.png',
};

function downloadImage(url, ballId) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(BALLS_DIR, `${ballId}.png`);
    const file = fs.createWriteStream(filePath);

    // Follow redirects
    const request = (url) => {
      https.get(url, (response) => {
        if (response.statusCode === 301 || response.statusCode === 302) {
          // Follow redirect
          request(response.headers.location);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✓ Downloaded: ${ballId}.png`);
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

async function downloadAll() {
  console.log('Downloading ball images...\n');
  let successCount = 0;
  let failCount = 0;

  for (const [ballId, url] of Object.entries(ballImages)) {
    try {
      await downloadImage(url, ballId);
      successCount++;
    } catch (err) {
      console.error(`✗ Failed: ${ballId}.png - ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Success: ${successCount} | Failed: ${failCount}`);
}

downloadAll();
