/**/

#ifndef LookupTable_H_
#define LookupTable_H_

class LookupTable {
private:
  float* lookupData; 

public: 
  void createLookupTable(float startingNote, float endingNote);
  void setLookupTable(float* data);
  float getLookupTension(float note);
  float* getLookupTableData();
  void adjustLookupTable(float note, float val); 

};

#endif /* LookupTable_H_ */
