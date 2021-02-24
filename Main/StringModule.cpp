/**/

#include "StringModule.h"
#include <HardwareSerial.h>

    void StringModule::initialize(int LOADCELL_DOUT_PIN, int LOADCELL_SCK_PIN, int SOLENOID_PIN, int ENC_A1, int ENC_B1, int M1, int M2){
      //get the ports for the motors, solenoid, photoresistor, load cell
      loadCell.initialize(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
      solenoid.initialize(SOLENOID_PIN);
      motor.initialize(ENC_A1, ENC_B1, M1, M2);   
    }
    
    void StringModule::tuneString(float noteFrequency){ 
      //motor move to load cell value
      //motor move to photoresistor value
      //lookupTable.adjustLookupTable(); 
    } 
    
    void StringModule::pluckString(){
      solenoid.actuate(); 
    }

    void StringModule::createTableData(float* noteRange, int numNotes){
      lookupTable.createLookupTable(noteRange, numNotes);   
    } 
     
    void StringModule::setTableData(float* data){
  
    }
     
    float* StringModule::getTableData(){
      
    }
     
    bool StringModule::stringPlucked(){
      return false; 
    } 
