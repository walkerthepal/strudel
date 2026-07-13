// ── DUSTY LOFI — loopable study bed ──
setcpm(76 / 4);

const prog = chord("<Fm9 Db^7 Ab^7 <Eb7 C7>>").dict("ireal");

const dust = (x) => x.crush(8).coarse(2).speed(0.97);

const drums = () =>
  stack(
    s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~").gain(0.95).lpf(2500),
    s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(0.85).lpf(3000),
    s("~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~").gain(0.2).degradeBy(0.5),
    s("hh*8").gain("[.4 .22]*4"),
  )
    .bank("RolandTR808")
    .swingBy(0.07, 8)
    .apply(dust);

const kickOnly = () =>
  s("bd ~ ~ ~ ~ ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~")
    .gain(0.9)
    .lpf(1800)
    .bank("RolandTR808")
    .apply(dust);

const keys = (cutoff = 950) =>
  n("[0,1,2,3]")
    .set(prog)
    .anchor("F4")
    .voicing()
    .s("triangle")
    .attack(0.03)
    .release(1.2)
    .add(note(perlin.range(-0.07, 0.07).slow(3)))
    .lpf(cutoff)
    .gain(0.35)
    .room(0.45);

const sub = () =>
  n("0")
    .set(prog)
    .mode("root:f1")
    .voicing()
    .s("sine")
    .attack(0.01)
    .release(0.12)
    .clip(0.9)
    .lpf(250)
    .gain(0.6);

const pad = () =>
  n("[0,1,2,3]")
    .set(prog)
    .anchor("F5")
    .voicing()
    .s("sawtooth")
    .attack(1.5)
    .release(2)
    .lpf(sine.range(350, 900).slow(8))
    .gain(0.12)
    .room(0.6)
    .pan(0.4);

const ping = () =>
  n("<[~ ~ 3 ~] ~ [~ 6 ~ ~] ~>")
    .set(prog)
    .anchor("F5")
    .voicing()
    .s("triangle")
    .decay(0.4)
    .sustain(0)
    .lpf(1600)
    .delay(0.5)
    .delaytime(0.375)
    .delayfeedback(0.45)
    .gain(0.2)
    .pan(0.35);

const sax = (mel) =>
  n(mel)
    .scale("F3:minor")
    .s("sawtooth")
    .attack(0.09)
    .release(0.6)
    .clip(1.1) // notes overlap slightly — phrases smear together, legato
    .vib("3.5:.15")
    .lpf(1100)
    .lpq(2)
    .gain(perlin.range(0.34, 0.52).slow(2)) // breathing dynamics
    .room(0.5)
    .pan(0.55)
    .delay(0.15)
    .delaytime(0.33)
    .delayfeedback(0.2)
    .swingBy(0.07, 8);

// pickup run → long hold → lazy fall. floats, never lands
const saxMel = "<[~ ~ [~ 4] [5 6]] [7@7 ~] [~ 6 5@2] [4 2@3]>";
// the answer — same shape, resolves home to F
const saxMel2 = "<[~ ~ [~ 2] [4 5]] [5@5 ~ [4 2]] [~ 4 2@2] [0@3 ~]>";

const groove = () => stack(drums(), keys(), sub(), pad(), ping());
const main = (mel = saxMel) => stack(drums(), keys(), sub(), sax(mel));
const breakdown = () => stack(kickOnly(), keys(550), sub(), ping());

// crackle runs outside the arrangement — never marks the loop point
$: s("crackle*4").density(0.04).gain(0.5);

$: arrange(
  [8, groove()],
  [8, main(saxMel)],
  [4, breakdown()],
  [8, main(saxMel2)],
  [4, groove()],
);
