/**/

#include "LoadCell.h"
#include "HX711.h"

#define LOADCELL_DOUT_PIN  3
#define LOADCELL_SCK_PIN  2

HX711 scale;
float calibration_factor = 12000.0; //determined during calibration with a known weight on the scale
long zero_factor = 9.9; //determined experimentally

/*
 * Return the tension value from the Load Cell
 */
float getValue(){
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
  scale.set_scale();

  scale.set_scale(calibration_factor);
  return scale.get_units() + zero_factor; 
}
