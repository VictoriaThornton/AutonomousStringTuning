/**/

#include "Motor.h"
#include <PID_v1.h>
#include <Arduino.h>

#define ENC             64                      //CPR Encoder value
#define GEAR            18.75                   //Motor gear ratio

  double kp = 30, ki = 20, kd = 0; // modify for optimal performance
  double input = 0, output = 0, setpoint = 0, angle, inangle; 
  PID myPID(&input, &output, &setpoint, kp, ki, kd, DIRECT);
  int encA1;  // Quadrature encoder A pin
  int encB1;  // Quadrature encoder B pin

  volatile long encoderPos = 0;

  char buffer[] = {' ',' ',' ',' ',' ',' ',' '}; 

    void encoder()  {                                     // pulse and direction, direct port reading to save cycles
    //  if (PINB & 0b00000001)    encoderPos++;             // if(digitalRead(encB1)==HIGH)   count ++;
    if(digitalRead(encB1)==HIGH)    encoderPos++;
    else{
      encoderPos--;  
    }                                 
    //  if(digitalRead(encB1)==LOW)   encoderPos --;
  }

  void Motor::initialize(int ENC_A1, int ENC_B1, int M1, int M2){
    encA1 = ENC_A1; 
    encB1 = ENC_B1; 
    Motor::M1 = M1; 
    Motor::M2 = M2; 

    pinMode(encA1, INPUT);                  // quadrature encoder input A
    pinMode(encB1, INPUT);                  // quadrature encoder input B

    attachInterrupt(encA1, encoder, FALLING);               // update encoder position

    myPID.SetMode(AUTOMATIC);
    myPID.SetSampleTime(1);
    myPID.SetOutputLimits(-255,255);          //-255, 255
    Serial.begin (115200);                              // for debugging
    Serial.println("Time,Input Angle,Setpoint,EncoderPos,Output Angle,"); //Time,
  }   

  bool Motor::adjustMotorPosition(double target){
      //  setpoint = analogRead(A0)*10;                       // modify to fit motor and encoder characteristics, potmeter connected to A0

      /*
      if (Serial.available()>0) 
      {
        buffer[0] = ' ';buffer[1] = ' ';buffer[2] = ' ';buffer[3] = ' ';buffer[4] = ' ';buffer[5] = ' ';buffer[6] = ' ';buffer[7] = ' ';
        Serial.readBytesUntil('\n', buffer, 7);
      }
      
      else setpoint = target; 
      */
    setpoint = target;

    inangle = setpoint*360/(ENC*GEAR);
    input = encoderPos ;                                // data from encoder
    angle = encoderPos*360/(ENC*GEAR);
    
    myPID.Compute();                                    // calculate new output
    pwmOut(output);                                     // drive L298N H-Bridge module

  //  Serial.print("Min:-2000,Max:226,");
    Serial.print(millis());
    Serial.print(",");
    Serial.print(inangle);
    Serial.print(",");
    Serial.print(setpoint);
    Serial.print(",");
    Serial.print(encoderPos);
    Serial.print(",");
    Serial.print(angle);
    Serial.println(",");
  }
  
  void Motor::zeroEncoder(){
    
  } 

  void Motor::pwmOut(int out) {                                // to H-Bridge board
    if (out > 0) {
      analogWrite(M1, out);                             // drive motor CW
      analogWrite(M2, 0);
    }
    else {
      analogWrite(M1, 0);
      analogWrite(M2, abs(out));                        // drive motor CCW
    }
  }
