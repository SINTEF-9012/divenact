from sense_hat import SenseHat
import sys
sense = SenseHat()

while True:
  sense.show_message(sys.argv[1])
