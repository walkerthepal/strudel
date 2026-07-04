// ══════════════════════════════════════════════════════════════════════════════
// SONG: Verse → Chorus → Verse → Chorus → Bridge (AACB) → Chorus → Outro
// KEY: A major.  Shared progression: Bm7 – Em9 – Amaj7 – [resolution chord]
//                                    ii  –  v  –  I   –  (changes per section)
// Note: Em9 is a MINOR v (G♮, borrowed from A Mixolydian) — mellow, non-dominant.
// setcpm(84/4) => 84 bpm, 1 cycle = 1 bar (4 beats)
//
// REVISION NOTES (implemented from analysis):
//   1. Swing now varies per section: verse 1/3 (classic), chorus .30 (tighter
//      pocket), refrain .36 (laid-back exhale), bridge .25 (nearly straight —
//      floats, and makes the final chorus's swing land harder on return).
//   2. Ghost rim layer added to verse + lush_verse (soft hits framing the
//      backbeat — the "drummer, not machine" fill the choruses already had).
//   3. Micro-humanization: occasional tiny .speed() on kicks (slight pitch
//      variation ≈ inconsistent stick strike) and .late() nudges on hats.
//   4. Horn stereo image widened: trumpet .25 / french horn .75 (was .4/.6).
//   5. Outro dissolves instead of hard-stopping: delay + bigger room on the
//      guitar, and 2 bars of silence appended so the tails actually decay.
//   6. Epiano melody enters bar 5 of the 8-bar middle verse — octave down,
//      warm timbre, masks silence on bars 1–4 to fill the vamping stretch.
// ══════════════════════════════════════════════════════════════════════════════
setcpm(84 / 4);

// ══════════════════════════════════════════════════════════════════════════════
// HORNS — trumpet + French horn share the melody (panned WIDE apart), trombone
// plays short LOW stabs (voicings dropped an octave, clipped short). Deployed
// per section so the entrance is an event: tacet in the intro verse, stabs-only
// in the lush verse, full section in chorus/bridge, soft solo horn in refrain.
// ══════════════════════════════════════════════════════════════════════════════
const horns = (mel, stab) =>
  stack(
    note(mel)
      .sound("gm_trumpet") // bright lead
      .gain(0.22)
      .lpf(2600)
      .room(0.4)
      .pan(0.25), // widened: hard-ish left (pan is 0..1 in Strudel)
    note(mel)
      .sound("gm_french_horn") // warm double — rounds the trumpet
      .gain(0.18)
      .lpf(2200)
      .room(0.4)
      .pan(0.75), // widened: hard-ish right — now reads as two players
    note(stab)
      .sub(note(12)) // fat low stabs (and-of-2, and-of-4)
      .sound("gm_trombone")
      .gain(0.25)
      .lpf(1400)
      .room(0.35)
      .clip(0.4)
      .pan(0.5), // low stab stays anchored center
  );
const hornStabs = (stab) =>
  note(stab)
    .sub(note(12))
    .sound("gm_trombone")
    .gain(0.25)
    .lpf(1400)
    .room(0.35)
    .clip(0.4);
const hornMel = (mel) =>
  note(mel).sound("gm_french_horn").gain(0.2).lpf(2200).room(0.4);

// ══════════════════════════════════════════════════════════════════════════════
// BASS — fingered P-bass, Jamerson-style. Sound: foam-mute decay (clip), gentle
// drive for thickness (shape), lpf keeps low end + mid growl and rolls off the
// string zing; a sine sub doubles the line underneath for weight. Lines: roots
// lock the kick (1, &-of-2), octave pop after beat 3, chromatic approach note
// into every chord change; runs saved for the 4-bar turns.
// ══════════════════════════════════════════════════════════════════════════════
const pBass = (line) =>
  stack(
    note(line)
      .add(note(perlin.range(0, 0.03))) // organic pitch drift, no vibrato — muted flatwounds don't sing
      .sound("gm_electric_bass_finger")
      .clip(0.85) // foam-mute: notes speak, then get out of the way
      .shape(0.3) // gentle drive = thickness
      .lpf(1250) // low end + mid presence
      .gain(0.75),
    note(line).sound("sine").clip(0.6).lpf(150).gain(0.25), // sub glue under the fingers
  );

