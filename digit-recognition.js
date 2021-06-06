const canvas = document.querySelector("#canvas_box");
const ctx = canvas.getContext("2d");
canvas.style.backgroundColor = "black";
var model = undefined;
//window.addEventListener('load',()=>{

 //  let model;

  //variables
  let painting=false;
  var painted= false;

  //functions
  function startingposition(){
    painting=true;
  }
  function finishedposition(){
    painting=false;
    ctx.beginPath();
  }
  //for desktops
  function draw(e){
    if(!painting) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX- rect.left;
    var mouseY = e.clientY- rect.top;
    ctx.lineTo(mouseX,mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX,mouseY);
    painted=true;
  }
  //for touch devices
  function drawm(e){
    if(!painting) return;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.strokeStyle = "white";
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.touches[0].clientX- rect.left;
    var mouseY = e.touches[0].clientY- rect.top;
    ctx.lineTo(mouseX,mouseY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(mouseX,mouseY);
    painted=true;
  }

  //event listeners
  canvas.addEventListener("mousedown",startingposition);
  canvas.addEventListener("mouseup",finishedposition);
  canvas.addEventListener("mousemove",draw);

  canvas.addEventListener("touchstart",startingposition);
  canvas.addEventListener("touchmove",drawm);
  canvas.addEventListener("touchend",finishedposition);


  $("#clear-button").click(async function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    document.getElementById("result").style.display = "none";
    painted=false;
   });

//});


//-------------------------------------
// loader for cnn model
//-------------------------------------
async function loadModel() {
  // clear the model variable

  // load the model using a HTTPS request (where you have stored your model files)
  //model = await tf.loadLayersModel("model.json");

  //model = await tf.loadLayersModel('https://drive.google.com/file/d/1Xbg-4aow1jRI9xquJFJiTLdVxAKd5Aue/view?usp=sharing');
  model = await tf.loadLayersModel('https://sarthak17jain.github.io/handwritten_digit_pred/cnnjsmodel/model.json');
  console.log("model loaded");
}

loadModel();

//-----------------------------------------------
// preprocess the canvas
//-----------------------------------------------
function preprocessCanvas(image) {
    // resize the input image to target size of (1, 28, 28)
    let tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([28, 28])
        .mean(2)
        .expandDims(2)
        .expandDims()
        .toFloat();
    return tensor.div(255.0);
}

//--------------------------------------------
// predict function
//--------------------------------------------
$("#predict-button").click(async function () {
    if (painted==true){
    // get image data from canvas
    var imageData = canvas.toDataURL();

    // preprocess canvas
    let tensor = preprocessCanvas(canvas);

    // make predictions on the preprocessed image tensor
    let prediction = await model.predict(tensor).data();
    var max = prediction[0];
    var maxIndex = 0;

    for (var i = 1; i < prediction.length; i++) {
        if (prediction[i] > max) {
            maxIndex = i;
            max = prediction[i];
        }
      }
    //console.log(prediction[0]);
    var maxpercentage = max*100;
    var str=String(maxpercentage.toPrecision(4));
    //window.alert(String(maxIndex)+" with "+str+" % "+"confidence");
    var result=String(maxIndex)+" with "+str+" % "+"confidence";
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = result;
   }
    else{
      document.getElementById("result").style.display = "block";
      document.getElementById("result").innerHTML = "Please draw something!!!";
      painted=false;
    }
});
