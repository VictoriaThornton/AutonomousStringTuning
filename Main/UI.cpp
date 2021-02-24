/**/

#include "UI.h"
#include <HardwareSerial.h>
#include <Arduino.h>

 float userInput; 
 //float* userInput; 

  float UI::getTuning(){
        userInput = Serial.parseFloat();
        return userInput; 
  }
