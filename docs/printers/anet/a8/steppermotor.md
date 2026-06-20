# Stepper Motor
The stepper motors used in Anet A8 (as bought in may 2018) are NEMA 17 42SHDC3025-24B. Here is [link to the official shop](https://shop.anet3d.com/collections/electronic-accessories/products/42-stepper-motor).

The 42SHDC3025-24B motor specs are : 

- Stepper Motor 42SHDC3025-24B
- Rated Power 14W
- Rated Voltage   3.96V
- Rated Current   0.9A
- Rated Speed 1000rpm
- Rated Torque    0.34NM
- Holding Torque  0.4N.M
- Step Angle  1.8°
- Step Angle Accuracy ±5%
- Phase   2
- Resistance  4.4Ω±10%
- Temperature Rise    80K Max
- Ambient Temperature -20℃~+50℃
- Ambient Humidity    90% Max
- Insulation Resistance   100 MΩ Min. ,500VDC
- Size    42*42*40(mm)
- Weight  280g

----
The stepper motors used in earlier Anet A8-B (as bought in May 2016) are NEMA 17 SL42STH40-1684A produced by Guangzhou Shenglong Motor Co., Ltd. Here is the [link to official shop](https://gzslmotor.en.alibaba.com/product/60354414477-802134067/NEMA_17_STEPPER_MOTOR_1_68A_12V_24V_42_42_40mm_3D_printer_motor.html), includes motor specs.

The SL42STH40-1684A motor specs are:

- Step Angle: 1.8° 
- Step Angle Accuracy: ±5 % (full step, no load)
- Voltage: 2.8 V
- Current per phase: 1.68 A
- Resistance per phase: 1.65 Ω
- Resistance accuracy: ±10 %
- Inductance per phase: 3.2 mH
- Inductance accuracy: ±20 %
- Holding torque: 3.6 kg·cm (0.4 N·m)
- Moment of inertia: 54 g/cm^2
- Weight: 0.28 kg
- Orientation torque: 150 g/cm
- Length: 40 mm
- Temperature rise: 80 °C max (rated current, 2 phases on)
- Ambient temperature: -20 °C ~ +50 °C
- Insulation resistance: 100 MΩ min, 500 VDC
- Shaft radial play: 0.02 mm max (450 g load)
- Shaft axial play: 0.08 mm max (450 g load)
- Max. radial force: 28 N (20 mm from the flange)
- Max. axial force: 10 N

----
Here is the old text:

The anet A8 uses Nema17 size stepper motors generic information about these motors can be found [here](http://reprap.org/wiki/NEMA_17_Stepper_motor).
Unfortunately there it is not clear which manufacturer this stepper came from. Therefore the mechanical and electrical parameters are missing. Based on user experience the following data has been collected.

Current:

| current | voltageDRV8825 | Result |
|---|---|---|
| 1.4 A | 0.75 V | working for x,y and z axis |
| 1.6 A | 0.8 V | working for extruder |
| 2 A | 1.0 V | working but motor got so hot that acrylic support deformed |
