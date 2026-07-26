// ══════════════════════════════════════════════════════════════════════
// WUBBA WUBBA — bolero-soul, 86bpm, lights off and the window open
// Intro → V1 → Cho → V2 → Drop → Cho → Bridge → Montuno → Cho → Outro
// Eb dorian
//   VERSE  : Ebm9 Ab13 Db^9 Gb^9   | the Ab13's natural 3rd is still the mood
//   CHORUS : Gb^9 Ab13 Fm7 Bbm9    | royal road in Db, settles on Bbm
//   BRIDGE : B^9 Bb7b9 Ebm9 Ab13   | B^9 = Cb — the dorian goes minor for 8 bars
//
// WHAT CHANGED, AND WHY IT WASN'T MOVING BEFORE
// 72bpm with two kicks a bar is a mood, not a groove — there was nothing in
// the track for a body to lock onto. Three fixes, all rhythmic:
//
//   1. 86bpm, and the kick is now a TRESILLO (3+3+2 — beat 1, the "&" of 2,
//      beat 4). That figure is the entire reason latin music moves hips. It
//      is asymmetric, so you can never quite settle, so you keep moving.
//   2. Everything hangs off a 2-3 SON CLAVE played on real claves, and the
//      nylon guitar comps *on the clave itself* — the harmony is percussion.
//   3. The bass gets every chord an EIGHTH NOTE EARLY (`push`). That single
//      displacement is the tumbao: the harmony arrives before the barline
//      does, so the whole band is permanently leaning forward.
//
// The percussion is dead straight. The kit drags (cross-stick 33ms late).
// Those two disagreeing about where the beat is IS the pocket — the looseness
// comes from parts pulling against each other, not from removing hits.
//
// SPARSE, WITH GHOSTS DOING THE COLOR. There is no pad holding the floor up
// anymore — it appears exactly once, in the bridge, where its arrival IS the
// mode change. What fills the space instead is detail at the threshold of
// audibility: ghost cross-sticks leaning into the backbeat, a feathered
// cáscara (two accents a bar, six ghosts), dead-thumb bass ghosts on the
// upright, and a marimba figure that sits out four bars in every eight.
// The chorus is one voice bigger than the verse, not five. Nothing is holding
// the track up but the parts that are actually saying something.
//
// FELT, NOT HEARD. The kit keeps every note it had — the backbeat is still on
// 2 & 4, the tresillo is still a tresillo — but the energy moved from the
// audible layer to the inaudible one. The Linn kick is lowpassed at 900Hz,
// which strips the beater click off entirely and leaves a thud; the third
// tresillo hit is a ghost; the cross-stick lost 5dB and gained a room. What
// replaces all that is thump(), an 808 at 160Hz and nothing else, now present
// in every section including the intro. You stop noticing the drums and start
// noticing that the room is moving. Nothing was removed — it was relocated.
//
// SOUNDS: UPRIGHT bass (short, woody, stops between notes — the clip is 0.72,
// not 1.0, because an upright is a percussion instrument) under a DX-style
// gm_epiano2. Comps are NYLON on the clave, MARIMBA glints, and a filtered
// choir patch for the "vocal": breath, not tone.
//
// THE MIX. Four orbits, four reverbs (see MIX BUSES) — one shared tail for
// twelve sources was doing more to crowd this than any part was. Below that:
// exactly one thing lives under 200Hz now (thump), the delay feedbacks came
// down about a third because in a sparse arrangement the tails are what
// refill the space you just cleared, and the NYLON is forward — mostly by
// taking reverb OFF it (room .3 → .2), which moves a part toward you without
// making it louder. It plays from bar one now.
// ══════════════════════════════════════════════════════════════════════
setcpm(86 / 4);

// ── PROGRESSIONS ──────────────────────────────────────────────────────
const vProg = chord("<Ebm9 Ab13 Db^9 Gb^9>").dict("ireal");
const cProg = chord("<Gb^9 Ab13 Fm7 Bbm9>").dict("ireal");
const bProg = chord("<B^9 Bb7b9 Ebm9 Ab13>").dict("ireal");

