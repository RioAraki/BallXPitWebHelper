# Translation Files

This directory contains translation files for the Ball X Pit Helper app.

## File Structure

### `zh-CN.json` - Simplified Chinese Translations

This file contains all Chinese translations for the app.

**Verification Status:**
- ✅ = **Verified** - Found in official Steam/community guides
- ⚠️ = **Needs Verification** - Educated guess based on game context

## How to Review and Edit

### 1. Open the file
Open `zh-CN.json` in any text editor (VS Code, Notepad++, etc.)

### 2. Review translations
Look for entries marked with `"verified": "⚠️"` - these need verification

### 3. Edit translations
Simply change the Chinese text. For example:

**Before:**
```json
"ghost": {
  "name": "幽灵",
  "description": "穿过敌人",
  "verified": "⚠️"
}
```

**After (if you verify it's correct):**
```json
"ghost": {
  "name": "幽灵",
  "description": "穿过敌人",
  "verified": "✅"
}
```

### 4. Items that need the most review

**Base Balls (needs verification):**
- ghost (幽灵)
- iron (黑铁)
- dark (黑暗)
- wind (风)
- light (光明)
- laser-h (激光（水平）)
- laser-v (激光（垂直）)
- earthquake (地震)
- brood-mother (育母)
- cell (细胞)

**Base Passives (needs descriptions):**
- baby-rattle (婴儿拨浪鼓)
- war-horn (战争号角)
- reachers-spear (长枪)
- deadeyes-amulet (死眼护符)

### 5. Verify with in-game client

If you have access to the Chinese version of Ball X Pit:
1. Check the actual in-game names
2. Update the JSON file with correct names
3. Change `"verified": "⚠️"` to `"verified": "✅"`

## JSON Format Tips

- Keep the structure intact (don't remove quotes or commas)
- Chinese text should be inside double quotes: `"name": "中文名字"`
- Each entry ends with a comma except the last one in a section
- Use a JSON validator if you want to check for syntax errors

## Finding Ball IDs

Ball IDs in the JSON match the image filenames in `/public/balls/`:
- `bleed.png` → `"bleed"`
- `frost-ray.png` → `"frost-ray"`
- `black-hole.png` → `"black-hole"`

## Future Use

Once reviewed, this file will be used to:
1. Display Chinese names in the app
2. Show Chinese descriptions in detail panels
3. Translate all UI elements

## Questions?

If you're unsure about a translation:
1. Leave it as is with `"verified": "⚠️"`
2. Add a note in the description
3. We can update it later
