# Anet Mainboard(s)
![](/images/reprap/anet/url.jpg)

So far the mainboard has been changed a couple of times without the version number being upgraded. 
The Brandname, URL and/or version number just did not get printed on the board anymore at some time. 

**Changes visible are:** 

- 4 potentiometers to set the steppermotor current(s). they are visible just left of the big round capacitors
 ![](/images/reprap/anet/electronics/4pots.jpg) - 

- 1 potentiometer (right Z steppermotor only). 
![](/images/reprap/anet/electronics/1pot.jpg)   

- No potentiometers.
![](/images/reprap/anet/electronics/0pot.jpg)

- changed (upgraded) powerconnectors. (note the power supply connections switched position as well)

![](/images/reprap/anet/electronics/oldconn.jpg) **⇐ OLD  -  NEW ⇒** ![](/images/reprap/anet/electronics/upgrconn.jpg)

      NOTE: The upgrade has been done because the "old" slide-on connectors often suffered meltdowns as a result of transitional resistance and the following heatdevelopement caused by improper wiring or currents going over the maximum rating for the connectors.

      
**The general layout of the other connectors on the board stayed the same however so the picture under shows how and where to connect all plugs.**

![](/images/reprap/anet/electronics/1-160f50zp1192.jpg)

source: [anet3d.com](http://www.anet3d.com/English/Technical_Support/Customer_Service/104.html)

[Order a replacement board](http://www.banggood.com/3D-Printer-Mainboard-Anet-V1_0-For-Reprap-Mendel-Prusa-Control-Motherboard-p-1084455.html)
## Hardware
#### Stepper Driver
A4988 (confirmed by removing heatsink)

#### Connectors
![](/images/reprap/anet/electronics/anetboardj3.jpg)
#### Voltage
If only Fan2 is running an nothing else has power (no LED on the board and the LCD is off as well), check the 5V power at the marked point. If you can't get 5V, the voltage regulator might be broken. See [Anet v1.0 Power Upgrade](https://www.thingiverse.com/thing:1712609)
![](/images/reprap/anet/electronics/anetboard5v.jpg)
