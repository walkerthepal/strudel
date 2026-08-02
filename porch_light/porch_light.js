// ══════════════════════════════════════════════════════════════════════
// PORCH LIGHT — Hoenn town music, the morning you leave
// Intro → Porch → Outside → Porch′ → Bridge → Porch″ → Outside′ → Outro
//                                              |  G major, 100bpm
//   PORCH   : G^9 C^9 Cm9 G^9       | the borrowed iv in bar 3 — the ache
//   OUTSIDE : Em9 Am9 D7 G^9        | never touches Cm, which is why it opens
//   BRIDGE  : Cm9 Cm9 Ab^9 Bb^9 / Fm9 Cm9 D7 D7  | bVI–bVII of C minor. No G
//             major anywhere for eight bars; the two D7 bars are the way back
//
// THE THIRD BAR IS THE SONG. Everything here exists to set up one chord.
// PORCH runs G^9 C^9 Cm9 G^9 and the Cm9 lands in the same place every single
// time, so by the second pass the ear is braced for it before it arrives —
// that anticipation is the actual feeling, not the chord. OUTSIDE is built
// from the one rule that it may not touch Cm, which is the entire reason it
// sounds like stepping out of a house. The bridge then hands the borrowed
// chord eight bars of its own and refuses to resolve, so PORCH″ is relief
// rather than repetition.
//
// IT IS NOT CHIPTUNE. Ruby/Sapphire/Emerald ran on the Sappy engine with
// sampled GM instruments — flute, marimba, pizzicato strings, a plucky bass.
// Square waves would be the wrong console by a decade, and city_cute already
// owns that palette. The 8-bit character here comes from crush(8) and a
// lowpass standing in for a bad speaker, applied to everything EXCEPT the
// bass: crushing the low end just makes it fizz, and the one thing that
// should stay clean is the thing holding the room up.
//
// THE HI-HATS ARE THE ARRANGEMENT. No PORCH ever gets hats. OUTSIDE gets them
// and that is the whole lift — an instrument entering, not anybody playing
// more notes. PORCH″ breaks a different rule instead: it is the only place
// the marimba and the pizzicato play at once, OUTSIDE's texture bleeding back
// in, so the return sounds like it has been somewhere. Nothing gets louder in
// this track. The sections separate by what is in the room.
//
// The shaker does not violate that rule, because it is not keeping time. It
// is high-passed to 4kHz, sits at a fifth of the hats' level, and lives on
// the wide bus rather than the kit bus — it reads as air in the room, not as
// a part. The hats arriving in OUTSIDE is still the only rhythmic event in
// the track.
//
// THE MELODY IS EXPOSED, AND THAT IS THE BET. Every other track in this
// project has a bass hook to fall back on. This one demotes the bass to roots
// and passing tones on purpose, because that is the hierarchy the game uses,
// and it leaves the flute carrying the piece over almost no drums. If it does
// not work, the melody is where to look — not the mix.
//
// WHAT CHANGED, AND WHY IT WASN'T MOVING BEFORE: IT WAS AUTUMN. The first
// version was correct and airless. Everything above 5.4kHz was gone, the
// reverbs were dark on every bus, and with no hats in two thirds of the track
// there was nothing at all in the top octave — so the borrowed Cm9, which is
// already the saddest thing in the piece, had a mix agreeing with it from
// every direction. It read as October. Four things moved, none of them
// harmonic: the console lowpass opened from 5.4k to 7.6k, the comp and lead
// reverbs got brighter and wider, a shaker went in as air, and the marimba
// got an octave-up sparkle in the register nothing else was using.
//
// The Cm9 did not move and is not going to. It is still bar 3 and it is
// still the point. What changed is that it is now the one dark thing in a
// bright room instead of the loudest voice in a dark one — which is the
// difference between leaving for good and the last week of August. That
// contrast is also why the bridge is the only section with NO shaker and no
// sparkle: eight bars where the air goes out is worth more now than it was
// when every section sounded like that anyway.
//
// If the file plays but sounds like a piano, suspect the soundfont names
// first: gm_flute and gm_pizzicato_strings fall back silently when a build
// does not have them. gm_marimba and gm_acoustic_bass are known good here.
// ══════════════════════════════════════════════════════════════════════
setcpm(100 / 4);

