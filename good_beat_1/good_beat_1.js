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

// ── BRIDGE — Mixolydian lift, floats out via ♭VII / chromatic ♭III ────────────
// Gmaj7 – Dmaj7 – Cmaj7 – Amaj7   |   ♭VII – IV – ♭III – I  (C is the surprise)
const bridge = () => stack(
  note("<[g3,b3,d4,f#4] [d3,f#3,a3,c#4] [c3,e3,g3,b3] [a3,c#4,e4,g#4]>")
    .sound("gm_epiano1").gain(.5).lpf(2500).room(.45),
  note("<g1 d1 c1 a1>")
    .sound("sawtooth").lpf(420).gain(.55),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.55).lpf(3200).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.35).room(.3).bank("RolandTR808"),
  s("hh*8").gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── REFRAIN — drops to the relative minor (F#m as home) ───────────────────────
// F#m9 – Dmaj7 – Amaj7 – E   |   i – VI – III – VII  in F# Aeolian
const refrain = () => stack(
  note("<[f#3,a3,c#4,e4,g#4] [d3,f#3,a3,c#4] [a3,c#4,e4,g#4] [e3,g#3,b3,d4]>")
    .sound("gm_epiano1").gain(.5).lpf(2500).room(.4),
  note("<f#1 d1 a1 e1>")
    .sound("sawtooth").lpf(420).gain(.55),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.55).lpf(3200).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.35).room(.3).bank("RolandTR808"),
  s("hh*8").gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── ARRANGEMENT — each [n, section] plays that section for n bars ──────────────
arrange(
  [8, verse()],
  [8, chorus()],
  [4, refrain()], 
  [8, verse()],
  [8, chorus()],
  [4, refrain()], 
  [4, verse()],
  [8, chorus()],
  [4, refrain()],
  [4, bridge()],
  [8, chorus()],
)
