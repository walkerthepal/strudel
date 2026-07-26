// A — dry
setcpm(104 / 4);
$: s("hh*8").gain(0.3).lpf(6500).bank("LinnDrum");

// B — same, with a reverb send
setcpm(104 / 4);
$: s("hh*8").gain(0.3).lpf(6500).bank("LinnDrum").room(0.4);