// Ghosted dead-notes — choked 16th thumps on the "a" of beats 1 & 2, pitched to
// each bar's root. The left-hand mute skip: felt, not heard.
const bassGhosts = (roots) =>
  note(roots)
    .struct("~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~ ~ ~ ~")
    .sound("gm_electric_bass_finger")
    .clip(0.15) // choked — a thump, not a pitch
    .lpf(700) // darker than the spoken notes
    .gain(0.22)
    .sometimesBy(0.3, (x) => x.gain(0.15)); // no two ghosts alike

// ── SHARED DRUM VOICES (humanized) ────────────────────────────────────────────
// Kick: occasional tiny speed bump = slight pitch variation, like an off-center
// stick strike. Hats: occasional 2ms-ish late nudge = hand drift, not a machine.
const kick = (pat, g, cutoff) =>
  s(pat)
    .gain(g)
    .lpf(cutoff)
    .sometimesBy(0.15, (x) => x.speed(1.02)) // micro pitch-humanize
    .bank("RolandTR808");
const hats = (pat, gains) =>
  s(pat)
    .add(note(perlin.range(0, 0.02))) // shimmer
    .gain(gains)
    .sometimesBy(0.15, (x) => x.late(0.002)) // hand drift (~6ms at 84bpm)
    .bank("RolandTR808");
// Ghost rims — soft hits framing the backbeat (verse-weight version of the
// chorus's sd ghosts). Felt, not heard.
const rimGhosts = () =>
  s("~ ~ rim ~ ~ ~ [~ rim] ~")
    .gain(0.12)
    .room(0.2)
    .sometimesBy(0.4, (x) => x.gain(0.08)) // no two ghosts alike
    .bank("RolandTR808");

// VERSE  : Bm7 – Em9 – Amaj7 – F#m7 — b7 on beat 4, chromatic g→g#→a, E#→f#
const verseBass =
  "<[b1 ~ ~ ~ ~ ~ b1 ~ b2 ~ f#2 ~ a1 ~ f#1 f1] [e1 ~ ~ ~ ~ ~ e1 ~ e2 ~ b1 ~ g1 ~ g#1 ~] [a1 ~ ~ ~ ~ ~ a1 ~ a2 ~ e2 ~ c#2 ~ ~ f1] [f#1 ~ ~ ~ ~ ~ f#1 ~ c#2 ~ e2 ~ f#2 ~ a1 a#1]>";
// CHORUS : Bm7 – Em9 – Amaj7 – Dmaj7 — octave pops, walk-down at the turn
const chorBass =
  "<[b1 ~ ~ ~ ~ ~ b1 ~ f#2 ~ b2 ~ ~ a1 ~ f1] [e1 ~ ~ ~ ~ ~ e1 ~ b1 ~ e2 ~ d2 ~ g#1 ~] [a1 ~ ~ ~ ~ ~ a1 ~ e2 ~ a2 ~ ~ ~ c#2 ~] [d2 ~ ~ ~ ~ ~ d2 ~ a1 ~ d2 ~ e2 ~ c#2 a#1]>";
// BRIDGE : Gmaj7 – Dmaj7 – Cmaj7 – Amaj7 — sparse root/fifth/third, floats
const bridBass =
  "<[g1 ~ ~ ~ ~ ~ g1 ~ ~ ~ d2 ~ ~ ~ b1 ~] [d1 ~ ~ ~ ~ ~ d1 ~ ~ ~ a1 ~ ~ ~ f#1 ~] [c1 ~ ~ ~ ~ ~ c1 ~ ~ ~ g1 ~ ~ ~ e1 ~] [a1 ~ ~ ~ ~ ~ a1 ~ ~ ~ e2 ~ c#2 ~ a#1 ~]>";
