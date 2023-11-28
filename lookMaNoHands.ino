#include <CapacitiveSensor.h>

//creates a CapacitiveSensor object using pins 2 and 4
CapacitiveSensor cs_2_4 = CapacitiveSensor(2, 4);

//input pin
int in = 2;

//output pin
int out = 4;

//starting state of output
int state = HIGH;    

//stores current reading from the sensor
int read;    

//previous reading from the sensor
int p = LOW;          

long currentTime = 0;

//debounce time in milliseconds
long debounce = 200;

void setup()
{
  pinMode(4, INPUT);
  pinMode(8, OUTPUT);

}

void loop()
{
  read = digitalRead(4);
  //checks for a rising edge on the sensor and debounce
  if (read == HIGH && p == LOW && (long)(millis() - currentTime) > debounce)
  {
    //toggles state if conditions are met
    if (state == HIGH)
      state = LOW;
    else
      state = HIGH;
    //updates current time
    currentTime = millis();
  }
  //sets output state based on toggled state
  digitalWrite(8, state);

  //updates previous reading
  p = read;
}