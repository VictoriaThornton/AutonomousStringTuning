var dropdownState = 'expanded'; 
var chosenNotes; 

function init(){
    toggleDropdownDisplay(); 
    selectMode('custom');
    chosenNotes = [0,2,4,7,6]; //default note values;
    clearCursors();
    document.getElementById("string1note1").style.opacity = 100; 
    document.getElementById("string2note3").style.opacity = 100; 
    document.getElementById("string3note5").style.opacity = 100; 
    document.getElementById("string4note8").style.opacity = 100;
    document.getElementById("string5note7").style.opacity = 100;    
}

function selectNote(note, string){ 
    //call to add the notes chosen by the user to an array once it's selected. One note for each string. Once the user hits the button
    chosenNotes[string-1] = note; //note starts from zero here to match 0 to 12 note scale
    clearStringCursors(string);     
    var displayNote = note + 1; //note + 1 corresponds to the displayed notes on the UI
    console.log("Selected note ", displayNote, "String:  ", string);
    document.getElementById("string"+string+"note"+displayNote).style.opacity = 100; 

    // if(string == 3){
    //     var noteNames = document.getElementsByClassName("noteNameString3"); 
    //     for(var i = 0; i < noteNames.length; i++){
    //         cursors[note].style = "text-size-adjust: 80%;"
    //     }
    // }
}

function chords(){} //have preset chord configurations to choose from

function clearStringCursors(string){
    //add in clear options for rest of strings
    var cursors = document.getElementsByClassName("cursor-"+string); 
    for(var i=0; i < cursors.length; i++){
        cursors[i].style.opacity = 0;
    }
}

function clearCursors(){
    //add in clear options for rest of strings
    var cursors = document.getElementsByClassName("cursor"); 
    for(var i=0; i < cursors.length; i++){
        cursors[i].style.opacity = 0;
    }
}

function selectTuningButtonPressed(){
    document.getElementById("play-button").style.display = "none";
    document.getElementById("play-button-pressed").style.display = "block"; 
    document.getElementById("play-button-pressed").webkitTransform = "translateY(0.5px)"; 
    document.getElementById("play-button-pressed").webkitTransform = "translateY(-0.5px)"; 
    
    //send MIDI tuning to Arduino
    for(var i = 0; i < chosenNotes.length; i++) {
        var stringNumber = i+1;
        var note = chosenNotes[i]; 
        var displayNote = note + 1; 
        console.log("Selected Note: ", displayNote, "for String number ", stringNumber); 
        if (midiOutput) {
            midiOutput.playNote(note, stringNumber, { duration: 100, velocity: 0.5 });
        }
        else {
            console.log("Looks like there is no MIDI output device. Check if your Arduino is connected.");
        }
    }
}

function finishedTuning(){
    document.getElementById("play-button").style.display = "block";
    document.getElementById("play-button-pressed").style.display = "none";  
}

function selectMode(type){
    if(type == 'chord'){
        document.getElementById("chordRadioButton").style.opacity = 100;
        document.getElementById("customRadioButton").style.opacity = 0;
    }
    if(type == 'custom'){
        document.getElementById("chordRadioButton").style.opacity = 0;
        document.getElementById("customRadioButton").style.opacity = 100;
    }
}

function toggleDropdownDisplay(){
    var elements = document.getElementsByClassName('expand');

    if(dropdownState == 'collapsed'){
        var elements = document.getElementsByClassName('expand');
        for (var i=0;i<elements.length;i+=1){
        elements[i].style.opacity = 100;
        elements[i].style.display = "block"; 
        }
        dropdownState = 'expanded'; 
        return; 
    }

    if(dropdownState == 'expanded'){
        
        for (var i=0;i < elements.length;i+=1){
          //  elements[i].style.display = 'none';
          elements[i].style.opacity = 0;
          elements[i].style.display = "none";         
        }
        dropdownState = 'collapsed';
        return; 
    }
}

function dropdownSelection(selection){
    document.getElementById("first-drop-down-box-text").innerHTML = selection; 
    toggleDropdownDisplay(); 
}

function actuateSolenoid(){
    
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
    // midiOutput = WebMidi.getOutputByName("IAC Driver IAC Bus 1");
    midiOutput = WebMidi.getOutputByName("Arduino Due");


});

