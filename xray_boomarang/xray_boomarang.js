// ══════════════════════════════════════════════════════════════════════
// XRAY BOOMARANG — bedroom pop, hips first
// Intro → V1 → Cho → V2 → Cho → Bridge → Cho → Outro   |  B dorian, 104bpm
//   VERSE  : Bm9 E13 G^9 F#m9       | dorian haze — the E13 is the lift
//   CHORUS : G^9 A13 F#m9 Bm9       | royal road in D, lands back home on Bm
//   BRIDGE : G^9 A13 D^9 [C#m7 F#7] | D^9 opens the roof, F#7 pulls back in
//
// THE BASS IS THE SONG. It states the hook naked in the intro, carries the
// verse with no vocal over it, and only hands off in the chorus. Everything
// else is cleared out of its register — guitar and keys are high-passed,
// the sub only shows up when the bass moves out of the way. It slurs into
// its notes with real pitch slides (see vSlide/cSlide/bSlide below).
// ══════════════════════════════════════════════════════════════════════
setcpm(104 / 4);

// ── PROGRESSIONS ──────────────────────────────────────────────────────
const vProg = chord("<Bm9 E13 G^9 F#m9>").dict("ireal");
const cProg = chord("<G^9 A13 F#m9 Bm9>").dict("ireal");
const bProg = chord("<G^9 A13 D^9 [C#m7 F#7]>").dict("ireal");

// tape flutter — everything pitched EXCEPT the bass drifts a few cents.
// the bass stays dead in tune; that's what makes it the anchor.
// ±3 cents, slowly: at ±8 it stopped reading as tape and started reading
// as badly tuned
const wobble = (x) => x.add(note(perlin.range(-0.03, 0.03).slow(6)));
const kit = (x) => x.bank("LinnDrum").swingBy(0.09, 8);

// ── DRUMS ─────────────────────────────────────────────────────────────
// kick: 1, the "and" of 2, the "and" of 3 — the bass lands on all three
const drums = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").gain(0.92).lpf(2200),
    s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(0.64).lpf(3200).room(0.22),
    s("~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~").gain(0.15).degradeBy(0.4),
    s("hh*8").gain("[.3 .18]*4").lpf(6500),
  ).apply(kit);

// phrase-boundary only: open hat on bar 4, snare tail on bar 8
const fill = () =>
  stack(
    s("<~ ~ ~ [~ ~ ~ oh]>").gain(0.28),
    s("<~ ~ ~ ~ ~ ~ ~ [~ ~ ~ [sd sd sd]]>").gain(0.38).lpf(3200).room(0.2),
  ).bank("LinnDrum");

const drumsBig = () =>
  stack(
    drums(),
    s("~ ~ ~ ~ cp ~ ~ ~ ~ ~ ~ ~ cp ~ ~ ~")
      .gain(0.26)
      .bank("RolandTR808")
      .room(0.3),
    fill(),
  );

// ── THE BASS LINE ─────────────────────────────────────────────────────
// composed 4-bar melodies, not riffs. voicing indices, so every note is a
// chord tone — it climbs through bars 1-2, leaps the octave in 3, walks home
const vBassMel =
  "<[0 ~ [~ 0] 2 ~ [1 0] ~ ~] [0 ~ [~ 0] 1 ~ [2 ~] 3 ~] [0 ~ [~ 2] 1 ~ [0 ~] ~ 4] [3 ~ [~ 2] 1 ~ 0 [~ 1] ~]>";
const cBassMel =
  "<[0 ~ [~ 0] 2 [~ 4] [3 ~] 2 ~] [0 ~ [~ 2] 3 ~ [4 ~] [~ 2] ~] [0 ~ [~ 0] 2 ~ [3 4] ~ [~ 2]] [0 ~ [~ 2] 1 ~ [0 ~] [~ 1] 2]>";
