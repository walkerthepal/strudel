// ══════════════════════════════════════════════════════════════════════
// WUBBA WUBBA — bolero-soul, 88bpm, lights off and the window open
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
//   1. 88bpm, and the kick is now a TRESILLO (3+3+2 — beat 1, the "&" of 2,
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
// SOUNDS: bass is FRETLESS now, not finger bass — the slides stop being a
// garnish and become the instrument's whole personality. Rhodes → VIBRAPHONE
// (mallet attack you can feel, tail that decays on its own, the sound of every
// late-night latin jazz record). Clean electric → NYLON. Bells → MARIMBA.
// The "vocal" is a filtered choir patch instead of a triangle: breath, not tone.
// ══════════════════════════════════════════════════════════════════════
setcpm(88 / 4);

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

// ── PERCUSSION (straight time — this is the half that does NOT drag) ───
// CLAVE. 2-3 son: the two-side leads, which is the softer, later-arriving
// half — it opens the phrase with a question instead of an announcement.
// Real claves, not a rimshot: a pitched woodblock sits at 2kHz and never
// argues with the kit or the bass.
const clave = (g = 0.38) =>
  note("<[~ ~ c6 ~ c6 ~ ~ ~] [c6 ~ ~ c6 ~ ~ c6 ~]>")
    .s("gm_woodblock")
    .clip(0.3)
    .gain(g)
    .pan(0.44)
    .lpf(6500)
    .room(0.26);

// CÁSCARA — the timbale shell figure, played as a shaker. It's syncopated by
// nature, so it gives 8th-note motion without the machine-gun quality of
// straight 16th hats. This replaces the old offbeat hi-hats entirely.
const cascara = (g = 0.2) =>
  s("<[hh ~ hh hh ~ hh ~ hh] [hh ~ hh ~ hh hh ~ hh]>")
    .bank("RolandTR808")
    .hpf(2200)
    .gain(g)
    .sometimesBy(0.3, (x) => x.gain(g * 0.55))
    .pan(0.62)
    .room(0.2);

// CONGA TUMBAO — open tones on the "&" of 2 and on 4 + its "&"; the low drum
// laying back a hair behind them, the way a hand does.
const congas = (g = 0.44) =>
  stack(
    s("~ ~ ~ mt ~ ~ ~ [mt mt]").gain(g),
    s("lt ~ [~ lt] ~ ~ lt ~ ~").gain(g * 0.5).late(0.006),
  )
    .bank("RolandTR808")
    .lpf(2600)
    .pan(0.34)
    .room(0.3);

// mambo bell — only in the sections that are allowed to get loud
const bell = (g = 0.2) =>
  s("cb ~ cb cb ~ cb ~ cb")
    .bank("RolandTR808")
    .gain(g)
    .lpf(3600)
    .pan(0.68)
    .room(0.3);

// ── DRUMS ─────────────────────────────────────────────────────────────
const drums = () =>
  stack(
    // TRESILLO. 3+3+2. beat 1, the "&" of 2, beat 4. this is the song now.
    s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~").gain(0.86).lpf(1900),
    // cross-stick on 2 & 4, 33ms behind the grid. it is the only lazy thing
    // in the arrangement and it makes everything around it sound relaxed.
    s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~")
      .gain(0.46)
      .lpf(4200)
      .room(0.34)
      .late(0.012),
  ).apply(kit);

// 808 kick under the Linn kick — pure weight below 160Hz, no click.
// (apply(groove), NOT apply(kit), or the bank gets overwritten and this
// silently turns back into a second LinnDrum kick.)
const thump = () =>
  s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~")
    .bank("RolandTR808")
    .gain(0.4)
    .lpf(160)
    .apply(groove);

// phrase boundaries only: open hat closing bar 4, an abanico — the timbale
// flourish that announces a section — closing bar 8. nothing inside a phrase.
const fill = () =>
  stack(
    s("<~ ~ ~ [~ ~ ~ oh]>").bank("LinnDrum").gain(0.18).apply(groove),
    s("<~ ~ ~ ~ ~ ~ ~ [~ ~ [ht ht] [mt ~]]>")
      .bank("RolandTR808")
      .gain(0.3)
      .lpf(3200)
      .room(0.32),
  );