// REFRAIN: F#m9 – Dmaj7 – Amaj7 – E — exhale: gentle walk-downs, octave lift out
const refrBass =
  "<[f#1 ~ ~ ~ ~ ~ ~ ~ c#2 ~ ~ ~ f#1 ~ e1 ~] [d1 ~ ~ ~ ~ ~ ~ ~ a1 ~ ~ ~ d1 ~ g#1 ~] [a1 ~ ~ ~ ~ ~ ~ ~ e2 ~ ~ ~ a1 ~ f#1 ~] [e1 ~ ~ ~ ~ ~ ~ ~ b1 ~ ~ ~ e1 ~ e2 ~]>";

// VERSE  : Bm7 – Em9 – Amaj7 – F#m7
const verseMel =
  "<[~ f#4 ~ a4 ~ ~ b4 ~] [~ b4 ~ a4 ~ g4 ~ f#4] [e4 ~ ~ g#4 a4 ~ ~ ~] [~ c#4 ~ d4 c#4 ~ ~ ~]>";
const verseStab =
  "<[~ ~ ~ [f#4,a4] ~ ~ ~ [f#4,a4]] [~ ~ ~ [g4,b4] ~ ~ ~ [b4,d5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [c#4,e4] ~ ~ ~ [a4,c#5]]>";
// CHORUS : Bm7 – Em9 – Amaj7 – Dmaj7     (lifts higher into the IV)
// Hook: one repeated rhythmic cell — pickup on the &-of-2, land on 3 (7th→root→3rd)
const chorMel =
  "<[~ ~ ~ [~ a4] b4 ~ d5 ~] [~ ~ ~ [~ f#4] g4 ~ b4 ~] [~ ~ ~ [~ g#4] a4 ~ c#5 ~] [~ ~ ~ [~ c#5] d5 ~ a4 ~]>";
const chorStab =
  "<[~ ~ ~ [f#4,a4] ~ ~ ~ [f#4,a4]] [~ ~ ~ [g4,b4] ~ ~ ~ [b4,d5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [a4,d5] ~ ~ ~ [f#4,a4]]>";
// BRIDGE : Gmaj7 – Dmaj7 – Cmaj7 – Amaj7 (chord tones only)
const bridMel =
  "<[~ g4 ~ b4 ~ ~ d5 ~] [~ f#4 ~ a4 ~ ~ c#5 ~] [~ e4 ~ g4 ~ ~ b4 ~] [~ e4 ~ g#4 ~ a4 ~ ~]>";
const bridStab =
  "<[~ ~ ~ [g4,b4] ~ ~ ~ [b4,d5]] [~ ~ ~ [f#4,a4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [e4,g4] ~ ~ ~ [g4,b4]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]]>";
// REFRAIN: F#m9 – Dmaj7 – Amaj7 – E
const refrMel =
  "<[~ c#4 ~ e4 ~ ~ g#4 ~] [~ f#4 ~ a4 ~ ~ c#5 ~] [e4 ~ ~ g#4 a4 ~ ~ ~] [~ b4 ~ g#4 ~ f#4 ~ e4]>";
const refrStab =
  "<[~ ~ ~ [c#4,e4] ~ ~ ~ [e4,g#4]] [~ ~ ~ [f#4,a4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [a4,c#5]] [~ ~ ~ [g#4,b4] ~ ~ ~ [e4,g#4]]>";

// ── SECTION SWING MAP — the pocket is part of the arrangement now ─────────────
const VERSE_SWING = 1 / 3; // classic triplet swing — the home feel
const CHORUS_SWING = 0.3; // tighter pocket — the chorus drives, not lopes
const REFRAIN_SWING = 0.36; // laid back — post-chorus exhale drags a hair
const BRIDGE_SWING = 0.25; // nearly straight — floats; return of full swing
//                            in the last chorus is its own event

