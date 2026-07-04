// 8-bit city pop — cute & short, ~112bpm
setcpm(112 / 4);

// royal road in A: IV^7 – V7 – iii7 – vi7
let prog = chord("<D^7 E7 C#m7 F#m7>").dict("ireal");

// crushed drum machine = chiptune kit
$: stack(s("bd ~ [~ bd] ~, ~ sd ~ sd"), s("hh*8").gain("[.6 .35]*4"))
  .bank("LinnDrum")
  .crush(5)
  .swingBy(1 / 8, 8);

// NES triangle-channel bass
$: n("<0 0 0 [0 2]>*2")
  .set(prog)
  .mode("root:g2")
  .voicing()
  .s("triangle")
  .clip(0.8)
  .gain(0.85);

// square-wave chord arps (one channel pretending to be four)
$: n("0 1 2 3".fast(2))
  .set(prog)
  .anchor("A4")
  .voicing()
  .s("square")
  .decay(0.12)
  .sustain(0)
  .lpf(2600)
  .gain(0.35)
  .pan(0.4);

// cute pulse lead with a little vibrato
$: n("<[0 2 4 ~] [5 4 2 ~] [4 3 2 ~] [1 2 0 ~]>")
  .scale("A4:major")
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
