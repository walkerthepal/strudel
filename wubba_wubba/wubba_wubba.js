// ══════════════════════════════════════════════════════════════════════
// WUBBA WUBBA — quiet storm, 72bpm, lights already off
// Intro → V1 → Cho → V2 → Cho → Bridge → Cho → Outro   |  Eb dorian
//   VERSE  : Ebm9 Ab13 Db^9 Gb^9   | the Ab13's natural 3rd is the whole mood
//   CHORUS : Gb^9 Ab13 Fm7 Bbm9    | royal road in Db, settles on Bbm
//   BRIDGE : B^9 Bb7b9 Ebm9 Ab13   | B^9 = Cb — the dorian goes minor for 8 bars
//
// Eb dorian and Db major are the same seven notes, so the verse and chorus
// never actually change key — the chorus just re-centers the same collection
// a third away. Nothing resolves, nothing announces itself. The only real
// harmonic event in the track is the bridge, where the Cb finally shows up
// and the mode darkens.
//
// THE BASS IS THE SONG (again). Two kick hits a bar, cross-stick on 2 & 4,
// hats only on the "and" — the kit is there to leave a hole. The bass sits in
// that hole at 120-250Hz and slurs into every phrase. Rhodes, guitar and pad
// are all high-passed off its back.
// ══════════════════════════════════════════════════════════════════════
setcpm(72 / 4);

// ── PROGRESSIONS ──────────────────────────────────────────────────────
const vProg = chord("<Ebm9 Ab13 Db^9 Gb^9>").dict("ireal");
const cProg = chord("<Gb^9 Ab13 Fm7 Bbm9>").dict("ireal");
const bProg = chord("<B^9 Bb7b9 Ebm9 Ab13>").dict("ireal");

// tape flutter on everything pitched EXCEPT the bass — same trick as before,
// the dead-in-tune bass is what the drifting parts hang off of
const wobble = (x) => x.add(note(perlin.range(-0.03, 0.03).slow(7)));

// LinnDrum, dragged. 0.12 at 8ths is enough to feel drunk at 72bpm without
// turning into a shuffle — the offbeat hats land late and everything sags
const kit = (x) => x.bank("LinnDrum").swingBy(0.12, 8);

// ── DRUMS ─────────────────────────────────────────────────────────────
// two kicks a bar. beat 1 and the "and" of 3, and that is the entire kick
// part for the whole song. the bass fills in around them.
const drums = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").gain(0.9).lpf(1800),
    // cross-stick, not a snare — soft wood on 2 & 4, sitting in a room
    s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~").gain(0.5).lpf(4200).room(0.32),
    // hats ONLY on the "and" of each beat. eight of them would be fussy.
    s("~ hh ~ hh ~ hh ~ hh").gain(0.24).lpf(7000),
  ).apply(kit);

// 808 kick under the Linn kick — pure weight below 160Hz, no click
const thump = () =>
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~")
    .bank("RolandTR808")
    .gain(0.42)
    .lpf(160)
    .apply(kit);

// phrase-boundary only: open hat closing bar 4, two rim taps closing bar 8.
// nothing embellishes inside a phrase
const fill = () =>
  stack(
    s("<~ ~ ~ [~ ~ ~ oh]>").gain(0.2),
    s("<~ ~ ~ ~ ~ ~ ~ [~ ~ rim rim]>").gain(0.28).lpf(4200).room(0.35),
  ).bank("LinnDrum");

// chorus kit: finger snaps ghosting the cross-stick, one kick pickup per phrase
const drumsBig = () =>
  stack(
    drums(),
    thump(),
    fill(),
    s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
      .bank("RolandTR808")
      .gain(0.2)
      .room(0.45),
    s("<~ ~ ~ [~ ~ ~ [~ bd]]>").bank("LinnDrum").gain(0.66).lpf(1800),
  );

// ── THE BASS LINE ─────────────────────────────────────────────────────
// composed 4-bar melodies on voicing indices, so every note is a chord tone.
// slow jam bass wants SPACE — these lines are mostly rests. the notes that
// are there are long, slurred into, and land on or just after the kick.
const vBassMel =
  "<[0 ~ ~ [~ 2] 1 ~ 0 ~] [0 ~ ~ [~ 1] 2 ~ ~ [~ 3]] [0 ~ [~ 0] 2 ~ 1 ~ ~] [2 ~ 1 ~ 0 ~ [~ 1] ~]>";
const cBassMel =
  "<[0 ~ [~ 2] 3 ~ [2 ~] ~ ~] [0 ~ [~ 1] 2 ~ [3 ~] [~ 2] ~] [0 ~ [~ 0] 2 ~ [1 2] ~ [~ 3]] [4 ~ [~ 3] 2 ~ [1 ~] 0 ~]>";
