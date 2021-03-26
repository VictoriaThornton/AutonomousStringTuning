var dropdownState = "expanded";
var chosenNotes;

//defined chords
var chordA = ["A", "E", "A", "C#", "E"];
var chordAm = ["A", "E", "A", "C", "E"];
var chordB = ["B", "F#", "B", "D#", "F#"];
var chordBm = ["B", "F#", "B", "D", "F#"];
var chordC = ["C", "E", "G", "C", "E"];
var chordCm = ["A#", "E", "G", "C", "E"];
var chordD = ["x", "D", "A", "D", "F#"];
var chordDm = ["x", "D", "A", "D", "F"];
var chordE = ["B", "E", "G#", "B", "E"];
var chordEm = ["B", "E", "G", "B", "E"];
var chordF = ["C", "G", "A", "C", "F"];
var chordFm = ["C", "G", "G#", "C", "F"];
var chordG = ["B", "D", "G", "B", "G"];
var chordGm = ["C", "F", "G#", "B", "F"];

function init() {
  toggleDropdownDisplay();
  selectMode("custom");
  chosenNotes = [0, 2, 4, 7, 6]; //default note values;
  clearCursors();
  document.getElementById("string1note1").style.opacity = 100;
  document.getElementById("string2note3").style.opacity = 100;
  document.getElementById("string3note5").style.opacity = 100;
  document.getElementById("string4note8").style.opacity = 100;
  document.getElementById("string5note7").style.opacity = 100;

    //keypresses to actuate solenoids
    window.onkeypress = function(event){
        var key = event.key; 
        switch(key){
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
        }
    }
}

function selectNote(note, string) {
    //add the notes chosen by the user to an array
    chosenNotes[string - 1] = note; //note starts from zero here to match 0 to 12 note scale; string numbers start from 1
    clearStringCursors(string);
    var displayNote = note + 1; //note + 1 corresponds how the note is displayed on the UI. N1 instead of N0
    console.log("Selected note ", displayNote, "String:  ", string);
    document.getElementById("string" + string + "note" + displayNote).style.opacity = 100; //make the cursor appear selected
    document.getElementById("string" + string + "noteLabel" + displayNote).style.fontSize = "24px"; //enlarge selected note text
}

//preset chord configurations
function chords() {}

function clearStringCursors(string) {
  //reset cursor selections for current string
  var cursors = document.getElementsByClassName("cursor-" + string);
  for (var i = 0; i < cursors.length; i++) {
    cursors[i].style.opacity = 0;
  }

  //reset text sizes for current string
  var noteLabels = document.getElementsByClassName("label-" + string);
  for (var i = 0; i < noteLabels.length; i++) {
    noteLabels[i].style.fontSize = "18px";
  }
}

function clearCursors() {
  //add in clear options for rest of strings
  var cursors = document.getElementsByClassName("cursor");
  for (var i = 0; i < cursors.length; i++) {
    cursors[i].style.opacity = 0;
  }
}

function selectTuningButtonPressed() {
  document.getElementById("play-button").style.display = "none";
  document.getElementById("play-button-pressed").style.display = "block";
  //button animation
  document.getElementById("play-button-pressed").className += " button-pressed";

  //send MIDI tuning to Arduino
  for (var i = 0; i < chosenNotes.length; i++) {
    var stringNumber = i + 1;
    var note = chosenNotes[i];
    var displayNote = note + 1;
    console.log("Selected Note: ",displayNote,"for String number ",stringNumber);
    
    if (midiOutput) {
      midiOutput.playNote(note, stringNumber, { duration: 100, velocity: 0.5 });
    } else {
      console.log(
        "Looks like there is no MIDI output device. Check if your Arduino is connected."
      );
    }
  }
}

//when the system has finished tuning, reset button to allow press again
function finishedTuning() {
  document.getElementById("play-button").style.display = "block";
  document.getElementById("play-button-pressed").style.display = "none";
}

function selectMode(type) {
  if (type == "chord") {
    document.getElementById("chordRadioButton").style.opacity = 100;
    document.getElementById("customRadioButton").style.opacity = 0;
  }
  if (type == "custom") {
    document.getElementById("chordRadioButton").style.opacity = 0;
    document.getElementById("customRadioButton").style.opacity = 100;
  }
}

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

//allow selection of chords
function dropdownSelection(selection) {
  document.getElementById("first-drop-down-box-text").innerHTML = selection;
  toggleDropdownDisplay();
}

//actuate the solenoid using keypresses for the different strings.
//1, 2, 3, 4, 5 to correspond to the different strings. Sends noteOff signals where the channel numbers correspond to the string number
//channel 6 corresponds to striking all of the strings at once
function actuateSolenoid(stringNumber) {
    if (midiOutput) {
        midiOutput.stopNote(10, stringNumber, { duration: 100, velocity: 0.5 });
    } else {
        console.log(
          "Looks like there is no MIDI output device. Check if your Arduino is connected."
        );
      }
}

WebMidi.enable(function (err) {
  if (err) {
    console.log("WebMidi could not be enabled.", err);
  }

  // Print available MIDI outputs
  for (let i = 0; i < WebMidi.outputs.length; i++) {
    console.log(WebMidi.outputs[i].name);
  }

  // From the list on the console, pick an output name:
  midiOutput = WebMidi.getOutputByName("Arduino Due");
});
