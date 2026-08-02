# strudel

Where I am keeping my programmatic beats.

Every `.js` file in here is a **single paste**. Open <https://strudel.cc/>,
select-all a file, paste, `Ctrl+Enter` to play and `Ctrl+.` to stop. Nothing
imports anything, there is no build step, and no file depends on another one.
A file that doesn't run whole is a broken file, not a partial one.

## The tracks

| Track | What it is | Tempo / key |
|---|---|---|
| [`wubba_wubba`](wubba_wubba/wubba_wubba.js) | Bolero-soul. Straight latin percussion pulling against a kit that drags — the disagreement is the pocket. Sparse, ghost notes doing the color. | 86bpm, Eb dorian |
| [`xray_boomarang`](xray_boomarang/xray_boomarang.js) | Bedroom pop where the bass is the hook. States it naked in the intro; everything else is high-passed out of its way. Real pitch slides. | 104bpm, B dorian |
| [`city_cute`](city_cute/city_cute.js) | 8-bit city pop. Chiptune voices over royal-road changes, pre-chorus every time, quiet tag before the outro. | 112bpm, A major |
| [`good_beat_1`](good_beat_1/good_beat_1.js) | Neo-soul with a horn section — trumpet and french horn panned wide, trombone stabs underneath. Swing varies per section. | 84bpm, A major |
| [`ops_poops`](ops_poops/ops_poops.js) | Dusty lofi study bed. Loops forever, breathes with a breakdown, crackle running outside the arrangement. | 76bpm, F minor |
| [`elephant_doc`](elephant_doc/elephant_doc_drum_loop.js) | Songo drum loop, 3-2 son clave. Built to play guitar over — 200Hz–2kHz is deliberately empty. Header says what to play. | 96bpm, A dorian |
| [`porch_light`](porch_light/porch_light.js) | Hoenn town music. Sampled GM soundfont, not chiptune — the whole track exists to set up one borrowed minor-iv in bar 3. Dead straight, almost no drums. | 100bpm, G major |

Alongside the main file, some folders keep variants: `_drum_loop` (the groove
alone), `_basic` (stripped to one loop), `_song_parts` (A/B/C harmony options
with the losers commented out), `_visualizer` (same track plus hydra), `_trap`
(same tune, rebuilt in another genre — see `porch_light_trap`).

## Layout

One directory per track, `snake_case`, named for the track, with the main file
repeating that name exactly. Variants are suffixes on the same name, never new
folders. No `src/`, no index, no shared library — duplication between tracks is
correct, because each file has to survive being pasted alone.

## Anatomy of a track file

```
header block        what the track is, the form, the chords, and WHY
setcpm(bpm / 4)     bare line, never a $: line — one cycle = one bar
progressions        const vProg = chord("<...>").dict("ireal")
shared transforms   wobble, groove, kit — small x => x.… lambdas
mix buses           the orbit() lambdas
voices              percussion → drums → bass → keys → color & leads
melodies            bare mini-notation strings
sections            named stack()s: verse, chorus, drop, montuno, tag, whatever
$: arrange(...)     last line
```

The header block is the only documentation this project has, so it carries the
analysis, not a summary of the code — what the track is *for*, what changed in
the last revision and why the old version wasn't moving. Same for inline
comments: they justify the number by saying what the wrong value sounded like.
Parts that get cut leave a `// CUT.` paragraph behind instead of vanishing, so
the next revision doesn't re-add them.

There is no default song form. Every track here does something different —
`wubba_wubba` interrupts itself with a drop and a montuno, `ops_poops` has no
verse or chorus at all, `elephant_doc` has no `arrange()` because it's a loop.
Sections get named after what they do.

Sketches are exempt from all of this. They're allowed to be ugly until they
earn promotion.

## Things that bite

- **One undefined call silences the whole file.** No error you'll notice — just
  nothing. Suspect a typo'd method before anything else.
- **Bank names are case-exact with no hyphens** — `RolandTR808`, `LinnDrum`. A
  wrong one falls back to default samples silently.
- **`.apply(kit)` overwrites `.bank(...)`**, so an 808 voice quietly becomes a
  LinnDrum voice. Keep feel (`swingBy`) and kit (`bank`) in separate lambdas.
- **`room` is a send and the reverb lives on the orbit.** Everything on one
  orbit shares one tail, which is what "muddy" actually is. So does `delay` —
  two voices wanting different delay times on one orbit will fight.
- **The ireal dict wants `^7`, not `maj7`.** An unrecognized chord symbol
  renders silence for that bar with no complaint.
- **`penv` needs `panchor(0)` and `psustain(0)`** or the slide runs backwards.
- **hydra options must be single-quoted** — `initHydra({ precision: 'mediump' })`.
  Double quotes become a pattern, and stringifying one hits a BigInt.