// ── PROGRESSIONS ──────────────────────────────────────────────────────
const porchProg = chord("<G^9 C^9 Cm9 G^9>").dict("ireal");
const outProg = chord("<Em9 Am9 D7 G^9>").dict("ireal");
const bridProg = chord("<Cm9 Cm9 Ab^9 Bb^9 Fm9 Cm9 D7 D7>").dict("ireal");

// Bar 3 of OUTSIDE is written D7, not D7sus4, and the suspension is PLAYED
// rather than spelled — the flute holds a g4 across the barline and only
// drops to f#4 on the third beat. Two reasons. The ireal dict renders an
// unrecognised symbol as silence with no complaint, and a sus that arrives in
// the melody is a voice hesitating, where a sus in the chord symbol is just a
// chord that happens to have a 4 in it.

//Rejected bridge — WILD ENCOUNTER. Quarter-note stabs, marimba doubling the
//bass, flute silent, hard cut back to PORCH″ with no transition. Funnier, and
//wubba_wubba proves this project likes tracks that interrupt themselves. Cut
//because the track's one idea is the borrowed chord, and four bars of a joke
//develops nothing:
//const bridProg = chord("<Em Em D D C C B7 B7>").dict("ireal");

//Rejected bridge — MODULATE UP A STEP. Pivot on E7 and bring PORCH″ back in A
//major. The lift is real but it is the same shape a step higher, which
//develops the key, not the idea:
//const bridProg = chord("<Am9 Am9 D7 D7 G^9 G^9 E7 E7>").dict("ireal");

// ── SHARED TRANSFORMS ─────────────────────────────────────────────────
// THE GBA SPEAKER. crush(5) is the chiptune track next door and crush(12) is
// inaudible; 8 is the width where the marimba's attack starts to grain up
// without the sustain turning to static.
//
// The lowpass is a deliberate compromise and worth naming as one. A real GBA
// resampled everything down and has no air at all, which is why this started
// at 5400 — but 5400 is also why the track sounded like October, because a
// piece with no hats in two thirds of it and nothing above 5.4kHz has an
// entirely empty top octave. 7600 keeps the console grain (the crush is
// doing most of that work anyway) while letting the marimba and the shaker
// have some daylight. Above about 8500 the illusion collapses and it just
// sounds like a flute library.
const gba = (x) => x.crush(8).lpf(7600);

// ── MIX BUSES ─────────────────────────────────────────────────────────
// Four orbits because this arrangement is mostly empty, and a sparse track is
// where one shared tail does the most damage: with nothing masking it, every
// voice's reverb is audible as the same room, and the flute ends up sitting
// in the kick's space. The bass gets its own orbit purely to keep it out of
// everyone else's reverb — it is the only voice here with no depth at all.
// The two melodic buses are where summer actually happened. busComp went
// from 6500 to 8600 and busLead from 5000 to 7400 — a dark reverb on a bright
// source still sounds like a dark room, and with four voices feeding these
// two orbits the roomlp was quietly setting the weather for the whole track.
// The kit and bass buses did NOT move: a bright tail on a soft kick is just
// a smear, and the low end is the one thing that should still sound close.
const busKit = (x) => x.orbit(1).roomsize(0.9).roomlp(3000); // small and close
const busBass = (x) => x.orbit(2).roomsize(0.5).roomlp(1800); // barely a room
const busComp = (x) => x.orbit(3).roomsize(2.6).roomlp(8600); // open and bright
const busLead = (x) => x.orbit(4).roomsize(4.2).roomlp(7400); // wide daylight

