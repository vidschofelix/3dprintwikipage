# HowTo Setup and Flash Klipper on Anet ET4/Pro/X
## Tools needed
- RaspberryPi
- ST-Link V2
 
## Raspberry Setup
- for the ease of sake, get the [MainSailOS](https://docs.mainsail.xyz/setup/mainsail-os) Raspberry Pi image
- Flash it to the SD, for example with the [Raspberry Pi Imager](https://www.raspberrypi.com/software/)
- boot raspberry
- connect to http:*mainsail.local or the http:*ip address of your pi and access the mainsail website
- update everything

## printer config
- in machine -> config files add printer.cfg and open it
- paste:
  *
```bash
# This file contains common pin mappings for the Anet ET4 printer for klipper.

[stepper_x]
step_pin: PB6
dir_pin: !PB5
enable_pin: !PB7
rotation_distance: 40
microsteps: 16
endstop_pin: ^!PC13
position_min: -3
position_endstop: -3
position_max: 220
homing_speed: 50

[stepper_y]
step_pin: PB3
dir_pin: PD6
enable_pin: !PB4
rotation_distance: 40
microsteps: 16
endstop_pin: ^!PE12
position_min: -8
position_endstop: -8
position_max: 220
homing_speed: 50

[stepper_z]
step_pin: PA12
dir_pin: !PA11
enable_pin: !PA15
rotation_distance: 8
microsteps: 16
endstop_pin: ^!PE11
position_endstop: 250
position_max: 250
homing_speed: 12
second_homing_speed: 5

[extruder]
step_pin: PB9
dir_pin: PB8
enable_pin: !PE0
full_steps_per_rotation: 200
gear_ratio: 3:1
rotation_distance: 23.132
microsteps: 16
nozzle_diameter: 0.400
filament_diameter: 1.750
heater_pin: PA0 # END_CONTROL
sensor_pin:  PA1 # TEMP_EXB1
sensor_type: EPCOS 100K B57560G104F
control: pid
pid_Kp: 20.375
pid_Ki: 0.844
pid_Kd: 123.016
min_temp: 0
max_temp: 250

[heater_bed]
heater_pin: PE2 # BED_CONTROL
sensor_pin: PA4 # TEMP_BED
sensor_type: EPCOS 100K B57560G104F
control: pid
pid_Kp: 70.721
pid_Ki: 1.981
pid_Kd: 631.118
min_temp: 0
max_temp: 125

[fan]
pin: PE3 # LAY_FAN

[heater_fan fan1]
pin: PE1 # END_FAN

[mcu]
baud: 115200
serial: /dev/serial/by-id/usb-1a86_USB2.0-Serial-if00-port0
restart_method: command

[printer]
kinematics: cartesian
max_velocity: 500
max_accel: 3000
max_z_velocity: 12
max_z_accel: 50

[pause_resume]

[filament_switch_sensor filament_sensor]
switch_pin: PA2 # MAT_DET
pause_on_runout: True

# The printer ships without a probe, but the wiring loom is
# already prepared for one

[probe]
pin: !PC3 # LV_DET
z_offset: 0.2

########################################
# EXP1 / EXP2 (display) pins
########################################

[board_pins]
aliases:
#   P1 header
    P1_1=PD7, P1_3=PB2, P1_5=PE4, P1_7=PB1, P1_9=<GND>,
    P1_2=PD5, P1_4=PE5, P1_6=PB0, P1_8=PD4, P1_10=<3V3>,
#   P2 header
    P2_1= PE6, P2_3=PD15, P2_5=PD1, P2_7=PE8, P2_9=PE10,
    P2_2=PD13, P2_4=PD14, P2_6=PD0, P2_8=PE7, P2_10=PE9

[virtual_sdcard]
path: /home/pi/gcode_files

[pause_resume]

[display_status]

[screws_tilt_adjust]
screw1: 10, 10
screw1_name: front left screw
screw2: 10, 210
screw2_name: rear left screw
screw3: 210, 210
screw3_name: rear right screw
screw4: 210, 10
screw4_name: front right screw
horizontal_move_z: 10.
speed: 50.
screw_thread: CW-M3

[gcode_macro CANCEL_PRINT]
rename_existing: BASE_CANCEL_PRINT
gcode:
    TURN_OFF_HEATERS
    CLEAR_PAUSE
    SDCARD_RESET_FILE
    BASE_CANCEL_PRINT

[gcode_macro PAUSE]
rename_existing: BASE_PAUSE
# change this if you need more or less extrusion
variable_extrude: 1.0
gcode:
    ##### read E from pause macro #####
    {% set E = printer["gcode_macro PAUSE"].extrude|float %}
    ##### set park positon for x and y #####
    # default is your max posion from your printer.cfg
    {% set x_park = printer.toolhead.axis_maximum.x|float - 5.0 %}
    {% set y_park = printer.toolhead.axis_maximum.y|float - 5.0 %}
    ##### calculate save lift position #####
    {% set max_z = printer.toolhead.axis_maximum.z|float %}
    {% set act_z = printer.toolhead.position.z|float %}
    {% if act_z < (max_z - 2.0) %}
        {% set z_safe = 2.0 %}
    {% else %}
        {% set z_safe = max_z - act_z %}
    {% endif %}
    ##### end of definitions #####
    SAVE_GCODE_STATE NAME=PAUSE_state
    BASE_PAUSE
    G91
    G1 E-{E} F2100
    G1 Z{z_safe} F900
    G90
    G1 X{x_park} Y{y_park} F6000
  
[gcode_macro RESUME]
rename_existing: BASE_RESUME
gcode:
    ##### read E from pause macro #####
    {% set E = printer["gcode_macro PAUSE"].extrude|float %}
    ##### end of definitions #####
    G91
    G1 E{E} F2100
    RESTORE_GCODE_STATE NAME=PAUSE_state
    BASE_RESUME

```

(based on [PHeNNeT FiLM](https://phennet-film.blogspot.com/2021/05/anet-et4-printercfg-this-setting-i-dont.html))
- save & close

## building the firmware
- *note: i wasnt able to make this with openblt work, but i will update if i find a way*
- ssh into raspberry (use MobaXterm, it has an inbuild sftp client to pull the firmware)
- 
```
cd klipper
make menuconfig
```

- choose settings:
- 
```
[*] Enable extra low-level configuration options
Micro-controller Architecture (STMicroelectronics STM32)
Processor model (STM32F407)
Bootloader offset (No bootloader)  --->
Clock Reference (8 MHz crystal)  --->
Communication interface (Serial (on USART1 PA10/PA9))  --->
(112500) Baud rate for serial port
()  GPIO pins to set at micro-controller startup

```

- type Q to exit, verify with Y
- 
```
make
```

- after its finished copy firmware.bin from /home/pi/klipper/out/ to your pc (via MobaXterm, Filezilla(port 22) or WinSCP)

## Flashing the Firmware
- attach your ST-Link to the printer
- run STM32 ST-Link Utility
- Target -> Connect
- backup your bootloader if you are coming from stock
  - select adress 0x08000000
  - left click Device Memory @ 0x08000000 -> Save to file -> original_bootloader.bin
- Target -> Program
  - Start Adress: 0x08000000
  - Filepath: your klipper.bin
  - Start
- if you have problems connecting ST-Link after the successful flash, lower your Connection Frequency in Target -> Settings
- Thats it. Restart your printer and click firmware restart in mainsail
