function preload() {
    mustacheImg = loadImage('mustache.png');
}

function setup() {
    canvas = createCanvas(300, 300);
    canvas.center();
}

function draw() {
}

function save_snapshot(){
  save('myFilterImage.png')
}


function take_snapshot(){
      Webcam.snap(function(data_uri) {
        document.getElementById("result").innerHTML = '<img id="captured_image" src="'+data_uri+'"/>';
    });
}

Webcam.set({
    width:350,
    height:300,
    image_format : 'png',
    png_quality:90
    
});

    camera = document.getElementById("camera");

Webcam.attach( "#camera" );

/*
function take_snapshot()
{
    Webcam.snap(function(data_uri) {
        document.getElementById("result").innerHTML = '<img id="captured_image" src="'+data_uri+'"/>';
    });
}
*/

function preload() {
    mustacheImg = loadImage('mustache.png');
}

// function setup() {
//     let canvas = createCanvas(800, 600); 
//     canvas.parent('filterCanvas'); 
//     centerCanvas(); 
// }

// function draw() {
//     background(200);

//     image(video, 0, 0, width, height);

//     if (filterType === 'mustache') {
//         image(mustacheImg, width / 2 - mustacheImg.width / 2, height / 2 - mustacheImg.height / 2);
//     } else if (filterType === 'lipstick') {
//         image(lipstickImg, width / 2 - lipstickImg.width / 2, height / 2 - lipstickImg.height / 2);
//     }
// }

// function saveImage() {
//     saveCanvas('filtered_image', 'png');
// }

function setup() {
    createCanvas(640 * 1.3, 480 * 1.3);
    video = createCapture(VIDEO);
    video.size(width, height);
  
    poseNet = ml5.poseNet(video, modelReady);
    poseNet.on('pose', function(results) {
      poses = results;
    });
    video.hide();
  
    textAlign(CENTER, CENTER);
  }
  
  
  function draw() {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
  
    drawMustache();
    pop();
  }
  
  function mouseClicked() {
    freeze = !freeze;
  }
  
  function drawMustache() {
    for (let i = 0; i < poses.length; i++) {
      let pose = poses[i].pose;
  
      let nosePoint = pose.keypoints[0];
      let leftMouthPoint = pose.keypoints[10]; // Left mouth corner
      let rightMouthPoint = pose.keypoints[9]; // Right mouth corner
  
      let noseX, noseY, leftMouthX, leftMouthY, rightMouthX, rightMouthY;
  
      if (nosePoint.score > 0.2) {
        noseX = nosePoint.position.x;
        noseY = nosePoint.position.y;
      }
  
      if (leftMouthPoint.score > 0.2) {
        leftMouthX = leftMouthPoint.position.x;
        leftMouthY = leftMouthPoint.position.y;
      }
  
      if (rightMouthPoint.score > 0.2) {
        rightMouthX = rightMouthPoint.position.x;
        rightMouthY = rightMouthPoint.position.y;
      }
  
      if (leftMouthX != null && leftMouthY != null && rightMouthX != null && rightMouthY != null && noseX != null && noseY != null) {
        // Calculate the position for the mustache
        let mustacheX = (leftMouthX + rightMouthX) / 2;
        let mustacheY = (leftMouthY + rightMouthY) / 2;
  
        // Calculate the size of the mustache based on the width between the mouth corners
        let mouthWidth = dist(leftMouthX, leftMouthY, rightMouthX, rightMouthY);
        let mustacheScale = mouthWidth / mustacheWidth;
  
        // Draw the mustache
        imageMode(CENTER);
        push();
        translate(mustacheX, mustacheY);
        scale(mustacheScale);
        image(mustacheImg, 0, 0);
        pop();
      }
    }
  }