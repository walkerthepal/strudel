// ══════════════════════════════════════════════════════════════════════════════
// SONG: Verse → Chorus → Verse → Chorus → Bridge (AACB) → Chorus
// KEY: A major.  Shared progression: Bm7 – Em9 – Amaj7 – [resolution chord]
//                                    ii  –  v  –  I   –  (changes per section)
// Note: Em9 is a MINOR v (G♮, borrowed from A Mixolydian) — mellow, non-dominant.
// setcpm(84/4) => 84 bpm, 1 cycle = 1 bar (4 beats)
// ══════════════════════════════════════════════════════════════════════════════
setcpm(84/4)

// ══════════════════════════════════════════════════════════════════════════════
// HORNS — a small brass section: SHARED melody on trumpet + French horn (bright
// lead over a warm middle, panned apart), with fat trombone stabs on the offbeats.
// Kept low & sparse so the guitar/bass theme stays out front. All lines are pure
// chord tones — chill and diatonic.
// ══════════════════════════════════════════════════════════════════════════════
const horns = (mel, stab) => stack(
  //note(mel).sound("gm_trumpet")                       // bright lead
  // .gain(.15).lpf(2600).room(.4).vib(4).vibmod(.05).pan(.4),
  note(mel).sound("gm_french_horn")                   // warm double — rounds the trumpet
    .gain(.13).lpf(2200).room(.4).pan(.6),
  note(stab).sound("gm_trombone")                     // fat low stabs (and-of-2, and-of-4)
    .gain(.14).lpf(1800).room(.35).pan(.5)
)

// VERSE  : Bm7 – Em9 – Amaj7 – F#m7
const verseMel  = "<[~ f#4 ~ a4 ~ ~ b4 ~] [~ b4 ~ a4 ~ g4 ~ f#4] [e4 ~ ~ g#4 a4 ~ ~ ~] [~ c#4 ~ d4 c#4 ~ ~ ~]>"
const verseStab = "<[~ ~ ~ [f#4,a4] ~ ~ ~ [f#4,a4]] [~ ~ ~ [g4,b4] ~ ~ ~ [b4,d5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [c#4,e4] ~ ~ ~ [a4,c#5]]>"
// CHORUS : Bm7 – Em9 – Amaj7 – Dmaj7     (lifts higher into the IV)
const chorMel   = "<[~ f#4 ~ a4 ~ ~ b4 ~] [~ b4 ~ a4 ~ g4 ~ f#4] [e4 ~ ~ g#4 a4 ~ ~ ~] [~ f#4 ~ a4 ~ c#5 ~ d5]>"
const chorStab  = "<[~ ~ ~ [f#4,a4] ~ ~ ~ [f#4,a4]] [~ ~ ~ [g4,b4] ~ ~ ~ [b4,d5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [a4,d5] ~ ~ ~ [f#4,a4]]>"
// BRIDGE : Gmaj7 – Dmaj7 – Cmaj7 – Amaj7 (chord tones only)
const bridMel   = "<[~ g4 ~ b4 ~ ~ d5 ~] [~ f#4 ~ a4 ~ ~ c#5 ~] [~ e4 ~ g4 ~ ~ b4 ~] [~ e4 ~ g#4 ~ a4 ~ ~]>"
const bridStab  = "<[~ ~ ~ [g4,b4] ~ ~ ~ [b4,d5]] [~ ~ ~ [f#4,a4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [e4,g4] ~ ~ ~ [g4,b4]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]]>"
// REFRAIN: F#m9 – Dmaj7 – Amaj7 – E
const refrMel   = "<[~ c#4 ~ e4 ~ ~ g#4 ~] [~ f#4 ~ a4 ~ ~ c#5 ~] [e4 ~ ~ g#4 a4 ~ ~ ~] [~ b4 ~ g#4 ~ f#4 ~ e4]>"
const refrStab  = "<[~ ~ ~ [c#4,e4] ~ ~ ~ [e4,g#4]] [~ ~ ~ [f#4,a4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [e4,g#4]]>"

