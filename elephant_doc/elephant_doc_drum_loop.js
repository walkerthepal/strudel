// ══════════════════════════════════════════════════════════════════════
// ELEPHANT DOC — drum loop. songo pocket, 96bpm, 3-2 son clave.
// Built to be played over: nothing lives in the guitar's midrange.
//
// THE POCKET IS A DISAGREEMENT. The percussion (clave, cáscara, congas)
// is dead straight — latin time is straight, and a swung clave is a broken
// clave. The kit swings 0.03 on 16ths and the cross-stick lands 18ms behind
// the grid. Those two halves not-quite-agreeing about where the beat is IS
// the pocket. Nothing here is loose because notes were removed.
//
// 3-2 SON CLAVE, not 2-3: the three-side leads, so you hear the anchor in
// the first bar instead of waiting for it. Everything else locks to it —
// the cáscara accents its bombo, the kick plays the tresillo that is the
// 3-side's spine, the congas answer on the back half.
//
// THE KICK IS A TRESILLO (3+3+2 — beat 1, the "&" of 2, beat 4) with the
// third hit ghosted, so you hear two kicks and feel three. Beneath it an
// 808 at 160Hz doubles ONLY beat 1 and the "&" of 2 — beat 4 is left to
// the ghost, which is what keeps the low end breathing instead of pumping.
//
// ROOM FOR YOU: kick lowpassed to 1000 (sub at 160), congas to 2600 and
// panned left, cáscara high-passed to 2200 and panned right, clave a
// woodblock at 2kHz. 200Hz–2kHz is deliberately empty. That hole is the
// guitar.
//
// ─── WHAT TO PLAY OVER IT ─────────────────────────────────────────────
// A DORIAN, two chords, one bar each:  | Am9 | D9 |   (loops with the clave)
//   Am9 : 5x5557    D9 : x5455x  — or just move one shape up a 4th
// More harmony if you want it:  | Am9 | D9 | Am9 | E7#9 |  (4-bar turnaround)
//
// Where to put the chords — pick one, don't do all three:
//   1. ON THE CLAVE itself (the guitar becomes percussion — most authentic,
//      hardest to get bored of):  1 · &2 · 4  ||  2 · 3
//   2. GUAJEO — dyads on the offbeats, same shape every bar. Hypnotic;
//      hands the section to the drums so you can sing over it.
//   3. Nothing on beat 1, ever. Land on the "&" of 2 and beat 4 and let the
//      kick have the downbeat alone. This is the one that makes it lean.
//
// Solo over A dorian (natural 6th — that F# is the whole flavor). The b5
// blues note works on the way down, never on a landing.
// ══════════════════════════════════════════════════════════════════════
setcpm(96 / 4);

// ── MIX BUSES ─────────────────────────────────────────────────────────
// `room` is a SEND and the reverb lives on the orbit, so the kit and the
// percussion each get their own tail. One shared reverb for six voices is
// how a small loop starts sounding like a smeared one.
const busKit = (x) => x.orbit(1).roomsize(1.1).roomlp(3200); // tight, dark
const busPerc = (x) => x.orbit(2).roomsize(2.2).roomlp(7000); // a real room

// feel only, no bank — safe to apply on top of 808 voices
const groove = (x) => x.swingBy(0.03, 16);
const kit = (x) => x.bank("LinnDrum").apply(groove).apply(busKit);

// ── PERCUSSION (straight time — this half does NOT drag) ──────────────
// 3-2 SON CLAVE on a real woodblock. Pitched, sits at 2kHz, never argues
// with the kit or the bass. 8 steps per bar: 1 · &2 · 4  ||  2 · 3
$: note("<[c6 ~ ~ c6 ~ ~ c6 ~] [~ ~ c6 ~ c6 ~ ~ ~]>")
  .s("gm_woodblock")
  .clip(0.3)
  .gain(0.3)
  .pan(0.56)
  .lpf(6500)
  .room(0.24)
  .apply(busPerc);

// CÁSCARA — the timbale shell figure, played as a shaker. Syncopated by
// nature, so it gives 8th-note motion without the machine-gun quality of
// straight 16th hats. TWO ACCENTS A BAR, SIX GHOSTS: `velocity` multiplies
// gain, and the accents land on beat 1 and the bombo ("&" of 2). A flat
// shaker is a texture you stop hearing; an accented one is a person.
$: s("<[hh ~ hh hh ~ hh ~ hh] [hh ~ hh ~ hh hh ~ hh]>")
  .bank("RolandTR808")
  .hpf(2200)
  .gain(0.2)
  .velocity("1 .45 .5 .8 .45 .5 .4 .55")
  .sometimesBy(0.3, (x) => x.velocity(0.3))
  .pan(0.66)
  .room(0.2)
  .apply(busPerc);

