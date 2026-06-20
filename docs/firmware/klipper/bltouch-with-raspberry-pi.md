# HowTo Run BLTouch connected to RPi microcontroller
### Why?
- some printer board dont support the control signal for the bltouch, or need to remove some components. In this case you have to fiddle a little but it's possible, so why not?

### Needed
- BLTouch
- a plier or smth to remove one pin from the dupon-connector

### RaspberryPi as MCU
- setup RaspberryPi as MCU following [this guide](https://www.klipper3d.org/RPi_microcontroller.html)

### Attaching the BLTouch
- remove the red pin from the triple-connection cable and put it into a single dupont case (included in original BLTouch packaging)
- connect the pins to the [gpio pins](https://pinout.xyz/):
  - white -> GPIO0
  - black -> GND next to GPI0
  - yellow -> GPIO27
  - brown -> GND
  - red -> 3.3V
  - *Todo: Add a picture of the wires*
- you can choose whatever pins you like for control_pin, but it's easier to follow if you choose the same

### printer.cfg adjustment
- add the following to your printerconfig.cfg (also see the [config reference](https://www.klipper3d.org/Config_Reference.html#bltouch)
- 
```bash
[mcu rpi]
serial: /tmp/klipper_host_mcu

[bltouch]
sensor_pin: ^rpi:gpio0
#   Pin connected to the BLTouch sensor pin. Most BLTouch devices
#   require a pullup on the sensor pin (prefix the pin name with "^").
#   This parameter must be provided.
control_pin: rpi:gpio27
#   Pin connected to the BLTouch control pin. This parameter must be
#   provided.
z_offset: 0.2
#pin_up_touch_mode_reports_triggered: False
#probe_with_touch_mode: True 

```

### good choice for sensorpins
- you can choose between gpio0 and gpio1 for the sensorpin because it has an inbuild pullup always active
- klipper can't set pgios to pullup because of reasons
- before i found this out, here was a long description how to set pullup by a script and make sure that this script runs always.
### Testing the Probe
- follow the [official guide for testing the bltouch](https://www.klipper3d.org/BLTouch.html#initial-tests)

### Wrapping it up
- replace your endstop_pin under [stepper_z] with 
```
endstop_pin: probe:z_virtual_endstop
```

- set your correct nozzle offset following the [official guide](https://www.klipper3d.org/Probe_Calibrate.html#calibrating-probe-z-offset)
