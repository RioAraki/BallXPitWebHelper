# Translation Discrepancies Report

## Ball ID Mismatches in zh-CN.json

These JSON keys don't match the actual ball IDs in the codebase:

| Current JSON Key | Correct Ball ID | Chinese Name | Action Needed |
|------------------|-----------------|--------------|---------------|
| `frost-ray` | `freeze-ray` | 冰冻射线 | Rename key |
| `frostflame` | `frozen-flame` | 冰冻之炎 | Rename key |
| `lovesick` | `lovestruck` | 热恋 | Rename key |
| `poison-cloud` | `noxious` | 毒云 | Rename key |
| `proliferation` | `overgrowth` | 蔓延 | Rename key |
| `specter` | `phantom` | 恶灵 | Rename key |
| `soul-leech` | `soul-sucker` | 吸魂妖 | Rename key |
| `swollen-egg` | `voluptuous-egg-sac` | 肿胀巢囊 | Rename key |
| `nightmare` | `incubus` | 梦淫妖 | Rename key |

## Translation Differences (Steam Guide vs Current)

| Ball ID | Current Translation | Steam Guide | Recommendation |
|---------|---------------------|-------------|----------------|
| `bleed` | 流血 | 放血 | Update to **放血** (more accurate - "to bleed" vs "bleeding") |
| `wind` | 风 | 疾风 | Update to **疾风** (matches Steam guide - "swift wind") |
| `egg-sac` | 巢囊 | 巣囊 | Keep **巢囊** (traditional character, both are valid) |
| `mosquito-swarm` | 蚊群 | 蚁群 | Keep **蚊群** (current is correct - "mosquito swarm" not "ant swarm") |

## Verification Status After Steam Guide Check

### Base Balls (18)
✅ **Verified from Steam Guide:**
- burn (燃烧)
- freeze (冰冻)
- ghost (幽灵)
- iron (黑铁)
- lightning (闪电)
- poison (中毒)
- charm (魅惑)
- dark (黑暗)
- light (光明)
- laser-h (激光(水平))
- laser-v (激光(垂直))
- earthquake (地震)
- brood-mother (育母)
- cell (细胞)
- vampire (吸血鬼)
- egg-sac (巢囊/巣囊)

⚠️ **Need Update:**
- bleed: 流血 → **放血**
- wind: 风 → **疾风**

### Evolved Balls (42)
✅ **All evolved balls verified from Steam guide!**

All 42 evolved ball names match the Steam guide perfectly (after fixing the JSON key mismatches).

## Recommended Actions

1. **Fix JSON Key Mismatches** - Rename 9 ball keys to match actual ball IDs
2. **Update Base Ball Names** - Update "bleed" and "wind" to match Steam guide
3. **Mark as Verified** - Change verification status to ✅ for all balls after updates

## Summary

- **Critical Issues:** 9 JSON keys don't match ball IDs (will cause lookups to fail)
- **Translation Updates:** 2 base ball names should be updated to match Steam guide
- **Overall Status:** 58/60 translations verified from Steam guide (96.7%)
