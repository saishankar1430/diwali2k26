# Replace All Experience Photos with 15 New Couple Memories

A complete visual and photographic refresh of **"Heeru ❤️ Sushii – A Diwali Night Together"**, updating every image across the application with the 15 newly provided authentic photos, curated by theme for each Diwali milestone, 3D street wall frame, the memory scrapbook, and the title screen.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> Based on your answers during interactive clarification:
> - **Photo Distribution**: Curated by matching each photo's theme and setting to its corresponding Diwali activity and memory story.
> - **Featured Start Screen & Finale Photo**: Selected the **Festive Yellow & Black Traditional Outfits** mirror selfie (`file_0000000081d882078ae16a2e9c29c523.png`) for the start screen polaroid and celebratory cards.

---

### 1. Overview & Core Concept

- **Goal**: Seamlessly replace all previous photo assets with the 15 authentic couple photos uploaded by the user, preserving all 3D gameplay, character walking, firework cascades, lighting interactions, and audio mechanics.
- **Scope**:
  1. Update `src/data/photos.ts` to register the 15 new images with heartfelt captions, dates, and category tags.
  2. Update `src/game/rules.ts` to link each of the 10 core Diwali interactions to the corresponding thematic photo.
  3. Update `src/components/TitleScreen.tsx` to showcase the user-selected yellow-and-black traditional outfit polaroid.
  4. Update `src/components/MemoryModal.tsx` and `src/components/GrandFinaleModal.tsx` to display the new photo collection and lightbox zooms.
  5. Update `src/game/environment.ts` so the 3D gilded wall frames hanging along the Haveli gali display the new photos in WebGL.

---

### 2. User Experience & Visual Design

#### Thematic Milestone Photo Mapping

| Milestone / Interaction | Theme & Atmosphere | Selected Couple Photo |
| :--- | :--- | :--- |
| **Start Screen Polaroid** | Golden festive beginning | **Festive Yellow & Black Outfits** (`file_0000000081d882078ae16a2e9c29c523.png`) |
| **The First Diya** | Traditional Indian attire, warmth | `file_0000000081d882078ae16a2e9c29c523.png` |
| **Our Rangoli** | Sunny outdoor celebration, bright colors | `IMG_20260114_155204_0605.jpg` |
| **Sitting Together (Bench)** | Quiet warmth, leaning on each other | `20260228001404989.jpg` (Head resting on shoulder) |
| **The Kandils** | Glowing lanterns & nighttime colors | `Snapchat-537623757.jpg` (Purple night glow) |
| **The Sky Lantern** | Tender wish, timeless memory | `Snapchat-1070186186.jpg` (B&W butterfly portrait) |
| **The Chakri** | Fun, laugh, carefree motion | `Snapchat-1917563654.jpg` (Mall fun & laugh) |
| **The Rocket** | Night walk under city stars | `Snapchat-2055378884.jpg` (Evening smile together) |
| **The Anar** | Close radiant smiles & bright eyes | `IMG_20260114_160653.jpg` (Close-up cute expression) |
| **Phuljhadi (Sparklers)** | Silly faces, playful sparkling joy | `20261001010756412.jpg` (Goofy tongue-out selfie) |
| **The Temple Bell** | Formal blessings & timeless elegance | `1766500175133.jpg` (Campus courtyard portrait) |
| **Mithai Ghar** | Sweet moments & treats together | `IMG20260424134939.jpg` (Canteen snack date) |

#### Full 15-Photo Scrapbook Album
The in-game album (`📸 15 Photos`) will feature:
- Clean segmented filter tabs: **All (15)**, **Festive**, **Romance**, **Moments**, **Smile**, **Night**.
- High-contrast, tactile polaroid styling with warm cream paper cards, gold foil borders, and subtle rotation angles.
- Fullscreen zoomable lightbox with previous/next navigation buttons and keyboard arrow key controls.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Thematic vs. Random Placement**
  - *Chosen*: Thematic matching (as selected by the user). Romantic moments match quiet activities (sitting, mandir bell, sky lantern), while high-energy/fun photos match fireworks (anar, chakri, sparklers).
  - *Why*: Deepens emotional resonance and connects each 3D interaction directly to the photograph revealed.
- **Decision 2: 3D Texture Loading Optimization**
  - *Chosen*: Load the 3D wall frames using Three.js `TextureLoader` with `sRGBEncoding` and lightweight mesh planes.
  - *Why*: Maintains high 60fps rendering in the WebGL scene without frame drops while rendering real photography.

---

### 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface Layer                     │
├───────────────────────────────┬─────────────────────────────┤
│ TitleScreen (Polaroid)        │ HUD Top Bar (📸 15 Photos) │
├───────────────────────────────┼─────────────────────────────┤
│ MemoryModal (Interactive Card)│ ScrapbookModal (15 Photos)  │
├───────────────────────────────┴─────────────────────────────┤
│ GrandFinaleModal (Recap Strip & Replay Fireworks)           │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      Data & Rules Layer                     │
├──────────────────────────────┬──────────────────────────────┤
│ src/data/photos.ts           │ COUPLE_PHOTOS (15 Items)     │
├──────────────────────────────┼──────────────────────────────┤
│ src/game/rules.ts            │ INITIAL_MEMORIES (photoUrl)  │
└──────────────────────────────┴──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                      3D World Scene                         │
├─────────────────────────────────────────────────────────────┤
│ src/game/environment.ts      │ 8 Gilded Wall Picture Frames │
└─────────────────────────────────────────────────────────────┘
```

---

### 5. Step-by-Step Execution Plan

1. **Update Data Definition (`src/data/photos.ts`)**:
   - Replace old array with the 15 photos, assigning rich captions, dates, titles, and category tags.
2. **Update Core Game Memories (`src/game/rules.ts`)**:
   - Update `photoUrl` and `photoCaption` for all 10 core milestones.
3. **Update Home Screen (`src/components/TitleScreen.tsx`)**:
   - Point polaroid image to `file_0000000081d882078ae16a2e9c29c523.png` (Yellow and black traditional attire).
4. **Update Scrapbook & Finale Components**:
   - Update `ScrapbookModal.tsx` and `GrandFinaleModal.tsx` to handle 15 photos smoothly.
5. **Update 3D Environment Wall Frames (`src/game/environment.ts`)**:
   - Update the 8 street wall photo frames to pull from the new photo indices.
6. **Compile & Lint Verification**:
   - Run `compile_applet` and `lint_applet` together to verify zero syntax or build errors.