// ── VERSE — resolves to Amaj7 (I) ─────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – F#m7    |   ii – v – I – vi
const verse = () =>
  stack(
    //note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
    //  .sound("gm_epiano1").gain(.55).lpf(2600).room(.35),
    pBass(verseBass),
    bassGhosts("<b1 e1 a1 f#1>"), // dead-note skip under the verse roots
    kick("bd ~ ~ bd ~ ~ bd ~", 0.7, 3000),
    s("~ ~ ~ ~ rim ~ ~ ~")
      .gain(0.5)
      .room(0.25)
      .sometimesBy(0.3, (x) => x.gain(0.4)) // humanize the backbeat
      .bank("RolandTR808"),
    rimGhosts(), // NEW — soft ghosts framing the backbeat
    hats("hh*8", "[.35 .24]*4"),
    s("<~ ~ ~ [~ ~ ~ [rim ~ mt lt]]>") // beat-4 pickup — same x~xx rhythm as the bass walk-up
      .gain(0.3)
      .lpf(2500)
      .room(0.25)
      .bank("RolandTR808"),
  ).swingBy(VERSE_SWING, 8); // horns tacet — intro is bass + drums only

// ── CHORUS — lifts to Dmaj7 (IV) ──────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – Dmaj7   |   ii – v – I – IV
// (Currently unused in the arrangement — kept in sync with lush_chorus's feel.)
const chorus = () =>
  stack(
    note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
      .sound("gm_electric_guitar_clean")
      .gain(0.55)
      .lpf(2600)
      .room(0.35),
    pBass(chorBass),
    kick("bd ~ ~ bd ~ ~ bd ~", 0.75, 3000),
    s("~ ~ ~ ~ rim ~ ~ ~").gain(0.55).room(0.25).bank("RolandTR808"),
    hats("hh*8", "[.45 .32]*4"),
  ).swingBy(CHORUS_SWING, 8);

// ── BRIDGE — Mixolydian lift, floats out via ♭VII / chromatic ♭III ────────────
// Gmaj7 – Dmaj7 – Cmaj7 – Amaj7   |   ♭VII – IV – ♭III – I  (C is the surprise)
// (Currently unused in the arrangement — kept in sync with lush_bridge's feel.)
const bridge = () =>
  stack(
    note("<[g3,b3,d4,f#4] [d3,f#3,a3,c#4] [c3,e3,g3,b3] [a3,c#4,e4,g#4]>")
      .sound("gm_electric_guitar_clean")
      .gain(0.5)
      .lpf(2500)
      .room(0.45),
    pBass(bridBass),
    kick("bd ~ ~ bd ~ ~ bd ~", 0.55, 3200),
    s("~ ~ ~ ~ rim ~ ~ ~").gain(0.35).room(0.3).bank("RolandTR808"),
    hats("hh*8", "[.3 .18]*4"),
  ).swingBy(BRIDGE_SWING, 8);

// ── REFRAIN — drops to the relative minor (F#m as home) ───────────────────────
// F#m9 – Dmaj7 – Amaj7 – E   |   i – VI – III – VII  in F# Aeolian
// (Currently unused in the arrangement — kept in sync with lush_refrain's feel.)
const refrain = () =>
  stack(
    note("<[f#3,a3,c#4,e4,g#4] [d3,f#3,a3,c#4] [a3,c#4,e4,g#4] [e3,g#3,b3,d4]>")
      .sound("gm_electric_guitar_clean")
      .gain(0.5)
      .lpf(2500)
      .room(0.4),
    pBass(refrBass),
    kick("bd ~ ~ bd ~ ~ bd ~", 0.55, 3200),
    s("~ ~ ~ ~ rim ~ ~ ~").gain(0.35).room(0.3).bank("RolandTR808"),
    hats("hh*8", "[.3 .18]*4"),
  ).swingBy(REFRAIN_SWING, 8);