// chorus kit: snaps ghosting the cross-stick, and a kick that anticipates the
// downbeat at the end of every 4-bar phrase — same trick as the bass
const drumsBig = () =>
  stack(
    drums(),
    thump(),
    fill(),
    s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
      .bank("RolandTR808")
      .gain(0.18)
      .room(0.45),
    s("<~ ~ ~ [~ ~ ~ [~ bd]] ~ ~ ~ [~ ~ [~ bd] [~ bd]]>")
      .bank("LinnDrum")
      .gain(0.6)
      .lpf(1800)
      .apply(groove),
  );

// ── THE BASS LINE ─────────────────────────────────────────────────────
// Composed 4-bar melodies on voicing indices, so every note is a chord tone.
// Rhythmic DNA of every bar: something on 1, the "&" of 2, beat 4, and a 16th
// pickup on the very last subdivision that has already changed chord. Far more
// notes than the old version — the emptiness was the lifelessness.
const vBassMel =
  "<[0 ~ ~ 2 ~ [~ 1] 2 [~ 0]] [0 ~ [~ 2] 3 ~ ~ 2 [~ 1]] [0 ~ ~ 2 ~ [1 ~] 3 [~ 2]] [4 ~ [~ 3] 2 ~ [1 ~] 0 [~ 0]]>";
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

const bass = (prog, line = vBassMel, slides = vSlide, g = 1.0, pdec = 0.1) =>
  n(line)
    .set(push(prog)) // ← the tumbao anticipation lives here
    .mode("root:g2")
    .voicing()
    .s("gm_acoustic_bass")
    .clip(1.0) // notes run into each other — a fretless never articulates
    .penv(slides)
    .panchor(0)
    .psustain(0)
    .pdecay(pdec)
    .lpf(1500)
    .room(0.14)
    .gain(perlin.range(g - 0.14, g).slow(4))
    .sometimesBy(0.12, (x) => x.gain(0.6));

// sub only where the arrangement is full — beat 1 and beat 4, under the
// tresillo's outer two hits
const sub = (prog) =>
  n("0 ~ ~ ~ ~ ~ 0 ~")
    .set(prog)
    .mode("root:a1")
    .voicing()
    .s("sine")
    .attack(0.02)
    .release(0.3)
    .clip(0.9)
    .lpf(190)
    .gain(0.38);

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
    .hpf(200)
    .lpf(3400)
    .gain(g)
    .pan(0.58)
    .room(0.42)
    .delay(0.16)
    .delaytime(0.375)
    .delayfeedback(0.24)
    .apply(wobble);

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
    .lpf(3200)
    .gain(g)
    .pan(0.32)
    .room(0.3)
    .apply(wobble);

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
    .room(0.32);

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
    .apply(wobble);

// ── COLOR & LEADS ─────────────────────────────────────────────────────
// marimba glints, one or two a bar, in dotted-eighth delay. wood instead of
// the old FM bell — it belongs to the same family as the claves and congas.
const glints = (prog, g = 0.26) =>
  n(
    "<[~ ~ ~ ~ ~ 2 ~ ~] [~ ~ 1 ~ ~ ~ ~ 3] [~ ~ ~ ~ 3 ~ ~ [2 ~]] [~ 0 ~ ~ ~ ~ 2 ~]>",
  )
    .set(prog)
    .anchor("Gb5")
    .voicing()
    .s("gm_marimba")
    .clip(0.7)
    .delay(0.3)
    .delaytime(0.375)
    .delayfeedback(0.36)
    .lpf(4200)
    .gain(g)
    .pan(0.64)
    .room(0.5);

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
    .delay(0.2)
    .delaytime(0.5)
    .delayfeedback(0.3)
    .apply(wobble);

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
    .delay(0.22)
    .delaytime(0.5)
    .delayfeedback(0.28)
    .apply(wobble);

