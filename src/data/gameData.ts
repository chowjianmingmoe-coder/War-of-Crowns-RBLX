import { Faction, Province, NewsArticle, Unit } from '../types';

export const GAME_IMAGES = {
  hero: '/src/assets/images/hero_crowns_1789382538721.jpg',
  valerius: '/src/assets/images/valerius_lion_1789382554164.jpg',
  korvath: '/src/assets/images/korvath_raven_1789382568049.jpg',
  map: '/src/assets/images/aldoria_map_1789382581197.jpg',
  siege: '/src/assets/images/siege_battle_1789382595301.jpg',
};

export const FACTIONS: Faction[] = [
  {
    id: 'valerius',
    name: 'House Valerius',
    subtitle: 'The Iron Lion of the Western Marches',
    motto: 'Honor in Blood, Iron in Soul',
    crest: 'Lion',
    primaryColor: '#eab308',
    accentColor: '#ca8a04',
    bannerGradient: 'from-amber-900/80 via-yellow-950/60 to-black',
    bannerImage: GAME_IMAGES.valerius,
    leader: {
      name: 'High Marshal Alden Valerius',
      title: 'Shield of the Golden Hearth',
      description: 'A master strategist hardened by two decades of frontier trench warfare. Alden believes a kingdom is built not by silver tongues, but by discipline, heavy armor, and steadfast fortresses.'
    },
    summary: 'Master architects and heavy shock-infantry commanders. Their formidable phalanx formations can withstand the most violent cavalry charges, while their heavy siege trebuchets shatter mountain keeps.',
    combatPhilosophy: 'Unbreakable frontline discipline, heavy armor mitigation, and fortified strongholds.',
    crownPower: {
      name: "Lion's Bulwark",
      effect: 'Grants +40% Armor and complete immunity to morale rout for 2 tactical turns.',
      flavor: 'The royal banner is planted, inspiring even wounded soldiers to hold against impossible odds.'
    },
    pros: ['Highest unit survivability & armor', 'Devastating counter-attacks against charging cavalry', 'Reinforced fortification construction'],
    cons: ['Slower march speed across marsh & mountain', 'Vulnerable to high-mobility horse archers'],
    units: [
      {
        id: 'val-1',
        name: 'Sun-Knight Paladin',
        category: 'Cavalry',
        factionId: 'valerius',
        role: 'Heavy Shock Cavalry',
        attack: 88,
        defense: 94,
        range: 1,
        mobility: 72,
        morale: 95,
        specialAbility: 'Righteous Lance Charge',
        abilityDescription: 'Deals 200% damage on first charge turn and shatters enemy shields.',
        lore: 'Mounted on barded war-stallions and blessed by the high clergy of Sol-Caelum.'
      },
      {
        id: 'val-2',
        name: 'Ironwall Phalanx',
        category: 'Infantry',
        factionId: 'valerius',
        role: 'Frontline Defensive Wall',
        attack: 70,
        defense: 98,
        range: 1,
        mobility: 45,
        morale: 90,
        specialAbility: 'Interlocking Pavise',
        abilityDescription: 'Reduces all incoming projectile and melee damage by 50% from the front.',
        lore: 'Tower shields forged from raw mountain iron, locked together to form a moving citadel.'
      },
      {
        id: 'val-3',
        name: 'Imperial Arbalestiers',
        category: 'Ranged',
        factionId: 'valerius',
        role: 'Armor-Piercing Crossbowmen',
        attack: 82,
        defense: 60,
        range: 4,
        mobility: 55,
        morale: 75,
        specialAbility: 'Steel Bolt Penetration',
        abilityDescription: 'Ignores 60% of target armor when fired from high ground.',
        lore: 'Winched heavy steel bows capable of piercing reinforced dragonhide and plate mail.'
      }
    ]
  },
  {
    id: 'korvath',
    name: 'House Korvath',
    subtitle: 'The Obsidian Raven of the Northern Crags',
    motto: 'From Shadows We Rule',
    crest: 'Raven',
    primaryColor: '#a855f7',
    accentColor: '#7e22ce',
    bannerGradient: 'from-purple-950/80 via-slate-950/60 to-black',
    bannerImage: GAME_IMAGES.korvath,
    leader: {
      name: 'Empress Vespera the Hexweaver',
      title: 'Matriarch of the Whispering Spire',
      description: 'An enigmatic sovereign steeped in forbidden blood magic and subterfuge. Vespera wages war in the minds of rival kings long before the first assassin strikes.'
    },
    summary: 'Practitioners of occult warfare, stealth infiltration, and dark alchemy. They cripple enemy logistics with curses, panic enemy lines with necromantic specters, and strike from concealment.',
    combatPhilosophy: 'Subterfuge, devastating critical ambush strikes, and attrition through lingering curses.',
    crownPower: {
      name: 'Eclipse of the Raven',
      effect: 'Envelops the battlefield in eldritch gloom, granting all units stealth and reducing enemy accuracy by 35%.',
      flavor: 'Thick violet fog descends upon the fray as spectral wings shriek across the sky.'
    },
    pros: ['Deadly stealth ambushes and critical hit chance', 'Terrifying morale-draining hexes', 'Superb intelligence gathering and assassination'],
    cons: ['Lower raw physical defense in prolonged melee', 'Vulnerable to holy magic and burst artillery'],
    units: [
      {
        id: 'kor-1',
        name: 'Void Stalker',
        category: 'Infantry',
        factionId: 'korvath',
        role: 'Stealth Executioner',
        attack: 95,
        defense: 52,
        range: 1,
        mobility: 88,
        morale: 85,
        specialAbility: 'Shadowstep Strike',
        abilityDescription: 'Teleports behind an enemy backliner and deals 250% critical damage.',
        lore: 'Trained from childhood in absolute silence, armed with twin serrated obsidian daggers.'
      },
      {
        id: 'kor-2',
        name: 'Abyssal Hex-Weaver',
        category: 'Arcane',
        factionId: 'korvath',
        role: 'Battlefield Curse Caster',
        attack: 85,
        defense: 45,
        range: 4,
        mobility: 60,
        morale: 80,
        specialAbility: 'Bloodfire Curse',
        abilityDescription: 'Inflicts damage over time and reduces target attack power by 30%.',
        lore: 'Wielders of forbidden crag-magic, bound by ancient blood oaths to the Raven Throne.'
      },
      {
        id: 'kor-3',
        name: 'Dread Cataphract',
        category: 'Cavalry',
        factionId: 'korvath',
        role: 'Terror Heavy Cavalry',
        attack: 84,
        defense: 78,
        range: 1,
        mobility: 80,
        morale: 90,
        specialAbility: 'Aura of Panic',
        abilityDescription: 'Adjacent enemies lose 20% morale every turn, triggering early routs.',
        lore: 'Warriors cloaked in blackened mail mounted on warhorses bred in subterranean caverns.'
      }
    ]
  },
  {
    id: 'sylvane',
    name: 'House Sylvane',
    subtitle: 'The Verdant Stag of the Primordial Weald',
    motto: 'The Forest Never Forgives',
    crest: 'Stag',
    primaryColor: '#22c55e',
    accentColor: '#16a34a',
    bannerGradient: 'from-emerald-950/80 via-stone-950/60 to-black',
    bannerImage: GAME_IMAGES.hero,
    leader: {
      name: 'Huntmaster Elyas Greenshadow',
      title: 'Warden of the Deep Canopy',
      description: 'A quiet master ranger whose longbow can strike a sparrow at four hundred paces. He knows every secret trail, choke point, and poisoned briar in the Great Weald.'
    },
    summary: 'Rangers, druidic shapeshifters, and wind-archers who utilize the natural wilderness as their primary weapon. Invading armies starve or fall to silent arrows before ever spotting a camp.',
    combatPhilosophy: 'Extreme skirmishing range, terrain concealment, nature-infused healing, and guerrilla ambushes.',
    crownPower: {
      name: "Wild Hunt's Fury",
      effect: 'Summons raging spirit beasts and increases ranged weapon distance by +2 tiles.',
      flavor: 'The ancient roots of the continent stir, obeying the command of the true forest wardens.'
    },
    pros: ['Longest attack range on any battlefield', 'Ignore forest, river, and mud movement penalties', 'Health regeneration while in natural cover'],
    cons: ['Weak defensive siege capability', 'Struggles in open desert or barren plains'],
    units: [
      {
        id: 'syl-1',
        name: 'Mistral Longbowman',
        category: 'Ranged',
        factionId: 'sylvane',
        role: 'Extreme Range Sniper',
        attack: 90,
        defense: 48,
        range: 5,
        mobility: 70,
        morale: 80,
        specialAbility: 'Windcaller Volley',
        abilityDescription: 'Rains arrows in a 3x3 area, pinning targets and disabling movement.',
        lore: 'Bows crafted from thousand-year-old ironwood trees strung with spectral sinew.'
      },
      {
        id: 'syl-2',
        name: 'Oakguard Treant Warden',
        category: 'Infantry',
        factionId: 'sylvane',
        role: 'Living Nature Behemoth',
        attack: 78,
        defense: 96,
        range: 1,
        mobility: 40,
        morale: 100,
        specialAbility: 'Entangling Roots',
        abilityDescription: 'Roots all nearby enemies to the ground for 1 turn.',
        lore: 'Sentient bark giants awakened to protect the sanctuary groves from imperial axes.'
      }
    ]
  },
  {
    id: 'solgard',
    name: 'House Solgard',
    subtitle: 'The Gilded Gryphon of the Southern Seas',
    motto: 'Gold Buys Steel, Steel Buys All',
    crest: 'Gryphon',
    primaryColor: '#f97316',
    accentColor: '#ea580c',
    bannerGradient: 'from-amber-950/80 via-orange-950/60 to-black',
    bannerImage: GAME_IMAGES.siege,
    leader: {
      name: 'Sovereign Lucian Thorne',
      title: 'High Commodore of the Gold Coast',
      description: 'Wealthiest sovereign in the known world. Lucian commands a fleet of three hundred galleons and believes any general can be bribed, and any fortress bought.'
    },
    summary: 'A commercial empire backed by gunpowder arquebusiers, ruthless mercenary free companies, and massive ironclad war-galleons that dominate sea trade and coastal bombardments.',
    combatPhilosophy: 'Financial dominance, mercenary recruitment, gunpowder volley fire, and naval supremacy.',
    crownPower: {
      name: 'Golden Mercenary Levy',
      effect: 'Instantly deploys a veteran mercenary battalion behind enemy ranks and bribes a hostile unit to switch allegiance.',
      flavor: 'Chest after chest of minted coin is emptied, proving loyalty belongs to the highest bidder.'
    },
    pros: ['Unmatched economic income and troop recruitment speed', 'Devastating gunpowder burst damage', 'Supreme naval supremacy on coastal maps'],
    cons: ['Mercenary morale drops precipitously if treasury dips', 'Expensive unit maintenance costs'],
    units: [
      {
        id: 'sol-1',
        name: 'Gilded Arquebusier',
        category: 'Ranged',
        factionId: 'solgard',
        role: 'Gunpowder Shock Trooper',
        attack: 96,
        defense: 58,
        range: 3,
        mobility: 50,
        morale: 76,
        specialAbility: 'Thunderous Volley',
        abilityDescription: 'Causes severe concussive shock, cancelling the target’s next turn.',
        lore: 'Equipped with alchemical black powder guns from the southern island workshops.'
      },
      {
        id: 'sol-2',
        name: 'Gryphon Rider',
        category: 'Cavalry',
        factionId: 'solgard',
        role: 'Flying Shock Unit',
        attack: 92,
        defense: 70,
        range: 2,
        mobility: 95,
        morale: 88,
        specialAbility: 'Divebomb Talons',
        abilityDescription: 'Swoops over walls and obstacles to strike directly at artillery and lords.',
        lore: 'Trained atop the sea cliffs of Solgard, bonded for life with fierce golden gryphons.'
      }
    ]
  }
];

