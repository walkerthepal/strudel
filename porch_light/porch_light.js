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
// 5.4kHz lowpass standing in for a bad speaker, applied to everything EXCEPT
// the bass: crushing the low end just makes it fizz, and the one thing that
// should stay clean is the thing holding the room up.
//
// THE HI-HATS ARE THE ARRANGEMENT. No PORCH ever gets hats. OUTSIDE gets them
// and that is the whole lift — an instrument entering, not anybody playing
// more notes. PORCH″ breaks a different rule instead: it is the only place
// the marimba and the pizzicato play at once, OUTSIDE's texture bleeding back
// in, so the return sounds like it has been somewhere. Nothing gets louder in
// this track. The sections separate by what is in the room.
//
// THE MELODY IS EXPOSED, AND THAT IS THE BET. Every other track in this
// project has a bass hook to fall back on. This one demotes the bass to roots
// and passing tones on purpose, because that is the hierarchy the game uses,
// and it leaves the flute carrying the piece over almost no drums. If it does
// not work, the melody is where to look — not the mix.
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
// without the sustain turning to static. The lowpass matters more than the
// crush does — the console resampled everything down, so nothing on a GBA has
// air, and leaving the top end in is what makes fake game music sound like a
// plugin instead of a cartridge.
const gba = (x) => x.crush(8).lpf(5400);

// ── MIX BUSES ─────────────────────────────────────────────────────────
// Four orbits because this arrangement is mostly empty, and a sparse track is
// where one shared tail does the most damage: with nothing masking it, every
// voice's reverb is audible as the same room, and the flute ends up sitting
// in the kick's space. The bass gets its own orbit purely to keep it out of
// everyone else's reverb — it is the only voice here with no depth at all.
const busKit = (x) => x.orbit(1).roomsize(0.9).roomlp(3000); // small and close
const busBass = (x) => x.orbit(2).roomsize(0.5).roomlp(1800); // barely a room
const busComp = (x) => x.orbit(3).roomsize(2.2).roomlp(6500); // wooden, mid
const busLead = (x) => x.orbit(4).roomsize(3.6).roomlp(5000); // far back

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
const intro = () =>
  stack(bass(porchProg, 0.78), marimba(porchProg, 0.3, "0 1 2 3 ~ 2 ~ ~"));

// `extra` is how PORCH″ gets the pizzicato without a second copy of PORCH.
const porch = (mel = porchMel, extra = silence) =>
  stack(kit(), bass(porchProg), marimba(porchProg), flute(mel), extra);

// The only section in the track with hi-hats.
const outside = (mel = outMel) =>
  stack(kit(), hats(), bass(outProg, 0.88, outBass), pizz(outProg), flute(mel));

// Kit down, bass up, and NO marimba — with the arpeggio gone the eighth-note
// pulse disappears for eight bars and the section floats. That is what makes
// it read as a held breath instead of a louder PORCH. The pizz drops to one
// stab on the downbeat so something still marks the bar.
const bridge = () =>
  stack(
    kit(0.34),
    bass(bridProg, 0.94, bridBass),
    pizz(bridProg, 0.3, "[0,1,2] ~ ~ ~", "Eb4"),
    flute(bridMel, 0.52),
  );

// Flute gone, drums gone, back to the two instruments that opened it. The
// marimba thins to three notes in the last bar and the porch light goes off.
const outro = () =>
  stack(
    bass(porchProg, 0.66),
    marimba(porchProg, 0.24, "<[0 1 2 3 ~ 2 ~ ~]!3 [0 ~ 2 ~ 4 ~ ~ ~]>"),
  );

$: arrange(
  [4, intro()],
  [8, porch()],
  [8, outside()],
  [8, porch(porchMel2)],
  [8, bridge()],
  // PORCH″ — the only place both comps play at once. OUTSIDE's texture comes
  // back into PORCH, which is how the return says it has been somewhere
  // without getting louder or adding a part that did not already exist.
  [8, porch(porchMel, pizz(porchProg, 0.22))],
  [8, outside(outMel2)],
  [4, outro()],
  [2, silence], // the flute's room is roomsize 3.6 — it needs the bars to decay
);
