# RAMPS
## Foreword
I've never worked with a wiki before, so this may end up being a relatively piecemeal kinda deal. If you wanna continue my work, feel free to do so using the original Google Doc. - Terrance S.

...Also, the original Google Doc [can be found here](https://docs.google.com/document/d/1GN1auBFuWrcrZUy0nlAIVBInn1FZdIZd72y1IQE9Oxc/edit?usp=sharing).

## Introduction
RepRap Arduino Mega Pololu Shield (RAMPS) is the standard of development for the open source replicating rapid prototyper (RepRap) movement. Though there may be many different approaches to the way this is done, largely RAMPS is the primary hardware backend for many, if not all 3D printers today within the consumer DIY market at the very least.

This guide is my contribution to the open source movement of the 3D market space, since I fully believe (along with many, many others) that the only way to move forward is to share what should be commonplace knowledge. Taking that, you (and I do mean you, the reader) should move forward and innovate. Pay it forward and all that jazz. ;-)

A few things worth mentioning before we continue:

- I don’t assume you know anything about electronics. I don’t know a damn thing about them (I work in the IT field by trade, and that’s entirely software). So things will be reduced to the most basic level with regards to instructions.
  - I do assume, however, that you have at least a basic understanding of how to work with computers; specifically software. If you don’t know the difference between a click and a double-click (not judging, just putting it out there), I would suggest brushing up there first.
- Though I’m platform agnostic (meaning that I don’t particularly care which platform/Operating System/etc. that I use), I do prefer to use Mac for everything except gaming. For software-specific instructions, you’ll see screenshots in macOS. If there are differences between how to do something within Mac and their Windows counterparts, I will do my best to draw attention to them.
- When recommending components, I’m generally going to do it using Amazon. Even if I didn’t have an Amazon Prime membership, I can’t remember what life was like before Amazon became the thing it is today. Things are cheap, delivery is quick, and support is exquisite.
- For some reason, I don’t like using pictures a lot. I apologize; this is something I’m trying to get used to, but in general I won’t use a lot of pictures. If they help with what I’m trying to explain (e.g., that one connector thing I can’t describe otherwise, or a diagram), I’ll use them. Otherwise, they’re just fluff and unnecessary disk space.
- Where possible, I’m going to give credit to the resources I used to get to where I’m at. That’s part of the whole “pay it forward” mantra I mentioned earlier, and I believe it’s obnoxious to build off of someone else’s work without giving them their due credit.
  - That being said, I’ll start right off the bat with giving credit to 3D Printer Czar for their work on the RAMPS 1.4 Assembly Guide. Without it, I would’ve been stuck up the creek without a paddle. It’s a very well-written guide, though I’ll admit I glossed over a lot of stuff.

## Why would I want to do this?
One question that seems to pop up a lot about this particular guide (and the thing that caused me to make the jump myself) is, “Why would I want to do this?”

Since a picture is worth a thousand words, here’s a picture to show you why I did it:

![](/images/reprap/electronics/img_0580.jpg)

In the event you can’t see what the photo is showing you, it’s this: The mainboard from my Anet A8 caught fire after about two weeks’ worth of printing. I am not entirely sure what caused the fire since my wiring was correct (despite some speculation from the Anet Facebook group), but I do know this: The Marlin firmware that Anet uses in their mainboards is older than the current stable version, and it lacks the basic safeguards that newer Marlin releases has.

Specifically, it’s missing the neat feature that covers what’s known as “thermal runaway”, that is, when the heatbed (or hotend) try to heat up but fail to do so, Marlin will automatically set itself into a failure status and halt all electrical activities until you reset.

## To Do/Change Log
There are still some things that I want to get around to adding to this guide. When they are added, I’ll mark them as complete. If possible, I’ll also add some self-imposed deadlines to make things a bit more predictable as to when you can expect those changes.

