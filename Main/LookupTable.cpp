#include <ArxContainer.h>
#include <HardwareSerial.h>

/**/

#include "LookupTable.h"

arx::map<float, float> lookupData; //<frequency, tension> 

/*
 * create lookup table by calculating the tensions for the notes defined in the noteRange
 */
void LookupTable::createLookupTable(float* noteRange, int numNotes) {
  float note;  
  
  for (int i = 0; i < numNotes; i++){
    note = *noteRange++; 
    lookupData.insert(note,calculateTension(note));  
    Serial.println("Added to lookup table: (note, tension)"); 
    Serial.println(note);
    Serial.println(calculateTension(note));
  }

}

void LookupTable::setLookupTable(float* data) {

}

float LookupTable::getLookupTension(float note) {

}

float* LookupTable::getLookupTableData() {

}

void LookupTable::adjustLookupTable(float note, float val) {

}

/*
 * calculate tension for a frequency using the D'addario tension equation
 */
float LookupTable::calculateTension(float frequency){
  tension = (unitWeight * pow((2.0 * scaleLength * frequency),2.0))/386.4; 
  return tension;   
}
