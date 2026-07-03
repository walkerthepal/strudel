/*
//Version A — remove the C#m, rest on Amaj7 (I)
setcpm(84/4)
// — HARMONY: Bm7 → Em9 → Amaj7 → (Amaj7 held) —
$: note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4]>")
  .sound("gm_clarinet").gain(.55).lpf(2600).room(.35)  // chords
$: note("<b1 e1 a1 a1>").sound("sawtooth").lpf(420).gain(.6) // root bass
// — DRUMS: soft neo-soul pocket —
$: s("bd ~ ~ bd ~ ~ bd ~").gain(.7).lpf(3000).bank("RolandTR808")
$: s("~ ~ ~ ~ rim ~ ~ ~").gain(.5).room(.25).bank("RolandTR808")
$: s("hh*8").gain("[.4 .28]*4").bank("RolandTR808")
all(x => x.swingBy(1/3, 8))
*/
/*
//Version B — go to the fourth, Dmaj7 (IV)
setcpm(84/4)
// ── HARMONY: Bm7 → Em9 → Amaj7 → Dmaj7 ──
$: note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [d3,f#3,a3,c#4]>")
    .sound("gm_clarinet").gain(.55).lpf(2600).room(.35)   // Rhodes comp
$: note("<b1 e1 a1 d2>").sound("sawtooth").lpf(420).gain(.6) // root bass
// ── DRUMS: soft neo-soul pocket ──
$: s("bd ~ ~ bd ~ ~ bd ~").gain(.7).lpf(3000).bank("RolandTR808")
$: s("~ ~ ~ ~ rim ~ ~ ~").gain(.5).room(.25).bank("RolandTR808")
$: s("hh*8").gain("[.4 .28]*4").bank("RolandTR808")
all(x => x.swingBy(1/3, 8))
*/
//Version C — go to F#m7 (vi), the deceptive resolution
setcpm(84/4)
// ── HARMONY: Bm7 → Em9 → Amaj7 → F#m7 ──
$: note("<[b3,d4,f#4,a4] [e3,g3,b3,d4,f#4] [a3,c#4,e4,g#4] [f#3,a3,c#4,e4]>")
    .sound("gm_epiano1").gain(.55).lpf(2600).room(.35)   // Rhodes comp
$: note("<b1 e1 a1 f#1>").sound("sawtooth").lpf(420).gain(.6) // root bass
// ── DRUMS: soft neo-soul pocket ──
$: s("bd ~ ~ bd ~ ~ bd ~").gain(.7).lpf(3000).bank("RolandTR808")
$: s("~ ~ ~ ~ rim ~ ~ ~").gain(.5).room(.25).bank("RolandTR808")
$: s("hh*8").gain("[.4 .28]*4").bank("RolandTR808")
all(x => x.swingBy(1/3, 8)) 


// possible chords
// gm_clarinet
// gm_epiano1 == rhodes
