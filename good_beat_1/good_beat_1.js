// ══════════════════════════════════════════════════════════════════════════════
// SONG: Verse → Chorus → Verse → Chorus → Bridge (AACB) → Chorus
// KEY: A major.  Shared progression: Bm7 – Em9 – Amaj7 – [resolution chord]
//                                    ii  –  v  –  I   –  (changes per section)
// Note: Em9 is a MINOR v (G♮, borrowed from A Mixolydian) — mellow, non-dominant.
// setcpm(84/4) => 84 bpm, 1 cycle = 1 bar (4 beats)
// ══════════════════════════════════════════════════════════════════════════════
setcpm(84/4)

// ── VERSE — resolves to Amaj7 (I) ─────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – F#m7    |   ii – v – I – vi
const verse = () => stack(
  note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
    .sound("gm_epiano1").gain(.55).lpf(2600).room(.35),
  note("<b1 e1 a1 a1>")
    .sound("sawtooth").lpf(420).gain(.6), 
  s("bd ~ ~ bd ~ ~ bd ~").gain(.7).lpf(3000).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.5).room(.25).bank("RolandTR808"),
  s("hh*8").gain("[.4 .28]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── CHORUS — lifts to Dmaj7 (IV) ──────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – Dmaj7   |   ii – v – I – IV
const chorus = () => stack(
  note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
    .sound("gm_epiano1").gain(.55).lpf(2600).room(.35),
  note("<b1 e1 a1 d2>")
    .sound("sawtooth").lpf(420).gain(.6),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.75).lpf(3000).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.55).room(.25).bank("RolandTR808"),
  s("hh*8").gain("[.45 .32]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── BRIDGE SECTION — deceptive turn to F#m7 (vi) ──────────────────────────────
// Bm7 – Em9 – Amaj7 – F#m7    |   ii – v – I – vi
const bridgeSection = () => stack(
  note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
    .sound("gm_epiano1").gain(.5).lpf(2500).room(.4),
  note("<b1 e1 a1 f#1>")
    .sound("sawtooth").lpf(420).gain(.55),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.55).lpf(3200).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.35).room(.3).bank("RolandTR808"),
  s("hh*8").gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── ARRANGEMENT — each [n, section] plays that section for n bars ──────────────
arrange(
  [8, verse()],         // Verse 1
  [8, chorus()],        // Chorus 1
  [8, verse()],         // Verse 2
  [8, chorus()],        // Chorus 2
  [4, verse()],         // Bridge: A
  [4, verse()],         //         A
  [4, bridgeSection()], //         C
  [4, bridgeSection()], //         C
  [4, chorus()],        //         B
  [8, chorus()]         // Final Chorus
)
