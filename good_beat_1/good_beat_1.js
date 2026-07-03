setcpm(76/4)
$: s("bd ~ ~ bd ~ ~ ~ bd").gain(.64).lpf(3800)
$: s("~ ~ ~ ~ sd ~ ~ ~ ~ ~ ~ ~ sd ~ ~ ~").gain(.87).room(.2)
//$: s("hh*4").gain(.34).lpf(2400) //hithat
$: s("hh*8").gain("[.5 .3]*4").lpf(2400) //hihat
all(x => x.swingBy(1/3, 8).bank("RolandTR808").crush(11).coarse(2.5))