// THE ANTICIPATION. Shifts a progression an eighth note earlier, so any bass
// note on the last 16th of a bar is already playing the NEXT chord. Salsa
// bassists do this by reflex; in an R&B context it reads as the bass being
// slightly impatient, which is exactly the feeling we want.
const push = (p) => p.early(1 / 8);

// tape flutter on everything pitched EXCEPT the bass — the dead-in-tune bass
// is what the drifting parts hang off of
const wobble = (x) => x.add(note(perlin.range(-0.03, 0.03).slow(7)));

// feel only, NO bank — so it can be applied to 808 voices without stomping
// them back to LinnDrum. Swing is nearly nothing on purpose: latin is straight,
// and a swung clave is a broken clave.
const groove = (x) => x.swingBy(0.04, 16);
const kit = (x) => x.bank("LinnDrum").apply(groove);

// ── MIX BUSES ─────────────────────────────────────────────────────────
// `room` is a SEND and the reverb lives on the ORBIT — so until now every
// voice in this track, kick through sax, was feeding one reverb with one
// decay. That is most of what "overwhelming" was: a dozen sources smearing
// into a single shared tail, so nothing had its own space.
//
// Four buses now, each with a room that suits what's on it. It also fixes a
// real collision: `delay` is per-orbit too, and the keys wanted a dotted-
// eighth while the lead wanted a half-note — on one shared orbit only
// whichever queried last was ever getting the delay time it asked for.
const busKit = (x) => x.orbit(1).roomsize(1.1).roomlp(3200); // tight and dark
const busPerc = (x) => x.orbit(2).roomsize(2).roomlp(7000); // a real room
const busComp = (x) => x.orbit(3).roomsize(3).roomlp(6000); // wider, softer
const busLead = (x) => x.orbit(4).roomsize(4.5).roomlp(4500); // long, dark

// ── PERCUSSION (straight time — this is the half that does NOT drag) ───
// CLAVE. 2-3 son: the two-side leads, which is the softer, later-arriving
// half — it opens the phrase with a question instead of an announcement.
// Real claves, not a rimshot: a pitched woodblock sits at 2kHz and never
// argues with the kit or the bass.
const clave = (g = 0.3) =>
  note("<[~ ~ c6 ~ c6 ~ ~ ~] [c6 ~ ~ c6 ~ ~ c6 ~]>")
    .s("gm_woodblock")
    .clip(0.3)
    .gain(g)
    .pan(0.44)
    .lpf(6500)
    .room(0.26)
    .apply(busPerc);

// CÁSCARA — the timbale shell figure, played as a shaker. It's syncopated by
// nature, so it gives 8th-note motion without the machine-gun quality of
// straight 16th hats. This replaces the old offbeat hi-hats entirely.
// TWO ACCENTS A BAR, SIX GHOSTS. `velocity` multiplies gain, so this shape
// scales with whatever level the section passes in: one hit at full, one at
// .8, everything else feathered down to .4. A flat shaker is a texture you
// stop hearing; an accented one is a person playing.
const cascara = (g = 0.22) =>
  s("<[hh ~ hh hh ~ hh ~ hh] [hh ~ hh ~ hh hh ~ hh]>")
    .bank("RolandTR808")
    .hpf(2200)
    .gain(g)
    .velocity("1 .4 .5 .4 .45 .8 .4 .5")
    .sometimesBy(0.3, (x) => x.velocity(0.3))
    .pan(0.62)
    .room(0.2)
    .apply(busPerc);

// CONGA TUMBAO — open tones on the "&" of 2 and on 4 + its "&"; the low drum
// laying back a hair behind them, the way a hand does.
const congas = (g = 0.38) =>
  stack(
    // the second of the two open tones is a ghost — a conga player's hand is
    // already on its way back up
    s("~ ~ ~ mt ~ ~ ~ [mt mt]").gain(g).velocity("1 1 1 .85 1 1 1 [1 .5]"),
    s("lt ~ [~ lt] ~ ~ lt ~ ~").gain(g * 0.45).late(0.006),
  )
    .bank("RolandTR808")
    .lpf(2600)
    .pan(0.34)
    .room(0.3)
    .apply(busPerc);

