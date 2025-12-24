# Swatch & Asset Naming Guide

To ensure the system automatically loads your new swatch images and 3D models, please follow these naming conventions and folder structures.

## 1. Directory Structure
Please create these folders inside your project's `public/` directory:

```text
public/
  ├── models/          (For .glb 3D files)
  ├── swatches/        (For .jpg/.png texture images)
  │    ├── table/      (Table materials)
  │    └── chair/      (Chair fabrics/materials)
  └── ui/              (Optional: for UI specific icons if needed)
```

## 2. Swatch Images
**File Format**: `.jpg` or `.png` (approx 100x100px or 256x256px is good for UI).

### Naming Rule:
Name the file exactly matching the **Color Name** you want to see in the UI, replacing spaces with underscores if preferred (code will handle it).

**Examples:**
*   For Color "Oak": `swatches/table/Oak.jpg`
*   For Color "Black Wood": `swatches/table/Black_Wood.jpg`
*   For Fabric "Grey Wool": `swatches/chair/Grey_Wool.jpg`
*   For Fabric "Beige": `swatches/chair/Beige.jpg`

## 3. 3D Models (.glb)
The system currently expects models to be named using this specific pattern:

**Table Pattern:**
`Brand {Brand}, Size {Size}, Colour {Color}.glb`

**Examples:**
*   `Brand Tromso, Size 140x90, Colour Oak.glb`
*   `Brand Florence, Size 200x100, Colour Walnut.glb`

**Chair Pattern:**
`Brand {Brand}, No Chairs {Count}, Colour {Color}.glb`

**Examples:**
*   `Brand Bergen, No Chairs 4, Colour Grey Wool.glb`
*   `Brand Hyde, No Chairs 1, Colour Leather.glb`

> **Note**: Ensure the "Color" part of the filename matches the Swatch filenames (e.g., if model says `Colour Oak.glb`, your swatch should be `Oak.jpg`).
