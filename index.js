const path = require('path');
let SerialPort = require('serialport');
let WebSocketServer = require('ws').Server;
 
// list serial ports:


let portName = process.argv[2];
let bRate = process.argv[3];
var port;
let curStr = 0;
const SERVER_PORT = 8081;               // port number for the webSocket server

let wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
let connections = new Array;          // list of connections to the server

wss.on('connection', handleConnection);
 
SerialPort.list().then(onList)

let storage = require('node-persist');
 
  
 const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj;
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
	  
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

console.log(getMethods(storage.init({dir: 'storage'})))
 
function handleConnection(client) {
  console.log("New Connection"); // you have a new client
  connections.push(client); // add this client to the connections array
 
  client.on('message', sendToSerial); // when a client sends a message,
 
  client.on('close', function() { // when a client closes its connection
    console.log("connection closed"); // print it out
    let position = connections.indexOf(client); // get the client's position in the array
    connections.splice(position, 1); // and delete it from the array
  });
}

function onList() {
	port = new SerialPort(portName, {
		baudRate: parseInt(bRate)
	})
	port.on('open', showPortOpen);
	
}

function showPortOpen() {
    console.log('port open. Data rate: ' + port.baudRate);
    const Readline = require('@serialport/parser-readline')
	const parser = port.pipe(new Readline());
	parser.on('data', readSerialData);
	port.on('close', showPortClose);
	port.on('error', showError);
}

function readSerialData(data) {
  var dataArray = data.split(' ')
  
  
  switch(dataArray[0]) {
	  case 'r':
	  //console.log("Parameter: " + dataArray[1])
	  onDeviceReadRequest(dataArray.slice(1))
	  break;
	  case 'w':
	 // console.log("Parameter: " + dataArray[1])
	  onDeviceWriteRequest(dataArray.slice(1))
	  break;
	  case 'h':
	  onDeviceHandshake()
	  break;
	  case 'epos':
	  onDeviceEposUpdate(dataArray)
	  break;
	  case 'pow':
	  onDevicePowUpdate(dataArray)
	  break;
	  case 'lc':
	  onDeviceLCUpdate(dataArray)
	  break;
	  case 'str':
	  onStringChange(dataArray)
	  break;
	  case 'tDes':
	  onDesiredTension(dataArray)
	  break;
	  case 'eDes':
	  onDesiredEncoder(dataArray)
	  break;
	  case 'active':
	  onActiveStr(dataArray)
	  break;
	  case 'inactive':
	  onInactiveStr(dataArray)
	  break;
	  default:
	  console.log('Command not recognized: ' + data)
	  break;
  }
  
}

function onInactiveStr(args) {
	broadcastArr(args, 2, 3)
}

function onActiveStr(args) {
	broadcastArr(args, 2, 3)
}

	
function onDesiredEncoder(args) {
	broadcastArr(args, 2, 3)
}

function onDesiredTension(args) {
	broadcastArr(args, 2, 3)
}

function onStringChange(args) {
	broadcastArr(args, 2, 3)
}

function onDeviceEposUpdate(args) {
	broadcastArr(args, 2, 3)
}

function onDevicePowUpdate(args) {
	broadcastArr(args, 2, 3)
}

function onDeviceLCUpdate(args) {
	broadcastArr(args, 2, 3)
}

function broadcastArr(args, min_size, max_size) {
	//console.log(args)
	if(args.length >= min_size && args.length <= max_size) {
		broadcast(JSON.stringify(args))
	} else {
		console.log("Illegal command " + args)
	}
}
function onDeviceHandshake() {
	console.log("Hands shook")
}
function showPortClose() {
  console.log('port closed.');
}
 
function showError(error) {
  console.log('Serial port error: ' + error);
}

function sendToSerial(data) {
  console.log("sending to serial: " + data);
  let val = ""+data;
  val += '\n';
  console.log(val)
  port.write(val);
}

function broadcast(data) {
  for (myConnection in connections) {   // iterate over the array of connections
    connections[myConnection].send(data); // send the data to each connection
  }
}

function sendRequestedItem(item) {
		console.log("item found as " + item);
		sendToSerial("w "+item);
}

function onDeviceReadRequest(args) {
	if(args.length != 1) {
		console.log("Illegal arguments for read: " + args)
	} else {
		console.log(`Read requested at ${args[0]}`);
		
		if(storage != null) {
			
			storage.getItem((""+args[0]).replace(/[\n\r]+/g, '')).then(data => {
				if(data != null) {
					console.log(data)
					sendRequestedItem(data)
				} else {
					console.log("Item not found at " + args[0])
				}
			});
		}
	}
}

function onDeviceWriteRequest(args) {
	if(args.length != 2) {
		console.log("Illegal arguments for read: " + args);
	} else {
		console.log("Write requested at  " + args[0]);
		console.log("Value of " + args[1]);
		if(storage != null) {
			
			storage.setItem((""+args[0]).replace(/[\n\r]+/g, ''), args[1].replace(/[\n\r]+/g, '')).then(data => {
				if(data != null) {
					console.log(data)
				} else {
					console.log("Item not found at " + args[0])
				}
			});
		}
	}
}

