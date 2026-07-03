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
    .sound("gm_electric_guitar_clean").gain(.55).lpf(2600).room(.35),
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
    .sound("gm_electric_guitar_clean").gain(.55).lpf(2600).room(.35),
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
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.45),
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
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.4),
  note("<f#1 d1 a1 e1>")
    .sound("sawtooth").lpf(420).gain(.55),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.55).lpf(3200).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.35).room(.3).bank("RolandTR808"),
  s("hh*8").gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── VERSE — resolves to Amaj7 (I) ─────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – F#m7    |   ii – v – I – vi
const lush_verse = () => stack(
note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
    .add(note(perlin.range(0, 0.04)))     // organic warble ±0.04 semitones
    .vib(4.5)                          // 4.5 Hz vib
    .vibmod(0.06)                          // ±0.06 depth (subtle but present)
    .sound("gm_electric_guitar_clean").gain(.55).lpf(2600).room(.35),
note("<b1 e1 a1 a1>")
    .add(note(perlin.range(0, 0.05)))     // slightly deeper warble on bass
    .vib(3.5)                          // slower vib for weight
    .vibmod(0.07)
    .sound("sawtooth").lpf(420).gain(.6), 
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.7).lpf(3000).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.5).room(.25).bank("RolandTR808"),
s("hh*8")
    .add(note(perlin.range(0, 0.02)))     // shimmer on hi-hats
    .gain("[.4 .28]*4").bank("RolandTR808")
).swingBy(1/3, 8)
 
// ── CHORUS — lifts to Dmaj7 (IV) ──────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – Dmaj7   |   ii – v – I – IV
const lush_chorus = () => stack(
note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
    .add(note(perlin.range(0, 0.045)))    // slightly richer warble in chorus
    .vib(5)                            // brighter, faster vib for lift
    .vibmod(0.065)                         // slightly deeper
    .sound("gm_electric_guitar_clean").gain(.55).lpf(2600).room(.35),
note("<b1 e1 a1 d2>")
    .add(note(perlin.range(0, 0.055)))    // more prominent bass warble
    .vib(4)                            // steady, warm
    .vibmod(0.08)
    .sound("sawtooth").lpf(420).gain(.6),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.75).lpf(3000).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.55).room(.25).bank("RolandTR808"),
s("hh*8")
    .add(note(perlin.range(0, 0.025)))    // more shimmer in chorus
    .gain("[.45 .32]*4").bank("RolandTR808")
).swingBy(1/3, 8)
 
// ── BRIDGE — Mixolydian lift, floats out via ♭VII / chromatic ♭III ────────────
// Gmaj7 – Dmaj7 – Cmaj7 – Amaj7   |   ♭VII – IV – ♭III – I  (C is the surprise)
const lush_bridge = () => stack(
note("<[g3,b3,d4,f#4] [d3,f#3,a3,c#4] [c3,e3,g3,b3] [a3,c#4,e4,g#4]>")
    .add(note(perlin.range(0, 0.06)))     // deeper warble for floating tension
    .vib(5.5)                          // faster vib for unsettled feeling
    .vibmod(0.09)                          // deeper for drama
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.45),
note("<g1 d1 c1 a1>")
    .add(note(perlin.range(0, 0.07)))     // prominent warble underscores movement
    .vib(4.5)
    .vibmod(0.1)
    .sound("sawtooth").lpf(420).gain(.55),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.55).lpf(3200).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.35).room(.3).bank("RolandTR808"),
s("hh*8")
    .add(note(perlin.range(0, 0.03)))     // aerial shimmer
    .gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)
 
// ── REFRAIN — drops to the relative minor (F#m as home) ───────────────────────
// F#m9 – Dmaj7 – Amaj7 – E   |   i – VI – III – VII  in F# Aeolian
const lush_refrain = () => stack(
note("<[f#3,a3,c#4,e4,g#4] [d3,f#3,a3,c#4] [a3,c#4,e4,g#4] [e3,g#3,b3,d4]>")
    .add(note(perlin.range(0, 0.04)))     // subtle, introspective warble
    .vib(4)                            // gentle, meditative vib
    .vibmod(0.065)                         // warm but controlled
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.4),
note("<f#1 d1 a1 e1>")
    .add(note(perlin.range(0, 0.05)))     // grounded but expressive bass
    .vib(3.5)
    .vibmod(0.075)
    .sound("sawtooth").lpf(420).gain(.55),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.55).lpf(3200).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.35).room(.3).bank("RolandTR808"),
s("hh*8")
    .add(note(perlin.range(0, 0.02)))     // soft shimmer
    .gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)


// ── ARRANGEMENT — each [n, section] plays that section for n bars ──────────────
arrange(
  [8, lush_verse()],
  [8, lush_chorus()],
  [4, lush_refrain()], 
  [8, lush_verse()],
  [8, lush_chorus()],
  [4, lush_refrain()], 
  [4, lush_verse()],
  [8, lush_chorus()],
  [4, lush_refrain()],
  [4, lush_bridge()],
  [8, lush_chorus()],
)
