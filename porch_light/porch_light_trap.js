// ══════════════════════════════════════════════════════════════════════
// PORCH LIGHT (TRAP) — the same town, from a car with the windows down
// Intro → Porch → Outside → Porch′ → Bridge → Outside′ → Outro
//                                    |  G major, 140bpm half-time
//   PORCH   : G^9 C^9 Cm9 G^9       | as before — but two bars per chord now
//   OUTSIDE : Em9 Am9 D7 G^9        | still the section that may not touch Cm
//   BRIDGE  : Cm9 Cm9 Ab^9 Bb^9 / Fm9 Cm9 D7 D7  | drums drop for eight bars
//
// WHAT THE REMIX INVERTS. porch_light.js demotes the bass on purpose: the
// game puts the flute on top and the bass underneath, and that file honours
// it. Trap does not have that hierarchy — the 808 IS the song, and the
// topline is a sample floating over it. So this is the same tune with its
// power structure reversed, which is the only reason it is worth making. The
// flute is quieter here, further back, and drenched in delay. The 808 has
// the hook, and it is the same root motion the old bass was playing straight.
//
// TWO BARS PER CHORD. Everything harmonic is .slow(2). At 140 a chord per bar
// changes every 1.7 seconds, which is frantic — trap wants harmony that sits
// still while the drums do the moving. Slowing it also keeps the melody at
// roughly the durations it had at 100bpm, so the tune did not have to be
// rewritten to survive the tempo. Bar 3 of PORCH is bars 5–6 now. The Cm9
// still lands in the same place relative to the phrase, which is the only
// thing that ever mattered about it.
//
// ONE RHYTHM, TWO INSTRUMENTS. The kick and the 808 fire on exactly the same
// grid (`knock`), because in trap they are not two parts — they are one
// sound split across two synths, the kick supplying the transient and the
// 808 the pitch. Writing them as separate patterns is the single most common
// way to make a trap beat sound flabby: the attacks smear and the low end
// stops being a punch.
//
// THE HATS BREATHE, OR THEY ARE JUST NOISE. 16ths are non-negotiable in this
// genre, so the discipline has to live somewhere else: the accent pattern
// keeps them from reading as a buzz, and the rolls happen ONLY in bar 4 and
// bar 8 of a phrase. A roll every bar is someone showing you they can
// program rolls. A roll at the turnaround is punctuation.
//
// THE CARTRIDGE IS STILL IN THE MACHINE. The gba crush/lowpass stays on the
// flute, marimba and pizzicato and is kept OFF the drums and the 808. That
// split is the whole visual: a 2002 handheld playing through a system that
// did not exist yet. Crushing the drums too would just sound like a bad
// recording of a trap beat instead of a trap beat sampling a bad recording.
//
// Same melodies and same chords as porch_light.js — this file duplicates
// them on purpose, because every file here has to survive being pasted alone.
// ══════════════════════════════════════════════════════════════════════
setcpm(140 / 4);

// ── PROGRESSIONS ──────────────────────────────────────────────────────
const porchProg = chord("<G^9 C^9 Cm9 G^9>").dict("ireal").slow(2);
const outProg = chord("<Em9 Am9 D7 G^9>").dict("ireal").slow(2);
const bridProg = chord("<Cm9 Cm9 Ab^9 Bb^9 Fm9 Cm9 D7 D7>")
  .dict("ireal")
  .slow(2);

// ── SHARED TRANSFORMS ─────────────────────────────────────────────────
// Melodic voices only — see the header. Same numbers as the original file so
// the two tracks sound like the same cartridge.
const gba = (x) => x.crush(8).lpf(5400);

// ── MIX BUSES ─────────────────────────────────────────────────────────
// Trap drums are DRY and in front; the reverb budget all goes to the melodic
// half. The 808 gets an orbit with almost no room at all — reverb on a sub is
// just a longer, blurrier sub, and it is the fastest way to lose the punch
// the whole arrangement is built around. busLead carries only the flute, so
// it can own the delay outright: delaytime is per-orbit, and sharing it with
// the pizzicato in the first draft meant neither voice got the time it asked.
const busKit = (x) => x.orbit(1).roomsize(0.4).roomlp(2400); // dry, up front
const bus808 = (x) => x.orbit(2).roomsize(0.2).roomlp(900); // no space at all
const busComp = (x) => x.orbit(3).roomsize(2.4).roomlp(6500); // wooden, mid
const busLead = (x) => x.orbit(4).roomsize(4).roomlp(4600); // flute + delay

// ── THE KNOCK ─────────────────────────────────────────────────────────
// Two bars of 16ths, shared by the kick and the 808. Bar 1 is the plain
// statement; bar 2 crowds the back half so the phrase leans forward into the
// next downbeat instead of stopping politely at the barline.
const knock =
  "<[x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~] [x ~ ~ ~ ~ ~ x ~ ~ x ~ ~ x ~ ~ ~]>";

