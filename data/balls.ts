import { Ball, BallType, BallCategory } from '@/types/ball';

// Helper function to get ball image URL
// For GitHub Pages deployment, we need to include the base path
function getBallImageUrl(ballId: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/BallXPitWebHelper' : '';
  return `${basePath}/balls/${ballId}.png`;
}

export const baseBalls: Ball[] = [
  {
    id: 'bleed',
    name: 'Bleed',
    type: BallType.BASE,
    category: BallCategory.STATUS,
    description: 'Inflicts 2 stacks of bleed. Bleeding enemies receive 1 damage per stack when hit by a ball (max 8 stacks)',
    element: 'blood',
    imageUrl: getBallImageUrl('bleed'),
    stats: {
      stacks: '2',
      maxStacks: '8',
      damagePerStack: '1'
    }
  },
  {
    id: 'burn',
    name: 'Burn',
    type: BallType.BASE,
    category: BallCategory.STATUS,
    description: 'Add 1 stack of burn on hit for 3 seconds (max 3 stacks). Burnt units are dealt 4-8 damage per stack per second',
    element: 'fire',
    imageUrl: getBallImageUrl('burn'),
    stats: {
      stacks: '1',
      maxStacks: '3',
      duration: '3 seconds',
      damagePerStack: '4-8 per second'
    }
  },
  {
    id: 'freeze',
    name: 'Freeze',
    type: BallType.BASE,
    category: BallCategory.STATUS,
    description: 'Has a 4% chance to freeze enemies for 5.0 seconds. Frozen enemies receive 25% more damage',
    element: 'ice',
    imageUrl: getBallImageUrl('freeze'),
    stats: {
      chance: '4%',
      duration: '5.0 seconds',
      damageBonus: '25%'
    }
  },
  {
    id: 'ghost',
    name: 'Ghost',
    type: BallType.BASE,
    category: BallCategory.UTILITY,
    description: 'Passes through enemies',
    element: 'spirit',
  imageUrl: getBallImageUrl('ghost'),
  },
  {
    id: 'iron',
    name: 'Iron',
    type: BallType.BASE,
    category: BallCategory.DAMAGE,
    description: 'Deals double damage but moves 40% slower',
    element: 'metal',
    imageUrl: getBallImageUrl('iron'),
    stats: {
      damageMultiplier: '2x',
      speedReduction: '40%'
    }
  },
  {
    id: 'lightning',
    name: 'Lightning',
    type: BallType.BASE,
    category: BallCategory.DAMAGE,
    description: 'Deals 1-20 damage to up to 3 nearby enemies',
    element: 'lightning',
    imageUrl: getBallImageUrl('lightning'),
    stats: {
      damage: '1-20',
      targets: '3'
    }
  },
  {
    id: 'poison',
    name: 'Poison',
    type: BallType.BASE,
    category: BallCategory.STATUS,
    description: 'Applies 1 stack of poison on hit (max 5 stacks). Poison lasts for 6 seconds and each stack deals 1-4 damage per second',
    element: 'poison',
    imageUrl: getBallImageUrl('poison'),
    stats: {
      stacks: '1',
      maxStacks: '5',
      duration: '6 seconds',
      damagePerStack: '1-4 per second'
    }
  },
  {
    id: 'charm',
    name: 'Charm',
    type: BallType.BASE,
    category: BallCategory.STATUS,
    description: 'Has a chance to charm enemies, making them fight for you',
    element: 'charm',
  imageUrl: getBallImageUrl('charm'),
  },
  {
    id: 'dark',
    name: 'Dark',
    type: BallType.BASE,
    category: BallCategory.SPECIAL,
    description: 'Dark element ball with curse abilities',
    element: 'dark',
  imageUrl: getBallImageUrl('dark'),
  },
  {
    id: 'wind',
    name: 'Wind',
    type: BallType.BASE,
    category: BallCategory.UTILITY,
    description: 'Wind element ball that affects area',
    element: 'wind',
  imageUrl: getBallImageUrl('wind'),
  },
  {
    id: 'light',
    name: 'Light',
    type: BallType.BASE,
    category: BallCategory.SPECIAL,
    description: 'Light element ball with blinding abilities',
    element: 'light',
  imageUrl: getBallImageUrl('light'),
  },
  {
    id: 'laser-h',
    name: 'Laser (Horizontal)',
    type: BallType.BASE,
    category: BallCategory.DAMAGE,
    description: 'Fires a horizontal laser beam',
    element: 'laser',
  imageUrl: getBallImageUrl('laser-h'),
  },
  {
    id: 'laser-v',
    name: 'Laser (Vertical)',
    type: BallType.BASE,
    category: BallCategory.DAMAGE,
    description: 'Fires a vertical laser beam',
    element: 'laser',
  imageUrl: getBallImageUrl('laser-v'),
  },
  {
    id: 'earthquake',
    name: 'Earthquake',
    type: BallType.BASE,
    category: BallCategory.DAMAGE,
    description: 'Creates earthquake effects on the battlefield',
    element: 'earth',
  imageUrl: getBallImageUrl('earthquake'),
  },
  {
    id: 'brood-mother',
    name: 'Brood Mother',
    type: BallType.BASE,
    category: BallCategory.SPECIAL,
    description: 'Spawns additional creatures',
    element: 'creature',
  imageUrl: getBallImageUrl('brood-mother'),
  },
  {
    id: 'cell',
    name: 'Cell',
    type: BallType.BASE,
    category: BallCategory.SPECIAL,
    description: 'Cellular division and growth abilities',
    element: 'bio',
  imageUrl: getBallImageUrl('cell'),
  },
  {
    id: 'vampire',
    name: 'Vampire',
    type: BallType.BASE,
    category: BallCategory.SPECIAL,
    description: 'Heals on hit, drains enemy life',
    element: 'blood',
  imageUrl: getBallImageUrl('vampire'),
  },
  {
    id: 'egg-sac',
    name: 'Egg Sac',
    type: BallType.BASE,
    category: BallCategory.SPECIAL,
    description: 'Explodes into multiple projectiles',
    element: 'creature',
  imageUrl: getBallImageUrl('egg-sac'),
  },
  {
    id: 'stone',
    name: 'Stone',
    type: BallType.BASE,
    category: BallCategory.DAMAGE,
    description: 'Heavy stone ball with solid damage',
    element: 'earth',
  imageUrl: getBallImageUrl('stone'),
  }
];

