/**/

#include "StringModule.h"
#include <HardwareSerial.h>

    void StringModule::initialize(){
      //get the ports for the motors, solenoid, photoresistor, load cell
     
    }
    
    void StringModule::tuneString(float noteFrequency){ 
      //motor move to load cell value
      //motor move to photoresistor value
      //correctedArray[noteFrequency] = newTension; 
      //setTableData(correctedArray);  
    } 
    
    void StringModule::pluckString(){
      solenoid.actuate(); 
    }
     
    void StringModule::setTableData(float* data){
  
    }
     
    float* StringModule::getTableData(){
      
    }
     
    bool StringModule::stringPlucked(){
      return false; 
    } 
