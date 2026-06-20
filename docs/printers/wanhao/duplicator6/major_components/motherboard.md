# Motherboard Overview
[Photo Dump for the motherboard v1.5](https://drive.google.com/drive/folders/178NaIAVjkrnVmxGbYWasyJjooYn8aHQS?usp=sharing)

The motherboard for the D6 was "heavily inspired" by the
[motherboard of the Ultimaker 2](https://github.com/Ultimaker/Ultimaker2/tree/master/1091_Main_board_v2.1.1_(x1))
It is based on the ATMega2560 microcontroller. It is primarily a 24 Volt circuit, with some 5 Volt pins. 

![](/images/reprap/wanhao/duplicator6/motherboard/motherboard.png)

### Interesting Pins
- J9 - Have heard of it being used for Z-probe purposes, [need more info]
- J19 - Here a 2pin JST Female connector was added to J19 for easier connection. Highly recommended!
- J16 + J17 - Does anyone know what these (Safety 1+2) would or could be used for?
- Based on schematics for the Ultimaker2 board, the following MIGHT BE true/helpful:
  - J9 - Analog - Pin 2 (middle) should output 5V
  - J16 - Safety 1 - Pin 1 should output 5V, Pin 2 is shared with Pin 1 of J17
  - D7 - Green Power LED
  - D3 - Yellow RX LED - ?
  - D4 - Yellow TX LED - ?
## The Stepper Motor Drivers
[The best that 2015 has to offer, the Allegro A4988ET for X,Y,Z, and Extruder axes (PDF Link)](https://www.allegromicro.com/~/media/Files/Datasheets/A4988-Datasheet.ashx)
## The Relay
A common point of failure in this version of the motherboard is the 5V circuit relay (Big Blue Cube). It can cause many issues where the printer "sorta" turns on, because the relay turns off the 5V circuit, which is the front panel interface LCD and knob.

TL;DR: Bypass the relay by shorting it with a solid core wire to fix MANY issues. See my terrible soldering job below that works just fine!

![](/images/reprap/wanhao/duplicator6/motherboard/shorting_relay.jpg)

For more about relay issues:

- [Wanhao's Official Video on Motherboard Relay Bypass](https://www.youtube.com/watch?v=0HC_GcVOXU0)
- [Wanhao's Official PDF on Motherboard Relay Bypass](http://www.wanhao3dprinter.com/xiazai/D6_Bypass_relay.pdf)
- [Investigating the Infamous Relay Bypass for Monoprice Maker Ultimate (Wanhao Duplicator 6)](https://newscrewdriver.com/2017/10/24/investigating-the-infamous-relay-of-monoprice-maker-ultimate-wanhao-duplicator-6/)
## The Extruder Ribbon Connection
![](/images/reprap/wanhao/duplicator6/major_components/mobo_extruder_pinout.png)

E-1A,1B,2A,2B are used by the stepper motor on the extruder.

[Link to my Google Sheet with Pinouts](https://docs.google.com/spreadsheets/d/1XX6I6iNZCkVIueA0zD95mo8jjTG3_VZ3gDfGH6G9hfs/edit?usp=sharing)

## The MOSFETS
[TODO: Photos to text transcription](https://drive.google.com/drive/folders/1GbxoP8aaD2Qk7poxObGDBJZ8CKOqrU9_?usp=sharing)

## The T1 Chip
The T1 chip located near the extruder ribbon cable connector of the motherboard is responsible for control of both fans on the extruder. If you have no power going to either or both fan then you may need to replace or bypass this chip. Check to make sure that it is not shorted, usually they go completely open circuit so you can solder another one on top of it. Almost any NPN general purpose transistor will work in place of T-1.

The original chip is a BC817 NPN transistor

![](/images/reprap/wanhao/duplicator6/motherboard/before.jpg)

This can be replaced with either a similar chip or a common 2N2222 transistor.

![](/images/reprap/wanhao/duplicator6/motherboard/after_from_ralph_burki_w_labels.jpg)
