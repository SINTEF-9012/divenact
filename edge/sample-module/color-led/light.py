import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
RUNNING = True
green, red, blue = (27, 22, 17)
GPIO.setup(red, GPIO.OUT)
GPIO.setup(green, GPIO.OUT)
GPIO.setup(blue, GPIO.OUT)
Freq = 100
INT = 0.2

RED = GPIO.PWM(red, Freq)
GREEN = GPIO.PWM(green, Freq)
BLUE = GPIO.PWM(blue, Freq)

try:
  while RUNNING:
    RED.start(1)
    GREEN.start(1)
    BLUE.start(100)
    time.sleep(INT)
    #RED.start(1)
    #GREEN.start(1)
    #BLUE.start(1)
    time.sleep(INT)
except KeyboardInterrupt:
  RUNNING = False
  GPIO.clean()

