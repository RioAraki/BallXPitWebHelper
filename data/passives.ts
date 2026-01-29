import { Passive, PassiveType } from '@/types/passive';

// Helper function to get passive image URL
// For GitHub Pages deployment, we need to include the base path
function getPassiveImageUrl(passiveId: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/BallXPitWebHelper' : '';
  return `${basePath}/passives/${passiveId}.png`;
}

// Base passives that CAN evolve (ingredients for evolved passives) - listed first
export const evolvableBasePassives: Passive[] = [
  // Cornucopia ingredients
  {
    id: 'baby-rattle',
    name: 'Baby Rattle',
    type: PassiveType.BASE,
    description: 'Gain 1.5x baby balls, but your aim becomes scattered',
    imageUrl: getPassiveImageUrl('baby-rattle')
  },
  {
    id: 'war-horn',
    name: 'War Horn',
    type: PassiveType.BASE,
    description: 'All baby balls deal 20% more damage',
    imageUrl: getPassiveImageUrl('war-horn')
  },
  // Gracious Impaler ingredients
  {
    id: 'reachers-spear',
    name: "Reacher's Spear",
    type: PassiveType.BASE,
    description: 'Increase crit chance to 20% when hitting enemies in the same column as you',
    imageUrl: getPassiveImageUrl('reachers-spear')
  },
  {
    id: 'deadeyes-amulet',
    name: "Deadeye's Amulet",
    type: PassiveType.BASE,
    description: 'Critical hits deal 10-15 bonus damage',
    imageUrl: getPassiveImageUrl('deadeyes-amulet')
  },
  // Odiferous Shell ingredients
  {
    id: 'wretched-onion',
    name: 'Wretched Onion',
    type: PassiveType.BASE,
    description: 'Deal 6-12 per second to enemies within 2 tiles',
    imageUrl: getPassiveImageUrl('wretched-onion')
  },
  {
    id: 'breastplate',
    name: 'Breastplate',
    type: PassiveType.BASE,
    description: 'Decrease damage taken by 10%',
    imageUrl: getPassiveImageUrl('breastplate')
  },
  // Phantom Regalia ingredients
  {
    id: 'ghostly-corset',
    name: 'Ghostly Corset',
    type: PassiveType.BASE,
    description: 'Balls go through enemies and deal 20% bonus damage when hitting them from the side',
    imageUrl: getPassiveImageUrl('ghostly-corset')
  },
  {
    id: 'ethereal-cloak',
    name: 'Ethereal Cloak',
    type: PassiveType.BASE,
    description: 'Balls go through enemies and deal 25% bonus damage until they hit the back of the field',
    imageUrl: getPassiveImageUrl('ethereal-cloak')
  },
  // Soul Reaver ingredients
  {
    id: 'vampiric-sword',
    name: 'Vampiric Sword',
    type: PassiveType.BASE,
    description: 'Each kill heals you by 5, but each shot you take deals 2 damage to you',
    imageUrl: getPassiveImageUrl('vampiric-sword')
  },
  {
    id: 'everflowing-goblet',
    name: 'Everflowing Goblet',
    type: PassiveType.BASE,
    description: 'You can heal past your max health at 20% efficiency',
    imageUrl: getPassiveImageUrl('everflowing-goblet')
  },
  // Tormenter's Mask ingredients
  {
    id: 'spiked-collar',
    name: 'Spiked Collar',
    type: PassiveType.BASE,
    description: 'Deal 30-50 to enemies the first time you get into their melee attack range',
    imageUrl: getPassiveImageUrl('spiked-collar')
  },
  {
    id: 'crown-of-thorns',
    name: 'Crown of Thorns',
    type: PassiveType.BASE,
    description: 'Destroy the 2 nearest enemies when you are hit from close range',
    imageUrl: getPassiveImageUrl('crown-of-thorns')
  },
  // Wings of the Anointed ingredients
  {
    id: 'radiant-feather',
    name: 'Radiant Feather',
    type: PassiveType.BASE,
    description: 'Increases ball launch speed by 20%, but get knocked back a little each time you shoot a ball',
    imageUrl: getPassiveImageUrl('radiant-feather')
  },
  {
    id: 'fleet-feet',
    name: 'Fleet Feet',
    type: PassiveType.BASE,
    description: 'Increase movement speed by 10% and move at full speed while shooting',
    imageUrl: getPassiveImageUrl('fleet-feet')
  },
  // Deadeye's Cross ingredients (4 daggers)
  {
    id: 'diamond-hilted-dagger',
    name: 'Diamond Hilted Dagger',
    type: PassiveType.BASE,
    description: 'Increase crit chance to 20% when hitting enemies in the front',
    imageUrl: getPassiveImageUrl('diamond-hilted-dagger')
  },
  {
    id: 'sapphire-hilted-dagger',
    name: 'Sapphire Hilted Dagger',
    type: PassiveType.BASE,
    description: 'Increase crit chance to 30% when hitting enemies on their left side',
    imageUrl: getPassiveImageUrl('sapphire-hilted-dagger')
  },
  {
    id: 'ruby-hilted-dagger',
    name: 'Ruby Hilted Dagger',
    type: PassiveType.BASE,
    description: 'Increase crit chance to 15% when hitting enemies in the back',
    imageUrl: getPassiveImageUrl('ruby-hilted-dagger')
  },
  {
    id: 'emerald-hilted-dagger',
    name: 'Emerald Hilted Dagger',
    type: PassiveType.BASE,
    description: 'Increase crit chance to 20% when hitting enemies on their right side',
    imageUrl: getPassiveImageUrl('emerald-hilted-dagger')
  }
];

