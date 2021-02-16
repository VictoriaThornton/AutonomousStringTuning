/**/

#ifndef DueFlashStorageHandler_H_
#define DueFlashStorageHandler_H_

class DueFlashStorageHandler {
private:
  int* lookupPointer;

public:
  float* getLookupData(int stringModule); 
  float* writeLookupData(float* data); 

};

#endif /* DueFlashStorageHandler_H_ */