export const ALL_UNITS: Unit[] = FACTIONS.flatMap(f => f.units);

export const PROVINCES: Province[] = [
  {
    id: 'prov-1',
    name: 'Caelum Citadel',
    title: 'The High Crown Seat',
    controller: 'Contested Imperial Throne',
    controllerColor: '#ef4444',
    x: 52,
    y: 38,
    defenseLevel: 'Tier III: High Citadel',
    resourceYield: '+120 Royal Prestige / +80 Imperial Taxes',
    garrison: '12,000 Imperial Legionnaires & Sun-Paladins',
    strategicImportance: 'The ancient capital where the High Crown rests. Whoever holds Caelum holds supreme legitimate authority over the continent.',
    lore: 'Built atop a natural plateau overlooking the Great River, its marble walls have withstood forty-two sieges over four centuries.'
  },
  {
    id: 'prov-2',
    name: 'Ironvale Bastion',
    title: 'Stronghold of House Valerius',
    controller: 'House Valerius',
    controllerColor: '#eab308',
    x: 28,
    y: 46,
    defenseLevel: 'Tier III: High Citadel',
    resourceYield: '+150 Iron Ore / +60 Mastercrafted Arms',
    garrison: '8,500 Heavy Shieldbearers & Knights',
    strategicImportance: 'The continent’s premier weapons foundry and iron quarry. Controls the Western mountain passes.',
    lore: 'Carved directly into the basalt granite of Mount Oros. The great smelters have burned continuously for three hundred years.'
  },
  {
    id: 'prov-3',
    name: 'Gloomspire Spire',
    title: 'Citadel of House Korvath',
    controller: 'House Korvath',
    controllerColor: '#a855f7',
    x: 74,
    y: 22,
    defenseLevel: 'Tier II: Castle',
    resourceYield: '+90 Eldritch Shards / +50 Black Mercury',
    garrison: '6,200 Shadow Stalkers & Hexweavers',
    strategicImportance: 'Northern crag fortress shrouded in perpetual storm clouds. Center of arcane espionage network.',
    lore: 'Surrounded by jagged black obsidian needles and cavernous catacombs that descend deep into the forgotten earth.'
  },
  {
    id: 'prov-4',
    name: 'The Whispering Weald',
    title: 'Heartland of House Sylvane',
    controller: 'House Sylvane',
    controllerColor: '#22c55e',
    x: 42,
    y: 72,
    defenseLevel: 'Tier II: Castle',
    resourceYield: '+140 Ancient Timber / +70 Herbal Elixirs',
    garrison: '5,000 Wind-Archers & Treant Wardens',
    strategicImportance: 'Dense primeval forest territory impassable to heavy cavalry and siege engines.',
    lore: 'Legends whisper that the trees themselves listen and rearrange the forest paths to trap invading legions in endless loops.'
  },
  {
    id: 'prov-5',
    name: 'Port Gilded Bay',
    title: 'Grand Harbor of House Solgard',
    controller: 'House Solgard',
    controllerColor: '#f97316',
    x: 82,
    y: 68,
    defenseLevel: 'Tier II: Castle',
    resourceYield: '+220 Gold Bullion / +110 Maritime Spices',
    garrison: '9,000 Mercenary Arquebusiers & Warships',
    strategicImportance: 'The richest trade nexus on the southern ocean. Controls shipping lanes and foreign mercenary contracts.',
    lore: 'A sprawling city of white marble, golden domes, and towering lighthouses where fortunes are made and squandered every hour.'
  },
  {
    id: 'prov-6',
    name: 'Dragonfang Chokepoint',
    title: 'The Blood Pass',
    controller: 'Contested Borderland',
    controllerColor: '#64748b',
    x: 60,
    y: 54,
    defenseLevel: 'Tier I: Outpost',
    resourceYield: '+40 Dragonstone Ore / +30 Strategic Tolls',
    garrison: '3,000 Frontier Watchmen',
    strategicImportance: 'The only passable route through the Dragonfang peaks connecting the eastern and western provinces.',
    lore: 'Named after the colossal skeletal dragon skull that forms the natural archway over the narrow mountain gorge.'
  }
];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Developer Diary #14: The Mechanics of Crown Morale and Flanking Formations',
    category: 'Dev Diary',
    date: 'September 12, 2026',
    readTime: '6 min read',
    excerpt: 'Lead Combat Designer Marcus Vance details how shield walls collapse when flanked, and how royal commanders inspire retreating battalions back to the fray.',
    tag: 'Combat System'
  },
  {
    id: 'news-2',
    title: 'Dynastic Intrigue: How Marriage Treaties and Assassins Shape the Throne',
    category: 'Lore Codex',
    date: 'September 4, 2026',
    readTime: '8 min read',
    excerpt: 'A deep dive into imperial court politics. Betroth your heir to House Sylvane for forest passage, or risk the wrath of Korvath shadow daggers in the night.',
    tag: 'Grand Strategy'
  },
  {
    id: 'news-3',
    title: 'Roblox Global Closed Playtest Announcement & Experience Notes',
    category: 'Major Update',
    date: 'August 28, 2026',
    readTime: '4 min read',
    excerpt: 'Sign-ups for our 50,000 player stress test are now live on Roblox. Experience tactical siege battles running smoothly across PC, Mobile, and Console.',
    tag: 'Playtest'
  }
];

export const ROBLOX_SPECS = {
  platform: 'Roblox Experience',
  installation: 'None required (Plays directly in Roblox)',
  supportedDevices: ['PC (Windows / Mac)', 'iOS / Android Mobile & Tablets', 'PlayStation / Xbox Consoles'],
  engine: 'Roblox Engine 2026 with custom tactical grid shaders',
  multiplayer: 'Seamless cross-play multiplayer servers'
};