// mambo bell — only in the sections that are allowed to get loud
const bell = (g = 0.2) =>
  s("cb ~ cb cb ~ cb ~ cb")
    .bank("RolandTR808")
    .gain(g)
    .lpf(3600)
    .pan(0.68)
    .room(0.3)
    .apply(busPerc);

// ── DRUMS ─────────────────────────────────────────────────────────────
const drums = () =>
  stack(
    // TRESILLO, still 3+3+2 — but lowpassed at 900Hz so there's no beater
    // click left, only a thud, and the third hit (beat 4) is a GHOST. The
    // "0.58@12 0.3@4" weights the 16-step bar: full for the first twelve
    // steps, ghosted for the last four, which is exactly where hit 3 lands.
    // You hear two kicks and feel three.
    s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~").gain("0.58@12 0.3@4").lpf(900),
    // cross-stick on 2 & 4, 33ms behind the grid. still on 2 & 4 — the beat
    // never leaves — but it's 5dB down and much darker, sitting further back
    // in the room. soft wood at the other end of the apartment.
    s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~")
      .gain(0.28)
      .lpf(2800)
      .room(0.46)
      .late(0.012),
    // GHOST CROSS-STICKS — 16ths leaning into the backbeats at a third of
    // their level, and a different count each bar so it never reads as a
    // loop. These are the "extra hits" the sparse version is allowed: you
    // don't hear them as strokes, you hear them as somebody breathing.
    s("<[~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ rim ~ ~ rim ~]>")
      .gain(0.09)
      .lpf(2200)
      .room(0.52)
      .late(0.012),
  )
    .apply(kit)
    .apply(busKit);

// THE PART THAT DOES THE WORK NOW. 808 at 160Hz, no click, nothing above the
// fundamental — it is pure weight and you cannot really hear it, which is the
// point. Everything the Linn kick gave up in level, this took over. It's in
// every section now, including the intro.
// (apply(groove), NOT apply(kit), or the bank gets overwritten and this
// silently turns back into a second LinnDrum kick.)
const thump = (g = 0.46) =>
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~")
    .bank("RolandTR808")
    .gain(g)
    .lpf(160)
    .apply(groove)
    .apply(busKit);

// phrase boundaries only: open hat closing bar 4, an abanico — the timbale
// flourish that announces a section — closing bar 8. nothing inside a phrase.
const fill = () =>
  stack(
    s("<~ ~ ~ [~ ~ ~ oh]>").bank("LinnDrum").gain(0.11).apply(groove),
    // the abanico is darker and half the level it was — a flourish you catch
    // out of the corner of your ear, not one that announces the section
    s("<~ ~ ~ ~ ~ ~ ~ [~ ~ [ht ht] [mt ~]]>")
      .bank("RolandTR808")
      .gain(0.17)
      .lpf(2400)
      .room(0.36),
  ).apply(busKit);
// chorus kit. The 808 clap that used to sit on 2 & 4 is GONE — it was
// doubling the cross-stick, which is the definition of heard-not-felt. The
// chorus lift comes from the congas, the marimba and the vocal instead.
// What's left is a kick that leans into the downbeat at the end of each
// 4-bar phrase — same anticipation trick as the bass, now at a third of the
// level and lowpassed to match the rest of the kit.
const drumsBig = () =>
  stack(
    drums(),
    thump(),
    fill(),
    s("<~ ~ ~ [~ ~ ~ [~ bd]] ~ ~ ~ [~ ~ [~ bd] [~ bd]]>")
      .bank("LinnDrum")
      .gain(0.32)
      .lpf(900)
      .apply(groove)
      .apply(busKit),
  );

// ── THE BASS LINE ─────────────────────────────────────────────────────
// Composed 4-bar melodies on voicing indices, so every note is a chord tone.
// Rhythmic DNA of every bar: something on 1, the "&" of 2, beat 4, and a 16th
// pickup on the very last subdivision that has already changed chord. Far more
// notes than the old version — the emptiness was the lifelessness.
const vBassMel =
  "<[0 ~ ~ 2 ~ [~ 1] 2 [~ 0]] [0 ~ [~ 2] 3 ~ ~ 2 [~ 1]] [0 ~ ~ 2 ~ [1 ~] 3 [~ 2]] [2 ~ [~ 3] 2 ~ [1 ~] 0 [~ 0]]>";
