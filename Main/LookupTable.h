/**/

#ifndef LookupTable_H_
#define LookupTable_H_

class LookupTable {
private:
  float* lookupData; 

public: 
  //void createLookupTable(Note startingNote, Note endingNote);
  void setLookupTable(float* data);
  //float getLookupTension(Note note);
  float* getLookupTableData();
  //void adjustLookupTable(Note note, float val); 

};

#endif /* LookupTable_H_ */
