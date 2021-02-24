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

int LOADCELL_DOUT_PIN = 3;  
int LOADCELL_SCK_PIN = 2;  
int SOLENOID_PIN;
int ENC_A1 = 2; 
int ENC_B1 = 3; 
int M1 = 4;  
int M2 = 5;  
 
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

  float stringNoteRange[] = {NOTE_D2, NOTE_F2, NOTE_E2}; 
  int numNotes = (sizeof(stringNoteRange)/sizeof(stringNoteRange[0]));
  stringModules[0].initialize(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN, SOLENOID_PIN, ENC_A1, ENC_B1, M1, M2);
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
  /*Commented lines for motor test below*/
  //double targetPosition = 80.2; 
  //stringModules[0].motor.adjustMotorPosition(targetPosition); 
}
