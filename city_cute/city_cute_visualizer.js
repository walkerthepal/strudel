// ══════════════════════════════════════════════════════════════════════
// 8-BIT CITY POP — Intro → V1 → Pre → Cho → V2 → Pre → Cho → Bridge → Pre → Cho → Tag → Outro
// KEY: A major, ~112bpm
//   VERSE  : D^7 E7 C#m7 F#m7        | royal road — floats, no I
//   PRE    : Bm7 E7                  | ii–V ramp, drum fill in bar 2
//   CHORUS : A^7 D^7 C#m7 [Bm7 E7]   | lands on I, doubled lead up an octave
//   BRIDGE : Bm7 E7 A^7 F#7          | F#7 = V of Bm → pulls into the pre
//   TAG    : first half-chorus, quiet | ends on D^7 → plagal cadence into outro
// ══════════════════════════════════════════════════════════════════════
// NOTE: 'mediump' MUST be single-quoted. The REPL turns double-quoted
// strings into patterns, and initHydra JSON.stringifies its options →
// pattern internals are BigInt → "Do not know how to serialize a BigInt".
await initHydra({ width: 320, height: 180, precision: "mediump" });
setcpm(112 / 4);

// ── PROGRESSIONS ──────────────────────────────────────────────────────
const verseProg = chord("<D^7 E7 C#m7 F#m7>").dict("ireal");
const preProg = chord("<Bm7 E7>").dict("ireal");
const chorProg = chord("<A^7 D^7 C#m7 [Bm7 E7]>").dict("ireal");
const bridProg = chord("<Bm7 E7 A^7 F#7>").dict("ireal");
const endProg = chord("A^9").dict("ireal");

// ── CHIP VOICES ───────────────────────────────────────────────────────
const drums = () =>
  stack(s("bd ~ [~ bd] ~, ~ sd ~ sd"), s("hh*8").gain("[.6 .35]*4"))
    .bank("LinnDrum")
    .crush(5);

const drumsBig = () =>
  stack(drums(), s("~ ~ ~ [~ oh]").gain(0.5).bank("LinnDrum").crush(5));

const preDrums = () =>
  stack(
    s(
      "<[bd ~ [~ bd] ~, ~ sd ~ sd] [bd ~ ~ ~, ~ [~ sd] [sd sd] [sd sd sd sd]]>",
    ),
    s("hh*8").gain("[.6 .35]*4"),
    s("<~ [~ ~ ~ [~ oh]]>").gain(0.55),
  )
    .bank("LinnDrum")
    .crush(5);

const triBass = (prog, line = "<0 0 0 [0 2]>*2") =>
  n(line)
    .set(prog)
    .mode("root:g2")
    .voicing()
    .s("triangle")
    .clip(0.8)
    .gain(0.85);

const chipArps = (prog, anch = "A4", g = 0.35) =>
  n("0 1 2 3".fast(2))
    .set(prog)
    .anchor(anch)
    .voicing()
    .s("square")
    .decay(0.12)
    .sustain(0)
    .lpf(2600)
    .gain(g)
    .pan(0.4);

const lead = (mel, sc) =>
  n(mel)
    .scale(sc)
    .s("square")
    .vib("4:.1")
    .decay(0.3)
    .sustain(0.2)
    .release(0.05)
    .lpf(3000)
    .gain(0.5)
    .pan(0.6)
    .delay(0.25)
    .delaytime(0.375)
    .delayfeedback(0.3);

// two pulse channels in near-unison — the fat NES lead
const leadWide = (mel, sc) =>
  stack(lead(mel, sc), lead(mel, sc).add(note(0.08)).pan(0.35).gain(0.38));

// ── MELODIES ──────────────────────────────────────────────────────────
const verseMel = "<[0 2 4 ~] [5 4 2 ~] [4 3 2 ~] [1 2 0 ~]>";
const verseMel2 = "<[4 5 7 ~] [7 5 4 ~] [2 4 5 ~] [4 2 0 ~]>";
const preMel = "<[~ 1 2 3] [4 [5 6] 7 ~]>";
const chorMel =
  "<[~ ~ ~ [~ 0] 2 ~ 4 ~] [~ ~ ~ [~ 3] 5 ~ 7 ~] [~ ~ ~ [~ 2] 4 ~ 6 ~] [~ ~ ~ [~ 1] 3 ~ 4 2]>";
const bridMel = "<[1 2 4 [5 4]] [2 4 5 [7 5]] [7 [6 5] 4 2] [4 2 1 ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
const intro = () => stack(drums(), triBass(verseProg)).swingBy(1 / 8, 8);

const verse = (mel = verseMel) =>
  stack(
    drums(),
    triBass(verseProg),
    chipArps(verseProg, "A4"),
    lead(mel, "A4:major"),
  ).swingBy(1 / 8, 8);

const prechorus = () =>
  stack(
    preDrums(),
    triBass(preProg, "<[0!3 [0 2]] [0 2 4 5]>"),
    chipArps(preProg, "A4", 0.38),
    lead(preMel, "A4:major"),
  ).swingBy(1 / 8, 8);