// Base passives that CANNOT evolve (no recipes use them)
export const nonEvolvableBasePassives: Passive[] = [
  {
    id: 'archers-effigy',
    name: "Archer's Effigy",
    type: PassiveType.BASE,
    description: 'Every 7-12 rows, spawn a stone archer with 160 health on your side. Stone archers are immune to ball damage and shoot arrows at enemies, dealing 10-20 each',
    imageUrl: getPassiveImageUrl('archers-effigy')
  },
  {
    id: 'artificial-heart',
    name: 'Artificial Heart',
    type: PassiveType.BASE,
    description: 'Friendly pieces gain 100% more health',
    requirement: 'Requires a passive that gives friendly pieces',
    imageUrl: getPassiveImageUrl('artificial-heart')
  },
  {
    id: 'bandage-roll',
    name: 'Bandage Roll',
    type: PassiveType.BASE,
    description: 'Shoot 1-2 baby balls each time you\'re healed',
    imageUrl: getPassiveImageUrl('bandage-roll')
  },
  {
    id: 'bottled-tornado',
    name: 'Bottled Tornado',
    type: PassiveType.BASE,
    description: 'When you catch a special ball, automatically shoot 1-3 new baby balls in random directions',
    imageUrl: getPassiveImageUrl('bottled-tornado')
  },
  {
    id: 'cursed-elixir',
    name: 'Cursed Elixir',
    type: PassiveType.BASE,
    description: 'When a poisoned enemy dies, 10% chance for them to come back as a zombie with 240 health that moves up the board and fights enemies',
    requirement: 'Requires a ball that applies Poison',
    imageUrl: getPassiveImageUrl('cursed-elixir')
  },
  {
    id: 'dynamite',
    name: 'Dynamite',
    type: PassiveType.BASE,
    description: 'Every 5-10 rows, spawn an enemy with dynamite attached to them. Destroying them will deal 200-500 damage to nearby enemies',
    imageUrl: getPassiveImageUrl('dynamite')
  },
  {
    id: 'eye-of-the-beholder',
    name: 'Eye of the Beholder',
    type: PassiveType.BASE,
    description: '10% chance to dodge incoming attacks',
    imageUrl: getPassiveImageUrl('eye-of-the-beholder')
  },
  {
    id: 'frozen-spike',
    name: 'Frozen Spike',
    type: PassiveType.BASE,
    description: 'When an enemy is frozen, they emit a chill to nearby enemies that deals 10-20 damage',
    requirement: 'Requires a ball that applies Freeze',
    imageUrl: getPassiveImageUrl('frozen-spike')
  },
  {
    id: 'gemspring',
    name: 'Gemspring',
    type: PassiveType.BASE,
    description: 'Every 7-11 rows, spawn a Gemspring. Dealing damage to them causes them to drop an increasing amount of XP gems',
    imageUrl: getPassiveImageUrl('gemspring')
  },
  {
    id: 'ghostly-shield',
    name: 'Ghostly Shield',
    type: PassiveType.BASE,
    description: 'Balls go through allies and heal them for 2 health',
    requirement: 'Requires a passive that gives allies',
    imageUrl: getPassiveImageUrl('ghostly-shield')
  },
  {
    id: 'golden-bull',
    name: 'Golden Bull',
    type: PassiveType.BASE,
    description: 'Every 7-11 rows, spawn a golden bull with 400 health on your side. Golden bulls accrue 10 gold per minute. They also move up the field, blocking and attacking enemies in the way',
    imageUrl: getPassiveImageUrl('golden-bull')
  },
  {
    id: 'hand-fan',
    name: 'Hand Fan',
    type: PassiveType.BASE,
    description: 'Slow down enemies in the same column as you by 50%',
    imageUrl: getPassiveImageUrl('hand-fan')
  },
  {
    id: 'hand-mirror',
    name: 'Hand Mirror',
    type: PassiveType.BASE,
    description: 'Projectiles have a 50% chance to reflect upon hitting you, dealing 20-40 damage if they hit an enemy',
    imageUrl: getPassiveImageUrl('hand-mirror')
  },
  {
    id: 'healers-effigy',
    name: "Healer's Effigy",
    type: PassiveType.BASE,
    description: 'Every 7-12 rows, spawn a stone healer with 100 health on your side, which heals you 10 health per minute while it\'s on the field. Healers are immune to ball damage and move up the field, blocking and attacking enemies in the way',
    imageUrl: getPassiveImageUrl('healers-effigy')
  },
  {
    id: 'hourglass',
    name: 'Hourglass',
    type: PassiveType.BASE,
    description: 'Balls deal 150% damage, but damage decays by 30% each time they bounce (minimum 50%)',
    imageUrl: getPassiveImageUrl('hourglass')
  },
  {
    id: 'kiss-of-death',
    name: 'Kiss of Death',
    type: PassiveType.BASE,
    description: 'Charmed enemies have a 10% chance of dying after recovering',
    requirement: 'Requires a ball that applies Charm',
    imageUrl: getPassiveImageUrl('kiss-of-death')
  },
  {
    id: 'lovers-quiver',
    name: "Lover's Quiver",
    type: PassiveType.BASE,
    description: 'Projectiles have a 40% chance to heal you for 1 health instead of hurting you',
    imageUrl: getPassiveImageUrl('lovers-quiver')
  },
  {
    id: 'magic-staff',
    name: 'Magic Staff',
    type: PassiveType.BASE,
    description: 'Increase area-of-effect damage (such as earthquake, laser, and lightning) by 20%',
    imageUrl: getPassiveImageUrl('magic-staff')
  },
  {
    id: 'magnet',
    name: 'Magnet',
    type: PassiveType.BASE,
    description: 'Increase range at which you pick up items and catch balls by 1.0 tiles',
    imageUrl: getPassiveImageUrl('magnet')
  },
  {
    id: 'midnight-oil',
    name: 'Midnight Oil',
    type: PassiveType.BASE,
    description: 'Balls that hit flaming enemies light on fire and deal 10-20 bonus fire damage on the next hit',
    requirement: 'Requires a ball that applies Burn',
    imageUrl: getPassiveImageUrl('midnight-oil')
  },
  {
    id: 'pressure-valve',
    name: 'Pressure Valve',
    type: PassiveType.BASE,
    description: 'Enemies explode on death, dealing 20-30 damage to adjacent enemies',
    imageUrl: getPassiveImageUrl('pressure-valve')
  },
  {
    id: 'protective-charm',
    name: 'Protective Charm',
    type: PassiveType.BASE,
    description: 'Gain a shield that blocks the next damage you would receive. Recharges after 60 seconds',
    imageUrl: getPassiveImageUrl('protective-charm')
  },
  {
    id: 'rubber-headband',
    name: 'Rubber Headband',
    type: PassiveType.BASE,
    description: 'Balls start off at 70% speed but increase by 20% each bounce (max 200%)',
    imageUrl: getPassiveImageUrl('rubber-headband')
  },
  {
    id: 'shortbow',
    name: 'Shortbow',
    type: PassiveType.BASE,
    description: 'Increase fire rate by 15%',
    imageUrl: getPassiveImageUrl('shortbow')
  },
  {
    id: 'silver-blindfold',
    name: 'Silver Blindfold',
    type: PassiveType.BASE,
    description: 'Increase crit chance to 20% when hitting blinded enemies',
    imageUrl: getPassiveImageUrl('silver-blindfold')
  },
  {
    id: 'silver-bullet',
    name: 'Silver Bullet',
    type: PassiveType.BASE,
    description: 'Balls deal 20% bonus damage until they hit a wall',
    imageUrl: getPassiveImageUrl('silver-bullet')
  },
  {
    id: 'slingshot',
    name: 'Slingshot',
    type: PassiveType.BASE,
    description: '25% chance to launch a baby ball when you pick up a gem',
    imageUrl: getPassiveImageUrl('slingshot')
  },
  {
    id: 'stone-effigy',
    name: 'Stone Effigy',
    type: PassiveType.BASE,
    description: 'Every 7-12 rows, spawn a stone soldier with 200 health on your side. Stone soldiers are immune to ball damage and move up the field, blocking and attacking enemies in the way',
    imageUrl: getPassiveImageUrl('stone-effigy')
  },
  {
    id: 'traitors-cowl',
    name: "Traitor's Cowl",
    type: PassiveType.BASE,
    description: 'Stone allies can now be damaged by your balls, but you heal 2 health when a ball hits one',
    requirement: 'Requires a passive that gives stone allies',
    imageUrl: getPassiveImageUrl('traitors-cowl')
  },
  {
    id: 'turret',
    name: 'Turret',
    type: PassiveType.BASE,
    description: 'Floats around your character and shoots a baby ball at enemies every 2.0 seconds',
    imageUrl: getPassiveImageUrl('turret')
  },
  {
    id: 'upturned-hatchet',
    name: 'Upturned Hatchet',
    type: PassiveType.BASE,
    description: 'Balls deal 80% more damage after hitting the back of the field, otherwise damage is reduced by 20%',
    imageUrl: getPassiveImageUrl('upturned-hatchet')
  },
  {
    id: 'voodoo-doll',
    name: 'Voodoo Doll',
    type: PassiveType.BASE,
    description: 'Curse has a 10% chance of killing enemies',
    requirement: 'Requires a ball that applies Curse',
    imageUrl: getPassiveImageUrl('voodoo-doll')
  },
  {
    id: 'wagon-wheel',
    name: 'Wagon Wheel',
    type: PassiveType.BASE,
    description: 'Each time a ball hits a wall, it deals 30% extra damage on the next hit',
    imageUrl: getPassiveImageUrl('wagon-wheel')
  },
  {
    id: 'iron-onesie',
    name: 'Iron Onesie',
    type: PassiveType.BASE,
    description: 'Unlocked by default. Provides enhanced protection',
    imageUrl: getPassiveImageUrl('iron-onesie')
  }
];