// A sparser knock for OUTSIDE — that section was always the one that opens
// up, and in this arrangement "open" means the 808 gets out of the way.
const knockOpen =
  "<[x ~ ~ ~ ~ ~ x ~ ~ ~ ~ ~ x ~ ~ ~] [x ~ ~ ~ ~ ~ x ~ ~ ~ x ~ ~ ~ ~ ~]>";

// ── DRUMS ─────────────────────────────────────────────────────────────
// 808 bank, no crush, no swing. lpf(180) is not a mistake: a trap kick is
// almost pure transient and the 808 underneath supplies everything else, so
// anything above 180Hz here is just competing with the sub.
const kick = (g = 0.95, k = knock) =>
  s("bd").struct(k).bank("RolandTR808").lpf(180).gain(g).apply(busKit);

// Snare and clap on beat 3 only. That is the half-time feel — at 140 with a
// backbeat on 2 AND 4 this is a house track, and the entire genre lives in
// the space where the missing snare should be. The clap is layered a little
// quieter and slightly late; two sounds one hair apart is what makes a trap
// snare sound wide instead of thin.
const snare = (g = 0.8) =>
  stack(
    s("~ ~ sd ~").gain(g),
    s("~ ~ cp ~")
      .gain(g * 0.62)
      .late(0.005),
  )
    .bank("RolandTR808")
    .room(0.12)
    .apply(busKit);

// Rolls in bar 4 and bar 8 of the phrase and NOWHERE else — see the header.
// The 4-bar `<>` on the roll line crosses the 2-bar knock, so the beat takes
// eight bars to fully repeat even though nothing in it is longer than four.
const hats = (g = 0.32) =>
  stack(
    s("hh*16").velocity("[1 0.42 0.62 0.42]*4"),
    s("<~ ~ ~ [~ ~ ~ [hh*6]] ~ ~ ~ [~ ~ [hh*4] [hh*8]]>").gain(g * 0.85),
    s("<~ [~ ~ ~ [~ oh]]>").gain(g * 0.8),
  )
    .bank("RolandTR808")
    .hpf(1200)
    .gain(g)
    .apply(busKit);

// ── THE 808 ───────────────────────────────────────────────────────────
// mode root:g1, an octave below the acoustic bass in the original — this is
// meant to be felt, not heard, and at g2 it was audibly a bass guitar part
// played on a sine.
//
// THE GLIDE. penv(-3) with panchor(0) starts every note three semitones flat
// and pulls it up into pitch over pdecay. panchor(0) is what makes the note
// ARRIVE at the written pitch rather than leave from it — without it the
// slide runs backwards and the 808 sounds broken rather than pitched. It
// alternates <-3 0> per chord so half the notes glide and half land clean;
// gliding into every single note is the sound of a preset.
//
// decay(1.1) with sustain(0) is the long 808 tail. clip(0.85) then cuts it
// just before the next hit, which is the difference between a bassline and
// one continuous drone that swallows the kick.
const sub = (prog, g = 0.9, k = knock) =>
  n("0")
    .struct(k)
    .set(prog)
    .mode("root:g1")
    .voicing()
    .s("sine")
    .attack(0.004)
    .decay(1.1)
    .sustain(0)
    .clip(0.85)
    .penv("<-3 0>")
    .panchor(0)
    .psustain(0)
    .pdecay(0.12)
    .shape(0.34) // saturation — an undistorted sine does not survive a phone
    .lpf(2200)
    .gain(g)
    .apply(bus808);

// ── COMPS ─────────────────────────────────────────────────────────────
// Half the note density of the original marimba part. At 140 the old
// "0 1 2 3 4 3 2 1" was a mallet solo; with rests on every other eighth it
// becomes a figure that sits in the beat instead of racing it.
const marimba = (prog, g = 0.34, line = "0 ~ 1 ~ 2 ~ 1 ~", anch = "G4") =>
  n(line)
    .set(prog)
    .anchor(anch)
    .voicing()
    .s("gm_marimba")
    .clip(0.5)
    .gain(g)
    .pan(0.4)
    .apply(gba)
    .room(0.36)
    .apply(busComp);

// OUTSIDE only, and on the offbeats as before — with the hats running 16ths
// the offbeat is the one place left where a stab is still legible.
const pizz = (prog, g = 0.28, line = "[~ [0,1,2]]*4", anch = "B4") =>
  n(line)
    .set(prog)
    .anchor(anch)
    .voicing()
    .s("gm_pizzicato_strings")
    .clip(0.16)
    .gain(g)
    .pan(0.6)
    .apply(gba)
    .room(0.3)
    .apply(busComp);