const bBassMel =
  "<[0 ~ ~ 2 ~ [1 ~] ~ [~ 3]] [0 ~ [~ 0] 1 ~ [2 3] ~ ~] [0 ~ [~ 2] 4 ~ [3 ~] [~ 2] ~] [0 ~ [~ 2] 1 0 ~ [~ 1] 2]>";
const oBassMel = "<[0 ~ ~ ~ ~ [1 0] ~ ~] [0 ~ [~ 2] 1 ~ 0 ~ ~]>";

// SLIDES — pitch envelope, in semitones, offset from the true pitch.
//
// The envelope MUST be configured panchor(0) + psustain(0). superdough's
// getParamADSR always ramps back to `min` on note release, so the anchor
// decides where the note ENDS UP. With panchor(0): min=0, so the note starts
// `penv` semitones off, decays to true pitch over pdecay, and releases to 0
// — dead in tune. (panchor(1) inverts that: it arrives in tune and then bends
// back off-pitch as it rings out. That is what made this sound broken.)
//
// Sign = direction of approach:  negative = start flat, slide UP the neck
//                                positive = start sharp, fall DOWN into it
// Patterns are step-aligned to the melodies above (8 steps/bar; `@` holds 0
// across the notes that stay fretted) so only chosen notes slide: phrase
// starts, the octave leap, and the turnarounds.
const vSlide = "<[-2 0@7] [0@6 -2 0] [-2 0@6 -3] [2 0@7]>";
const cSlide = "<[-2 0@7] [0@5 -2 0@2] [-2 0@4 -2 0@2] [0@7 2]>";
const bSlide = "<[-2 0@6 -2] [0@5 -2 0@2] [0@3 -3 0@4] [0@7 2]>";
const oSlide = "<[-2 0@7] [-2 0@7]>";

// round, fingered, mid-forward — sits at 120–250Hz where it reads as melody.
// perlin gain + occasional ghosts = a player, not a sequencer
const bass = (prog, line = vBassMel, slides = vSlide, g = 1.0, pdec = 0.06) =>
  n(line)
    .set(prog)
    .mode("root:g2")
    .voicing()
    .s("gm_electric_bass_finger")
    .clip(0.96) // notes just touch — the line slurs instead of articulating
    .penv(slides)
    .panchor(0) // resolve TO pitch and stay — see the note above
    .psustain(0)
    .pdecay(pdec) // slide time; no pattack, so the bend starts instantly
    .lpf(1900)
    .room(0.1)
    .gain(perlin.range(g - 0.14, g).slow(3))
    .sometimesBy(0.12, (x) => x.gain(0.5));

// sub only in the big sections — in the verse the bass owns the bottom alone
const sub = (prog) =>
  n("0 ~ ~ 0 ~ ~ ~ ~")
    .set(prog)
    .mode("root:a1")
    .voicing()
    .s("sine")
    .attack(0.01)
    .release(0.18)
    .clip(0.9)
    .lpf(210)
    .gain(0.42);

// ── CHORDS (high-passed — they live above the bass, never under it) ────
const gtr = (prog, st = "~ x ~ x ~ x ~ [x x]", g = 0.42, voices = "[0,1,2,3]") =>
  n(voices)
    .set(prog)
    .anchor("B4")
    .voicing()
    .s("gm_electric_guitar_clean")
    .struct(st)
    .clip(0.22)
    .phaser(2)
    .hpf(180) // guitar's lowest is ~247Hz; this is insurance, not a carve
    .lpf(2700)
    .gain(g)
    .pan(0.62)
    .room(0.25)
    .apply(wobble);

// voices "[1,2,3]" drops the voicing's LOWEST note. That bottom voice sat
// around 185Hz — right on top of the bass's upper range — so losing it is
// what separates the pad from the bassline. Top note is unchanged (anchor
// mode is `below`), so the pad keeps its register and just stops competing.
const keys = (prog, g = 0.35, voices = "[1,2,3]") =>
  n(voices)
    .set(prog)
    .anchor("F#4") // voicing mode is `below`: top note <= F#4, so ~185-370Hz
    .voicing()
    .s("gm_epiano1")
    .attack(0.02)
    .release(0.9)
    .phaser(4)
    // 150, not 380 — the bass only occupies 123-247Hz and the sub sits below
    // that, so this clears them without touching the chord. At 380 this was
    // filtering ABOVE the voicing's own top note and gutting the part.
    .hpf(150)
    .lpf(1900)
    .gain(g)
    .pan(0.38)
    .room(0.4)
    .apply(wobble);

