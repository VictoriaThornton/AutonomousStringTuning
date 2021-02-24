/**/

#ifndef LoadCell_H_
#define LoadCell_H_

class LoadCell {
private:

public:
  void initialize(int LOADCELL_DOUT_PIN, int LOADCELL_SCK_PIN); 
  float getValue(); 
};

#endif /* LoadCell_H_ */
