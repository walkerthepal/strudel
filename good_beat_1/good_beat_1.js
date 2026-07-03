// ══════════════════════════════════════════════════════════════════════════════
// SONG STRUCTURE: Verse → Chorus → Verse → Chorus → Bridge (AACB x4) → Chorus
// ══════════════════════════════════════════════════════════════════════════════

setcpm(84/4)

// ────────────────────────────────────────────────────────────────────────────
// VERSION A: Amaj7 resolution (I) — VERSE
// ────────────────────────────────────────────────────────────────────────────
const verseChords = () => note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [a3,c#4,e4,g#4]>")
  .sound("gm_clarinet")
  .gain(.55)
  .lpf(2600)
  .room(.35)

const verseBass = () => note("<b1 e1 a1 a1>")
  .sound("sawtooth")
  .lpf(420)
  .gain(.6)

const verseDrums = () => [
  s("bd ~ ~ bd ~ ~ bd ~").gain(.7).lpf(3000).bank("RolandTR808"),
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.5).room(.25).bank("RolandTR808"),
  s("hh*8").gain("[.4 .28]*4").bank("RolandTR808")
]

const verse = () => [
  verseChords(),
  verseBass(),
  ...verseDrums()
].map(x => x.swingBy(1/3, 8))

// ────────────────────────────────────────────────────────────────────────────
// VERSION B: Dmaj7 lift (IV) — CHORUS
// ────────────────────────────────────────────────────────────────────────────
const chorusChords = () => note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
  .sound("gm_clarinet")
  .gain(.55)
  .lpf(2600)
  .room(.35)

const chorusBass = () => note("<b1 e1 a1 d2>")
  .sound("sawtooth")
  .lpf(420)
  .gain(.6)

const chorusDrums = () => [
  s("bd ~ ~ bd ~ ~ bd ~").gain(.75).lpf(3000).bank("RolandTR808"), // slightly louder
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.55).room(.25).bank("RolandTR808"),
  s("hh*8").gain("[.45 .32]*4").bank("RolandTR808") // slightly brighter
]

const chorus = () => [
  chorusChords(),
  chorusBass(),
  ...chorusDrums()
].map(x => x.swingBy(1/3, 8))

// ────────────────────────────────────────────────────────────────────────────
// VERSION C: F#m7 deceptive (vi) — for bridge transition
// ────────────────────────────────────────────────────────────────────────────
const bridgeChords = () => note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
  .sound("gm_epiano1")
  .gain(.50)
  .lpf(2500)
  .room(.40)

const bridgeBass = () => note("<b1 e1 a1 f#1>")
  .sound("sawtooth")
  .lpf(420)
  .gain(.55)

const bridgeDrums = () => [
  s("bd ~ ~ bd ~ ~ bd ~").gain(.55).lpf(3200).bank("RolandTR808"), // stripped back
  s("~ ~ ~ ~ rim ~ ~ ~").gain(.35).room(.30).bank("RolandTR808"),
  s("hh*8").gain("[.3 .18]*4").bank("RolandTR808") // minimal hi-hats
]

const bridgeSection = () => [
  bridgeChords(),
  bridgeBass(),
  ...bridgeDrums()
].map(x => x.swingBy(1/3, 8))

// ────────────────────────────────────────────────────────────────────────────
// BRIDGE: AACB x4 (each bar is 8 beats, 4 bars = 32 beats per cycle)
// ────────────────────────────────────────────────────────────────────────────
const bridge = () => {
  const pattern = [
    "a", "a", "c", "b", // AACB cycle 1
    "a", "a", "c", "b", // cycle 2
    "a", "a", "c", "b", // cycle 3
    "a", "a", "c", "b"  // cycle 4
  ]
  
  return pattern.map(type => {
    switch(type) {
      case "a":
        return verse()
      case "b":
        return chorus()
      case "c":
        return bridgeSection()
      default:
        return verse()
    }
  }).flat()
}

// ────────────────────────────────────────────────────────────────────────────
// SONG STRUCTURE
// ────────────────────────────────────────────────────────────────────────────
stack(
  // Verse 1 (8 bars)
  verse(),
  
  // Chorus 1 (8 bars)
  chorus().timeRange(0.5, 1),
  
  // Verse 2 (8 bars)
  verse().timeRange(1, 1.5),
  
  // Chorus 2 (8 bars)
  chorus().timeRange(1.5, 2),
  
  // Bridge: AACB x4 (32 bars)
  bridge().timeRange(2, 4),
  
  // Chorus 3 - Final (8 bars)
  chorus().timeRange(4, 4.5)
)