const chorus = (v = 1) =>
  stack(
    drumsBig(),
    triBass(chorProg, "<0 [0 4] 0 [0 2]>*2"),
    chipArps(chorProg, "C5", 0.4),
    leadWide(chorMel, "A5:major"),
  )
    .swingBy(0.1, 8)
    .velocity(v);

const bridge = () =>
  stack(
    drums(),
    triBass(bridProg),
    lead(bridMel, "A5:major").vib("5:.15").delayfeedback(0.35),
  ).swingBy(0.06, 8);

const tag = () =>
  stack(
    drums(), // no open hat
    triBass(chorProg, "<0 [0 4] 0 [0 2]>*2"),
    leadWide(chorMel, "A5:major"),
  ).swingBy(0.1, 8);

// outro: one last bar of groove, then a chip-style button ending —
// run up the A^9, unison downbeat hit, echo out
const outro = () =>
  stack(
    s("<[bd ~ [~ bd] ~, ~ sd ~ sd] [[bd,oh] ~ ~ ~]>").bank("LinnDrum").crush(5),
    s("<[hh*8] ~>").gain("[.6 .35]*4").bank("LinnDrum").crush(5),
    n("<[0 0 0 [4 2]] [0@4]>")
      .set(endProg)
      .mode("root:g2")
      .voicing()
      .s("triangle")
      .clip("<.8 3>")
      .gain(0.85),
    n("<[0 1 2 3]*2 [[0 1 2 3 4 5 6 7] ~]>")
      .set(endProg)
      .anchor("A4")
      .voicing()
      .s("square")
      .decay(0.12)
      .sustain(0)
      .lpf(2600)
      .gain(0.4)
      .pan(0.4)
      .delay(0.4)
      .delaytime(0.375)
      .delayfeedback(0.45),
  ).swingBy(1 / 8, 8);

// ══════════════════════════════════════════════════════════════════════
//  VISUALS — HYDRA   (retro 90s city-pop, chunky pixels)
//  Beat-synced via H() — no detectAudio, no per-frame FFT polling.
//  Perf setup:
//    · these double-quoted consts are already pre-parsed into Patterns by
//      the REPL transpiler — H() gets a Pattern, no per-frame parsing.
//      Do NOT wrap them in mini(); the transpiler makes that mini(pattern).
//    · window.fps = 24 (below .out()) caps hydra's render loop; throttled
//      frames skip uniform evaluation + the GL draw entirely.
//    · 320x180 buffer; canvas is pixelated:true by default → crisp upscale.
//  Keep this .out() ABOVE arrange() — the REPL plays the LAST expression.
// ══════════════════════════════════════════════════════════════════════
const punch = "1 0.15 [0.15 1] 0.15"; // kick rhythm — bd on beat 1 + & of 3
const back = "0.2 0.55 0.2 0.55"; // backbeat — grid flashes on the snare
const drift = "<0 0.04 0.09 0.14>"; // hue sweep, steps once per bar

osc(5, 0.05, 0.9)
  .color(1.3, 0.55, 0.7) // peach → magenta
  .hue(H(drift)) // slow palette drift per phrase
  // ── teal scanline "blinds" scrolling up = the retro grid ────────────
  .add(
    osc(26, 0, 0)
      .rotate(Math.PI / 2)
      .thresh(0.6, 0.05)
      .color(0.3, 0.9, 0.85)
      .scrollY(0, 0.05),
    H(back), // grid brightens on the backbeat
  )
  // ── pulsing sun ─────────────────────────────────────────────────────
  .add(
    shape(72, H(punch.mul(0.23).add(0.15)), 0.06) // radius pumps on the kick
      .color(1.4, 0.75, 0.38)
      .scale(1, 0.7)
      .scrollY(-0.12), // modulateScale dropped — extra texture pass, invisible payoff
    H(punch.mul(0.4).add(0.5)), // brightness pumps too
  )
  // ── BIG 8-bit pixels — lower the two numbers = chunkier blocks ───────
  .pixelate(48, 27) // try 32,18 for mega-chunk / 80,45 finer
  // ── 90s CRT scanlines + saturation/contrast lift ────────────────────
  .mult(
    osc(90, 0, 0)
      .rotate(Math.PI / 2)
      .brightness(0.15),
    0.5,
  )
  .saturate(1.35)
  .contrast(1.1)
  .out();

// cap hydra's render loop — hands the main thread back to the scheduler.
// sandboxed hydra global, synced every rAF. 24 reads as retro; try 15 if needed.
window.fps = 24;

// ── ARRANGEMENT ───────────────────────────────────────────────────────
// KEEP THIS LAST — it's the expression the REPL actually plays.
arrange(
  [4, intro()],
  [4, verse()],
  [2, prechorus()],
  [4, chorus()],
  [4, verse(verseMel2)],
  [2, prechorus()],
  [4, chorus()],
  [4, bridge()],
  [2, prechorus()],
  [4, chorus()],
  [2, tag()],
  [2, outro()],
  [2, silence],
);
