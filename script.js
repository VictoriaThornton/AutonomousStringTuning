let midiOutput;

function buttonPressed(note) {
    if (midiOutput) {
        midiOutput.playNote(note, 10, { duration: 100, velocity: 0.5 });
    }
    else {
        console.log("Looks like there is no MIDI output device. Check if your Arduino is connected.");
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
    // midiOutput = WebMidi.getOutputByName("IAC Driver IAC Bus 1");
    midiOutput = WebMidi.getOutputByName("Arduino Due");


});
