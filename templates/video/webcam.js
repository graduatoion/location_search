var n = null
var v = null
var gCtx = null

function captureToCanvas(){

	  try{
            gCtx.drawImage(v,0,0);
            try{
		qrcode.decode();
                console.log('test');
            }
            catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
            };
        }
        catch(e){       
                console.log(e);
                setTimeout(captureToCanvas, 500);
        };
}

function initCanvas(w,h){
	
	n = navigator;
	v = document.getElementById("v");
	var gCanvas = document.getElementById("qr-canvas");
	gCanvas.style.width = w + "px";
	gCanvas.style.height = h + "px";
	gCanvas.width = w;
	gCanvas.height = h;
	gCtx = gCanvas.getContext("2d");
	gCtx.clearRect(0, 0, w, h);		
}

function setwebcam(){
var options = true;
if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
{
	try{
		navigator.mediaDevices.enumerateDevices().then(function(devices) {
		  devices.forEach(function(device) {
			if (device.kind === 'videoinput') {
			  if(device.label.toLowerCase().search("back") >-1)
				options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment'} ;
			}
			
			
			console.log(device.kind + ": " + device.label +" id = " + device.deviceId);
		  });
		  setwebcam2(options);
					
		});
	}
	catch(e)
	{
		console.log(e);
	}
}
else{
	console.log("no navigator.mediaDevices.enumerateDevices" );
	
}	
}

function setwebcam2(options){
	 
		  var p = n.mediaDevices.getUserMedia({video: options, audio: false})
		  p.then(success, error)
		  setTimeout(captureToCanvas, 500);
	
}
function success(stream){
	v.srcObject = stream;
	setTimeout(captureToCanvas(), 500);
}
function error(error){
	console.log(error);
}
function load(){
	initCanvas(800,600);
	qrcode.callback = read;
	setwebcam();
}
function read(a){
	document.getElementById("result").innerHTML = a.toString()
	console.log(a);
}
