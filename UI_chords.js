var dropdownState = "collapsed";
var chosenNotes;
var MotorState = 'off'; 

var chordType = 1; //minor by default 
var chordRoot = 0; //C by default

function init() {

  include('dev.js');
  radioSelect(1); //default radio selection = minor chord
  //startDevice(); 

  //keypresses to actuate solenoids
  window.onkeypress = function (event) {
    var key = event.key;
    switch (key) {
      case '1':
        actuateSolenoid(1);
        console.log("actuate string 1 solenoid");
        break;

      case '2':
        actuateSolenoid(2);
        console.log("actuate string 2 solenoid");
        break;

      case '3':
        actuateSolenoid(3);
        console.log("actuate string 3 solenoid");
        break;

      case '4':
        actuateSolenoid(4);
        console.log("actuate string 4 solenoid");
        break;

      case '5':
        actuateSolenoid(5);
        console.log("actuate string 5 solenoid");
        break;

      case '6': case 'a': case 'A':
        actuateSolenoid(6);
        console.log("actuate all solenoids");
        break;

      case 's': case 'S':
        //shortcut to switch tabs
        switchTuningMode();
        break;
    }
  }
}
//passes in the text from the dropdown upon user selection and selects the chord root
function dropdownSelection(chord, chordRootNumber) {
  document.getElementById("first-drop-down-box-text").innerHTML = chord;
  toggleDropdownDisplay();
  chordRoot = chordRootNumber; 
}

function include(file) {

  var script = document.createElement('script');
  script.src = file;
  script.type = 'text/javascript';
  script.defer = true;

  document.getElementsByTagName('head').item(0).appendChild(script);

}

function dropdownTextHighlight(dropdownBoxId, state) {
  if (state == 'over') {
    document.getElementById("drop-down-" + dropdownBoxId).style.fill = '#1AC1B7';
  }
  if (state == 'out') {
    document.getElementById("drop-down-" + dropdownBoxId).style.fill = '#fafae4';
  }


}
//saves the chordType and changes the appearance of the radio buttons
function radioSelect(buttonNumber) {
  //reset cursor selections for current string
  var radioButtons = document.getElementsByClassName("radio");
  for (var i = 0; i < radioButtons.length; i++) {
    radioButtons[i].style.opacity = 0;
  }

  document.getElementById("radioButton" + buttonNumber).style.opacity = 100;
  //from 0 to 4
  //major, minor, diminished, augmented, dominant seventh
  chordType = buttonNumber;
}

//switch to the custom tuning mode
function switchTuningMode() {
  window.location.href = "UI_custom.html";
}

//hit the slider switch to turn the motors on and off
function toggleMotorControlSwitch(previousState) {
  if (previousState == 'off') {
    document.getElementById("motorControlButtonBackgroundOn").style.display = 'block';
    document.getElementById("motorControlButtonOn").style.display = 'block';
    MotorState = 'on';
    startAllMotors();
  }
  if (previousState == 'on') {
    document.getElementById("motorControlButtonBackgroundOn").style.display = 'none';
    document.getElementById("motorControlButtonOn").style.display = 'none';
    MotorState = 'off';
    stopAll();
  }

  console.log("MOTOR STATE: ", MotorState);
}

function startAllMotors() {
  startMotor(1);
  startMotor(2);
  startMotor(3);
  startMotor(4);
  startMotor(5);
}

function selectTuningButtonPressed() {
  document.getElementById("play-button").style.display = "none";
  document.getElementById("play-button-pressed").style.display = "block";
  //button animation
  document.getElementById("play-button-pressed").className += " button-pressed";

  //send chord tuning over socket to Arduino
  sendChord(parseInt(chordRoot), parseInt(chordType));
}

//when the system has finished tuning, reset button to allow press again
function finishedTuning() {
  document.getElementById("play-button").style.display = "block";
  document.getElementById("play-button-pressed").style.display = "none";
}

//make the dropdown close and expand
function toggleDropdownDisplay() {
  var elements = document.getElementsByClassName("expand");

  if (dropdownState == "collapsed") {
    var elements = document.getElementsByClassName("expand");
    for (var i = 0; i < elements.length; i += 1) {
      elements[i].style.opacity = 100;
      elements[i].style.display = "block";
    }
    dropdownState = "expanded";
    return;
  }

  if (dropdownState == "expanded") {
    for (var i = 0; i < elements.length; i += 1) {
      elements[i].style.opacity = 0;
      elements[i].style.display = "none";
    }
    dropdownState = "collapsed";
    return;
  }
}


//actuate the solenoid using keypresses for the different strings.
//1, 2, 3, 4, 5 to correspond to the different strings.
//channel 6 corresponds to striking all of the strings at once
function actuateSolenoid(stringNumber) {
  // if (midiOutput) {
  //     midiOutput.stopNote(10, stringNumber, { duration: 100, velocity: 0.5 });
  // } else {
  //     console.log(
  //       "Looks like there is no MIDI output device. Check if your Arduino is connected."
  //     );
  //   }
  actuate(stringNumber);
}

// WebMidi.enable(function (err) {
//   if (err) {
//     console.log("WebMidi could not be enabled.", err);
//   }

//   // Print available MIDI outputs
//   for (let i = 0; i < WebMidi.outputs.length; i++) {
//     console.log(WebMidi.outputs[i].name);
//   }

//   // From the list on the console, pick an output name:
//   midiOutput = WebMidi.getOutputByName("Arduino Due");
// });