// ── MELODIES ──────────────────────────────────────────────────────────
// verse 2 only — four notes in four bars, and the last is the #11 of Gb^9
const verseCounter = "<[~ ~ ~ 4] [~ ~ 3 ~] [~ ~ ~ 6] [5 ~ ~ ~]>";
// chorus "vocal" — every phrase enters on an offbeat and leaves on one. it
// never lands with the kick, which is why it floats over the groove.
const chorMel =
  "<[~ ~ 2 ~ ~ 4 ~ [~ 2]] [3 ~ ~ ~ 5 ~ [4 ~] ~] [~ ~ 5 ~ ~ 3 ~ [~ 4]] [6 ~ ~ 5 ~ ~ 4 ~]>";
// bridge sax: Db(#9) → Cb(b9) → Gb(b13) over the Bb7b9 in bar 2
const bridMel =
  "<[~ ~ 4 ~ [5 ~] 7 ~ ~] [~ 6 ~ [5 4] ~ 2 ~ ~] [~ ~ 0 ~ [2 ~] 4 ~ ~] [3 ~ [~ 1] 0 ~ ~ ~ ~]>";
// last chorus only — the sax answers the vocal in its gaps, never over it
const chorSax =
  "<[~ ~ ~ ~ ~ ~ 4 ~] [~ 6 ~ [5 ~] ~ ~ ~ ~] [~ ~ ~ ~ 7 ~ [6 ~] ~] [~ 4 ~ ~ 3 ~ ~ ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
// clave, shaker, bass. no kit. four bars where the only thing keeping time is
// a pair of sticks, so the bass has to be the hook — and gets to be.
const intro = () => stack(clave(0.34), cascara(0.16), bass(vProg), pad(vProg, 0.1));

const verse = (mel = null) =>
  stack(
    drums(),
    fill(),
    clave(0.36),
    cascara(0.2),
    bass(vProg),
    nylon(vProg, 0.26),
    keys(vProg, 0.3),
    pad(vProg, 0.15),
    mel ? lead(mel, "eb4:dorian", 0.2) : silence,
  );

const chorus = (extra = silence) =>
  stack(
    drumsBig(),
    clave(0.4),
    cascara(0.24),
    congas(0.42),
    bass(cProg, cBassMel, cSlide),
    sub(cProg),
    nylon(cProg, 0.3),
    keys(cProg, 0.34, "~ x ~ [~ x] x ~ ~ x"),
    pad(cProg, 0.19),
    glints(cProg),
    leadWide(chorMel),
    extra,
  );

// THE DROP. Every harmonic instrument disappears for four bars — no pad, no
// vibes, no guitar, no vocal. Percussion and one fretless bass that has
// stopped playing beat 1. This is the sexiest four bars in the track and it
// works entirely by subtraction.
const drop = () =>
  stack(
    drums(),
    thump(),
    clave(0.44),
    cascara(0.26),
    congas(0.5),
    bell(0.16),
    bass(vProg, dBassMel, dSlide, 1.0, 0.13),
  );

// the Cb arrives, the mode goes minor, the sax comes in over it
const bridge = () =>
  stack(
    drums(),
    thump(),
    fill(),
    clave(0.34),
    cascara(0.2),
    congas(0.36),
    bass(bProg, bBassMel, bSlide),
    sub(bProg),
    nylon(bProg, 0.24),
    keys(bProg, 0.3),
    pad(bProg, 0.2),
    glints(bProg, 0.2),
    sax(bridMel, "eb4:minor", 0.32),
  );

// MONTUNO — the percussion break. guajeo, bell, congas wide open, no vocal.
// the only four bars where the drums are the loudest thing in the room.
const montuno = () =>
  stack(
    drums(),
    thump(),
    clave(0.44),
    cascara(0.28),
    congas(0.52),
    bell(0.24),
    bass(cProg, cBassMel, cSlide),
    guajeo(cProg, 0.3),
    keys(cProg, 0.24, "~ ~ x ~ ~ ~ x ~"),
    pad(cProg, 0.13),
  );

// peel back to bass, claves and a soft kick. longer pdecay = the slides go
// slack as it winds down.
const outro = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~").gain(0.5).lpf(1300).apply(kit),
    clave(0.26),
    cascara(0.12),
    bass(vProg, oBassMel, oSlide, 0.9, 0.16),
    keys(vProg, 0.2, "~ ~ x ~ ~ ~ ~ ~"),
    pad(vProg, 0.13),
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