const cBassMel =
  "<[0 ~ [~ 2] 3 ~ [2 ~] 4 [~ 3]] [0 ~ ~ 2 ~ [3 ~] 2 [~ 0]] [0 ~ [~ 1] 2 ~ [3 4] 3 [~ 2]] [4 ~ [~ 3] 2 ~ [1 ~] 0 [~ 0]]>";
const bBassMel =
  "<[0 ~ ~ 2 ~ ~ 1 [~ 0]] [0 ~ [~ 1] 2 ~ [3 ~] 2 [~ 1]] [0 ~ ~ 2 ~ [~ 1] 0 [~ 2]] [3 ~ [~ 2] 1 ~ ~ 0 [~ 0]]>";
// the drop: the most literal tumbao in the song — nothing on beat 1 at all,
// so the kick and the bass stop agreeing and your hips have to fill the gap
const dBassMel =
  "<[~ ~ ~ 2 ~ ~ 0 [~ 0]] [~ ~ [~ 0] 2 ~ ~ 1 [~ 0]] [~ ~ ~ 2 ~ [1 ~] 0 [~ 3]] [2 ~ [~ 1] 0 ~ ~ 0 [~ 0]]>";
const oBassMel = "<[0 ~ ~ ~ ~ [~ 1] 0 ~] [0 ~ ~ 2 ~ ~ 1 [~ 0]]>";

// SLIDES — pitch envelope in semitones, offset from true pitch.
// panchor(0) + psustain(0) is mandatory: getParamADSR ramps to `min` on
// release, so the anchor decides where the note ENDS UP. At 0 the note starts
// `penv` semitones off, decays to true pitch, and stays there.
// negative = start flat, slide UP into it.  positive = fall DOWN into it.
// Step-aligned to the melodies above (8 steps/bar, `@` holds 0 across notes
// that stay put). On a fretless this is the instrument, not an effect — but
// it still only goes on chosen notes, or the whole thing warbles.
const vSlide = "<[-2 0@7] [0@6 -2 0] [-2 0@7] [2 0@7]>";
const cSlide = "<[-2 0@7] [0@3 -2 0@4] [-2 0@7] [2 0@2 -2 0@4]>";
const bSlide = "<[-2 0@7] [-2 0@7] [-3 0@7] [0@3 -2 0@4]>";
const dSlide = "<[0@3 -2 0@4] [0@3 -2 0@4] [0@3 -3 0@4] [-2 0@7]>";
const oSlide = "<[-2 0@7] [-2 0@7]>";

const bass = (prog, line = vBassMel, slides = vSlide, g = 1.0, pdec = 0.06) =>
  n(line)
    .set(push(prog)) // ← the tumbao anticipation lives here
    .mode("root:g2")
    .voicing()
    .s("gm_acoustic_bass")
    // an upright STOPS. clip 1.0 was fretless logic — every note ran into the
    // next one and the low end turned to porridge. At 0.72 with a short
    // release the notes decay into silence, which reads as more relaxed even
    // though not one note was removed.
    .clip(0.72)
    .release(0.15)
    .penv(slides)
    .panchor(0)
    .psustain(0)
    .pdecay(pdec) // 0.06, not 0.1 — an upright slide is fast or it's just flat
    .lpf(1150) // upright is dark; 1500 was letting through string noise
    .room(0.14)
    .gain(perlin.range(g - 0.14, g).slow(4))
    .sometimesBy(0.12, (x) => x.gain(0.6))
    .apply(busKit);

// DEAD-THUMB GHOSTS. An upright player slaps the string with the side of the
// thumb between notes — no pitch to speak of, just wood and a little thump.
// clip(0.1) makes each one a click and lpf 480 takes the pitch out of it.
// THIS is what fills the 16ths the melody left empty. It replaces the pad:
// motion instead of wallpaper, and it only exists where you'd never notice it.
const bassGhost = (prog, g = 0.15) =>
  n("<[~ [~ 0] ~ ~ [~ 0] ~ ~ [0 ~]] [~ [~ 0] ~ [0 ~] ~ ~ [~ 0] ~]>")
    .set(prog)
    .mode("root:g2")
    .voicing()
    .s("gm_acoustic_bass")
    .clip(0.1)
    .lpf(480)
    .gain(g)
    .room(0.08)
    .apply(busKit);