// Combined base passives (evolvable first, then non-evolvable)
export const basePassives: Passive[] = [...evolvableBasePassives, ...nonEvolvableBasePassives];

export const evolvedPassives: Passive[] = [
  {
    id: 'cornucopia',
    name: 'Cornucopia',
    type: PassiveType.EVOLVED,
    description: 'Each time baby balls are created, spawn 0-1 additional baby balls',
    recipe: ['baby-rattle', 'war-horn'],
    imageUrl: getPassiveImageUrl('cornucopia')
  },
  {
    id: 'gracious-impaler',
    name: 'Gracious Impaler',
    type: PassiveType.EVOLVED,
    description: 'Critical hits have a 5% chance to instantly kill enemies',
    recipe: ['reachers-spear', 'deadeyes-amulet'],
    imageUrl: getPassiveImageUrl('gracious-impaler')
  },
  {
    id: 'odiferous-shell',
    name: 'Odiferous Shell',
    type: PassiveType.EVOLVED,
    description: 'When you touch enemies, they have a 50% chance of instantly dying',
    recipe: ['wretched-onion', 'breastplate'],
    imageUrl: getPassiveImageUrl('odiferous-shell')
  },
  {
    id: 'phantom-regalia',
    name: 'Phantom Regalia',
    type: PassiveType.EVOLVED,
    description: 'Balls go through enemies until they hit the back wall. Balls deal 50% more damage when going through enemies',
    recipe: ['ghostly-corset', 'ethereal-cloak'],
    imageUrl: getPassiveImageUrl('phantom-regalia')
  },
  {
    id: 'soul-reaver',
    name: 'Soul Reaver',
    type: PassiveType.EVOLVED,
    description: 'Each kill heals you by 1 and you can heal past your max health at 30% efficiency',
    recipe: ['vampiric-sword', 'everflowing-goblet'],
    imageUrl: getPassiveImageUrl('soul-reaver')
  },
  {
    id: 'tormenters-mask',
    name: "Tormenter's Mask",
    type: PassiveType.EVOLVED,
    description: 'Enemies have a 10% chance of dying immediately the first time they detect you',
    recipe: ['spiked-collar', 'crown-of-thorns'],
    imageUrl: getPassiveImageUrl('tormenters-mask')
  },
  {
    id: 'wings-of-the-anointed',
    name: 'Wings of the Anointed',
    type: PassiveType.EVOLVED,
    description: 'Balls move 40% faster and you move 20% faster. You no longer are affected by environmental hazards on the ground',
    recipe: ['radiant-feather', 'fleet-feet'],
    imageUrl: getPassiveImageUrl('wings-of-the-anointed')
  },
  {
    id: 'deadeyes-cross',
    name: "Deadeye's Cross",
    type: PassiveType.EVOLVED,
    description: 'Increase critical hit chance to 60%',
    recipe: ['diamond-hilted-dagger', 'sapphire-hilted-dagger', 'ruby-hilted-dagger', 'emerald-hilted-dagger'],
    imageUrl: getPassiveImageUrl('deadeyes-cross')
  },
  {
    id: 'grotesque-artillery',
    name: 'Grotesque Artillery',
    type: PassiveType.EVOLVED,
    description: 'Enhanced turret system with devastating firepower',
    recipe: ['turret', 'hand-fan'],
    imageUrl: getPassiveImageUrl('grotesque-artillery')
  },
  {
    id: 'deadeyes-impaler',
    name: "Deadeye's Impaler",
    type: PassiveType.EVOLVED,
    description: 'Combines precision and lethality for devastating critical hits',
    recipe: ['gracious-impaler', 'deadeyes-cross'],
    imageUrl: getPassiveImageUrl('deadeyes-impaler')
  }
];

export const allPassives: Passive[] = [...basePassives, ...evolvedPassives];