| Thing to Do | Status | Deadline Date | Completion Date |
|---|---|---|---|
| Add a “To Do” table | Complete | 03NOV16 | 03NOV16 |
| Add extra pictures for reference | Pending | 31DEC16 |   |
| Add extra Marlin configuration pointers | Pending | 31DEC16 |   |
| Add a Troubleshooting section. | Complete | 03NOV16 | 03NOV16 |
| ...Actually fill in the Troubleshooting section. | Complete | 30NOV16 | 15NOV16 |
| Add a vendors listing | Complete | 11NOV16 | 11NOV16 |
| Beef up the introduction | Complete | 15NOV16 | 15NOV16 |
| Make it pretty | Complete | 17NOV16 | 17NOV16 |
| Add items to the Glossary | Complete | 30NOV16 | 21NOV16 |
| Add “Where to go from here” section | Complete | 21NOV16 | 21NOV16 |
| Add a “Lessons Learned” section | Complete | 21NOV16 | 21NOV16 |

## What You’ll Need
This guide assumes at the very least that you’ve gotten yourself some sort of 3D printer lying around that has the ability to be migrated to a RAMPS installation. In my case, I started with a cheap Prusa i3 clone on eBay. It’s the Anet A8, and in the interest of full disclosure, I ended up going the RAMPS route due to the main board not being smart enough to stop itself from catching fire.

So, the list of things you need to move forward:

- That printer I just mentioned. It doesn’t have to be the Anet A8; many other printers will do just fine, I’m sure. But I can really only personally vouch for this printer. What’s more, it’s on the low end of 3D printers budgeting-wise.
Cost: Varies. I picked mine up for around $180.00 USD from the link given earlier.
- RAMPS equipment. With this, you can either source the Polulu Shield, Arduino MEGA board, and other parts yourself, or you can go with a kit for a quicker transition. I’d personally recommend the latter option, but that’s because I believe that the destination is more important than the journey (and also, I’m lazy).
  - Cost: Varies. In this case, the one I personally went with was this one from Amazon. At the time of this writing, it’s going for a mere $34.68 USD, and it’s served me well for the past couple of months. ALSO, if you’re going to shop on Amazon, I’d recommend checking out Amazon Smile. It lets you give a portion of your purchase to the charity of your choice. I do smile a bit more when I purchase through Smile, so… please do the same.
- Additional hardware. It goes without saying, but you’ll need to have some tools to make the jump. They aren’t mandatory, but if you’re serious about 3D printing (and I hope you are!) this will pay dividends moving forward. My specific recommendations for adapting your kit to a RAMPS setup are:
  - DuPont connectors. This is the name of those li’l black ends you… that… well, that… I’m bad at describing this. So, I’ll use a picture instead:
![](/images/reprap/electronics/dupont_connector_on_a_cable.jpg)
  - Yes, that thing. There are kits on Amazon (I’m a huge fan of theirs; you’ll learn this quickly) that sell these connectors at amazingly low cost. The one that I’d recommend is this one here, which contains 425 pieces for $10.99 USD. Hilitchi also has other kits going upwards of 1,000 pieces (which is what I got, but I’m a nerd) for $16.87 USD.

- With DuPont connectors, you’ll need something to crimp them. Though you can use any random set of pliers you’ve got laying around to do this, they’re not specialized for the task, and you’ll have varying degrees of success (trust me, I know). Instead, I’d recommend getting an actual DuPont crimper. For the moment, I’m not going to discuss how to use them with DuPont connectors because there are plenty of videos on YouTube covering the subject, and that’s how I learned. Note: If you watch a video and it brings up soldering, disregard. DuPont connectors do not require soldering, and it’s allegedly bad practice to use solder.
Cost: $23.00 USD. The one I linked above is the one I went for, and it works like a charm.

- Wiring. Eventually, you’re going to run into a situation where you need extra wiring to get some more wiggle room with your build. For this, I’d recommend this ribbon cable; it’s cheap and it does the job very well. You don’t need to match the RAMPS standard of green, blue, red, and black wiring; so long as the wires go where they need to go, the color is immaterial.
Cost: Varies. Depending on how much wire you want, it’ll run as low as $8.98 USD, possibly lower with some sleuthing.

