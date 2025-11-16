# Stickerdrucker

## Installation

Install fnm
```bash
curl -fsSL https://fnm.vercel.app/install | bash
fnm i v24
```

Install live-server
```bash
npm i -g live-server
```

Run the website
```bash
live-server .
```

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
