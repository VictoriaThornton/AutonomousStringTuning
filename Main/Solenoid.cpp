/**/

#include "Solenoid.h"
#include <Arduino.h>
int solenoidPin; 

  void Solenoid::initialize(int SOLENOID_PIN){
      solenoidPin = SOLENOID_PIN; 
      pinMode(solenoidPin, OUTPUT); 
  }
  
  void Solenoid::actuate(){
      digitalWrite(solenoidPin, HIGH);      //switch solenoid on
      digitalWrite(solenoidPin, LOW);       //switch solenoid off
  }
