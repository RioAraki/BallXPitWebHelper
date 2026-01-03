const https = require('https');
const fs = require('fs');
const path = require('path');

// Passive image URLs from the Ball X Pit Wiki
const passiveImages = {
  // Base Passives
  'archers-effigy': 'https://static.wikia.nocookie.net/ballpit/images/9/9f/Archers_Effigy.png',
  'artificial-heart': 'https://static.wikia.nocookie.net/ballpit/images/f/f0/Artificial_Heart.png',
  'baby-rattle': 'https://static.wikia.nocookie.net/ballpit/images/e/ed/Baby_Rattle.png',
  'bandage-roll': 'https://static.wikia.nocookie.net/ballpit/images/b/b9/Bandage_Roll.png',
  'bottled-tornado': 'https://static.wikia.nocookie.net/ballpit/images/2/2b/Bottled_Tornado.png',
  'breastplate': 'https://static.wikia.nocookie.net/ballpit/images/2/2b/Breastplate.png',
  'crown-of-thorns': 'https://static.wikia.nocookie.net/ballpit/images/1/19/Crown_Of_Thorns.png',
  'cursed-elixir': 'https://static.wikia.nocookie.net/ballpit/images/0/01/Cursed_Elixir.png',
  'deadeyes-amulet': 'https://static.wikia.nocookie.net/ballpit/images/f/f8/Deadeyes_Amulet.png',
  'diamond-hilted-dagger': 'https://static.wikia.nocookie.net/ballpit/images/d/d6/Diamond_Hilted_Dagger.png',
  'dynamite': 'https://static.wikia.nocookie.net/ballpit/images/f/fc/Dynamite.png',
  'emerald-hilted-dagger': 'https://static.wikia.nocookie.net/ballpit/images/5/51/Emerald_Hilted_Dagger.png',
  'ethereal-cloak': 'https://static.wikia.nocookie.net/ballpit/images/7/73/Ethereal_Cloak.png',
  'everflowing-goblet': 'https://static.wikia.nocookie.net/ballpit/images/7/7a/Everflowing_Goblet.png',
  'eye-of-the-beholder': 'https://static.wikia.nocookie.net/ballpit/images/c/cc/Eye_Of_The_Beholder.png',
  'fleet-feet': 'https://static.wikia.nocookie.net/ballpit/images/f/f3/Fleet_Feet.png',
  'frozen-spike': 'https://static.wikia.nocookie.net/ballpit/images/a/af/Frozen_Spike.png',
  'gemspring': 'https://static.wikia.nocookie.net/ballpit/images/0/09/Gemspring.png',
  'ghostly-corset': 'https://static.wikia.nocookie.net/ballpit/images/f/fb/Ghostly_Corset.png',
  'ghostly-shield': 'https://static.wikia.nocookie.net/ballpit/images/7/72/Ghostly_Shield.png',
  'golden-bull': 'https://static.wikia.nocookie.net/ballpit/images/8/83/Golden_Bull.png',
  'hand-fan': 'https://static.wikia.nocookie.net/ballpit/images/7/7f/Hand_Fan.png',
  'hand-mirror': 'https://static.wikia.nocookie.net/ballpit/images/3/34/Hand_Mirror.png',
  'healers-effigy': 'https://static.wikia.nocookie.net/ballpit/images/1/17/Healers_Effigy.png',
  'hourglass': 'https://static.wikia.nocookie.net/ballpit/images/1/11/Hourglass.png',
  'kiss-of-death': 'https://static.wikia.nocookie.net/ballpit/images/1/18/Kiss_Of_Death.png',
  'lovers-quiver': 'https://static.wikia.nocookie.net/ballpit/images/b/b2/Lovers_Quiver.png',
  'magic-staff': 'https://static.wikia.nocookie.net/ballpit/images/f/f9/Magic_Staff.png',
  'magnet': 'https://static.wikia.nocookie.net/ballpit/images/8/8c/Magnet.png',
  'midnight-oil': 'https://static.wikia.nocookie.net/ballpit/images/0/04/Midnight_Oil.png',
  'pressure-valve': 'https://static.wikia.nocookie.net/ballpit/images/c/c9/Pressure_Valve.png',
  'protective-charm': 'https://static.wikia.nocookie.net/ballpit/images/1/19/Protective_Charm.png',
  'radiant-feather': 'https://static.wikia.nocookie.net/ballpit/images/b/ba/Radiant_Feather.png',
  'reachers-spear': 'https://static.wikia.nocookie.net/ballpit/images/c/c2/Reachers_Spear.png',
  'rubber-headband': 'https://static.wikia.nocookie.net/ballpit/images/3/38/Rubber_Headband.png',
  'ruby-hilted-dagger': 'https://static.wikia.nocookie.net/ballpit/images/5/50/Ruby_Hilted_Dagger.png',
  'sapphire-hilted-dagger': 'https://static.wikia.nocookie.net/ballpit/images/7/70/Sapphire_Hilted_Dagger.png',
  'shortbow': 'https://static.wikia.nocookie.net/ballpit/images/f/f9/Shortbow.png',
  'silver-blindfold': 'https://static.wikia.nocookie.net/ballpit/images/0/09/Silver_Blindfold.png',
  'silver-bullet': 'https://static.wikia.nocookie.net/ballpit/images/0/0f/Silver_Bullet.png',
  'slingshot': 'https://static.wikia.nocookie.net/ballpit/images/3/3f/Slingshot.png',
  'spiked-collar': 'https://static.wikia.nocookie.net/ballpit/images/1/1d/Spiked_Collar.png',
  'stone-effigy': 'https://static.wikia.nocookie.net/ballpit/images/f/f3/Stone_Effigy.png',
  'traitors-cowl': 'https://static.wikia.nocookie.net/ballpit/images/1/14/Traitors_Cowl.png',
  'turret': 'https://static.wikia.nocookie.net/ballpit/images/3/32/Turret.png',
  'upturned-hatchet': 'https://static.wikia.nocookie.net/ballpit/images/4/43/Upturned_Hatchet.png',
  'vampiric-sword': 'https://static.wikia.nocookie.net/ballpit/images/8/87/Vampiric_Sword.png',
  'voodoo-doll': 'https://static.wikia.nocookie.net/ballpit/images/f/fd/Voodoo_Doll.png',
  'wagon-wheel': 'https://static.wikia.nocookie.net/ballpit/images/f/fa/Wagon_Wheel.png',
  'war-horn': 'https://static.wikia.nocookie.net/ballpit/images/9/9c/War_Horn.png',
  'wretched-onion': 'https://static.wikia.nocookie.net/ballpit/images/f/f2/Wretched_Onion.png',
  // Evolved Passives
  'cornucopia': 'https://static.wikia.nocookie.net/ballpit/images/b/be/Cornucopia.png',
  'gracious-impaler': 'https://static.wikia.nocookie.net/ballpit/images/a/ae/Gracious_Impaler.png',
  'odiferous-shell': 'https://static.wikia.nocookie.net/ballpit/images/5/53/Odiferous_Shell.png',
  'phantom-regalia': 'https://static.wikia.nocookie.net/ballpit/images/d/da/Phantom_Regalia.png',
  'soul-reaver': 'https://static.wikia.nocookie.net/ballpit/images/9/9b/Soul_Reaver.png',
  'tormenters-mask': 'https://static.wikia.nocookie.net/ballpit/images/2/2c/Tormenters_Mask.png',
  'wings-of-the-anointed': 'https://static.wikia.nocookie.net/ballpit/images/f/f8/Wings_Of_The_Anointed.png',
  'deadeyes-cross': 'https://static.wikia.nocookie.net/ballpit/images/5/51/Deadeyes_Cross.png'
};

const outputDir = path.join(__dirname, '..', 'public', 'passives');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`Skipping ${filename} (already exists)`);
      resolve();
      return;
    }

    const file = fs.createWriteStream(filePath);
    
    const request = https.get(url, (response) => {
      // Follow redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        console.log(`Redirecting ${filename} to ${redirectUrl}`);
        https.get(redirectUrl, (redirectResponse) => {
          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`Downloaded: ${filename}`);
            resolve();
          });
        }).on('error', (err) => {
          fs.unlink(filePath, () => {});
          reject(err);
        });
        return;
      }

      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${filename}`);
        resolve();
      });
    });

    request.on('error', (err) => {
      fs.unlink(filePath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Starting passive image downloads...');
  console.log(`Output directory: ${outputDir}`);
  
  const entries = Object.entries(passiveImages);
  let successCount = 0;
  let failCount = 0;

  for (const [id, url] of entries) {
    try {
      await downloadImage(url, `${id}.png`);
      successCount++;
      // Add small delay to be nice to the server
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`Failed to download ${id}: ${err.message}`);
      failCount++;
    }
  }

  console.log(`\nDownload complete!`);
  console.log(`Success: ${successCount}, Failed: ${failCount}`);
}

downloadAll();