// ── DRUMS ─────────────────────────────────────────────────────────────
// A kit that barely exists. Kick on 1 and the & of 3, cross-stick on 3, and
// that is the entire drum part for two thirds of the track. The push on the
// & of 3 is doing the job a hi-hat would: it is the only event in the bar
// that is not on a beat, so it is what keeps 100bpm from reading as a
// metronome. Putting the kick on 1 and 3 flat sounded like a drum machine
// demo.
const kit = (g = 0.42) =>
  stack(s("bd ~ ~ ~ ~ bd ~ ~").velocity("1 0.68"), s("~ ~ rim ~").velocity(0.8))
    .bank("LinnDrum")
    .gain(g)
    .apply(gba)
    .room(0.16)
    .apply(busKit);

// OUTSIDE ONLY. Straight eighths, never sixteenths — sixteenths at this tempo
// turn a town square into a chase. The accent pattern is what makes eight
// even hits read as a person; flat eighths sounded like a click track and
// made the whole section feel like a different, worse song.
const hats = (g = 0.3) =>
  s("hh*8")
    .velocity("[0.75 0.45]*4")
    .bank("LinnDrum")
    .hpf(1400)
    .gain(g)
    .apply(gba)
    .apply(busKit);

// SUMMER AIR. A shaker, not a hi-hat, and the distinction is the whole
// reason it is allowed to exist in a track whose arrangement rule is that
// PORCH never gets hats: high-passed to 4kHz it has no body, at 0.16 it is a
// fifth of the hats' level, and it goes to busComp rather than busKit so it
// occupies the wide bright room instead of the tight one the drums are in.
// Eight straight eighths, accented in pairs.
//
// It is the ONE voice in the track that does not get the gba lowpass. That
// is not an oversight — crushing it puts it right back in the same 7.6kHz
// box as everything else, and the entire job of this part is to be the thing
// that lives above the cartridge. Straight 16ths were the first attempt and
// they were a hiss, not air.
const shaker = (g = 0.16) =>
  s("hh*8")
    .velocity("[1 0.55]*4")
    .bank("RolandTR808")
    .hpf(4000)
    .gain(g)
    .room(0.34)
    .apply(busComp);

// ── BASS ──────────────────────────────────────────────────────────────
const porchBass = "<[0 ~ 0 ~] [0 ~ 0 ~] [0 ~ 0 ~] [0 ~ 2 1]>";
const outBass = "<[0 ~ 0 2] [0 ~ 0 2] [0 ~ 1 2] [0 ~ 0 ~]>";
const bridBass =
  "<[0 ~ ~ ~] [0 ~ 0 2] [0 ~ ~ ~] [0 ~ 0 2] [0 ~ ~ ~] [0 ~ 0 2] [0 ~ 0 ~] [0 ~ 2 1]>";

// Roots and passing tones, and nothing else — this is the one track here
// where the bass is deliberately NOT the hook, because that is the hierarchy
// the game uses and the flute cannot lead against a competing riff. It only
// moves at the turnaround: bar 4 of PORCH walks 2 → 1 into the downbeat,
// which is the single moment the bass is allowed to be interesting.
//
// clip(0.55) is short. Longer and consecutive roots blur into a drone, and
// with this little else playing, a droning bass IS the low end. No crush and
// no gba lowpass here on purpose; see the header.
const bass = (prog, g = 0.88, line = porchBass) =>
  n(line)
    .set(prog)
    .mode("root:g2")
    .voicing()
    .s("gm_acoustic_bass")
    .clip(0.55)
    .release(0.12)
    .lpf(900)
    .gain(g)
    .apply(busBass);

// ── COMPS ─────────────────────────────────────────────────────────────
// PORCH. Steady eighth arpeggios, up and back down. The marimba is the pulse
// the missing hi-hats are not providing — it works because it has no sustain,
// so eight notes a bar read as motion rather than as a chord pad. A Rhodes
// playing this exact line was mush.
const marimba = (prog, g = 0.36, line = "0 1 2 3 4 3 2 1", anch = "G4") =>
  n(line)
    .set(prog)
    .anchor(anch)
    .voicing()
    .s("gm_marimba")
    .clip(0.62)
    .gain(g)
    .pan(0.42)
    .apply(gba)
    .room(0.4)
    .apply(busComp);

