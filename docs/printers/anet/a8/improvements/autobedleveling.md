# Autolevel for the A8 Anet 3D Printer
With autolevel your printer will scan the surface of your heatbed and adjust the Z-axis offset according to the position. Therefore you will not need to adjust the heatbed any more. You will need the following:
1. Distance sensor
1. Connector(JST XHP-3)
1. Sensor support (normally printed by yourself)
1. Firmware
1. Slicer settings
A good combination is **highlighted in bold**.
## Sensor
The sensor will replace your Z axis switch.
There are many sensor types available here an overview selection of some possibilities. The cost is only approximate and for information only. There is information missing, so if you have any knowledge please add it (this is a WIKI!).

A video comparison of the different types can be found [here](https://www.youtube.com/watch?v=il9bNWn66BY)

| Sensor name | Type | glass bed | Distance | comment | cost | link | voltage | oc | sig* |
|---|---|---|---|---|---|---|---|---|---|
| ROKO SN04-N | NPN | no | <3 mm | the "official" Anet sensor | 4-15 USD |   | 10-30 V(5 V) | no |   |
| TRONYX XY-08N | NPN | no | 8 mm | With Support | [12 USD](https://www.aliexpress.com/item/TRONXY-3D-Printer-Auto-Leveling-Sensor-with-Auto-Feature-3D-Touch-Free-shipping/32841886247.html) |   | 6-38 V(5 V) | no |   |
| **HallON** | Hall effect | yes | On any surface | With Connector for Anet | [10-16 Euro](http://hallon.garage-makezone.eu/) | [PnP and DIY kits](https://www.thingiverse.com/thing:2838259) | 5 V | no |   |
| LJ18A3-8-Z/BX | NPN inductive | no | 8 mm | [with connector](http://www.ebay.co.uk/itm/192036463186) | [3 USD](https://www.aliexpress.com/item/Promotion-LJ18A3-8-Z-BX-8mm-Approach-Sensor-NPN-NO-Switch-DC-6-36V/32623086326.html) |   | 6-36 V(5 V) | no | 3.2 µm |
| **LJ18A3-8-Z/BX-5V** | NPN inductive | no | 8 mm |   | [6 USD](https://aliexpress.com/item/M18-8mm-sensing-DC-5V-NPN-NO-LJ18A3-8-Z-BX-5V-cylinder-inductive-proximity-sensor/32719316657.html) |   | 5 V | no | 3.0 µm |
| LJC18A3-H-Z/BX | NPN capacitive | yes | 1-10 mm |   | 5 USD |   | 6-36 V |   | 0.6 µm @ 25 °C, 9 µm @ 60 °C |
| LJ12A3-4-Z/BX | NPN Inductive | no | 4 mm |   | 2 USD |   | 6-36 V |   |   |
| LJ12A3-4-Z/BX-5V | NPN Inductive | no | 4 mm |   | 3 USD |   | 5 V |   |   |

    

If (5 V) is mentioned on the sensor, it has been tested that it works on the 5 V provided by the Z-switch connector, but officially it need a higher voltage therefore it might not work reliably. See "wiring chapter" to connect it to the 12 V power supply.

*)The standard deviation obtained according to the Autobedleveling#Testing Repeatability Of The Probe chapter
### capacitive sensors vs inductive
- inductive sensors are using magnetic fields for the detection. They can only detect metal. It can detect the metal under the glass, if the range of the sensor is high enough. But if the metal is deformed beneath the glass the printer will try to compensate a non-existing deformation. Also while using Inductive sensors, the detection range needs to be adjusted according to the metal which the sensor senses. They are designed for sensing Iron based metals. So for other metals, the sensing distance needs to be derated. A rough multiplier for sensing distances for various metals are given in brackets -  Steel (1.0), Stainless Steel (0.6 - 1.0), Aluminum (0.30 - 0.45), Brass (0.35 - 0.50), Copper (0.25 - 0.45). For eg: if an 8 mm Inductive sensor is used to sense Aluminum, the sensing distance is actually between 2.4 mm and 3.6 mm. So it would be best to test the sensing distance with the sensor you purchased before installation, especially while using 4 mm sensors along with a glass build plate.

- capacitive sensors are using electrical fields for the detection. They can detect many materials including glass. They have a little screw to adjust the field to fit your needs and your material. The drawback of capacitive sensing is that it is affected by temperature and humidity.
Therefore a general recommendation could be: ** inductive for metal, capacitive for glass **

Read more at: http://www.ab.com/en/epub/catalogs/12772/6543185/12041221/12041227/print.html

### open collector(oc) & and internal pull up resistor
First of all, why do we need a NPN for the Anet-board? The input on the Anet-board is low-active. That means it is held high at 5 V with an internal pullup-resistor and is actively switched down to 0 V. That is what a NPN-Sensor does.

If you get an open collector sensor you will have an easier wiring. To know if it is a open collector connect the power supply (12 V) to the brown(+) and blue(-) wire. Then take a multimeter and check the voltage between black and blue. If there is none you have an open collector sensor, which can be directly connected to the board.

Most Chinese sensors do not have an open collector output (might be the LED-circuit). They have an internal pull up resistor. This is why the black wire is not only high impedance when the sensor is not switched but has any voltage on it. For those you need to add at least one resistor between the black and the blue wire to reduce the voltage to nearly 5 V. (as mentioned above it is not for switching but securing the board. switching is done with 0 V). Another way it to put a diode in, which should also prevent from damaging the board with voltage-peaks from the sensor while switching.

As you can see this topic is not easy to solve. So "universal" way is to put in an optocoupler which is not only working but protects your board from damaging

## Sensor support

| Description | for Sensor | Printer | link/comment | offset X | offset Y |
|---|---|---|---|---|---|
| Official Anet | ROKO SN04-N | A8 | expensive, fragile and collides the heat bed harness and connector | 15 mm | 55 mm |
| Official Anet like | ROKO SN04-N | A8 | http://www.thingiverse.com/thing:1751859 | 15 mm | 55 mm |
|   | ROKO SN04-N | A8 | http://www.thingiverse.com/thing:1874774 |   |   |
|   | ROKO SN04-N/XY-08N | A8 | https://www.thingiverse.com/thing:2319403 | -21 mm | -43 mm |
|   | **HallON A8** | A8 | [2838259](https://www.thingiverse.com/thing:2838259) | 19 mm | 42 mm |
|   | LJC18A3-H-Z/BX | A6 | [A6](http://www.thingiverse.com/thing:1785616) |   |   |
|   | **LJ18A3-8-Z/BX** | A8 | [1911146](http://www.thingiverse.com/thing:1911146) | 65 mm | -36 mm |
|   | **18 mm capacitive sensor** | A8 | http://www.thingiverse.com/thing:1883473 |   |   |
|   | 12 mm inductive sensor |   | http://www.thingiverse.com/thing:1884118 |   |   |

The offset in X,Y, and Z are the values defined in the firmware (In Marlin Configuration.h). The value for X and Y can be quite coarse. Z has to be accurate and has to be adjusted quite accurately. This value you can set also via display (Marlin): Menu->Control-> Motion->Z-Offset. Procedure to get this value:
1. Set a large Z-offset value (i.e. 2 mm)
1. Autohome your printer
1. place a sheet of paper beneath the nozzle (make sure it is clean)
1. Go into Prepare -> Move Axis and disable Soft Endstops
1. move Z-axis down by steps of 0.1 until it touches the paper.
1. note the Z value (i.e 0.7 mm) and subtract it from the initial value (2 mm-0.7 mm).
1. Set the value as Z-offset (1.3 mm)

**HallON** Only Sensor with ready to use predefined firmware, and full project support. 

**HallON Youtube channel:** [Installation and user guide](https://www.youtube.com/channel/UCdCgbAW-DJVNAqVUW8MlNqA)

## Sensor wiring
The Sensor will be replace the Z switch. You will need a **"JST XPH-3" 3 pin connector**. You might also use the connector of your Z probe if you do not need a 5 V power supply as the middle pin is missing.
The position of the pins on the board is described in the picture:

![](/images/reprap/anet/a8/improvement/wiring.png)

Normally the following color code is used for the sensor Harness:

- Black - Signal - for NPN it is 0 V=active, high impedance OR supply voltage for inactive
- Brown - Power supply - See sensor for the Voltage*
- Blue  - Ground - 0 V

As most sensors need a voltage larger than the 5 V provided by the connector there are a few alternative options:
1. Purchase a pre made board:
    - [OptoCoupler](https://www.aliexpress.com/item/1-Channel-Optocoupler-Isolation-Module-Input-12V-No-Din-Rail-Holder-PLC-Processors-80KHz-PC817-EL817/32719957788.html)
1. For **5 V sensors or for some 6-36 V sensors ** use the 5 V supply of the connector. Anet and Skynet3D use this option for their sensor and it works for the LJ18A3-8-Z/BX. According to some users the low voltage is acceptable for the "orange" sensors. But the this might lead to unreliable readings as it is not designed for this voltage.
1. If you have an **open collector NPN** sensor (see above) than you may connect the brown wire to the the 12 V input of your board and the blue to the ground and finally the black wire to the Z switch (the board should have an internal pull up).
1. If you have a sensor **with an internal pull up resistor**(see above) than you may connect the Brown wire to the the 12 V input of your board and the blue to the ground. The following options are available:
  1. Add a resistor between the black(signal) and the blue(ground) wire to reduce the resulting voltage from 12 V to 5 V. The best way is to test it with different resistors and measure the voltage between the signal (black) and ground (blue). Best to start with is 10 kΩ, for me it worked with 5 kΩ. Increase the resistance if the voltage is to low, decrease if it is to high. When you found the correct resistor you can connect the signal pin (black) to the signal pin of the Z-probe plug as shown on the picture. 
  1. The disadvantage of using resistors is that it depends on the power supply voltage and a change of this voltage my damage your printer. This can be avoided by **using a diode**. Assuming a typical NPN normally-open (NO) sensor, connections can be made as in the schematic below (be careful with the polarity of the diode). See Method 3 [here](https://github.com/thijsk/Skynet3d/blob/master/Documentation/diagrams%20and%20images/Sensor_options.pdf) and [this post](https://mertarauh.com/2017/01/18/dont-trust-the-internet-and-how-to-add-an-inductive-proximity-sensor-to-your-3d-printer-the-proper-and-easiest-way) for more details.
    - ![](/images/reprap/anet/a8/improvement/a8_diode_sensor_12v.png)
1. Some tutorials recommend to use **two resistors**. But this is **only for PNP-sensors and for high-active inputs**. In our case this would lead to errors. When the sensor switches to 0V and the Atmega internal pull up is activated there would be about 2.5 V on the signal pin which is not recognized as low by the AVR.
1. last but not least there is the universal/safe way for your NPN-Sensor. Putting the optocoupler in: 
![](/images/reprap/anet/a8/improvement/15895108_1220874871337969_6770101747027532263_n.jpg)
(R2 is optional for Anet-Boards as it has its own Pullup)

## Firmware
Normally the installed printer software does not support autolevel. Therefore you will have to upload a new one via the USB port.
There are 2 options:
- [Original Anet firmware](http://anet3d.en.made-in-china.com/custom-detail/xmQExQndGJUQxmQExQndGJUQ/The-Firmware-Links-You-May-Need.html)
- [Marlin](https://github.com/MarlinFirmware/Marlin) 3D printer firmware.
 ~~ * Skynet 3D A marlin-based firmware modified for the Anet A8~~ Skynet3D is obsolete. Use Marlin.
### Marlin
Instructions and information can be found here:
[Marlin](http://marlinfw.org/)
[Anet Board Defs for Arduino](https://github.com/SkyNet3D/anet-board/)

You will have to make the following changes in the configuration.h file:

Set the position of the probe according to the probe support table above:
   #define X_PROBE_OFFSET_FROM_EXTRUDER 65  // X offset: -left  +right  [of the nozzle] 
   #define Y_PROBE_OFFSET_FROM_EXTRUDER -36  // Y offset: -front +behind [the nozzle] 

Alternative:
   #define X_PROBE_OFFSET_FROM_EXTRUDER -21  // X offset: -left  +right  [of the nozzle]
   #define Y_PROBE_OFFSET_FROM_EXTRUDER -43  // Y offset: -front +behind [the nozzle]
   
To define the positions(of the probe) of the points for the autolevel (sometimes needed):
    #define LEFT_PROBE_BED_POSITION   35
    #define RIGHT_PROBE_BED_POSITION  200
    #define BACK_PROBE_BED_POSITION   180
    #define FRONT_PROBE_BED_POSITION  20

Goes With Alternative:
    #define LEFT_PROBE_BED_POSITION   20
    #define RIGHT_PROBE_BED_POSITION  160
    #define BACK_PROBE_BED_POSITION   160
    #define FRONT_PROBE_BED_POSITION  20
    
These points have to reachable with the x,y offset defined for your probe support otherwise you get an error message when compiling and uploading.

Set the auto leveling method that you will be using (in this case Bilinear), just uncomment it:
    //#define AUTO_BED_LEVELING_3POINT
    //#define AUTO_BED_LEVELING_LINEAR
    #define AUTO_BED_LEVELING_BILINEAR
    //define AUTO_BED_LEVELING_UBL
    //#define MESH_BED_LEVELING
    
In the case that the sensor is outside of the plate after homing the Y and X axis, use Z safe homing (applies if you are using a sensor support with a negative Y-offset:
    #define Z_SAFE_HOMING
    
Enable the Soft Endstops option in the menu by uncommenting:
    #define SOFT_ENDSTOPS_MENU_ITEM

## Slicer settings
The slicer needs some specific setup to execute the autolevel before each print and that the autohome works.

There are already some configuration files available at [Cura](../slicer/cura)
### G-code (only needed if there is no configuration file available for download)
#### Auto home
Before homing of the Z axis the probe has to be positioned above the heat bed. When the code G28 is sent to the printer this is done automatically. But if "G28 Z" is sent it is not. This is the case for some Cura 2.1 json files.
#### Auto level
The G code G29 starts the autolevel procedure. It should be executed after the G28 command

#### Implementing G-code in CURA 2.1
The G-code executed before a print is defined in the json file (see also [Cura](../slicer/cura))
Example:

```
"default": "G21 ;metric values\nG90 ;absolute positioning\nM82 ;set extruder to absolute mode\nM107 ;start with the fan off\nG28;move X/Y/Z to min endstops\nG29 ;auto level"\n
```

### Testing repeatability of the probe
To test the repeatability of the probe Marlin/Skynet3D has the G-code M48. Which has to be activated in the configuration.h file: #define Z_MIN_PROBE_REPEATABILITY_TEST

For the following G-code "M48 P50 X100 Y100 V4" was used to obtain the values for the table above.
### Measuring your heat bed flatness
If you have Octoprint installed on your 3D printer use built in operation:
https://3dprintscape.com/octoprint-bed-level-visualizer-complete-setup-guide/

Without Octoprint but you will be limited 7X7 Matrix:

With the "G29 T P10 V4" your printer will scan your heatbed in a 10x10 point matrix.

FreeMat/Matlab tool and instruction to analyze your output can be found [here](/images/reprap/anet/a8/improvement/analyze_heatbed_geometry_and_sensor_quality_2.zip)
![](/images/reprap/anet/a8/improvement/flattness_of_aluminium_hb.png)
A online tool can be found [here](http://www.maui-3d.com/cgi-bin/plotG29) (send G-code "G29 T P7 V4" to your printer to get the output)

Only works with at least a 7x7 Matrix! If you use a smaller matrix, use the link below

~~Another, more interactive online tool can be found [here](http://lokspace.eu/3d-printer-auto-bed-leveling-mesh-visualizer/) - paste the same output as above~~. Web page No longer available

![](/images/reprap/anet/a8/improvement/lokspace-g29-visualizer.jpg)
## Troubleshooting
Automatic bed levelling is a complex beast.  When set up well it can work extremely well, but if it isn't working well for you, there are a few basic things to check.

A very typical problem scenario is where the print is fine on one edge or in the middle, but the nozzle is too near the bed in one corner or on one edge.  In this case, the first thing to check is if the [probe X and Y offsets are correct](#are_your_x_and_y_offsets_correct).

Another common problem is the nozzle being too high above the bed when printing starts.  This is often caused by [the Z offset being incorrect](#is_your_z-offset_correct).

These problems, and many others, can be solved by working through these simple troubleshooting steps.
### Is the bed as flat and level as it can be?
ABL can't work miracles.  You need to make sure your bed is as level as you can get it by adjusting the corner screws. When you have ABL working well you may like to consider to swap the springs and screws for fixed stands. (Like these, for example [2165389](http://www.thingiverse.com/thing:2165389).)

There's no magic number for how flat your bed needs to be, but you probably want any variations to be no more than 1 mm across the entire bed.  You can check it manually by laying a straight edge (such as a steel rule) across it, or using your probe by increasing the number of probed points using the instructions under 'Measuring your bed flatness'.

### Which levelling method are you using?
The two main levelling methods in Marlin are linear and bilinear.  Linear creates a single tilted plane, and is best suited to a perfectly flat surface which is tilted lower or higher on one side or corner.  Bilinear is best suited to an uneven bed with dips and rises, and is the Marlin-recommended method.

It is unlikely that your bed is perfectly flat, so bilinear is usually a good option, especially if linear does not give good results.

http://marlinfw.org/docs/features/auto_bed_leveling.html
### Is your probe working well?
One of the first things you should do after installing your Z-probe is check how well it works using the M48 command to test it.

In order to run M48 you need to uncomment this line in configuration.h:

```
#define Z_MIN_PROBE_REPEATABILITY_TEST
```

Use commands like this to run 10 probes and get the measurements:

```
M48 P10 X100 Y100
```

The output will look similar to this:

```
M48 Z-Probe Repeatability Test
Finished!
Mean: 3.450000 Min: 3.442 Max: 3.452 Range: 0.010
Standard Deviation: 0.004330
```

This shows the absolute maximum and minimum measurements the sensor took, the mean (average) of all the measurements, the range between the maximum and minimum, and the standard deviation.

The standard deviation is interesting because it tells us that 68 % of all the measurements were within 0.00433 mm (one standard deviation) of either side of the mean, and 95 % of the measurements were within 0.00866 mm (two standard deviations) of the mean.

A good probe should consistently give a range in the hundredths of mm, e.g. 0.05 mm. A very good probe will have a range in the thousandths.

More information about standard deviation:
https://en.wikipedia.org/wiki/Standard_deviation

If you get a very large range or standard deviation you should look for sources of movement in your Z-axis.  The motor couplers can contribute to excess play and you can consider upgrading them to better ones.  Failing that, consider getting a new probe.

#### Probe area
You should do the M48 probe test in multiple places across your build area to ensure your probe is consistent everywhere.  If you're using a capacitive sensor, make sure you check at the extremes of your probing grid to make sure you're not suffering from any wrap-around near the bed edges.

These lines in configuration.h define the probing grid boundaries:

```
  #define LEFT_PROBE_BED_POSITION   35
  #define RIGHT_PROBE_BED_POSITION  200
  #define BACK_PROBE_BED_POSITION   180
  #define FRONT_PROBE_BED_POSITION  20
```

#### Some tips for probe accuracy
- The 'spring' type Z-motor couplers allow vertical play, which can affect the Z-probe results. You can replace them with 'Plum' style couplers (like [these](http://www.ebay.co.uk/itm/320969288677?var=5100767295527)) which have no vertical movement.  
- Capacitive probe measurements will vary near the edge - ensure that your probe boundaries are far enough from the edge to avoid this.

### Are you probing enough points?
If your bed is curved or particularly warped you can increase the number of points the probe measures in order to create a more detailed correction matrix (at the expense of time - more probes means G29 takes longer).

Try a 5x5 or 7x7 grid by changing this line: 

```
#define ABL_GRID_MAX_POINTS_X 5
```

### Are your X and Y offsets correct?
For ABL to work correctly it is **essential** that the printer knows the exact offset from the nozzle to the probe, otherwise any correction is not going to be applied in the right place, and it may look like the printer isn't correcting at all.

If you downloaded SkyNet3D (now obsolete) or Marlin Firmware and used one of the example configurations, it probably came with some pre-configured probe offsets and a recommended sensor mount for you to print.  It is absolutely vital that you check the sensor offsets once your probe is installed, and update the values in configuration.h accordingly.  

These are the relevant lines:

```
 #define X_PROBE_OFFSET_FROM_EXTRUDER 65  // X offset: -left  +right  [of the nozzle] 
 #define Y_PROBE_OFFSET_FROM_EXTRUDER -36  // Y offset: -front +behind [the nozzle] 
```

Typically, sensors are most sensitive in the center, so we need to know the offset from the tip of the nozzle to the center of the probe.  Here is an approach you can use to measure it:

#### Measuring X and Y offsets
1. Measure the bed and make a mark in the center (X110 Y110)
1. Home the printer then move to X110 Y110 Z0
1. If the nozzle is not on the mark you will need to make small movements to get it on the mark
1. With the nozzle on the mark in the center of the bed, measure the X and Y distance from the edge of the bed to the side of the probe
1. Measure the diameter of the probe
1. The probe offset values are 110 - [the distance from the bed edge to the probe] + [probe diameter / 2]

The offset parameters are integers, so round your results to whole numbers before updating configuration.h

### Is your Z-offset correct?
Getting the Z-offset right is critical to get your first layer.  Use this process to find and set it:

With a firmware based on Marlin 1.1.x the procedure is a bit different as the behaviour of G92 in pre 1.1.x versions was buggy:

1. Heat your printer up to your printing temperature and allow a few minutes for it to expand and settle
1. Reset the existing Z-offset to zero 
```
M851 Z0
```

1. Home all axes 
```
G28
```

1. Move the nozzle to the middle of the bed 
```
G1 X110 Y110
```
 (if your bed is 220 x 220)
1. Turn off the software endstops with 
```
M211 S0
```

1. Move the nozzle down so it is just gripping a piece of standard printer paper
1. Set the Z-offset to the displayed value. E.g. if the printer displays a Z-Value of -1.23 enter 
```
M851 Z-1.23
```

1. Store it to the EEPROM 
```
M500
```

1. **Important notice!** Enable the endstops again with 
```
M211 S1
```
 or the printer head will collide with the bed on the next 
```
G28
```
 command

Pre Marlin 1.1.x
1. Heat your printer up to your printing temperature and allow a few minutes for it to expand and settle
1. Reset the existing Z-offset to zero 
```
M851 Z0
```

1. Home all axes 
```
G28
```

1. Move the nozzle to the middle
```
G1 X110 Y110
```

1. Move the nozzle down so it is just gripping a piece of standard printer paper
1. Mark this position as Z zero
```
G92 Z0
```

1. Use the sensor to probe the middle of the bed (where we just set Z0)
```
G30 X110 Y110
```

1. Take the Z value of the bed and put a minus sign in front; this is the Z-offset.  E.g. 1.23 becomes -1.23
1. Set the Z-offset
```
M851 Z-1.23
```

1. Store it to the EEPROM
```
M500
```

### Did you let it warm up?
Before setting your Z-offset you need to make sure your printer is up to temperature and you've given it a few minutes for any thermal expansion to occur.  Differences in nozzle height of around 0.2 mm have been observed between a hot and a cold nozzle.  If you set your Z-offset with the nozzle cold, you will most likely find it is too close to the bed when it is hot.

You should also ensure that the printer has had sufficient time at temperature before starting a print.  Ideally give the printer 3-5 minutes after it reaches printing temperatures before you start to print.

## See Also
- [Very good video from Thomas Sanladerer](https://www.youtube.com/watch?v=EcGFLwj0pnA)
- [Watch?V=TTl09r E0wE](https://www.youtube.com/watch?v=tTl09r-E0wE)
- [This video explains all the process for marlin 1.1.8, just excellent](https://youtu.be/G-TwWfUzXpc)
## Disclaimer
Several experts have edited and corrected this page.  This is just an recommendation without any warranty. If you are an expert and knows something better or just has found an error, please feel free to edit this wiki and add your knowledge.