const bBassMel =
  "<[0 ~ ~ [~ 2] 1 ~ ~ ~] [0 ~ [~ 1] 0 ~ [~ 3] 2 ~] [0 ~ ~ [~ 2] 1 ~ 0 ~] [0 ~ [~ 2] 3 ~ [2 1] ~ ~]>";
const oBassMel = "<[0 ~ ~ ~ ~ [1 0] ~ ~] [0 ~ ~ [~ 2] 1 ~ ~ ~]>";

// SLIDES — pitch envelope in semitones, offset from true pitch.
// panchor(0) + psustain(0) is mandatory: getParamADSR ramps to `min` on
// release, so the anchor decides where the note ENDS UP. At 0 the note starts
// `penv` semitones off, decays to true pitch, and stays there.
// negative = start flat, slide UP into it.  positive = fall DOWN into it.
// Step-aligned to the melodies above (8 steps/bar, `@` holds 0 across the
// notes that stay fretted) so only phrase starts and turnarounds slur.
// pdecay is long here — 0.09 at 72bpm is an audible, lazy smear, not a blip.
const vSlide = "<[-2 0@7] [-2 0@7] [-2 0@2 -2 0@4] [2 0@7]>";
const cSlide = "<[-2 0@7] [0@5 -2 0@2] [-2 0@7] [2 0@7]>";
const bSlide = "<[-2 0@7] [-2 0@7] [-3 0@7] [0@3 -2 0@4]>";
const oSlide = "<[-2 0@7] [-2 0@7]>";

const bass = (prog, line = vBassMel, slides = vSlide, g = 1.0, pdec = 0.09) =>
  n(line)
    .set(prog)
    .mode("root:g2")
    .voicing()
    .s("gm_electric_bass_finger")
    .clip(0.98) // notes overlap into each other — legato, never articulated
    .penv(slides)
    .panchor(0)
    .psustain(0)
    .pdecay(pdec)
    .lpf(1700)
    .room(0.12)
    .gain(perlin.range(g - 0.16, g).slow(4))
    .sometimesBy(0.1, (x) => x.gain(0.55));

// sub only where the arrangement is full — in the verse the bass owns the
// bottom by itself and the track sounds emptier on purpose
const sub = (prog) =>
  n("0 ~ ~ ~ ~ 0 ~ ~")
    .set(prog)
    .mode("root:a1")
    .voicing()
    .s("sine")
    .attack(0.02)
    .release(0.3)
    .clip(0.9)
    .lpf(190)
    .gain(0.4);

// ── KEYS & PADS (all high-passed — they live above the bass) ───────────
// Rhodes: one lazy push per bar plus a long ring. voices "[1,2,3]" drops the
// voicing's lowest note, which is what keeps the comp out of 150-250Hz.
const keys = (prog, g = 0.36, st = "x ~ ~ [~ x] ~ ~ x ~") =>
  n("[1,2,3]")
    .set(prog)
    .anchor("Bb4")
    .voicing()
    .s("gm_epiano1")
    .struct(st)
    .attack(0.03)
    .release(1.6) // longer than the gap between hits — the chords bleed together
    .clip(0.9)
    .phaser(3)
    .phaserdepth(0.5)
    .hpf(170)
    .lpf(1800)
    .gain(g)
    .pan(0.4)
    .room(0.45)
    .apply(wobble);

// warm saw pad, way back — the "room tone" of the track. attack is slow enough
// that it never has an edge, and the hpf keeps it off the bass entirely.
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

// clean chorused guitar — two-note stabs way up top, chorus sections only
const gtr = (prog, g = 0.3) =>
  n("[2,3]")
    .set(prog)
    .anchor("Db5")
    .voicing()
    .s("gm_electric_guitar_clean")
    .struct("~ ~ x ~ ~ ~ ~ [~ x]")
    .clip(0.25)
    .phaser(2)
    .hpf(340) // memory-of-a-guitar, not a chord — stays clear of the bass
    .lpf(2800)
    .gain(g)
    .pan(0.64)
    .room(0.3)
    .apply(wobble);

