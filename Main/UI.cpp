/**/

#include "UI.h"
#include <Arduino.h>
#include <MIDIUSB.h>
#include <pitchToFrequency.h>

float userInput;
//float* userInput;

float UI::getTuning() {
  userInput = Serial.parseFloat();
  return userInput;
}

const char* pitch_name(byte pitch) {
  static const char* names[] = {"C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"};
  return names[pitch % 12];
}

int pitch_octave(byte pitch) {
  return (pitch / 12) - 1;
}

void noteOn(byte channel, byte pitch, byte velocity) {
  //digitalWrite(LED_BUILTIN, HIGH);

  Serial.print("Note On: ");
  Serial.print(pitch_name(pitch));
  Serial.print(pitch_octave(pitch));
  Serial.print(", channel=");
  Serial.print(channel);
  Serial.print(", velocity=");
  Serial.println(velocity);
  Serial.println("Note =  ");
  Serial.println(pitchFrequency[pitch]);
  userInput = pitchFrequency[pitch]; 
}

void noteOff(byte channel, byte pitch, byte velocity) {
  //digitalWrite(LED_BUILTIN, LOW);

  Serial.print("Note Off: ");
  Serial.print(pitch_name(pitch));
  Serial.print(pitch_octave(pitch));
  Serial.print(", channel=");
  Serial.print(channel);
  Serial.print(", velocity=");
  Serial.println(velocity);
  userInput = pitchFrequency[pitch]; 
}

float UI::getMidiInput() {
//  pinMode(LED_BUILTIN, OUTPUT);
//  Serial.begin(115200);
  midiEventPacket_t rx = MidiUSB.read();
  switch (rx.header) {
    case 0:
      return -1; 
      break; //No pending events

    case 0x9:
      noteOn(
        rx.byte1 & 0xF,  //channel
        rx.byte2,        //pitch
        rx.byte3         //velocity
      );
      return userInput; 
      break;

    case 0x8:
      noteOff(
        rx.byte1 & 0xF,  //channel
        rx.byte2,        //pitch
        rx.byte3         //velocity
      );
      return userInput; 
      break;

    default:
      Serial.print("Unhandled MIDI message: ");
      Serial.print(rx.header, HEX);
      Serial.print("-");
      Serial.print(rx.byte1, HEX);
      Serial.print("-");
      Serial.print(rx.byte2, HEX);
      Serial.print("-");
      Serial.println(rx.byte3, HEX);
      return -1; 
  }
}
