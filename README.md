# Stickerdrucker

## Run

Execute the file `start.sh` on the raspberry.
You can close Firefox with `Ctrl+q`.

## GPIO on Raspberry

GPIO pins as keyboard input.

Reference: https://blog.geggus.net/2017/01/setting-up-a-gpio-button-keyboard-on-a-raspberry-pi/

Compile a binary version and put it into the right place:
```bash
dtc -I dts -O dtb -o /boot/overlays/breadboard.dtbo breadboard.dts
```

Finally the following line must be added to /boot/config.txt:

```bash
dtoverlay=breadboard
```
