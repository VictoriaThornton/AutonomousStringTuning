/**/

#ifndef Motor_H_
#define Motor_H_

class Motor {
private:
  float p; 
  float i; 
  float d; 
  
public:
  bool adjustMotorPosition(float actual, float target); 
  void zeroEncoder(); 

};

#endif /* Motor_H_ */