// SPARKLE. The same marimba an octave up, playing two notes in the back half
// of the bar and nothing else. It is a re-voicing, not a new instrument —
// which is the point, because the top octave needed something in it and this
// track had already decided its palette. Two notes a bar is the ceiling: at
// four it stopped being light on the water and became a second melody
// arguing with the flute.
const sparkle = (prog, g = 0.2) => marimba(prog, g, "~ ~ ~ ~ 2 ~ 1 ~", "G5");

// OUTSIDE. Offbeat stabs — every & and nothing on a beat, so the pizz and the
// kick never occupy the same instant.
//
// The three-note stack lives inside the mini-notation ([0,1,2]) and goes
// through set/anchor/voicing like every other harmony voice in this project.
// The tidier-looking prog.anchor().voicing().struct() spelling was the first
// draft and it is not worth the risk: an unsupported method anywhere in a
// chain silences the entire file with no error, and this form is already
// proven to work in city_cute.
//
// clip(0.18) makes it a pluck; anything longer and it is a string pad, which
// is the one texture this arrangement has no room for.
const pizz = (prog, g = 0.32, line = "[~ [0,1,2]]*4", anch = "B4") =>
  n(line)
    .set(prog)
    .anchor(anch)
    .voicing()
    .s("gm_pizzicato_strings")
    .clip(0.18)
    .gain(g)
    .pan(0.58)
    .apply(gba)
    .room(0.34)
    .apply(busLead);

// ── FLUTE ─────────────────────────────────────────────────────────────
// Shallow vibrato and a slow attack. The attack is the important one: at 0.01
// the flute spoke exactly on the grid with everything else and the track
// sounded typed in. At 0.07 the note blooms a hair late without being played
// late, which is the only humanising this arrangement gets — everything else
// here is dead straight on purpose, because sequencers cannot play late and
// that stiffness is half of why game music sounds like game music.
const flute = (mel, g = 0.5) =>
  note(mel)
    .s("gm_flute")
    .attack(0.07)
    .release(0.24)
    .clip(0.92)
    .vib("5:0.05")
    .hpf(300)
    .gain(g)
    .pan(0.5)
    .apply(gba)
    .room(0.32)
    .apply(busLead);

// ── MELODIES ──────────────────────────────────────────────────────────
// PORCH. Stepwise, small range, lands on the 3rd — a tune somebody could hum
// without knowing the chords. Bar 3 is the eb5: the borrowed note over the
// borrowed chord, approached from c5 and left by step down to d5, so it
// arrives as a colour rather than as an accident.
const porchMel =
  "<[b4 ~ a4 b4 d5 ~ ~ ~] [e5 ~ d5 ~ b4 ~ ~ ~] [c5 ~ eb5 ~ d5 ~ ~ ~] [b4 ~ ~ a4 ~ g4 ~ ~]>";

// PORCH′. Same skeleton, sitting higher and reaching g5 in bar 2 — so the eb5
// in bar 3 is now a step DOWN into the ache instead of up into it. Same
// chord, opposite gesture, no new material.
const porchMel2 =
  "<[d5 ~ b4 d5 g5 ~ ~ ~] [g5 ~ f#5 ~ e5 ~ ~ ~] [f5 ~ eb5 ~ d5 ~ ~ ~] [b4 ~ ~ d5 ~ b4 ~ ~]>";

// OUTSIDE. Opens upward, which is the whole point of the section. Bar 3 is
// the suspension the chord symbol does not spell: g4 held over the D7,
// dropping to f#4 late.
const outMel =
  "<[g4 ~ a4 b4 ~ ~ e5 ~] [d5 ~ c5 ~ b4 ~ a4 ~] [g4 ~ ~ ~ f#4 ~ ~ ~] [g4 ~ b4 ~ ~ ~ ~ ~]>";

// OUTSIDE′. Same shape a third higher, holding the last note for a whole bar
// because it is the last thing the flute plays in the track.
const outMel2 =
  "<[b4 ~ d5 e5 ~ ~ g5 ~] [f#5 ~ e5 ~ d5 ~ c5 ~] [b4 ~ ~ ~ a4 ~ ~ ~] [b4 ~ ~ ~ ~ ~ ~ ~]>";

