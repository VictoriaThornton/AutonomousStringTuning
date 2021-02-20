/**/
#include "StringModule.h"
#include "UI.h"
#include "DueFlashStorageHandler.h"

StringModule stringModules[1]; 
 
UI userInterface; 
DueFlashStorageHandler storage; 
enum State{INITIALIZATION = 1, SELECTION = 2, CALIBRATION = 3}; 
State state;
 
void setup() {
  state = INITIALIZATION; 
  Serial.begin(9600);
}

void loop() {

  switch(state){
    case INITIALIZATION:
      initializationState();
      state = SELECTION; 
      break;
       
    case SELECTION:
      selectionState();
      state = CALIBRATION; 
      break;
       
    case CALIBRATION:
      calibrationState(); 
      break;
       
    default: 
      break;
  }

}

/*
 * Create the necessary objects and set up the ports
 */
void initializationState(){
  Serial.println("initialization state");
  int arraySize = (sizeof(stringModules)/sizeof(stringModules[0])); 
  
  for(int i = 0; i < arraySize; i++){ 
    stringModules[i].initialize(); 
    Serial.print("String plucked?: "); 
    Serial.println(stringModules[i].stringPlucked()); 
  } 
}

/*
 * Get the tuning that the user selected
 */
void selectionState(){
  Serial.println("selection state"); 
  userInterface.getTuning(); 
}

/*
 * Do the tuning and correct the lookup table based on the photoresistor reading if needed
 */
void calibrationState(){
  Serial.println("calibration state");
  //stringModules[0].tuneString(note);  
}