// ── BELLS & LEADS ─────────────────────────────────────────────────────
// FM triangle glints, one or two a bar, drenched in dotted-eighth delay
const bells = (prog, g = 0.3) =>
  n(
    "<[~ ~ ~ ~ ~ ~ 2 ~] [~ ~ 1 ~ ~ ~ ~ ~] [~ ~ ~ ~ 3 ~ ~ [2 ~]] [~ ~ 0 ~ ~ ~ ~ ~]>",
  )
    .set(prog)
    .anchor("Gb5")
    .voicing()
    .s("triangle")
    .fm(5)
    .fmh(2.01)
    .attack(0.005)
    .decay(0.4)
    .sustain(0)
    .delay(0.35)
    .delaytime(0.375)
    .delayfeedback(0.4)
    .lpf(4000)
    .gain(g)
    .pan(0.6)
    .room(0.5);

// breathy triangle lead — hummed, not sung. sits above everything, quiet.
const lead = (mel, sc = "eb4:dorian", g = 0.3) =>
  n(mel)
    .scale(sc)
    .s("triangle")
    .attack(0.08)
    .release(0.5)
    .clip(0.95)
    .vib("3:.045") // slow vibrato is the only thing making it read as a voice
    .lpf(2100)
    .gain(g)
    .pan(0.52)
    .room(0.5)
    .delay(0.2)
    .delaytime(0.5)
    .delayfeedback(0.3)
    .apply(wobble);

const leadWide = (mel, sc = "eb4:dorian") =>
  stack(
    lead(mel, sc, 0.3),
    lead(mel, sc, 0.13).add(note(12)).pan(0.44).lpf(3400),
  );

// tenor sax, bridge only, and mixed low enough to be atmosphere rather than
// a solo. it plays the altered notes of the Bb7b9 — that's the whole point
const sax = (mel, g = 0.34) =>
  n(mel)
    .scale("eb4:minor")
    .s("gm_tenor_sax")
    .clip(0.92)
    .attack(0.06)
    .lpf(2400)
    .gain(g)
    .pan(0.46)
    .room(0.5)
    .delay(0.22)
    .delaytime(0.5)
    .delayfeedback(0.28)
    .apply(wobble);

// ── MELODIES ──────────────────────────────────────────────────────────
// verse 2 only — four notes in four bars, and the last one is the #11 of Gb^9
const verseCounter = "<[~ ~ ~ 4] [~ ~ 3 ~] [~ ~ ~ 6] [5 ~ ~ ~]>";
// chorus "vocal": quarter notes, all chord tones, nothing clever
const chorMel = "<[~ 2 ~ [4 2]] [3 ~ ~ [5 ~]] [~ 5 ~ [3 ~]] [4 ~ 6 ~]>";
// bridge sax: Db(#9) → Cb(b9) → Gb(b13) over the Bb7b9 in bar 2
const bridMel =
  "<[~ ~ 4 ~ [5 ~] 7 ~ ~] [~ 6 ~ [5 4] ~ 2 ~ ~] [~ ~ 0 ~ [2 ~] 4 ~ ~] [3 ~ [~ 1] 0 ~ ~ ~ ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
// kick, cross-stick, bass. four bars to let the hook state itself.
const intro = () => stack(drums(), bass(vProg), pad(vProg, 0.12));

const verse = (mel = null) =>
  stack(
    drums(),
    fill(),
    bass(vProg),
    keys(vProg, 0.34),
    pad(vProg, 0.16),
    mel ? lead(mel, "eb4:dorian", 0.22) : silence,
  );

const chorus = () =>
  stack(
    drumsBig(),
    bass(cProg, cBassMel, cSlide),
    sub(cProg),
    keys(cProg, 0.38, "x ~ [~ x] ~ ~ x ~ [~ x]"),
    pad(cProg, 0.2),
    gtr(cProg),
    bells(cProg),
    leadWide(chorMel),
  );

// the Cb arrives, the mode goes minor, the sax comes in over it
const bridge = () =>
  stack(
    drums(),
    thump(),
    fill(),
    bass(bProg, bBassMel, bSlide),
    sub(bProg),
    keys(bProg, 0.32),
    pad(bProg, 0.2),
    bells(bProg, 0.22),
    sax(bridMel),
  );

// peel it back to the bass and a soft kick. longer pdecay = the slides go
// slack as it winds down.
const outro = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").gain(0.6).lpf(1300).apply(kit),
    bass(vProg, oBassMel, oSlide, 0.9, 0.14),
    keys(vProg, 0.22, "x ~ ~ ~ ~ ~ ~ ~"),
    pad(vProg, 0.14),
  );

// hiss sits outside the arrangement so it never marks the seams
$: s("crackle*4").density(0.03).gain(0.28);

$: arrange(
  [4, intro()],
  [8, verse()],
  [8, chorus()],
  [8, verse(verseCounter)],
  [8, chorus()],
  [8, bridge()],
  [8, chorus()],
  [4, outro()],
  [2, silence],
);