// BRIDGE. Eight bars with no G major in them. It leans on eb5, ab4 and bb4 —
// the three notes PORCH can never play — and ends on f#4 alone, the only
// leading tone in the section and the entire reason PORCH″ feels like home.
const bridMel =
  "<[eb5 ~ d5 ~ c5 ~ ~ ~] [g4 ~ ~ ~ bb4 ~ c5 ~] [eb5 ~ ~ ~ c5 ~ ~ ~] [d5 ~ ~ ~ f5 ~ ~ ~] [eb5 ~ c5 ~ ab4 ~ ~ ~] [g4 ~ ~ bb4 ~ c5 ~ ~] [~ ~ ~ ~ a4 ~ c5 ~] [f#4 ~ ~ ~ ~ ~ ~ ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
// Bass and marimba, no drums and no flute. Four bars is exactly one turn of
// porchProg, so the Cm9 is heard once, alone, before the tune ever starts.
// Bass, marimba and the shaker — the air is established before anything
// else, so that when the drums arrive they arrive into a room that is
// already bright rather than turning the lights on.
const intro = () =>
  stack(
    bass(porchProg, 0.78),
    marimba(porchProg, 0.3, "0 1 2 3 ~ 2 ~ ~"),
    shaker(0.13),
  );

// `extra` is how PORCH′ and PORCH″ get their extra layer without a second
// copy of PORCH.
const porch = (mel = porchMel, extra = silence) =>
  stack(
    kit(),
    bass(porchProg),
    marimba(porchProg),
    shaker(),
    flute(mel),
    extra,
  );

// The only section in the track with hi-hats — and the shaker lifts with
// them, since this is the section that is literally outdoors.
const outside = (mel = outMel) =>
  stack(
    kit(),
    hats(),
    bass(outProg, 0.88, outBass),
    pizz(outProg),
    shaker(0.19),
    sparkle(outProg),
    flute(mel),
  );

// Kit down, bass up, and NO marimba — with the arpeggio gone the eighth-note
// pulse disappears for eight bars and the section floats. That is what makes
// it read as a held breath instead of a louder PORCH. The pizz drops to one
// stab on the downbeat so something still marks the bar.
//
// NO SHAKER AND NO SPARKLE. This is the only section where the air goes out,
// and it is worth far more now than it was before the track got bright —
// eight bars with an empty top octave, in a piece that otherwise shimmers,
// is what makes the borrowed chord land as weather rather than as decor.
const bridge = () =>
  stack(
    kit(0.34),
    bass(bridProg, 0.94, bridBass),
    pizz(bridProg, 0.3, "[0,1,2] ~ ~ ~", "Eb4"),
    flute(bridMel, 0.52),
  );

// Flute gone, drums gone, back to the instruments that opened it. The marimba
// thins to three notes in the last bar and the porch light goes off — but the
// shaker is still going when it does, which is the difference between the
// track ending and the afternoon just continuing without you.
const outro = () =>
  stack(
    bass(porchProg, 0.66),
    marimba(porchProg, 0.24, "<[0 1 2 3 ~ 2 ~ ~]!3 [0 ~ 2 ~ 4 ~ ~ ~]>"),
    shaker(0.11),
  );

$: arrange(
  [4, intro()],
  [8, porch()],
  [8, outside()],
  // PORCH′ picks up the sparkle. It is the first time anything is in the top
  // octave over a PORCH, and it lands on the section whose melody already
  // reaches highest — so the register opens in the melody and the comp at the
  // same moment rather than one propping up the other.
  [8, porch(porchMel2, sparkle(porchProg))],
  [8, bridge()],
  // PORCH″ — the only place both comps play at once. OUTSIDE's texture comes
  // back into PORCH, which is how the return says it has been somewhere
  // without getting louder or adding a part that did not already exist. After
  // eight airless bars of bridge, the sparkle returning with it is the moment
  // the weather comes back.
  [8, porch(porchMel, stack(pizz(porchProg, 0.22), sparkle(porchProg, 0.22)))],
  [8, outside(outMel2)],
  [4, outro()],
  [2, silence], // the flute's room is roomsize 4.2 — it needs the bars to decay
);
