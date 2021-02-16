/**/

#ifndef LookupTable_H_
#define LookupTable_H_
#include "StringModule.h"

class LookupTable {
private:
  float* lookupTable; 

public:
  //void createLookupTable(StringModule::Note startingNote, StringModule::Note endingNote);
  void setLookupTable(float* data);
  //float getLookupTension(StringModule::Note note);
  float* getLookupTableData();
  //void adjustLookupTable(StringModule::Note note, float val); 

};

#endif /* LookupTable_H_ */