// ── VERSE — resolves to Amaj7 (I) ─────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – F#m7    |   ii – v – I – vi
const lush_verse = () =>
  stack(
    note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
      .struct("<[~ x@4 x@3]!3 [~ x@4 x@2 ~]>") // off-beat comp; bar 4's last hit shortened — the &-of-4 belongs to the push
      .add(note(perlin.range(0, 0.04))) // organic warble ±0.04 semitones
      .vib(4.5) // 4.5 Hz vib
      .vibmod(0.06) // ±0.06 depth (subtle but present)
      .sound("gm_electric_guitar_clean")
      .gain(0.55)
      .lpf(2600)
      .room(0.35),
    note("<~ ~ ~ [~ ~ ~ [~ [b3,d4,f#4,a4]]]>") // push — next phrase's Bm7 anticipated on the &-of-4, with the bass walk-up
      .vib(4.5)
      .vibmod(0.06)
      .sound("gm_electric_guitar_clean")
      .gain(0.5)
      .lpf(2600)
      .room(0.35)
      .clip(3), // rings across the barline, covering bar 1's beat-1 rest
    pBass(verseBass),
    bassGhosts("<b1 e1 a1 f#1>"), // dead-note skip under the verse roots
    kick("bd ~ ~ bd ~ ~ bd ~", 0.7, 3000),
    s("~ ~ ~ ~ rim ~ ~ ~")
      .gain(0.5)
      .room(0.25)
      .sometimesBy(0.3, (x) => x.gain(0.4)) // humanize the backbeat
      .bank("RolandTR808"),
    rimGhosts(), // NEW — soft ghosts framing the backbeat
    hats("hh*8", "[.35 .24]*4"),
    s("<~ ~ ~ [~ ~ ~ [rim ~ mt lt]]>") // beat-4 pickup — same x~xx rhythm as the bass walk-up
      .gain(0.3)
      .lpf(2500)
      .room(0.25)
      .bank("RolandTR808"),
    hornStabs(verseStab), // trombone stabs only — full section saved for chorus
  ).swingBy(VERSE_SWING, 8);

// ── CHORUS — lifts to Dmaj7 (IV) ──────────────────────────────────────────────
// Bm7 – Em9 – Amaj7 – Dmaj7   |   ii – v – I – IV
const lush_chorus = () =>
  stack(
    note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
      .struct("<[x@5 x@3]!3 [x@5 x@2 ~]>") // downbeat comp; bar 4's last hit shortened — the &-of-4 belongs to the push
      .add(note(perlin.range(0, 0.045))) // slightly richer warble in chorus
      .vib(5) // brighter, faster vib for lift
      .vibmod(0.065) // slightly deeper
      .sound("gm_electric_guitar_clean")
      .gain(0.55)
      .lpf(2600)
      .room(0.35),
    note("<~ ~ ~ [~ ~ ~ [~ [b3,d4,f#4,a4]]]>") // push — Bm7 anticipated on the &-of-4 of bars 4 & 8
      .vib(5)
      .vibmod(0.065)
      .sound("gm_electric_guitar_clean")
      .gain(0.55)
      .lpf(2600)
      .room(0.35)
      .clip(2), // short ring into the next downbeat hit
    pBass(chorBass),
    kick("bd ~ ~ bd ~ ~ bd <~ ~ ~ [~ bd]>", 0.75, 3000), // pickup kick only at each 4-bar turn
    s("~ ~ ~ ~ [rim,sd] ~ ~ ~") // fattened backbeat — the chorus lift
      .gain(0.5)
      .room(0.25)
      .bank("RolandTR808"),
    s("~ ~ sd ~ ~ ~ [~ sd] ~") // ghost notes framing the backbeat
      .gain(0.14)
      .bank("RolandTR808"),
    hats("~ hh hh hh hh hh hh <hh hh hh [hh oh]>", "[.38 .26]*4"), // open hat only every 4th bar
    s("<~ ~ ~ [~ ~ ~ [sd ~ mt lt]]>") // beat-4 fill locked to the bass run — lt lands with the pickup kick
      .gain(0.35)
      .lpf(2800)
      .room(0.25)
      .bank("RolandTR808"),
    s("<[cr ~ ~ ~] ~ ~ ~ ~ ~ ~ ~>") // crash marks the chorus arrival (bar 1 only)
      .gain(0.25)
      .bank("RolandTR808"),
    horns(chorMel, chorStab), // full brass section: hook melody + low stabs
  ).swingBy(CHORUS_SWING, 8);

