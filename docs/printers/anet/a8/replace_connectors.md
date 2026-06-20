# Howto: Replace the Connectors on the Mainboard
## Why?
![board with burned pins](/images/reprap/anet/a8/photo_2016-10-19_20-58-49.jpg)

The green connectors on the board are not rated for the heatbed currency. Multiple users on the Facebook-Groups showed their burned pins, connectors or mainboards. To prevent this you should switch the connectors.

## Preparation
### Parts
You need:
- new connectors with a pin distance of 5,08mm and a currency rating of at least 20A ([ebay](https://www.ebay.de/itm/10-50PCS-5-08mm-Pitch-Panel-KF301-2P-KF301-3P-Screw-Terminal-Block-PCB-Connector/232498440599): AKZ120 or 5mm PCB)
- soldering and desldering equipment (like [this](https://www.ebay.de/itm/Lotkolben-Set-Elektronik-Lotstation-220V-60W-Soldering-Regelbar/162791502112))

## Processing
### Warning!
If you have no experience in soldering you should give it to someone who knows how to do this. Messing up the connectors could lead to a fire, so give it to some electronics-guy.

### Desoldering
![Board with stock connectors](/images/reprap/anet/a8/photo_2016-11-05_01-19-02.jpg)

Desolder all three connectors. Heat the two pins alternating and pull them out or use desoldering tools like desoldering wick and a desoldering pump.

![Board without connectors](/images/reprap/anet/a8/photo_2016-11-05_01-18-50.jpg)

### Solder the new connectors
To apply the new connectors to the board just solder them where the old ones were.

![board with first new connector](/images/reprap/anet/a8/photo_2016-11-05_01-19-29.jpg)

![board with three new connectors](/images/reprap/anet/a8/photo_2016-11-05_01-19-40.jpg)

### Finish
Reapply the board to your printer and enjoy.

## Related improvement
To prevent the high currency of the heatbed going through the Mainboard [apply a relay](../../../electronics/heatbed_mosfet) to your setup.
