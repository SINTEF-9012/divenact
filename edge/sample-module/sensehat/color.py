from sense_hat import SenseHat
from time import sleep

sense = SenseHat()
RED = (255, 0, 0)
GREEN = (0, 255, 0)
BLUE = (0, 0, 255)

while True:
  sense.clear(RED)
  sleep(1)
