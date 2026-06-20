# Replacing the hotbed connector
- article under development, please add your knowledge and feel free to edit -
The corresponding discussion can be found [here](https://www.facebook.com/groups/OFFICIALAnet3DprinterSupportGroup/permalink/662020787319819/)

A very common issue are scorched heat bed connectors like this:
![](/images/reprap/anet/a8/18449265_10211516226635514_3997977419206089998_o.jpg)

For problems on the other end of these wires look [here](../../../electronics/heatbed_mosfet).
### Root cause
There are several opinions about the root cause of this problem. Which is the main root cause or if it is a combination of them is still to be [discussed](https://www.facebook.com/groups/OFFICIALAnet3DprinterSupportGroup/permalink/662020787319819/). Here some collected facts and arguments.

The connector is a VHR-6N from JST rated to 10A. The heat bed draws around 10A at room temperature and less when hotter (click [here](./improvements/understanding_my_heatbed#heat-bed-power) for details). So theoretically the connector is just enough. But these connectors are not designed to constantly moving aroud so a **strain relief**(see below) could probably solve the problem. 

   NOTE
   Always keep in mind: 
   Wherever there is an electric current flowing through a circuit. there will be heat developing whenever it encounters a resistance.
   The hotbed heater has a small resistance ( between 1 and 3 Ohm) and it is designed to develope heat and it can sustain the heat.
   A large resistance in the connector will limit the current a lot and it will prohibit any real heat developing in the heater. 
   A small resistance in the connector (lets asume just 1 Ohm) will limit the current just a very small amount and a lot of heat will 
   develope in the connector almost equal to that of the heater intself.
   
   ERGO a meltdown of the connector is in progress

Other possible reason for failures could be:
- poor quaity of the crimps
- stiff stock wires or wrong size
- that only 1 of the two + pins and one of the two - pins are used instead of both + pins and - pins reducing the current for each.

## How to repair
There are several options to repair scorched connectors

### Option 1 - Replace the connectors with the same type
#### (and maybe set yourself up for another happening of "more of the same"?)
You will need: 
- 1x VHR-6N from JST
- 4x SVH with AWG 16 pre crimped pigtails like [these](https://www.digikey.com/product-detail/en/jst-sales-america-inc/ASVHSVH16K305/455-3107-ND/6009483) or
  - 4x SVH-41T-P1.1 pins
  - crimping tool
  - pliers and side cutters
  - Silicone wires with thins strads  AWG 16 to 18.

The heat bed connector has 4 pins for + and -. The + pins can be used in paralell, the - pins also. This reduces the current on the pins and therefore the probability of failure.

It is recomended to add strain relief.

### Option 2 - Soldering the wires directly onto the hotbed heater
   Soldering cables directly onto the heater is a very reliable option if it is well done. But soldering thick wires onto the heater with 
   a large thermal capacity is quite dificult and requires some soldering experience to avoid cold joints (stacking one blob of solder on 
   top of another without melting the solder properly, and therefor not creating a good electrical connection). As this connection has to 
   withstand a quite high current and a failure may lead to fire, this not recommended for a first time soldering experience.

Recommendations:

- Use a solderingiron of good capacity (75/100 Watts). A smaller capacity iron will not melt the solder quick enough to get a good electrical connection (the more metal you need to heatup for a joint the more capacity you need, keep heating it with a low capacity iron  for longer time is not good practice)

- Do not OVERheat the solderjoint. As soon as the solder melts on both the wire and the pad keep the wire motionless till the solder has hardened (if it moves while hardening the joint will be no good eventhough the wire might be "stuck on")
 
- Adding too much solder is just as bad as not enough for a good electrical connection.
 
- The solder on the heat bed is probably lead free solder. Most people use leaded solder at home. As mixing them is not recommended it is better to remove as much old solder as possible before soldering.
 
- Maybe add a strain relief so that the constant bending of the wire does not stress the solderjoint.
 
[video of a heat bed soldering](https://www.youtube.com/watch?v=8XAr6ac-lLU&feature=youtu.be) it might be a slow going video but a lot can be learned for thoose who never practised soldering before.

### Option 3 - spade connectors
-feel free to write this chapter - always keep in mind : **if it works**, there is no wrong way of fixing your problem just easy and hard ways
### Option 4 - european style screw connectors
-feel free to write this chapter - always keep in mind : **if it works**, there is no wrong way of fixing your problem just easy and hard ways
## Strain relief
A strain relief reduces the stress on the connector/solder. This is a good idea independently of which option was chosen or as a preventive measure before it fails. Here some options:
- A [cable chain](http://www.thingiverse.com/thing:1915486) 
- 90° angle connector [17916](https://www.thingiverse.com/thing:17916)
- https://www.thingiverse.com/thing:1875869
- https://www.wikihow.com/Identify-Resistors

   NOTE 
   a cablechain was mentioned above: For cablemanagement it might look nice but there are some drawbacks on this. 
   It will bend the complete wire 180 degrees over the whole length of the wire with every motion. 
   In my opinion a better way is to keep the bending as gradual as possible spread out over the complete length of the wire.
   
   To clarify: let the hotbedwire(s) run from the top of the printer to the bed. the motion of the bed will then never bend the wires more 
   then maybe 15 degrees spread out over ca 30 cm. therefore hardly any bending at all in a specific place and furthermore eliminating the 
   need for the other mentioned angled connector(s). (Why overengeneer things?)
   
   
## Remarks:
- By replacing the stock wires by thicker ones (AWG 14 or 16) you can increase the heater power ([explanation](./improvements/understanding_my_heatbed)). For the JST crimp connectors AWG 16 is the thickest wire compatible with the SVH-41T-P1-1 pins
- The connector at the HB is: B6P-VH(LF)(SN)
## Comments
Also it is prefered to discuss the content in the discussion link (see top) you can add comments here:
