# Printer Calibration
3D Printers are great, but they do need to be calibrated in order to print in the correct dimensions, extrude the correct amount of filament and provide accurate and stable heat to the hotend and heated bed. This guide will explain the process of calibrating your printer.

This guide is aimed particularly at the Marlin/SkyNet firmware, though EEPROM settings can be saved and the processes will be virtually the same for any printer. In particular, this guide is aimed at cartesian based printers.

## Extruder Calibration
#### Required Tools
- 150mm length of filament (white/light colouring is preferred so you can clearly see the marks)
- Vernier Calliper
- Marker

#### Steps
- Remove the hotend so you don't waste a ton of filament

- Measure and mark 120mm on a length of filament
![](/images/reprap/firmware/img_1264.jpg)

- Insert filament into extruder so that the top of the mark is just above the housing of the extruder
![](/images/reprap/firmware/img_1265.jpg)

- Extrude 100mm of filament

```
G91  ;relative positioning
G1 E100 F300 ;extrude 100mm at half max speed
G90 ;absolute positioning

```

- Measure distance between second mark, and housing of extruder.
![](/images/reprap/firmware/img_1268.jpg)

The difference in distance will either be greater than, less than, or equal to 120mm. If you measure equal to, then you're done and your extruder motor has been properly calibrated. In this case, there is a difference of 17.91mm *less* than 120. So the distance travelled is 120-17.91 = 102.09mm. It's close, but not quite right.

To calculate the new E-steps per mm we must know the current value. For the sake of this guide, we will assume an original value of 90 steps/mm.

The calculation is as follows:

''Steps<sub>new</sub> = (Distance<sub>expected</sub> / Distance<sub>actual</sub> ) * Steps<sub>Original</sub>''

From this formula we can calculate the new steps/mm by plugging in the values:

''Steps<sub>new</sub> = ( 100 / 102.09 ) * 90''

''Steps<sub>new</sub> = 88.16 steps/mm''

Save the new steps to the printer with ''M92 E88.16''

**NOTE**: This setting will not persist! You will have to either set the setting in the EEPROM (through printer menus) or in ''configuration.h''. The purpose of saving the setting like this, is to redo the calibration and test that it is accurate.

To save the setting in ''configuration.h'' edit the following line:

```c
#define DEFAULT_AXIS_STEPS_PER_UNIT   {100,  100, 400, 88.16} // { X, Y, Z, E }

```

## XY Calibration