// ── VERSE — resolves to Amaj7 (I) ─────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – F#m7    |   ii – v – I – vi
const verse = () => stack(
  //note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
  //  .sound("gm_epiano1").gain(.55).lpf(2600).room(.35),
  note("<[b1 ~ ~ b1 ~ f#2 ~ ~] [e1 ~ ~ e1 ~ b1 ~ ~] [a1 ~ ~ a1 ~ e2 ~ ~] [f#1 ~ ~ f#1 ~ c#2 ~ e2]>")
    .sound("sawtooth").lpf(760).gain(.6),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.7).lpf(3000).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.5).room(.25).bank("RolandTR808"),
  s("hh*8")
    .add(note(perlin.range(0, 0.02)))     // shimmer on hi-hats
    .gain("[.4 .28]*4").bank("RolandTR808"),
horns(verseMel, verseStab)
).swingBy(1/3, 8)

// ── CHORUS — lifts to Dmaj7 (IV) ──────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – Dmaj7   |   ii – v – I – IV
const chorus = () => stack(
  note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
    .sound("gm_electric_guitar_clean").gain(.55).lpf(2600).room(.35),
  note("<[b1 ~ ~ b1 f#2 ~ ~ b2] [e1 ~ ~ e1 b1 ~ ~ e2] [a1 ~ ~ a1 e2 ~ ~ a2] [d2 ~ ~ d2 a1 ~ ~ d2]>")
    .sound("sawtooth").lpf(760).gain(.6),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.75).lpf(3000).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.55).room(.25).bank("RolandTR808"),
  s("hh*8").gain("[.45 .32]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── BRIDGE — Mixolydian lift, floats out via ♭VII / chromatic ♭III ────────────
// Gmaj7 – Dmaj7 – Cmaj7 – Amaj7   |   ♭VII – IV – ♭III – I  (C is the surprise)
const bridge = () => stack(
  note("<[g3,b3,d4,f#4] [d3,f#3,a3,c#4] [c3,e3,g3,b3] [a3,c#4,e4,g#4]>")
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.45),
  note("<[g1 ~ ~ g1 ~ d2 ~ ~] [d1 ~ ~ d1 ~ a1 ~ ~] [c1 ~ ~ c1 ~ g1 ~ ~] [a1 ~ ~ a1 ~ e2 ~ ~]>")
    .sound("sawtooth").lpf(760).gain(.55),
  s("bd ~ ~ bd ~ ~ bd ~").gain(.55).lpf(3200).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.35).room(.3).bank("RolandTR808"),
  s("hh*8").gain("[.3 .18]*4").bank("RolandTR808")
).swingBy(1/3, 8)

// ── REFRAIN — drops to the relative minor (F#m as home) ───────────────────────
// F#m9 – Dmaj7 – Amaj7 – E   |   i – VI – III – VII  in F# Aeolian
const refrain = () => stack(
  note("<[f#3,a3,c#4,e4,g#4] [d3,f#3,a3,c#4] [a3,c#4,e4,g#4] [e3,g#3,b3,d4]>")
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.4),
  note("<[f#1 ~ ~ ~ c#2 ~ f#1 ~] [d1 ~ ~ ~ a1 ~ d1 ~] [a1 ~ ~ ~ e2 ~ a1 ~] [e1 ~ ~ ~ b1 ~ e1 e2]>")
    .sound("sawtooth").lpf(760).gain(.55),
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
note("<[b1 ~ ~ b1 ~ f#2 ~ ~] [e1 ~ ~ e1 ~ b1 ~ ~] [a1 ~ ~ a1 ~ e2 ~ ~] [f#1 ~ ~ f#1 ~ c#2 ~ e2]>")
    .add(note(perlin.range(0, 0.05)))     // slightly deeper warble on bass
    .vib(3.5)                          // slower vib for weight
    .vibmod(0.07)
    .sound("sawtooth").lpf(760).gain(.6),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.7).lpf(3000).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.5).room(.25).bank("RolandTR808"),
s("hh*8")
    .add(note(perlin.range(0, 0.02)))     // shimmer on hi-hats
    .gain("[.4 .28]*4").bank("RolandTR808"),
horns(verseMel, verseStab)                 // brass section: shared melody + trombone stabs
).swingBy(1/3, 8)
 
