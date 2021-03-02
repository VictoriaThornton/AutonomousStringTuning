/*
EncA - 5
EncB - 4
green - ecn gnd
blue - enc vcc
purple - mc 7
gray - mc 6



/**/

//#include "Motor.h"
#include <PID_v1.h>
#include <Arduino.h>
#include "HX711.h"

HX711 scale;
float calibration_factor = 12000.0; //determined during calibration with a known weight on the scale
float zero_factor = 13.3; //determined experimentally

#define LOADCELL_DOUT_PIN 3
#define LOADCELL_SCK_PIN 2


#define ENC             64                      //CPR Encoder value
#define GEAR            18.75                   //Motor gear ratio

#define ENCA 5
#define ENCB 4
#define MCP 7
#define MCG 6

int M1, M2;
int inbyte;
long temp, timecount = 0;
double kp = 2.5, ki = 2, kd = 0; // modify for optimal performance
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

  void init(int ENC_A1, int ENC_B1, int m1, int m2){
    encA1 = ENC_A1; 
    encB1 = ENC_B1; 
    M1 = m1; 
    M2 = m2; 

    pinMode(encA1, INPUT);                  // quadrature encoder input A
    pinMode(encB1, INPUT);                  // quadrature encoder input B

    attachInterrupt(encA1, encoder, FALLING);               // update encoder position

    myPID.SetMode(AUTOMATIC);
    myPID.SetSampleTime(1);
    myPID.SetOutputLimits(-255,255);          //-255, 255
    Serial.begin (9600);                              // for debugging
    Serial.println("Time,Input Angle,Setpoint,EncoderPos,Output Angle,"); //Time,
  }   

  bool adjustMotorPosition(double target){
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
    Serial.print(",INANGLE:");
    Serial.print(inangle);
    Serial.print(",SETPOINT:");
    Serial.print(setpoint);
    Serial.print(",EPOS:");
    Serial.print(encoderPos);
    Serial.print(",ANGLE:");
    Serial.print(angle);
    Serial.print(",OUTPUT:");
    Serial.println(output);
  }
  
  void zeroEncoder(){
    
  } 
  bool noRun = true;
  void pwmOut(int out) {                                // to H-Bridge board
    if(!noRun) {
      if (out > 0) {
        analogWrite(M1, out);                             // drive motor CW
        analogWrite(M2, 0);
      }
      else {
        analogWrite(M1, 0);
        analogWrite(M2, abs(out));                        // drive motor CCW
      }
    } else {
      analogWrite(M1, 0);
      analogWrite(M2, 0);
    }
  }
void setup() {
  Serial.begin(9600);
  init(ENCA, ENCB, MCG, MCP);
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
   scale.set_scale(); 
}
int val = 5;
void loop() {
  // put your main code here, to run repeatedly:
  
adjustMotorPosition(val);
scale.set_scale(calibration_factor);
Serial.print("LOADCELL: ");
    Serial.println(scale.get_units() + zero_factor);
if(Serial.available() > 0) {
  String in = Serial.readStringUntil('\n');
 // char cmd =
  if(in.startsWith("y")) {
    noRun = false;
    Serial.println("Enable");
  }  else if(in.startsWith("n")) {
    noRun = true;
    Serial.println("Disable");
  } else if(in.startsWith("s")) {
    val = in.substring(2).toInt();
    }
  }
}
