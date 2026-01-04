# Steam Guide Chinese Name Mapping

This document maps the Chinese ball names from the [official Steam guide](https://steamcommunity.com/sharedfiles/filedetails/?id=3589448013) to the ball IDs in our codebase.

## Base Balls (18 total)

| Ball ID | English Name | Chinese Name (Steam) | Element |
|---------|--------------|---------------------|---------|
| bleed | Bleed | 放血 | blood |
| burn | Burn | 燃烧 | fire |
| freeze | Freeze | 冰冻 | ice |
| ghost | Ghost | 幽灵 | spirit |
| iron | Iron | 黑铁 | metal |
| lightning | Lightning | 闪电 | lightning |
| poison | Poison | 中毒 | poison |
| charm | Charm | 魅惑 | charm |
| dark | Dark | 黑暗 | dark |
| wind | Wind | 疾风 | wind |
| light | Light | 光明 | light |
| laser-h | Laser (Horizontal) | 激光(水平) | laser |
| laser-v | Laser (Vertical) | 激光(垂直) | laser |
| earthquake | Earthquake | 地震 | earth |
| brood-mother | Brood Mother | 育母 | creature |
| cell | Cell | 细胞 | bio |
| vampire | Vampire | 吸血鬼 | blood |
| egg-sac | Egg Sac | 巣囊 | creature |

## Evolved Balls (42 total)

| Ball ID | English Name | Chinese Name (Steam) | Recipe |
|---------|--------------|---------------------|--------|
| assassin | Assassin | 刺客 | iron + ghost (alt: iron + dark) |
| berserk | Berserk | 狂暴 | charm + bleed (alt: charm + burn) |
| blizzard | Blizzard | 暴风雪 | freeze + wind (alt: freeze + lightning) |
| flash | Flash | 闪光 | lightning + light |
| flicker | Flicker | 闪烁 | light + dark |
| freeze-ray | Freeze Ray | 冰冻射线 | freeze + laser-h |
| frozen-flame | Frozen Flame | 冰冻之炎 | burn + freeze |
| glacier | Glacier | 冰川 | freeze + earthquake |
| hemorrhage | Hemorrhage | 血流如注 | bleed + iron |
| holy-laser | Holy Laser | 神圣激光 | laser-h + laser-v |
| inferno | Inferno | 炼狱 | burn + wind |
| laser-beam | Laser Beam | 激光束 | light + laser-h |
| leech | Leech | 吸血水蛭 | brood-mother + bleed |
| lightning-rod | Lightning Rod | 避雷针 | lightning + iron |
| lovestruck | Lovestruck | 热恋 | charm + light (alt: charm + lightning) |
| maggot | Maggot | 蛆虫 | brood-mother + cell |
| magma | Magma | 熔岩 | burn + earthquake |
| mosquito-swarm | Mosquito Swarm | 蚁群 | vampire + egg-sac |
| noxious | Noxious | 毒云 | poison + wind (alt: dark + wind) |
| overgrowth | Overgrowth | 蔓延 | earthquake + cell |
| phantom | Phantom | 恶灵 | dark + ghost |
| radiation-beam | Radiation Beam | 辐射光束 | laser-h + poison (alt: laser-h + cell) |
| sacrifice | Sacrifice | 活祭 | bleed + dark |
| sandstorm | Sandstorm | 沙尘暴 | earthquake + wind |
| shotgun | Shotgun | 霰弹枪 | iron + egg-sac (alt: iron + maggot) |
| soul-sucker | Soul Sucker | 吸魂妖 | vampire + ghost |
| storm | Storm | 风暴 | lightning + wind |
| swamp | Swamp | 沼泽 | poison + earthquake |
| virus | Virus | 病毒 | poison + ghost (alt: poison + cell) |
| voluptuous-egg-sac | Voluptuous Egg Sac | 肿胀巣囊 | egg-sac + cell |
| wraith | Wraith | 怨灵 | freeze + ghost |
| bomb | Bomb | 炸弹 | burn + iron |
| nuclear-bomb | Nuclear Bomb | 核弹 | bomb + poison |
| sun | Sun | 太阳 | burn + light |
| black-hole | Black Hole | 黑洞 | sun + dark |
| succubus | Succubus | 魅魔 | charm + vampire |
| incubus | Incubus | 梦淫妖 | charm + dark |
| satan | Satan | 撒旦 | incubus + succubus |
| mosquito-king | Mosquito King | 蚊王 | vampire + brood-mother |
| spider-queen | Spider Queen | 蜘蛛女王 | brood-mother + egg-sac |
| vampire-lord | Vampire Lord | 吸血鬼领主 | vampire + bleed (alt: vampire + dark) |
| nosferatu | Nosferatu | 诺斯费拉图 | vampire-lord + spider-queen + mosquito-king |

## Verification Status

✅ **All 60 balls matched!**
- 18 base balls
- 42 evolved balls

All Chinese names from the Steam guide have been successfully mapped to ball IDs in the codebase.

## Notes

1. Some balls have alternative recipes (marked with "alt:")
2. Laser has two variants: horizontal (水平) and vertical (垂直)
3. Multi-stage evolutions:
   - **Black Hole** requires Sun (which itself needs burn + light)
   - **Satan** requires both Incubus and Succubus
   - **Nosferatu** requires Vampire Lord, Spider Queen, and Mosquito King
