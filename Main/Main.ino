/**/
#include "StringModule.h"
#include "UI.h"
#include "DueFlashStorageHandler.h"

#define TONE_PITCH 440
#include <Pitch.h>

StringModule stringModules[1]; 
 
UI userInterface; 
DueFlashStorageHandler storage; 
enum State{INITIALIZATION = 1, SELECTION = 2, CALIBRATION = 3}; 
State state;
float userTuning; 
 
void setup() {
  state = INITIALIZATION; 
  Serial.begin(9600);
}

void loop() {

  switch(state){
    case INITIALIZATION:
      initializationState(); 
      break;
       
    case SELECTION:
      selectionState(); 
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

  float stringNoteRange[] = {NOTE_D2}; 
  int numNotes = (sizeof(stringNoteRange)/sizeof(stringNoteRange[0]));
  stringModules[0].initialize();
  stringModules[0].createTableData(stringNoteRange, numNotes); //create the lookup table for the string module  

  state = SELECTION;
  Serial.println("Type in a frequency: ");  
}

/*
 * Get the tuning that the user selected
 */
void selectionState(){

  if(Serial.available()){
    userTuning = userInterface.getTuning();
    Serial.println("You typed: "); 
    Serial.println(userTuning); 
    state = CALIBRATION; 
  }
  
}

/*
 * Do the tuning and correct the lookup table based on the photoresistor reading if needed
 */
void calibrationState(){
  Serial.println("calibration state");
  stringModules[0].tuneString(userTuning); 
}
