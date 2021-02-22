/**/

#ifndef StringModule_H_
#define StringModule_H_

#include "Motor.h"
#include "LoadCell.h"
#include "Photoresistor.h"
#include "Solenoid.h"
#include "LookupTable.h"

class StringModule {
private:
    Motor motor; 
    LoadCell loadCell; 
    Photoresistor photoresistor; 
    Solenoid solenoid; 
    LookupTable lookupTable;  
  
public:
    
    enum Note{}; 
    void initialize(); 
    void tuneString(float noteFrequency); 
    void pluckString();
    void createTableData(float* noteRange, int numNotes);  
    void setTableData(float* data); 
    float* getTableData(); 
    bool stringPlucked(); 
};

#endif /* StringModule_H_ */
