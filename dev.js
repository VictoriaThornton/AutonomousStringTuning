var text;       // variable for the text div you'll create
var socket = new WebSocket("ws://localhost:8081");
var encPos = 0;

var activeString = 0
var stringReading = 0

function setup() {
  socket.onopen = openSocket;
  socket.onmessage = procData;
 
  // make a new div and position it at 10, 10:
  text = createDiv("Socket may not be open, ensure device is connected and node is running with args 'node index.js [PORT]=COM9 [BAUDRATE]=115200'");
  text.position(10,10);
}
 
function draw() {
}

function openSocket() {
  text.html("Socket open.");
  //socket.send("Hello server");
}
 
function procData(evt) {
	
	text.html("")
  let dataArray = JSON.parse(evt.data);
 // console.log(dataArray)
  switch(dataArray[0]) {
	  case 'epos':
	  //console.log("Parameter: " + dataArray[1])
	  onEncUpdate(dataArray.slice(1))
	  break;
	  case 'pow':
	 // console.log("Parameter: " + dataArray[1])
	  onPowUpdate(dataArray.slice(1))
	  break;
	  case 'h':
	  onDeviceHandshake()
	  break;
	  case 'lc':
	  onLCUpdate(dataArray.slice(1))
	  break;
	 case 'str':
	  onStringChange(dataArray.slice(1))
	  break;
	  case 'tDes':
	  onDesiredTension(dataArray.slice(1))
	  break;
	  case 'eDes':
	  onDesiredEncoder(dataArray.slice(1))
	  break;
	  case 'active':
	  onActiveStr(dataArray.slice(1))
	  break;
	  case 'inactive':
	  onInactiveStr(dataArray.slice(1))
	  break;
	  default:
	  console.log('Command not recognized: ' + dataArray[0])
	  break;
  }
}

function changeStrIfNecessary(str) {
	if(activeString != str) {
		activeString = str;
		console.log("Changing to string " + str)
		socketSend("m " + str);
	} else {
		console.log("Change str unnecessary")
	}
}
var timeOne = new Date(), timeTwo = new Date();
function onInactiveStr(args) {
	timeTwo = new Date();
	console.log(timeTwo - timeOne)
	document.getElementById("str"+args[0].replace(/[\n\r]+/g, '')).style.backgroundColor = "silver";
}

function onActiveStr(args) {
	timeOne = new Date();
	
	document.getElementById("str"+args[0].replace(/[\n\r]+/g, '')).style.backgroundColor = "red";
}

function onDesiredEncoder(args) {
	onSetpointUpdate(args)
}

function onDesiredTension(args) {
	onTensUpdate(args)
}

function onStringChange(args) {
	stringReading = args[0].replace(/[\n\r]+/g, '')
	//console.log("reading " + stringReading)
}

function onTensUpdate(args) {
	if(args.length != 1) {
		console.log("Illegal arguments for tension expected: " + args)
	} else {
	var output = document.getElementById("tensionExpected" + stringReading);
	output.value = args[0].replace(/[\n\r]+/g, '')
	}
}

function onEncUpdate(args) {
	if(args.length != 1) {
		console.log("Illegal arguments for epos: " + args)
	} else {
	var output = document.getElementById("encoderPos" + stringReading);
	output.value = args[0].replace(/[\n\r]+/g, '')
	}
}

function onSetpointUpdate(args) {
	if(args.length != 1) {
		console.log("Illegal arguments for setpoint: " + args)
	} else {
	var output = document.getElementById("setpoint" + stringReading);
	output.value = args[0].replace(/[\n\r]+/g, '')
	}
}

function onLCUpdate(args) {
	if(args.length != 1) {
		console.log("Illegal arguments for load cell: " + args)
	} else {
	var output = document.getElementById("loadCell" + stringReading);
	output.value = args[0].replace(/[\n\r]+/g, '')
	}
}

function onPowUpdate(args) {
	if(args.length != 1) {
		console.log("Illegal arguments for pow: " + args)
	} else {
	var output = document.getElementById("outputPID" + stringReading);
	output.value = args[0].replace(/[\n\r]+/g, '')
	}
}
function changeModule() {
    var x = document.getElementById("moduleSelect").value;
	activeString = x
    socketSend("m " + x)
}

function tuneTo(i, val) {
	changeStrIfNecessary(i)
	switch(activeString) {
		case 0:
		return; //disabled
		break;
	}
	socketSend("tune " + val)
}

function stopMotor(i) {
	changeStrIfNecessary(i)
	socketSend("n 0")
}

function startMotor(i) {
	changeStrIfNecessary(i)
	socketSend("y 0")
}

function actuate(i) {
	changeStrIfNecessary(i)
	socketSend("actuate " + i);
}

function stopAll() {
	for(var i = 0; i < 5; i++) {
		socketSend("m " + i)
		socketSend("n " + i)
		activeString = i
	}
}

function startDevice() {
	socketSend("start 0")
}

function socketSend(data) {
	console.log("Sending: " + data)
	socket.send(data)
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function updateSetpoint(value) {
	const parsed = parseInt(value);
	if (isNaN(parsed)) { 
	  console.log("Not a number.")
	  return 0; 
	}
	if(parsed > 15000 || parsed < -15000) {
		console.log("Outside permitted range.")
		return 0;
	}
	socketSend("s " + value)
}

function updateZeroFactor(value) {
	const parsed = parseFloat(value);
	if (isNaN(parsed)) { 
	  console.log("Not a number.")
	  return 0; 
	}
	socketSend("zero " + value)
}

function updateCalibrationFactor(value) {
	const parsed = parseInt(value);
	if (isNaN(parsed)) { 
	  console.log("Not a number.")
	  return 0; 
	}
	socketSend("calib " + value)
}
// 
function onChordSend() {
	var root = document.getElementById("rootSelect").value; 
	var type = document.getElementById("typeSelect").value; 
	sendChord(parseInt(root), parseInt(type))
}

//AUTO GENERATED CODE	//AUTO_GEN 
//AUTO GENERATED CODE	//AUTO_GEN 
function sendChord(root, type) {	//AUTO_GEN 
if(0== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 0 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(0== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 1 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(0== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 2 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(0== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 3 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(0== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 4 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(0== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 5 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(0== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(1== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(2== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(3== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
}	//AUTO_GEN 
if(4== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
}	//AUTO_GEN 
if(5== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
}	//AUTO_GEN 
if(6== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
if(7== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 4");	//AUTO_GEN 
}	//AUTO_GEN 
if(8== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 5");	//AUTO_GEN 
}	//AUTO_GEN 
if(9== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 2");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 6");	//AUTO_GEN 
}	//AUTO_GEN 
if(10== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 7");	//AUTO_GEN 
}	//AUTO_GEN 
if(11== root && 6 == type) {	//AUTO_GEN 
socketSend("m 1");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 2");	//AUTO_GEN 
socketSend("tune 0");	//AUTO_GEN 
socketSend("m 3");	//AUTO_GEN 
socketSend("tune 1");	//AUTO_GEN 
socketSend("m 4");	//AUTO_GEN 
socketSend("tune 3");	//AUTO_GEN 
}	//AUTO_GEN 
}	//AUTO_GEN 