- More wiring/cabling. Another thing that I didn’t know when I started was that the cabling that the Anet A8 kit wasn’t necessarily the best cable for the job. Specifically, they used a very high gauge of wire that had the possibility to overheat. I believe the REPRAP forums recommend using around 16-gauge wire for anything pulling in a lot of current, and, well… 3D printers in general use a lot of the stuff. You can find various gauges of wire on the cheap on Amazon; take note: the lower the number, the thicker the cable (e.g., 12-gauge is substantially thicker than 20-gauge).

- Wire strippers. I thought I could get away with using my wire cutters to strip wires, but… wire strippers were quite literally made for the job, and they’re fantastic at it. I’d recommend this pair on Amazon; they have blown me away with how well they work.
Cost: Varies. The ones I linked are (at the time of this writing) $12.57 USD.

## Making it Happen
1. Go to the Arduino website and download the Arduino IDE (Integrated Development Environment; link to the page giving you the choice of platforms is here). Once downloaded, install it. On Windows systems at the very least, you’ll also be prompted to install the Arduino drivers as well. Though I didn’t notice the same thing on my iMac, it may apply to other systems. Either way, this is key. You need to have those [drivers](https://softwaretested.com/drivers/) installed to be able to interact with your Arduino MEGA board and upload the firmware.
Go to the Marlin GitHub repository and download the latest version of Marlin (from the link provided, click Clone or download > Download ZIP). You don’t have to do anything extra with this just yet; just unzip it and stand by.
  - Though you don’t have to do anything extra, I’ve also taken the liberty of posting my MARLIN Configuration files for you to download. These files will need to be unzipped to the “Marlin” directory of the Marlin firmware you downloaded earlier, and overwrite the pre-existing files. PLEASE BACKUP YOUR ORIGINALS BEFORE DOING THIS. Also note that these files are only guaranteed to work for the Anet A8 specifically, but may work for Prusa i3 clones in general.
1. Once you’ve got all the hardware you need, go and check out that RAMPS 1.4 Assembly Guide I mentioned earlier. No joke, it’ll walk you through the vast majority of what you need to know for getting your RAMPS equipment assembled. I’d re-write it, but honestly… as far as wheels go, it’s pretty damn good, so I won’t reinvent it just yet. Using that guide, I was able to get through my RAMPS assembly without issue.
1. It’s at this point where you’ll want to cut off the original ends of the cable that connected to the stock board of your printer and replace them with the DuPont connectors. Though the original connectors may work just as well as the DuPont connectors, RAMPS setups are better off with DuPont connectors since you don’t have to worry about the nibs from the original connectors rubbing against other components.
1. Once the connectors are made (if you chose to go ahead with it) and the RAMPS boards are set up with the various jumpers and components added, connect your stepper motors and other leads to their respective connection on the RAMPS boards. Don’t worry too much about the orientation of the wires just yet; if you get them wrong you can always change the firmware settings or simply flip the connectors around.
1. Using the USB cable provided in your RAMPS setup, connect your RAMPS board to your computer (you don’t need to have power supplied to the board via the PSU; your computer will provide all you need for this step) and launch the Arduino IDE you installed earlier by double-clicking the Marlin.ino file within the Marlin firmware directory you unzipped the firmware to earlier (step 2). Note: As I said in the introduction, I prefer using Macs. The screenshots may not be on a Windows platform, but the menu structure is the same on both platforms.
1. Before doing anything else, you’ll need to configure the Arduino IDE to know which port and board you’re working on. For the RAMPS setup I recommended, these are the options you’ll choose for the port...

FIXME (Image)

1. Take note that Windows doesn’t necessarily tell you what’s running on a port, and will be represented by COMX, where X is any given port number available to Arduino. In my experience, this has typically been COM3.
1. And then the board…

FIXME (Image)

1. From here on out, you’ll only need to worry about two parts in the Arduino interface: Verify and Upload (though when you choose Upload, it starts by compiling and verifying the source code anyway, so you can technically disregard the Verify button). Verify is shown in the following screenshot as a checkmark, and Upload as the right-facing arrow.

FIXME (Image)

1. The other part of note for Arduino is the multitude of tabs at the top. Arduino source code is collectively saved as a “sketch file”, with the .ino file extension. When uploading the Marlin firmware, you may get an error at one point or another where it says that the file must be located within a directory named Marlin. If you get this, cancel the upload and rename the root directory (that is, the directory with Marlin.ino, Configuration.h, Configuration_adv.h, etc.) to Marlin and try again.
1. Back to the tabs: Each tab represents a specific file within the Arduino sketch. You can see in this screenshot that the tabs spill off the edge of the window, but you’ll also see that there’s a downward-facing arrow on the very right. Clicking this will give you a scrollable menu of all the tabs/files in your sketch:
1. Of these many files, there are three files you’ll be using for configuring your RAMPS setup:
  - Configuration.h
  - Configuration_adv.h
  - Pins_RAMPS.h
1. Configuration.h holds the vast majority of changes you would need to make for your RAMPS installation, such as the various travel speeds and various measurements (such as your build are X-, Y-, and Z-offsets, among many others). The Configuration_adv.h file will hold the more advanced settings (e.g., getting into the basics of pin layout and fan settings), and the Pins_RAMPS.h file holds the actual pin layout for your RAMPS board.
1. Click the Upload button in Arduino to upload your settings to your board. If everything is configured properly, you should be good to go with a decent baseline.
1. Again, please note: This guide and the provided files assumes you’re running an Anet A8 3D printer. Though the A8 is just one of many Prusa i3 clones on the market today, there are differences in builds (mostly the build sizes and offsets which must be taken into account within your Configuration.h file), and if they’re not properly addressed can lead to some horrendous noises at best, and damaged hardware at worst.

## Troubleshooting
RAMPS and Marlin are a match made in heaven when it comes to DIY 3D printing, but that doesn’t mean that things are guaranteed to work without a hitch. This particular section will walk you through the pitfalls that I’ve encountered myself, as well as issues that have been brought up by readers that I have looked into.

Where applicable, credit has been given to the authors of any contributions to these fixes.

### Error: you cannot set extruder_0_auto_fan_pin equal to fan_pin
This is caused when you try to, as the error message states, set the EXTRUDER_0_AUTO_FAN_PIN in Configuration_adv.h to the same pin as FAN_PIN in the respective pins file. For the purposes of this particular guide, the specific pins file we’re looking at is the pins_RAMPS.h file.

Before addressing the fix, let’s look at the cause.

In the Configuration_adv.h file that I’ve posted for download, look at the file around line 211 (if you don’t have the line numbers enabled, do that now by clicking File > Preferences in the Arduino IDE, and putting a check in the Display line numbers checkbox). You’ll see something similar to the following:

```
#define EXTRUDER_0_AUTO_FAN_PIN 9

```

Now look at the pins_RAMPS.h file in your sketch at around line 150, and you’ll see this:

```
#if ENABLED(IS_RAMPS_EFB)     // Hotend, Fan, Bed
 #define FAN_PIN        RAMPS_D9_PIN

```

The problem here should be pretty self-explanatory: We’re telling Marlin that the EXTRUDER_0_AUTO_FAN_PIN and the FAN_PIN are both located at the same place (the shorthand version of “9” vice “RAMPS_D9_PIN” is located elsewhere, but is beyond the scope of this issue), and thought they are technically at the same spot, technically doesn’t cut it here.

The fix is a simple one: In your pins_RAMPS.h file, modify the lines shown above to read this instead:

```
#if ENABLED(IS_RAMPS_EFB)     // Hotend, Fan, Bed
 #define FAN_PIN      -1                  // Default is RAMPS_D9_PIN

```

To be clear, you don’t need to add the comment (the line marked off with the two forward slashes), but I recommend doing this in the event you want to revert back in the future; it’s great practice to keep the defaults around somewhere, and where better than the file to which they belong?

And that’s it! One simple change eliminated your pin conflict!

## Lessons Learned
Along the way with the RAMPS upgrade of my Anet A8 system (as well as the self-sourced built of MZBot’s VORON CoreXY 3D printer), I learned a great deal about the intricacies of the RAMPS system, as well as the associated pitfalls. Here are some of the more important/”seemingly minor but actually pretty damn important” bits I learned along the way:

### Stepper Driver Orientation: It’s Important
It’s very important that you pay attention to polarity; that’s not just something that you need to be concerned with in RAMPS, but electronics in general. To that end, the orientation of your stepper motors needs to be on point when you’re inserting them into your board. Unlike with CPUs in a custom-build desktop computer, stepper drivers can fit into their DuPont slots in either orientation, and 3D Printer Czar’s RAMPS assembly guide doesn’t cover all stepper drivers, just the A4498 drivers that come with the majority of RAMPS kits you can purchase these days.

In building my VORON system, I ended up burning out a couple of the RAMPS boards due to not paying attention to the inscriptions on the board and stepper drivers when I inserted them. I managed to pull two diagram files from the Polulu-files.com site and stitch them together for comparison:

FIXME (Image)

Though these pinouts look identical, there is one very important distinction to make: the metal disc on the A4988 that’s used to specify the orientation of the chip on the board is on the other end of the DRV8825 stepper driver. If you were to use that same point of reference on the 8825 as you did on the 4988, you could end up frying your RAMPS board at the very least.

When I made this mistake on my VORON system, I ended up seeing substantial voltage issues that ultimately ended up blowing a fuse in my PSU’s IEC switch, as well as slowly but surely messing with my LCD controller board as well. I discovered what the issue was too late to save my first RAMPS board, but managed to isolate and resolve the issue before it claimed another.

Final lesson on this particular problem? Pay attention to detail. Do not skip ahead of any instructions you may be following, and do not make any assumptions.

Ever.

## Where to go from here
This document is (if I do say so myself) a great start to set you off in the right direction, but with RAMPS (as limited as it may be with other offerings such as Smoothieware and the like) having so much more to see and do with regards to both the hardware and the software.

What I would personally recommend doing is opening up your Marlin sketch and take a look through each of the individual files that comprises it. Get as familiar as possible with it, and make tweaks to see how that improves your overall printing. Marlin itself is written in the C++ programming language, and can be extended upon as needed; what’s more, Marlin has many different offshoots, including the Repetier-Firmware which has an incredible Configuration.h file generator available.

Ultimately, my recommendation is to stay curious. Tinker. Make mistakes. Learn and move on, better yourself and give back.

## Conclusion
~~This is admittedly a very short document.~~It’s more finely tuned for a specific hardware configuration, and is by no means a catch all. If you have any questions, concerns, or comments on anything you’ve found here, please feel free to get in contact with me at terrance.shaw@gmail.com. I will do what I can to assist, but without hands-on experience with hardware, I make no guarantees.

This document, since its original creation, has continued to grow in content and scope. As more information is gathered, it will be updated here. As well, the folks at the Anet A8 3D Printer Facebook group have a wiki that they have recently started, and I will do what I can to adapt this guide to that format.

## How Can I Help?
Honestly, just pay it forward. If you learned anything from this guide, pass it on to friends who may be looking for the same kinda assistance. If you want more tailored help with your hardware, you can always donate to terrance.shaw@gmail.com via PayPal, but I can’t guarantee any kind of timeline with that route unless you donate enough for me to get a new set of hardware since… well, this is a relatively expensive hobby. I get new toys when I can realistically afford the massive wallet trauma, but otherwise… well, I’m just a regular middle-class dude getting by as best I can.

## Acknowledgements
Nobody knows things without someone first teaching them. Here are the acknowledgements for those that have (directly or otherwise) contributed to the creation of this guide.

Am I missing someone? Please let me know so that I can give proper credit!

- 3D Printer Czar for his well-written RAMPS Assembly Guide

- /u/ThatOnePerson from reddit for the recommendation to add AliExpress as a vendor (this prompted the addition of a vendors listing in the guide)

- /u/Lewissunn from reddit for asking the question about the pin conflict error that comes up when you try to use my Marlin configuration files, thus prompting the initial troubleshooting topic in the Troubleshooting section of the guide

## Glossary

| Term | Definition |
|---|---|
| Bowden | An extruder configuration where filament is fed to the hot end via a run of PTFE tubing |
| Cartesian | A 3D printing configuration based on cartesian directions, using X, Y, and Z axes for motion. Examples of this include the Mendel and Prusa i3 3D printers, with a moving X/Y carriage and stationary Z axes |
| CoreXY | A unique take on the cartesian configuration, this 3D printing configuration is where the X and Y axes move along a set of rails controlled by two belts that cooperatively move the carriage; the Z axes moves the build plate vertically as necessary |
| Delta | A 3D printing configuration where the printing carriage is on an effector plate attached to three moving rods/beams. Examples of this include the Kossel and Rostock 3D printers |
| Direct (Drive) | An extruder configuration where the extruder motor is located directly on the carriage and feeds the filament directly into the hot end |
| Extruder | The component on the 3D printer responsible for feeding filament to the hot end (can be either bowden or direct) |
| FFF/FDM | Fused Filament Fabrication and Fused Deposition Modeling are interchangeable terms used to describe the 3D printing process where molten filament is extruded through a nozzle and built layer by layer. Note that FDM is a trademark of Stratasys, Ltd. |
| GCode | Generic term used to describe the output set of directions used to direct a 3D printer with the creation of a model |
| Hot End | The component on the 3D printer that melts the plastic filament |
| RAMPS | Short for RepRap Arduino MEGA Polulu Shield, this describes a specific configuration for an overall 3D printer setup (RepRap project, Arduino MEGA control board, with a Polulu shield (an extra board that fits on top the Arduino MEGA)) |
| SLA | Stereolithography; in this particular use, a type of 3D printer that uses either DLP projectors or lasers to cure resin layer by layer |
| STL | Stereolithography; in this particular use, a file extension. Note: STL files are not used directly to print models; they must first be sliced by a Slicer into GCode.  See also SLA, Slicer, GCode |
| Slicer | A broad term that describes the software used to output GCode (or its equivalent) to the 3D printer for execution |
| Stepper motor | The actual motors used to control movement along the axis as well as the extruders |
| Stepper motor driver | These fit on the Polulu shield and assist with the translation of instructions to pulses of electricity to provide instruction to the stepper motors |

## References
This guide was written using a combination of references and hands-on experience. Where applicable, you can find the references used in the creation of this guide here.

- Marlin on RepRapWiki - Discussion of the Marlin firmware, including its creators, advantages and benefits, etc.

## Vendors Listing
There are a lot of different vendors to choose from when it comes to 3D printing, and there’s no one correct answer as to where to best get your parts. Though I obviously favor Amazon in this guide (because I’ve been shopping through them for the better part of a decade now, and I trust them and the merchants that sell through them), there are other options available whether it be for shipping speed or item cost.

- Amazon - Enough said. Really.

- eBay - eBay has become an excellent source of all kinds of different parts, and kits for 3D printers, primarily sourced from China, though available through American resellers.

- AliExpress - An e-commerce site that, as you’d expect from a service that was created in China, specializes in many cheap (be it monetary and/or quality) clones of popular 3D printing kits available today. In addition to kits, though, you can also purchase very affordable parts and components to upgrade/modify your existing printer. The primary caveat to AliExpress is that you’ll generally be waiting longer to get your purchase since most, if not all, items are shipped out of China.

## See also
- [RAMPS Setup with Marlin Installation by Terrance Shaw](https://docs.google.com/document/d/1GN1auBFuWrcrZUy0nlAIVBInn1FZdIZd72y1IQE9Oxc/edit) following changes to this excelent guide are proposed:
  - in configuration.h change:
    - set: #define Z_MAX_POS 240 - to use the maximum A8 height
    - to enable autolevel follow the instructions as described for skynet3D

- [Prusa I3 Ramps](http://reprap.org/wiki/Prusa_i3_Rework_Electronics_and_wiring)
- [Configuration for Marlin RC8](https://lookaside.fbsbx.com/file/Marlin-RC8_for_Anet_A8.zip?token=AWxerod_qM1j6HlMsY6LlzcLDlkw9BTEQkSYxShSHgXKm02zA1lsh0TiQm7WlpkKs2K165yjmXKWF4yMT7Ds5mcGvi_7hB0JpsHJjicGVMqR9TPuTB95gxzw9aoDWdzhp2E4aQtarZJMzX8AUDB3Oze-)