// CUT. This was a sine at a1 doubling the chord root under the chorus and
// bridge — and it made sense back when thump() only appeared in the big
// sections. thump() is now in every section including the intro, so the sub
// region had THREE things in it (808 at 160Hz, this at 190Hz, and the
// upright's own fundamental at g2 ≈ 98Hz), all landing on beats 1 and 4.
// That pileup is what a mix feeling "overwhelming" usually actually is: it
// isn't the parts you can hear, it's the ones you can't. Deleted, not muted —
// the upright has plenty of fundamental and thump() has the weight.

// ── KEYS & GUITARS (all high-passed — they live above the bass) ────────
// VIBES, not Rhodes. voices "[1,2,3]" drops the voicing's lowest note, which
// is what keeps the comp out of 150-250Hz. mallets ring out on their own, so
// the part can be almost nothing and still fill the bar.
const keys = (prog, g = 0.32, st = "~ ~ x ~ x ~ ~ x") =>
  n("[1,2,3]")
    .set(prog)
    .anchor("Bb4")
    .voicing()
    .s("gm_epiano2")
    .struct(st)
    .attack(0.01)
    .release(1.4)
    .clip(0.8)
    .hpf(320)
    .lpf(3400)
    .gain(g)
    .pan(0.58)
    .room(0.42)
    .delay(0.12)
    .delaytime(0.375)
    .delayfeedback(0.18)
    .apply(wobble)
    .apply(busComp);

// THE LATIN FLARE IN ONE LINE: the nylon guitar plays nothing but the clave.
// Not a rhythm derived from it — the clave itself, both bars of it. Once the
// harmony is playing the key pattern, every other part has something to lock
// to and the whole track stops sounding like layers and starts sounding like
// a band in a room.
const nylon = (prog, g = 0.28) =>
  n("[0,1,2,3]")
    .set(prog)
    .anchor("Db4")
    .voicing()
    .s("gm_acoustic_guitar_nylon")
    .struct("<[~ ~ x ~ x ~ ~ ~] [x ~ ~ x ~ ~ x ~]>")
    .clip(0.6)
    .hpf(260)
    .lpf(3600)
    .gain(g)
    .pan(0.3)
    .room(0.2)
    .apply(wobble)
    .apply(busComp);

// GUAJEO — the montuno figure: two-note dyads on the offbeats, the same shape
// every bar. It's hypnotic rather than expressive, which is the point; it
// hands the section over to the percussion.
const guajeo = (prog, g = 0.3) =>
  n("<[~ [0,2] ~ [1,3] [0,2] ~ [1,3] ~] [~ [1,3] ~ [0,2] [1,3] ~ [0,2] ~]>")
    .set(prog)
    .anchor("Ab4")
    .voicing()
    .s("gm_acoustic_guitar_nylon")
    .clip(0.5)
    .hpf(300)
    .lpf(3800)
    .gain(g)
    .pan(0.72)
    .room(0.32)
    .apply(busComp);

// warm saw pad, way back — the "room tone". slow enough attack that it never
// has an edge, hpf'd clear of the bass entirely.
const pad = (prog, g = 0.17) =>
  n("[0,1,2,3]")
    .set(prog)
    .anchor("Gb4")
    .voicing()
    .s("sawtooth")
    .struct("x")
    .attack(0.7)
    .release(1.4)
    .clip(0.95)
    .hpf(300)
    .lpf(sine.range(700, 1150).slow(11)) // barely-moving filter, like breathing
    .gain(g)
    .room(0.55)
    .apply(wobble)
    .apply(busComp);