// ── BRIDGE — Mixolydian lift, floats out via ♭VII / chromatic ♭III ────────────
// Gmaj7 – Dmaj7 – Cmaj7 – Amaj7   |   ♭VII – IV – ♭III – I  (C is the surprise)
const lush_bridge = () =>
  stack(
    note("<[g3,b3,d4,f#4] [d3,f#3,a3,c#4] [c3,e3,g3,b3] [a3,c#4,e4,g#4]>")
      .add(note(perlin.range(0, 0.06))) // deeper warble for floating tension
      .vib(5.5) // faster vib for unsettled feeling
      .vibmod(0.09) // deeper for drama
      .sound("gm_electric_guitar_clean")
      .gain(0.5)
      .lpf(2500)
      .room(0.45),
    pBass(bridBass),
    kick("bd ~ ~ bd ~ ~ bd ~", 0.55, 3200),
    // no backbeat — kick + hats only, let it float (makes the final chorus hit harder)
    hats("~ ~ hh hh hh hh hh hh", "[.3 .18]*4"),
    horns(bridMel, bridStab), // full brass — horns over thin drums = the bridge
  ).swingBy(BRIDGE_SWING, 8); // nearly straight — the float is rhythmic too

// ── REFRAIN — drops to the relative minor (F#m as home) ───────────────────────
// F#m9 – Dmaj7 – Amaj7 – E   |   i – VI – III – VII  in F# Aeolian
const lush_refrain = () =>
  stack(
    note("<[f#3,a3,c#4,e4,g#4] [d3,f#3,a3,c#4] [a3,c#4,e4,g#4] [e3,g#3,b3,d4]>")
      .add(note(perlin.range(0, 0.04))) // subtle, introspective warble
      .vib(4) // gentle, meditative vib
      .vibmod(0.065) // warm but controlled
      .sound("gm_electric_guitar_clean")
      .gain(0.5)
      .lpf(2500)
      .room(0.4),
    pBass(refrBass),
    kick("bd ~ ~ ~ ~ ~ bd ~", 0.5, 3200), // sparse kick (1 & 4) — post-chorus exhale
    s("~ ~ ~ ~ rim ~ ~ ~").gain(0.35).room(0.3).bank("RolandTR808"),
    s("~ ~ hh ~ ~ ~ hh ~") // sparse hats — let it breathe
      .gain(0.2)
      .bank("RolandTR808"),
    hornMel(refrMel), // soft solo horn — melody only, no stabs
  ).swingBy(REFRAIN_SWING, 8); // drags a hair behind the chorus pocket

// ── VERSE with melody — answer to the 8-bar stretch ──────────────────────────
// Melody enters bar 5 (second half only), octave down on warm epiano
const lush_verse_mel = () =>
  stack(
    lush_verse(),
    note(verseMel)
      .sub(note(12)) // octave down — warm, not leading
      .sound("gm_epiano1")
      .gain(0.3)
      .lpf(2500)
      .room(0.35)
      .mask("<0!4 1!4>"), // silent bars 1–4, enters bar 5
  ).swingBy(VERSE_SWING, 8);

// ── OUTRO — one ringing Amaj9, dissolve into the room ─────────────────────────
const outro = () =>
  stack(
    note("<[a2,e3,b3,c#4,g#4] ~ ~ ~>")
      .sound("gm_electric_guitar_clean")
      .gain(0.5)
      .room(0.7) // bigger hall than anywhere else in the song
      .delay(0.4) // echoes hand the chord to the reverb…
      .delaytime(0.5)
      .delayfeedback(0.45) // …which hands it to silence
      .clip(4),
    pBass("<a1 ~ ~ ~>").clip(4).lpf(700), // let the low A ring out, darkened
    s("<cr ~ ~ ~>").gain(0.25).room(0.5).bank("RolandTR808"),
  );

// ── ARRANGEMENT — each [n, section] plays that section for n bars ──────────────
arrange(
  [4, verse()],
  [4, lush_verse()],
  [8, lush_chorus()],
  [4, lush_refrain()],
  [8, lush_verse_mel()], // CHANGE: melody enters bar 5, fills the 8-bar stretch
  [8, lush_chorus()],
  [4, lush_refrain()],
  [4, lush_verse_mel()],
  [8, lush_chorus()],
  [4, lush_refrain()],
  [4, lush_bridge()],
  [8, lush_chorus()],
  [3, outro()],
  [1, silence], // tail room — let the delay/reverb decay before the stop
);