// ── CHORUS — lifts to Dmaj7 (IV) ──────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – Dmaj7   |   ii – v – I – IV
const lush_chorus = () => stack(
note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
    .add(note(perlin.range(0, 0.045)))    // slightly richer warble in chorus
    .vib(5)                            // brighter, faster vib for lift
    .vibmod(0.065)                         // slightly deeper
    .sound("gm_electric_guitar_clean").gain(.55).lpf(2600).room(.35),
note("<[b1 ~ ~ b1 f#2 ~ ~ b2] [e1 ~ ~ e1 b1 ~ ~ e2] [a1 ~ ~ a1 e2 ~ ~ a2] [d2 ~ ~ d2 a1 ~ ~ d2]>")
    .add(note(perlin.range(0, 0.055)))    // more prominent bass warble
    .vib(4)                            // steady, warm
    .vibmod(0.08)
    .sound("sawtooth").lpf(760).gain(.6),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.75).lpf(3000).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.55).room(.25).bank("RolandTR808"),
s("~ hh hh hh hh hh hh hh")
    .add(note(perlin.range(0, 0.025)))    // more shimmer in chorus
    .gain("[.45 .32]*4").bank("RolandTR808"),
horns(chorMel, chorStab)                   // brass section: shared melody + trombone stabs
).swingBy(1/3, 8)
 
// ── BRIDGE — Mixolydian lift, floats out via ♭VII / chromatic ♭III ────────────
// Gmaj7 – Dmaj7 – Cmaj7 – Amaj7   |   ♭VII – IV – ♭III – I  (C is the surprise)
const lush_bridge = () => stack(
note("<[g3,b3,d4,f#4] [d3,f#3,a3,c#4] [c3,e3,g3,b3] [a3,c#4,e4,g#4]>")
    .add(note(perlin.range(0, 0.06)))     // deeper warble for floating tension
    .vib(5.5)                          // faster vib for unsettled feeling
    .vibmod(0.09)                          // deeper for drama
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.45),
note("<[g1 ~ ~ g1 ~ d2 ~ ~] [d1 ~ ~ d1 ~ a1 ~ ~] [c1 ~ ~ c1 ~ g1 ~ ~] [a1 ~ ~ a1 ~ e2 ~ ~]>")
    .add(note(perlin.range(0, 0.07)))     // prominent warble underscores movement
    .vib(4.5)
    .vibmod(0.1)
    .sound("sawtooth").lpf(760).gain(.55),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.55).lpf(3200).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.35).room(.3).bank("RolandTR808"),
s("~ ~ hh hh hh hh hh hh")
    .add(note(perlin.range(0, 0.03)))     // aerial shimmer
    .gain("[.3 .18]*4").bank("RolandTR808"),
horns(bridMel, bridStab)                   // brass section: shared melody + trombone stabs
).swingBy(1/3, 8)
 
// ── REFRAIN — drops to the relative minor (F#m as home) ───────────────────────
// F#m9 – Dmaj7 – Amaj7 – E   |   i – VI – III – VII  in F# Aeolian
const lush_refrain = () => stack(
note("<[f#3,a3,c#4,e4,g#4] [d3,f#3,a3,c#4] [a3,c#4,e4,g#4] [e3,g#3,b3,d4]>")
    .add(note(perlin.range(0, 0.04)))     // subtle, introspective warble
    .vib(4)                            // gentle, meditative vib
    .vibmod(0.065)                         // warm but controlled
    .sound("gm_electric_guitar_clean").gain(.5).lpf(2500).room(.4),
note("<[f#1 ~ ~ ~ c#2 ~ f#1 ~] [d1 ~ ~ ~ a1 ~ d1 ~] [a1 ~ ~ ~ e2 ~ a1 ~] [e1 ~ ~ ~ b1 ~ e1 e2]>")
    .add(note(perlin.range(0, 0.05)))     // grounded but expressive bass
    .vib(3.5)
    .vibmod(0.075)
    .sound("sawtooth").lpf(760).gain(.55),
s("bd ~ ~ bd ~ ~ bd ~")
    .gain(.55).lpf(3200).bank("RolandTR808"),
s("~ ~ ~ ~ rim ~ ~ ~")
    .gain(.35).room(.3).bank("RolandTR808"),
s("hh*8")
    .add(note(perlin.range(0, 0.02)))     // soft shimmer
    .gain("[.3 .18]*4").bank("RolandTR808"),
horns(refrMel, refrStab)                   // brass section: shared melody + trombone stabs
).swingBy(1/3, 8)


// ── ARRANGEMENT — each [n, section] plays that section for n bars ──────────────
arrange(
  [4, verse()],
  [4, lush_verse()],
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
