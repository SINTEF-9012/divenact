A sample module for Azure IoT, using colors to differentiate versions.

# Install LED to RPi

We use KY-016. Follow this [tutorial](https://iotguider.in/raspberrypi/rgb-3-color-led-module-ky-016-in-raspberry-pi/) for the circuit. In short, R, G, B to GPIO 17, 27, 22, respectively, and - to GND.

# Build image (optional)

```bash sudo docker buid -t <tag> .```

Or, use songhui/color-led:[red|green|blue], from docker hub

# Turn it on

```bash sudo docker run --rm --privileged=true songhui/color-led:red```
