const int potPin = A0; //potentiometer is connected to analog pin A0

void setup() {
  //initialize the serial communication:
  Serial.begin(57600);
}

void loop() {
  int potValue = analogRead(potPin);
  
  //send the potentiometer value to the computer:
  Serial.println(potValue);

  //add a delay for stability
  delay(10);
}
