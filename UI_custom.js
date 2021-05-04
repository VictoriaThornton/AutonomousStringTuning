var dropdownState = "expanded";
var chosenNotes;
var MotorState = 'off';  


function init() {
  chosenNotes = [0, 2, 4, 5, 4]; //default note values;
  include('dev.js');
   
  clearStringCursors(1); 
  clearStringCursors(2); 
  clearStringCursors(3); 
  clearStringCursors(4); 
  clearStringCursors(5); 

  document.getElementById("string1note1").style.opacity = 100;
  document.getElementById("string" + 1 + "noteLabel" + 1).style.fontSize = "24px";
  document.getElementById("string2note3").style.opacity = 100;
  document.getElementById("string" + 2 + "noteLabel" + 3).style.fontSize = "24px";
  document.getElementById("string3note5").style.opacity = 100;
  document.getElementById("string" + 3 + "noteLabel" + 5).style.fontSize = "24px";
  document.getElementById("string4note6").style.opacity = 100;
  document.getElementById("string" + 4 + "noteLabel" + 6).style.fontSize = "24px";
  document.getElementById("string5note5").style.opacity = 100;
  document.getElementById("string" + 5 + "noteLabel" + 5).style.fontSize = "24px";
  
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

            case 's': case 'S': 
            //shortcut to switch tabs
            switchTuningMode();
            break; 
        }
  }
}

function include(file) {
  
  var script  = document.createElement('script');
  script.src  = file;
  script.type = 'text/javascript';
  script.defer = true;
  
  document.getElementsByTagName('head').item(0).appendChild(script);
  
}


function switchTuningMode(){
  window.location.href = "UI_chords.html";
}

function initializeText(string){
  var noteLabels = document.getElementsByClassName("label-" + string);
  for (var i = 0; i < noteLabels.length; i++) {
    noteLabels[i].innerHTML = "N"+(i+1);
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


function clearStringCursors(string) {
  //reset cursor selections for current string
  var cursors = document.getElementsByClassName("cursor-" + string);
  for (var i = 0; i < cursors.length; i++) {
    cursors[i].style.opacity = 0;
  }
  console.log("RESET STRING #" + string); 
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

//press 'select notes' button and send notes over socket to Arduino
function selectTuningButtonPressed() {
  document.getElementById("play-button").style.display = "none";
  document.getElementById("play-button-pressed").style.display = "block";
  //button animation
  document.getElementById("play-button-pressed").className += " button-pressed";
  startDevice(); //send start command to Node.js server 
  //send tuning over socket to Arduino 
  for (var i = 0; i < chosenNotes.length; i++) {
    var stringNumber = i+1; 
    var note = chosenNotes[i];
    // var displayNote = note + 1;
    console.log("Selected Note: ",note,"for String number ",stringNumber);
    tuneTo(stringNumber, note);   
  }
  
}

function startAllMotors(){
  startMotor(0); 
  startMotor(1); 
  startMotor(2); 
  startMotor(3); 
  startMotor(4);
}

//hit the slider switch to turn the motors on and off
function toggleMotorControlSwitch(previousState){
  if(previousState == 'off'){
    document.getElementById("motorControlButtonBackgroundOn").style.display = 'block';
    document.getElementById("motorControlButtonOn").style.display = 'block';
    MotorState = 'on'; 
    startAllMotors();
  }
  if(previousState == 'on'){
    document.getElementById("motorControlButtonBackgroundOn").style.display = 'none';
    document.getElementById("motorControlButtonOn").style.display = 'none';
    MotorState = 'off'; 
    stopAll(); 
  }
 
  console.log("MOTOR STATE: ", MotorState); 
}

//reset tuning button to allow press again
function resetTuningButton() {
  document.getElementById("play-button").style.display = "block";
  document.getElementById("play-button-pressed").style.display = "none";
}


//actuate the solenoid using keypresses for the different strings.
//1, 2, 3, 4, 5 to correspond to the different strings. Sends noteOff signals where the channel numbers correspond to the string number
//channel 6 corresponds to striking all of the strings at once
function actuateSolenoid(stringNumber) {
      actuate(stringNumber); 
}