// ── COLOR & LEADS ─────────────────────────────────────────────────────
// marimba, and now an actual FLOURISH rather than a texture: an 8-bar figure
// where four of the eight bars are completely empty. It answers the phrase
// instead of decorating every one of them, and the 8-bar shape crosses the
// 4-bar chord cycle so the same gesture lands on different harmony each time.
const glints = (prog, g = 0.22) =>
  n(
    "<~ [~ ~ ~ ~ ~ 2 ~ ~] ~ [~ ~ 1 ~ [3 ~] ~ ~ ~] ~ [~ ~ ~ ~ 3 ~ ~ ~] ~ [~ 0 ~ [2 ~] ~ ~ ~ ~]>",
  )
    .set(prog)
    .anchor("Gb5")
    .voicing()
    .s("gm_marimba")
    .clip(0.7)
    .delay(0.24)
    .delaytime(0.375)
    .delayfeedback(0.2)
    .lpf(4200)
    .gain(g)
    .pan(0.64)
    .room(0.44)
    .apply(busComp);

// the "vocal": a choir patch filtered down until it's breath rather than
// tone, mixed under everything. somebody humming in the next room.
const lead = (mel, sc = "eb4:dorian", g = 0.3) =>
  n(mel)
    .scale(sc)
    .s("gm_voice_oohs")
    .attack(0.09)
    .release(0.6)
    .clip(0.95)
    .vib("3:.04") // slow vibrato is what makes it read as a person
    .hpf(240)
    .lpf(1900)
    .gain(g)
    .pan(0.5)
    .room(0.5)
    .delay(0.18)
    .delaytime(0.5)
    .delayfeedback(0.22)
    .apply(wobble)
    .apply(busLead);

// octave-doubled version. Currently UNUSED — the chorus went single-tracked.
// Swap `lead(chorMel, "eb4:dorian", 0.28)` → `leadWide(chorMel)` in chorus()
// if the last chorus needs one more size than the first two.
const leadWide = (mel, sc = "eb4:dorian") =>
  stack(lead(mel, sc, 0.3), lead(mel, sc, 0.1).add(note(12)).pan(0.4).lpf(3000));

// tenor sax — atmosphere, not a solo. bridge, and one pass over the last
// chorus answering the vocal.
const sax = (mel, sc = "eb4:minor", g = 0.32) =>
  n(mel)
    .scale(sc)
    .s("gm_tenor_sax")
    .clip(0.92)
    .attack(0.06)
    .lpf(2400)
    .gain(g)
    .pan(0.44)
    .room(0.5)
    .delay(0.2)
    .delaytime(0.5)
    .delayfeedback(0.2)
    .apply(wobble)
    .apply(busLead);

// ── MELODIES ──────────────────────────────────────────────────────────
// verse 2 only — four notes in four bars, and the last is the #11 of Gb^9
const verseCounter = "<[~ ~ ~ 4] [~ ~ 3 ~] [~ ~ ~ 6] [5 ~ ~ ~]>";
// chorus "vocal" — TWO notes a bar, held. It was four, and four is a melody
// you follow; two is a melody you sit inside. Every phrase still enters on an
// offbeat and never lands with the kick, which is why it floats.
const chorMel = "<[~ ~ 2@4 4@2] [3@4 ~ 5@3] [~ ~ 5@3 3@3] [4@6 3@2]>";
// bridge sax: Db(#9) → Cb(b9) → Gb(b13) over the Bb7b9 in bar 2
const bridMel =
  "<[~ ~ 4 ~ [5 ~] 7 ~ ~] [~ 6 ~ [5 4] ~ 2 ~ ~] [~ ~ 0 ~ [2 ~] 4 ~ ~] [3 ~ [~ 1] 0 ~ ~ ~ ~]>";
// last chorus only — the sax answers the vocal in its gaps, never over it
const chorSax =
  "<[~ ~ ~ ~ ~ ~ 4 ~] [~ 6 ~ [5 ~] ~ ~ ~ ~] [~ ~ ~ ~ 7 ~ [6 ~] ~] [~ 4 ~ ~ 3 ~ ~ ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
// claves, shaker, bass — and a sub pulse you register in your chest rather
// than your ears. no audible kit at all for four bars, so the bass has to be
// the hook, and gets to be.
// no pad. the bass is completely naked over claves, shaker and a sub pulse —
// nothing to hide behind, which is the only way an intro states a hook.
const intro = () =>
  stack(
    clave(0.26),
    cascara(0.18),
    thump(0.28),
    bass(vProg),
    bassGhost(vProg, 0.14),
    nylon(vProg, 0.3), // the clave comp is here from bar one now
  );