// CONGA TUMBAO — open tones on the "&" of 2, beat 4 and its "&" (the last
// one ghosted; a conga player's hand is already on its way back up).
$: s("<[~ ~ ~ mt ~ ~ mt mt] [~ ~ ~ mt ~ ~ mt [mt mt]]>")
  .bank("RolandTR808")
  .gain(0.36)
  .velocity("1 1 1 1 1 1 .9 .55")
  .lpf(2600)
  .pan(0.34)
  .room(0.3)
  .apply(busPerc);

// the slap on 2, and the low heel-stroke laying 6ms behind the way a hand
// does. both way down — they're the drum's body, not its voice.
$: s("~ ~ ht ~ ~ ~ ~ ~")
  .bank("RolandTR808")
  .gain(0.19)
  .lpf(3200)
  .pan(0.3)
  .room(0.28)
  .apply(busPerc);
$: s("lt ~ ~ ~ lt ~ ~ ~")
  .bank("RolandTR808")
  .gain(0.15)
  .lpf(1800)
  .late(0.006)
  .pan(0.38)
  .room(0.3)
  .apply(busPerc);

// ── KIT (this half drags) ─────────────────────────────────────────────
// TRESILLO at 1000Hz — no beater click, just a thud. "0.6@12 0.32@4"
// weights the 16-step bar: full through step 12, ghosted after, which is
// exactly where the third hit (beat 4) lands.
$: s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ bd ~ ~ ~")
  .gain("0.6@12 0.32@4")
  .lpf(1000)
  .apply(kit);

// THE FELT HALF. 808 at 160Hz and nothing above the fundamental — beat 1
// and the bombo only. You don't hear it, you notice the room is moving.
$: s("bd ~ ~ ~ ~ ~ bd ~ ~ ~ ~ ~ ~ ~ ~ ~")
  .bank("RolandTR808")
  .gain(0.44)
  .lpf(160)
  .apply(groove)
  .apply(busKit);

// CROSS-STICK on 2 & 4, 18ms behind the grid. Soft wood at the other end
// of the apartment — the backbeat you can hang on to without it shouting.
$: s("~ ~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~")
  .gain(0.3)
  .lpf(2800)
  .room(0.44)
  .late(0.018)
  .apply(kit);

// ONE ghost cross-stick per bar, leaning into the backbeat, a different
// one each bar so it never reads as a loop. You don't hear these as
// strokes, you hear them as somebody breathing.
$: s("<[~ ~ ~ rim ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~] [~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ rim ~ ~ ~ ~]>")
  .gain(0.09)
  .lpf(2200)
  .room(0.5)
  .late(0.018)
  .apply(kit);

// ── PHRASE BOUNDARIES ONLY ────────────────────────────────────────────
// 8-bar phrase. An open hat closes bar 4; an abanico — the timbale
// flourish that announces a section — closes bar 8. Nothing inside a
// phrase. A fill you notice is a fill in the wrong place.
$: s("<~ ~ ~ [~ ~ ~ oh] ~ ~ ~ [~ ~ oh ~]>").gain(0.11).apply(kit);
$: s("<~ ~ ~ ~ ~ ~ ~ [~ ~ [ht ht] [mt ~]]>")
  .bank("RolandTR808")
  .gain(0.17)
  .lpf(2400)
  .room(0.36)
  .apply(busKit);

// ── OPTIONAL: unmute with the leading `_` ─────────────────────────────
// MAMBO BELL — the "turn it up" switch. Instant lift, zero new notes.
_$: s("cb ~ cb cb ~ cb ~ cb")
  .bank("RolandTR808")
  .gain(0.18)
  .lpf(3600)
  .pan(0.7)
  .room(0.3)
  .apply(busPerc);

// TUMBAO BASS in A — nothing on beat 1, ever. The "&" of 2 and beat 4,
// and beat 4 has ALREADY CHANGED CHORD (the anticipation): the harmony
// arrives before the barline does, so the whole thing leans forward.
// Upright clip is 0.72, not 1.0 — an upright is a percussion instrument.
_$: note("<[~ ~ ~ e2 ~ ~ d2 ~] [~ ~ ~ fs2 ~ ~ a1 ~]>")
  .s("gm_acoustic_bass")
  .clip(0.72)
  .release(0.15)
  .lpf(1150)
  .gain(0.8)
  .room(0.12)
  .apply(busKit);
