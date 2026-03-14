export const WONDER_SHELF_DATA = {
  "product_name": "ワンダーシェルフ (Wonder Shelf)",
  "specifications": {
    "shelf_board_thickness_mm": 17,
    "pole_diameter_mm": 35,
    "bolt_diameter_mm": 8
  },
  "parts": {
    "shelf_boards": [
      { "width": 450, "depth": 300 },
      { "width": 450, "depth": 450 },
      { "width": 600, "depth": 300 },
      { "width": 600, "depth": 450 },
      { "width": 750, "depth": 300 },
      { "width": 750, "depth": 450 },
      { "width": 900, "depth": 300 },
      { "width": 900, "depth": 450 }
    ],
    "poles": [
      { "model": "PP-100", "actual_length": 83, "effective_height": 100 },
      { "model": "PP-150", "actual_length": 133, "effective_height": 150 },
      { "model": "PP-200", "actual_length": 183, "effective_height": 200 },
      { "model": "PP-250", "actual_length": 233, "effective_height": 250 },
      { "model": "PP-300", "actual_length": 283, "effective_height": 300 },
      { "model": "PP-350", "actual_length": 333, "effective_height": 350 },
      { "model": "PP-400", "actual_length": 383, "effective_height": 400 },
      { "model": "PP-450", "actual_length": 433, "effective_height": 450 }
    ],
    "hardware": {
      "connectors": [
        { "name": "連結ボルト", "target": "pole_to_pole", "diameter": 8 },
        { "name": "ビス", "target": "top_board_fix", "note": "六角レンチ付属" }
      ],
      "feet": [
        { "name": "アジャスター", "diameter": 30, "adjustable": true },
        { "name": "キャスター", "types": ["ストッパーあり", "ストッパーなし"] }
      ],
      "accessories": [
        { "name": "ワッシャー", "sizes_diameter": [50, 63, 80] },
        { "name": "ジョイントボード", "compatible_depth": [300, 450] }
      ]
    }
  },
  "assembly_rules": {
    "stacking_logic": "Pole (Bottom) + Board + Pole (Top) connected by Connection Bolt",
    "top_termination": "Top Board is fixed by Hex Screw into the final Pole",
    "bottom_termination": "Bottom Pole is fitted with Adjuster or Caster",
    "total_height_formula": "Sum of (effective_height of poles) + (17mm if top board is used)"
  }
};
