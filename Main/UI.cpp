#include <HardwareSerial.h>

/**/

#include "UI.h"
 float userInput; 
 //float* userInput; 

  float UI::getTuning(){
        userInput = Serial.parseFloat();
        return userInput; 
  }