// the verse gets thump() now too. it never used to — the Linn kick was
// carrying the whole bottom on its own, which is why it had to be loud.
const verse = (mel = null) =>
  stack(
    drums(),
    thump(0.34),
    fill(),
    clave(0.28),
    cascara(0.22),
    bass(vProg),
    bassGhost(vProg, 0.15),
    nylon(vProg, 0.32),
    keys(vProg, 0.28),
    mel ? lead(mel, "eb4:dorian", 0.2) : silence,
  );

// the chorus is now ONE voice bigger than the verse, not five: congas, a
// marimba flourish, and the vocal — no pad, and the vocal is single-tracked
// instead of octave-doubled. The lift comes from what enters, not from mass.
const chorus = (extra = silence) =>
  stack(
    drumsBig(),
    clave(0.32),
    cascara(0.27),
    congas(0.34),
    bass(cProg, cBassMel, cSlide),
    nylon(cProg, 0.36),
    keys(cProg, 0.32, "~ x ~ ~ x ~ ~ x"),
    glints(cProg, 0.22),
    lead(chorMel, "eb4:dorian", 0.20),
    extra,
  );

// THE DROP. Every harmonic instrument disappears for four bars — no pad, no
// keys, no guitar, no vocal. Percussion and one upright bass that has stopped
// playing beat 1. The cowbell is gone from here now; the section works by
// subtraction, and a cowbell is the loudest possible way to say "quiet part".
const drop = () =>
  stack(
    drums(),
    thump(),
    clave(0.38),
    cascara(0.32),
    congas(0.44),
    bass(vProg, dBassMel, dSlide, 1.0, 0.09),
    bassGhost(vProg, 0.2), // ghosts loudest here — they're the only "comp" left
  );

// the Cb arrives, the mode goes minor, the sax comes in over it — and this is
// the ONLY place in the song with a pad. It used to run under everything,
// which meant it said nothing; now its arrival is the sound of the mode
// changing. That's the whole trade: texture as an event, not as a floor.
const bridge = () =>
  stack(
    drums(),
    thump(),
    fill(),
    clave(0.26),
    cascara(0.22),
    congas(0.28),
    bass(bProg, bBassMel, bSlide),
    nylon(bProg, 0.3),
    keys(bProg, 0.28),
    pad(bProg, 0.22),
    glints(bProg, 0.18),
    sax(bridMel, "eb4:minor", 0.3),
  );

// MONTUNO — the percussion break. guajeo, bell, congas wide open, no vocal.
// the only four bars where the drums are the loudest thing in the room.
const montuno = () =>
  stack(
    drums(),
    thump(),
    clave(0.38),
    cascara(0.32),
    congas(0.44),
    bell(0.2),
    bass(cProg, cBassMel, cSlide),
    bassGhost(cProg, 0.18),
    nylon(cProg, 0.3),
    guajeo(cProg, 0.28),
  );

// peel back to bass, claves and a kick that is now almost entirely sub —
// the audible half is at 800Hz and 0.34, the felt half carries it out.
// longer pdecay = the slides go slack as it winds down.
const outro = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~").gain(0.34).lpf(800).apply(kit).apply(busKit),
    thump(0.3),
    clave(0.2),
    cascara(0.14),
    bass(vProg, oBassMel, oSlide, 0.9, 0.1),
    bassGhost(vProg, 0.12),
    keys(vProg, 0.2, "~ ~ x ~ ~ ~ ~ ~"),
  );

// hiss sits outside the arrangement so it never marks the seams
// $: s("crackle*4").density(0.03).gain(0.26);

// every section length is even, so the 2-bar clave never flips sides
$: arrange(
  [4, intro()],
  [8, verse()],
  [8, chorus()],
  [8, verse(verseCounter)],
  [4, drop()],
  [8, chorus()],
  [8, bridge()],
  [4, montuno()],
  [8, chorus(sax(chorSax, "eb4:dorian", 0.24))],
  [6, outro()],
  [2, silence],
);