// ── FLUTE ─────────────────────────────────────────────────────────────
// Quieter than the original (0.5 → 0.38) and pushed back with a dotted-eighth
// delay. It is the sample now, not the lead — it should sound like it is
// coming off a record somebody is rapping over, which means it can afford to
// be indistinct in a way the original flute absolutely could not.
//
// .slow(2) is here rather than on the melody strings so the strings stay
// byte-identical to porch_light.js and diffing the two files stays honest.
const flute = (mel, g = 0.38) =>
  note(mel)
    .slow(2)
    .s("gm_flute")
    .attack(0.07)
    .release(0.3)
    .clip(0.92)
    .vib("5:0.05")
    .hpf(300)
    .gain(g)
    .pan(0.5)
    .apply(gba)
    .delay(0.34)
    .delaytime(0.1875)
    .delayfeedback(0.34)
    .room(0.4)
    .apply(busLead);

// ── MELODIES ──────────────────────────────────────────────────────────
// Unchanged from porch_light.js. See that file's header for what each one is
// doing; the eb5 in bar 3 of porchMel is still the entire point of the track.
const porchMel =
  "<[b4 ~ a4 b4 d5 ~ ~ ~] [e5 ~ d5 ~ b4 ~ ~ ~] [c5 ~ eb5 ~ d5 ~ ~ ~] [b4 ~ ~ a4 ~ g4 ~ ~]>";
const porchMel2 =
  "<[d5 ~ b4 d5 g5 ~ ~ ~] [g5 ~ f#5 ~ e5 ~ ~ ~] [f5 ~ eb5 ~ d5 ~ ~ ~] [b4 ~ ~ d5 ~ b4 ~ ~]>";
const outMel =
  "<[g4 ~ a4 b4 ~ ~ e5 ~] [d5 ~ c5 ~ b4 ~ a4 ~] [g4 ~ ~ ~ f#4 ~ ~ ~] [g4 ~ b4 ~ ~ ~ ~ ~]>";
const outMel2 =
  "<[b4 ~ d5 e5 ~ ~ g5 ~] [f#5 ~ e5 ~ d5 ~ c5 ~] [b4 ~ ~ ~ a4 ~ ~ ~] [b4 ~ ~ ~ ~ ~ ~ ~]>";
const bridMel =
  "<[eb5 ~ d5 ~ c5 ~ ~ ~] [g4 ~ ~ ~ bb4 ~ c5 ~] [eb5 ~ ~ ~ c5 ~ ~ ~] [d5 ~ ~ ~ f5 ~ ~ ~] [eb5 ~ c5 ~ ab4 ~ ~ ~] [g4 ~ ~ bb4 ~ c5 ~ ~] [~ ~ ~ ~ a4 ~ c5 ~] [f#4 ~ ~ ~ ~ ~ ~ ~]>";

// ── SECTIONS ──────────────────────────────────────────────────────────
// Flute and 808 alone — no kick, no hats. The 808 states the root motion bare
// before anything else arrives, which is exactly the job the bass had in the
// intro of xray_boomarang and exactly the job it was denied in the original
// porch_light.
const intro = () => stack(sub(porchProg, 0.86), flute(porchMel, 0.42));

const porch = (mel = porchMel, extra = silence) =>
  stack(
    kick(),
    snare(),
    hats(),
    sub(porchProg),
    marimba(porchProg),
    flute(mel),
    extra,
  );

// Sparser knock, and the pizzicato comes in. Same trade the original made —
// this section opens by changing what is in the room, not by getting louder.
const outside = (mel = outMel) =>
  stack(
    kick(0.95, knockOpen),
    snare(),
    hats(),
    sub(outProg, 0.9, knockOpen),
    pizz(outProg),
    flute(mel),
  );

// THE BEAT SWITCH. mask("<0!8 1!8>") holds the drums out for the first eight
// bars, so the borrowed-chord section arrives as 808 and flute floating with
// nothing underneath them, and the kit slams back in for the second half.
// The original bridge floated by REMOVING the marimba pulse; this one floats
// by removing the drums entirely, which is the same idea in the only
// vocabulary trap has.
const bridge = () =>
  stack(
    stack(kick(), snare(), hats()).mask("<0!8 1!8>"),
    sub(bridProg, 0.94),
    marimba(bridProg, 0.3, "0 ~ ~ ~ 1 ~ ~ ~", "Eb4"),
    flute(bridMel, 0.4),
  );

// Kick and hats out, 808 and flute left holding the last chord — the reverse
// of the intro, and the same gesture as the original's outro: the two voices
// that opened it are the two that close it.
const outro = () =>
  stack(sub(porchProg, 0.8), marimba(porchProg, 0.24), flute(porchMel, 0.36));

$: arrange(
  [8, intro()],
  [16, porch()],
  [16, outside()],
  [16, porch(porchMel2)],
  [16, bridge()],
  [16, outside(outMel2)],
  [8, outro()],
  [4, silence], // the flute's delay feeds back at 0.34 — it needs the room
);
