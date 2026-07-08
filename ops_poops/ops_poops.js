// ── DUSTY LOFI — Intro → Main → Breakdown → Main ──
setcpm(76 / 4);

const prog = chord("<Fm9 Db^7 Ab^7 <Eb7 C7>>").dict("ireal");

const dust = (x) => x.crush(8).coarse(2).speed(0.97);

const drums = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").gain(0.95).lpf(2500), // two kicks, that's it
    s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(0.85).lpf(3000), // flat 2 & 4
    s("hh*8").gain("[.4 .22]*4"), // one hat pattern, no rolls
  )
    .bank("RolandTR808")
    .swingBy(0.07, 8); // barely-swung, not showtunes

const kickOnly = () =>
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~")
    .gain(0.9)
    .lpf(1800)
    .bank("RolandTR808");

const keys = (cutoff = 950) =>
  n("[0,1,2,3]") // block chord, once a bar — no noodling
    .set(prog)
    .anchor("F4")
    .voicing()
    .s("triangle")
    .attack(0.03)
    .release(1.2)
    .lpf(cutoff)
    .gain(0.35)
    .room(0.45);

const sub = () =>
  n("0")
    .set(prog)
    .mode("root:f1")
    .voicing()
    .s("sine")
    .clip(0.9)
    .lpf(250)
    .gain(0.6);

const sax = (mel) =>
  n(mel)
    .scale("F3:minor")
    .s("sawtooth")
    .attack(0.09)
    .release(0.4) // lazy onset — no note starts on time
    .vib("3.5:.12") // slow, wide-ish vibrato = breath
    .lpf(1100)
    .lpq(2) // dark, no buzz
    .gain(0.42)
    .room(0.5)
    .pan(0.55)
    .swingBy(0.07, 8);

// four-bar phrase, mostly air — lands on chord tones, trails off
const saxMel = "<[~ ~ 4 [~ 5]] [7@3 ~] [~ 6 5 [4 ~]] [2@2 ~ ~]>";

const main = () => stack(drums(), keys(), sub(), sax(saxMel));
const breakdown = () => stack(kickOnly(), keys(550), sub()); // hats/snare drop, keys go underwater

arrange(
  [2, stack(kickOnly(), keys(700))], // intro: kick + muffled keys
  [8, main()],
  [4, breakdown()],
  [8, main()],
  [2, stack(keys(500), sub())], // outro: drums out, chord rings
).apply(dust);
