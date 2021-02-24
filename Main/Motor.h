/**/

#ifndef Motor_H_
#define Motor_H_

class Motor {
private:

  long temp, timecount = 0; 
  int inbyte; 
  int M1;     // PWM outputs to L298N H-Bridge motor
  int M2;  
 
  
public:
  void initialize(int ENC_A1, int ENC_B1, int M1, int M2);
  //bool adjustMotorPosition(float actual, float target);    
  bool adjustMotorPosition(double target); 
  void zeroEncoder(); 
  void pwmOut(int out); 
  //static void encoder(); 

};

#endif /* Motor_H_ */