export const evolvedBalls: Ball[] = [
  {
    id: 'assassin',
    name: 'Assassin',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Passes through the front of enemies, but not the back. Backstabs deal 30% bonus damage.',
    recipe: ['iron', 'ghost'],
    alternativeRecipes: [['iron', 'dark']],
    element: 'shadow',
    imageUrl: getBallImageUrl('assassin'),
    stats: {
      backstabBonus: '30%'
    }
  },
  {
    id: 'berserk',
    name: 'Berserk',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: '30% chance of causing enemies to go berserk for 6 seconds. Berserk enemies deal 15-24 damage to adjacent enemies every second',
    recipe: ['charm', 'bleed'],
    alternativeRecipes: [['charm', 'burn']],
    element: 'rage',
    imageUrl: getBallImageUrl('berserk'),
    stats: {
      chance: '30%',
      duration: '6 seconds',
      damage: '15-24 per second'
    }
  },
  {
    id: 'black-hole',
    name: 'Black Hole',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Instantly kills the first non-boss enemy that it hits, but destroys itself afterwards. Has a 7 second cooldown',
    recipe: ['dark', 'sun'],
    element: 'void',
    imageUrl: getBallImageUrl('black-hole'),
    stats: {
      cooldown: '7 seconds'
    }
  },
  {
    id: 'blizzard',
    name: 'Blizzard',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Freezes all enemies within a 2 tile radius for 0.8 seconds, dealing 1-50 damage',
    recipe: ['freeze', 'wind'],
    alternativeRecipes: [['freeze', 'lightning']],
    element: 'ice',
    imageUrl: getBallImageUrl('blizzard'),
    stats: {
      radius: '2 tiles',
      duration: '0.8 seconds',
      damage: '1-50'
    }
  },
  {
    id: 'bomb',
    name: 'Bomb',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Explodes when hitting an enemy, dealing 150-300 damage to nearby enemies. Has a 3 second cooldown',
    recipe: ['burn', 'iron'],
    element: 'explosive',
    imageUrl: getBallImageUrl('bomb'),
    stats: {
      damage: '150-300',
      cooldown: '3 seconds'
    }
  },
  {
    id: 'flash',
    name: 'Flash',
    type: BallType.EVOLVED,
    category: BallCategory.UTILITY,
    description: 'Damage all enemies on screen for 1-3 damage after hitting an enemy and blind them for 2 seconds',
    recipe: ['lightning', 'light'],
    element: 'light',
    imageUrl: getBallImageUrl('flash'),
    stats: {
      damage: '1-3',
      duration: '2 seconds'
    }
  },
  {
    id: 'flicker',
    name: 'Flicker',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Deals 1-7 damage to every enemy on screen every 1.4 seconds',
    recipe: ['light', 'dark'],
    element: 'twilight',
    imageUrl: getBallImageUrl('flicker'),
    stats: {
      damage: '1-7',
      interval: '1.4 seconds'
    }
  },
  {
    id: 'freeze-ray',
    name: 'Freeze Ray',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Emits a freeze ray when hitting an enemy, dealing 20-50 damage with a 10% chance of freezing them for 10.0 seconds',
    recipe: ['freeze', 'laser-h'],
    element: 'ice',
    imageUrl: getBallImageUrl('freeze-ray'),
    stats: {
      damage: '20-50',
      chance: '10%',
      duration: '10.0 seconds'
    }
  },
  {
    id: 'frozen-flame',
    name: 'Frozen Flame',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Add 1 stack of frostburn on hit for 20 seconds (max 4 stacks). Frostburnt units dealt 8-12 damage per stack per second and receive 25% more damage',
    recipe: ['burn', 'freeze'],
    element: 'frost-fire',
    imageUrl: getBallImageUrl('frozen-flame'),
    stats: {
      stacks: '1',
      maxStacks: '4',
      duration: '20 seconds',
      damagePerStack: '8-12 per second',
      damageBonus: '25%'
    }
  },
  {
    id: 'glacier',
    name: 'Glacier',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Releases glacial spikes over time that deal 15-30 damage to enemies that touch them and freeze them for 2.0 seconds',
    recipe: ['freeze', 'earthquake'],
    alternativeRecipes: [['stone', 'freeze']],
    element: 'ice',
    imageUrl: getBallImageUrl('glacier'),
    stats: {
      damage: '15-30',
      duration: '2.0 seconds'
    }
  },
  {
    id: 'hemorrhage',
    name: 'Hemorrhage',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Inflicts 3 stacks of bleed. When hitting an enemy with 12 stacks of bleed or more, consumes all stacks to deal 20% of their current health',
    recipe: ['bleed', 'iron'],
    element: 'blood',
    imageUrl: getBallImageUrl('hemorrhage'),
    stats: {
      stacks: '3',
      threshold: '12 stacks',
      damage: '20% current HP'
    }
  },
  {
    id: 'holy-laser',
    name: 'Holy Laser',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Deals 24-36 damage to all enemies in the same row and column',
    recipe: ['laser-h', 'laser-v'],
    element: 'laser',
    imageUrl: getBallImageUrl('holy-laser'),
    stats: {
      damage: '24-36'
    }
  },
  {
    id: 'incubus',
    name: 'Incubus',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: '4% chance of charming the enemy for 9 seconds. Charmed enemies curse nearby enemies. Cursed enemies dealt 100-200 after being hit 5 times',
    recipe: ['charm', 'dark'],
    element: 'demon',
    imageUrl: getBallImageUrl('incubus'),
    stats: {
      chance: '4%',
      duration: '9 seconds',
      curseDamage: '100-200',
      curseHits: '5'
    }
  },
  {
    id: 'inferno',
    name: 'Inferno',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Applies 1 stack of burn every second to all enemies within a 2 tile radius. Burn lasts for 6 seconds, dealing 3-7 damage per stack per second',
    recipe: ['burn', 'wind'],
    element: 'fire',
    imageUrl: getBallImageUrl('inferno'),
    stats: {
      radius: '2 tiles',
      duration: '6 seconds',
      damagePerStack: '3-7 per second'
    }
  },
  {
    id: 'laser-beam',
    name: 'Laser Beam',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Emit a laser beam on hit that deals 30-42 damage and blinds enemies for 8 seconds',
    recipe: ['light', 'laser-h'],
    element: 'laser',
    imageUrl: getBallImageUrl('laser-beam'),
    stats: {
      damage: '30-42',
      duration: '8 seconds'
    }
  },
  {
    id: 'leech',
    name: 'Leech',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Attaches up to 1 leech onto enemies it hits, which add 2 stacks of bleed per second (max 24 stacks)',
    recipe: ['brood-mother', 'bleed'],
    element: 'parasite',
    imageUrl: getBallImageUrl('leech'),
    stats: {
      stacksPerSecond: '2',
      maxStacks: '24'
    }
  },
  {
    id: 'lightning-rod',
    name: 'Lightning Rod',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Plants a lightning rod into enemies it hits. These enemies struck by lightning every 3.0 seconds, dealing 1-30 damage to up to 8 nearby enemies',
    recipe: ['lightning', 'iron'],
    element: 'lightning',
    imageUrl: getBallImageUrl('lightning-rod'),
    stats: {
      interval: '3.0 seconds',
      damage: '1-30',
      targets: '8'
    }
  },
  {
    id: 'lovestruck',
    name: 'Lovestruck',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Inflicts lovestruck on hit enemies for 20 seconds. Lovestruck units have a 50% chance of healing you for 5 health when they attack',
    recipe: ['charm', 'light'],
    alternativeRecipes: [['charm', 'lightning']],
    element: 'charm',
    imageUrl: getBallImageUrl('lovestruck'),
    stats: {
      duration: '20 seconds',
      chance: '50%',
      healing: '5'
    }
  },
  {
    id: 'maggot',
    name: 'Maggot',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Infest enemies on hit with maggots. When they dies, they explode into 1-2 baby balls',
    recipe: ['brood-mother', 'cell'],
    element: 'parasite',
    imageUrl: getBallImageUrl('maggot'),
    stats: {
      babyBalls: '1-2'
    }
  },
  {
    id: 'magma',
    name: 'Magma',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Emits lava blobs over time. Enemies who walk into lava blobs dealt 15-30 damage and gain 1 stack of burn. This ball deals 6-12 damage to nearby units',
    recipe: ['burn', 'earthquake'],
    element: 'fire',
    imageUrl: getBallImageUrl('magma'),
    stats: {
      lavaDamage: '15-30',
      auraDamage: '6-12',
      stacks: '1'
    }
  },
  {
    id: 'mosquito-king',
    name: 'Mosquito King',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Spawns a mosquito each time it hits an enemy. Mosquitos attack a random enemy, dealing 80-120 damage each',
    recipe: ['vampire', 'brood-mother'],
    element: 'blood',
    imageUrl: getBallImageUrl('mosquito-king'),
    stats: {
      damage: '80-120'
    }
  },
  {
    id: 'mosquito-swarm',
    name: 'Mosquito Swarm',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Explodes into 3-6 mosquitos. Mosquitos attack random enemies, dealing 80-120 damage each',
    recipe: ['vampire', 'egg-sac'],
    element: 'blood',
    imageUrl: getBallImageUrl('mosquito-swarm'),
    stats: {
      count: '3-6',
      damage: '80-120'
    }
  },
  {
    id: 'noxious',
    name: 'Noxious',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Passes through enemies and applies 3 stacks of poison to nearby enemies within a 2 tile radius',
    recipe: ['poison', 'wind'],
    alternativeRecipes: [['dark', 'wind']],
    element: 'poison',
    imageUrl: getBallImageUrl('noxious'),
    stats: {
      stacks: '3',
      radius: '2 tiles'
    }
  },
  {
    id: 'nuclear-bomb',
    name: 'Nuclear Bomb',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Explodes dealing 300-500 damage and applying 1 stack of radiation to everyone present (max 5 stacks). Each stack increases damage received by 10%',
    recipe: ['bomb', 'poison'],
    element: 'nuclear',
    imageUrl: getBallImageUrl('nuclear-bomb'),
    stats: {
      damage: '300-500',
      stacks: '1',
      maxStacks: '5',
      damageIncrease: '10% per stack'
    }
  },
  {
    id: 'overgrowth',
    name: 'Overgrowth',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Applies 1 stack of overgrowth. Upon reaching 3, consume all stacks and deal 150-200 damage to all enemies in a 3x3 tile square',
    recipe: ['earthquake', 'cell'],
    element: 'nature',
    imageUrl: getBallImageUrl('overgrowth'),
    stats: {
      stacks: '1',
      threshold: '3 stacks',
      damage: '150-200',
      area: '3x3 tiles'
    }
  },
  {
    id: 'phantom',
    name: 'Phantom',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Curse enemies on hit. Cursed enemies dealt 100-200 damage after being hit 5 times',
    recipe: ['dark', 'ghost'],
    element: 'spirit',
    imageUrl: getBallImageUrl('phantom'),
    stats: {
      curseDamage: '100-200',
      curseHits: '5'
    }
  },
  {
    id: 'radiation-beam',
    name: 'Radiation Beam',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Emit a radiation beam on hit that deals 24-48 damage and applies 1 stack of radiation',
    recipe: ['laser-h', 'poison'],
    alternativeRecipes: [['laser-h', 'cell']],
    element: 'nuclear',
    imageUrl: getBallImageUrl('radiation-beam'),
    stats: {
      damage: '24-48',
      stacks: '1'
    }
  },
  {
    id: 'sacrifice',
    name: 'Sacrifice',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Inflicts 4 stacks of bleed (max 15 stacks) and applies curse to hit enemies. Cursed enemies dealt 50-100 after being hit 5 times',
    recipe: ['bleed', 'dark'],
    element: 'dark',
    imageUrl: getBallImageUrl('sacrifice'),
    stats: {
      stacks: '4',
      maxStacks: '15',
      curseDamage: '50-100',
      curseHits: '5'
    }
  },
  {
    id: 'sandstorm',
    name: 'Sandstorm',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Goes through enemies and is surrounded by a raging storm dealing 10-20 damage per second and blinding nearby enemies for 3 seconds',
    recipe: ['earthquake', 'wind'],
    alternativeRecipes: [['stone', 'wind']],
    element: 'earth',
    imageUrl: getBallImageUrl('sandstorm'),
    stats: {
      damage: '10-20 per second',
      duration: '3 seconds'
    }
  },
  {
    id: 'satan',
    name: 'Satan',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'While active, add 1 stack of burn to all active enemies per second (max 5 stacks), dealing 10-20 damage per stack per second',
    recipe: ['incubus', 'succubus'],
    element: 'demon',
    imageUrl: getBallImageUrl('satan'),
    stats: {
      stacks: '1',
      maxStacks: '5',
      damagePerStack: '10-20 per second'
    }
  },
  {
    id: 'shotgun',
    name: 'Shotgun',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Shoots 3-7 iron baby balls after hitting a wall. Iron baby balls move at 200% speed but destroyed upon hitting anything',
    recipe: ['iron', 'egg-sac'],
    alternativeRecipes: [['iron', 'maggot']],
    element: 'metal',
    imageUrl: getBallImageUrl('shotgun'),
    stats: {
      count: '3-7',
      speed: '200%'
    }
  },
  {
    id: 'soul-sucker',
    name: 'Soul Sucker',
    type: BallType.EVOLVED,
    category: BallCategory.UTILITY,
    description: 'Passes through enemies and saps them, with a 30% chance of stealing 1 health and reducing their attack damage by 20%',
    recipe: ['vampire', 'ghost'],
    element: 'spirit',
    imageUrl: getBallImageUrl('soul-sucker'),
    stats: {
      chance: '30%',
      healing: '1',
      damageReduction: '20%'
    }
  },
  {
    id: 'spider-queen',
    name: 'Spider Queen',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Has a 25% chance of birthing an Egg Sac each time it hits an enemy',
    recipe: ['brood-mother', 'egg-sac'],
    element: 'creature',
    imageUrl: getBallImageUrl('spider-queen'),
    stats: {
      chance: '25%'
    }
  },
  {
    id: 'storm',
    name: 'Storm',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Emits lightning to strike nearby enemies every second, dealing 1-40 damage',
    recipe: ['lightning', 'wind'],
    element: 'lightning',
    imageUrl: getBallImageUrl('storm'),
    stats: {
      damage: '1-40',
      interval: '1 second'
    }
  },
  {
    id: 'succubus',
    name: 'Succubus',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: '4% chance of charming the enemy for 9 seconds. Heals 1 when hitting a charmed enemy',
    recipe: ['charm', 'vampire'],
    element: 'demon',
    imageUrl: getBallImageUrl('succubus'),
    stats: {
      chance: '4%',
      duration: '9 seconds',
      healing: '1'
    }
  },
  {
    id: 'sun',
    name: 'Sun',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Blind all enemies in view and add 1 stack of burn every second (max 5 stacks). Burn deals 6-12 damage per stack per second',
    recipe: ['burn', 'light'],
    element: 'light',
    imageUrl: getBallImageUrl('sun'),
    stats: {
      stacks: '1',
      maxStacks: '5',
      damagePerStack: '6-12 per second'
    }
  },
  {
    id: 'swamp',
    name: 'Swamp',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Leaves behind tar blobs over time. Enemies who walk into tar blobs dealt 15-30 damage, slowed by 50% for 7 seconds',
    recipe: ['poison', 'earthquake'],
    element: 'poison',
    imageUrl: getBallImageUrl('swamp'),
    stats: {
      damage: '15-30',
      slow: '50%',
      duration: '7 seconds'
    }
  },
  {
    id: 'vampire-lord',
    name: 'Vampire Lord',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Each hit inflicts 3 stacks of bleed. Heals 1 health and consumes all stacks when hitting an enemy with at least 10 stacks',
    recipe: ['vampire', 'bleed'],
    alternativeRecipes: [['vampire', 'dark']],
    element: 'blood',
    imageUrl: getBallImageUrl('vampire-lord'),
    stats: {
      stacks: '3',
      threshold: '10 stacks',
      healing: '1'
    }
  },
  {
    id: 'virus',
    name: 'Virus',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Applies 1 stack of disease to units it hits (max 8 stacks). Disease lasts for 6 seconds, dealing 3-6 damage per second',
    recipe: ['poison', 'ghost'],
    alternativeRecipes: [['poison', 'cell']],
    element: 'bio',
    imageUrl: getBallImageUrl('virus'),
    stats: {
      stacks: '1',
      maxStacks: '8',
      duration: '6 seconds',
      damage: '3-6 per second'
    }
  },
  {
    id: 'voluptuous-egg-sac',
    name: 'Voluptuous Egg Sac',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Explodes into 2-3 egg sacs on hitting an enemy. Has a 3 second cooldown',
    recipe: ['egg-sac', 'cell'],
    element: 'creature',
    imageUrl: getBallImageUrl('voluptuous-egg-sac'),
    stats: {
      count: '2-3',
      cooldown: '3 seconds'
    }
  },
  {
    id: 'wraith',
    name: 'Wraith',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Freezes any enemy it passes through for 0.8 seconds',
    recipe: ['freeze', 'ghost'],
    element: 'spirit',
    imageUrl: getBallImageUrl('wraith'),
    stats: {
      duration: '0.8 seconds'
    }
  },
  {
    id: 'nosferatu',
    name: 'Nosferatu',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Spawns a vampire bat each bounce. Vampire bats fly towards a random enemy, dealing 132-176 damage on hit, turning into a Vampire Lord',
    recipe: ['vampire-lord', 'spider-queen', 'mosquito-king'],
    element: 'blood',
    imageUrl: getBallImageUrl('nosferatu'),
    stats: {
      damage: '132-176'
    }
  },
  {
    id: 'landslide',
    name: 'Landslide',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Creates a devastating landslide effect that damages enemies',
    recipe: ['stone', 'earthquake'],
    element: 'earth',
    imageUrl: getBallImageUrl('landslide')
  },
  {
    id: 'steel',
    name: 'Steel',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Reinforced metal ball with enhanced damage properties',
    recipe: ['stone', 'iron'],
    element: 'metal',
    imageUrl: getBallImageUrl('steel')
  },
  {
    id: 'catapult',
    name: 'Catapult',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Launches projectiles at enemies with catapult force',
    recipe: ['stone', 'egg-sac'],
    element: 'earth',
    imageUrl: getBallImageUrl('catapult')
  },
  {
    id: 'brimstone',
    name: 'Brimstone',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Infernal stone that burns with hellfire',
    recipe: ['stone', 'burn'],
    alternativeRecipes: [['poison', 'burn']],
    element: 'fire',
    imageUrl: getBallImageUrl('brimstone')
  },
  {
    id: 'banished-flame',
    name: 'Banished Flame',
    type: BallType.EVOLVED,
    category: BallCategory.STATUS,
    description: 'Dark flames that consume enemies',
    recipe: ['dark', 'burn'],
    element: 'dark',
    imageUrl: getBallImageUrl('banished-flame')
  },
  {
    id: 'fireworks',
    name: 'Fireworks',
    type: BallType.EVOLVED,
    category: BallCategory.SPECIAL,
    description: 'Explodes into a spectacular firework display',
    recipe: ['egg-sac', 'burn'],
    element: 'fire',
    imageUrl: getBallImageUrl('fireworks')
  },
  {
    id: 'laser-cutter',
    name: 'Laser Cutter',
    type: BallType.EVOLVED,
    category: BallCategory.DAMAGE,
    description: 'Powerful laser that cuts through enemies with precision',
    recipe: ['laser-h', 'steel'],
    alternativeRecipes: [['laser-v', 'steel']],
    element: 'laser',
    imageUrl: getBallImageUrl('laser-cutter')
  }
];

export const allBalls: Ball[] = [...baseBalls, ...evolvedBalls];
