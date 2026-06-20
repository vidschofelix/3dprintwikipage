# Wanhao Duplicator 6+
It would seem that the necessary connections are already on the ribbon.(Bottom 4 pins on the ribbon connector) Z-MIN maps to pin 29 and BL-SIG to pin 9. This is with reference to the Arduino Mega 2560 board. It looks to me as if they were planning for a filament runout detection as well. FLA-DET on the board maps to pin 12. On J10, CTL is pin 10, BOTTON is pin 11. On J11, AC-DET is on pin A9. TX and RX goes to TXD2(pin 16) and RXD2 (pin 17)
the pins on J10 (CTL - pin 10, and BOTTON - pin 11)

I edited pins_ULTIMAIN_2.h with the traced pins for Z-MIN and BL-SIG and it seems to be working just fine. The good news is that they kept most of the pins just as on the old D6 - just my extruder was running the wrong way.

![](/images/reprap/wanhao/duplicator6/duplicator6plus/florian_gabriel_plus_mobo_flop.jpg)

![](/images/reprap/wanhao/duplicator6/duplicator6plus/hans_coetzee_plus_mobo_back.jpg)