// ── LEAD ──────────────────────────────────────────────────────────────
// breathy triangle — sits like a hummed vocal. absent from verse 1 entirely
const lead = (mel, sc = "B4:dorian", g = 0.32) =>
  n(mel)
    .scale(sc)
    .s("triangle")
    .attack(0.05)
    .release(0.35)
    .clip(0.95)
    // no pitch envelope here. a scoop on every note + vibrato + tape drift
    // stacks into permanent warble — the lead reads as sung from the soft
    // attack and the vibrato alone
    .vib("3.5:.05")
    .lpf(2200)
    .gain(g)
    .pan(0.55)
    .room(0.45)
    .delay(0.22)
    .delaytime(0.375)
    .delayfeedback(0.3)
    .apply(wobble);

const leadWide = (mel, sc = "B4:dorian") =>
  stack(
    lead(mel, sc, 0.32),
    lead(mel, sc, 0.15).add(note(12)).pan(0.45).lpf(3200),
  );

// ── MELODIES ──────────────────────────────────────────────────────────
// verse 2 only — a thin counterline sitting high above the bass, not a hook
const verseCounter = "<[~ ~ ~ 6] [~ ~ 5 ~] [~ ~ ~ 8] [7 ~ ~ ~]>";
const chorMel = "<[~ 6 ~ [7 6]] [4 ~ ~ [2 4]] [~ 5 ~ [6 5]] [4 ~ 2 ~]>";
const bridMel = "<[~ 4 6 ~] [~ 6 7 ~] [~ 7 9 [8 7]] [6 ~ 4 ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
// 4 bars of drums + bass, nothing else. states the whole hook naked
const intro = () => stack(drums(), bass(vProg));

// no vocal. sparse two-note guitar stabs high up, keys as haze
const verse = (mel = null) =>
  stack(
    drums(),
    fill(),
    bass(vProg),
    gtr(vProg, "~ ~ ~ x ~ ~ ~ [~ x]", 0.28, "[2,3]"),
    keys(vProg, 0.31),
    mel ? lead(mel, "B4:dorian", 0.22) : silence,
  );

// the handoff — voice takes the tune, bass gets busier underneath it
const chorus = () =>
  stack(
    drumsBig(),
    bass(cProg, cBassMel, cSlide),
    sub(cProg),
    // thinned like the Rhodes — drops the guitar's bottom voice out of the
    // pad's core so the two stop stacking in the same 250-370Hz band
    gtr(cProg, "[~ x]*4", 0.44, "[1,2,3]"),
    keys(cProg, 0.39),
    leadWide(chorMel),
  );

// chords thin out, the F#7 shoves you back into the chorus
const bridge = () =>
  stack(
    drums(),
    fill(),
    bass(bProg, bBassMel, bSlide),
    sub(bProg),
    keys(bProg, 0.31),
    lead(bridMel, "B4:dorian", 0.34),
  );

// everything peels away until it's just the bass and a kick
const outro = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ bd ~ ~ ~ ~ ~").gain(0.66).lpf(1500).apply(kit),
    // longer pdecay — the slides go lazy as the track winds down
    bass(vProg, oBassMel, oSlide, 0.92, 0.1),
    keys(vProg, 0.22),
  );

// tape hiss lives outside the arrangement — never marks the loop point
$: s("crackle*4").density(0.03).gain(0.32);

$: arrange(
  [4, intro()],
  [8, verse()],
  [8, chorus()],
  [8, verse(verseCounter)],
  [8, chorus()],
  [4, bridge()],
  [8, chorus()],
  [4, outro()],
  [2, silence],
);
