/**/

#ifndef LookupTable_H_
#define LookupTable_H_

class LookupTable {
private: 
  float unitWeight = 0.000234279; 
  float scaleLength = 25.5;
  float tension = 0; 
  
public:
  //void createLookupTable(float startingNote, float endingNote);
  void createLookupTable(float* noteRange, int numNotes);
  void setLookupTable(float* data);
  float getLookupTension(float note);
  float* getLookupTableData();
  void adjustLookupTable(float note, float val);
  float calculateTension(float note); 

};

#endif /* LookupTable_H_ */
