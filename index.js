// canvas optimisations: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Optimizing_canvas

var viewportCanvas = document.getElementById('canvas');
var viewportContext = viewportCanvas.getContext('2d', { alpha : false });

var bufferCanvas = document.createElement('canvas');
var bufferContext = bufferCanvas.getContext('2d', { alpha : false});
var horizonX = 0;
var horizonY = 0;
var depthScale = 0;
// resize the canvas to fill browser window dynamically
window.addEventListener('resize', resizeCanvas, false);
function resizeCanvas() {
    viewportCanvas.width = window.innerWidth;
    viewportCanvas.height = window.innerHeight;
    bufferCanvas.width = window.innerWidth;
    bufferCanvas.height = window.innerHeight;
    horizonX = window.innerWidth / 2;
    horizonY = window.innerHeight / 2;
    depthScale = (window.innerWidth + window.innerHeight) / 2;
}
resizeCanvas();

var frameCount = 0;
var fps = 0;
setInterval(() => {
    //console.log(`${frameCount} fps`);
    fps = frameCount;
    frameCount = 0;
}, 1000)

window.requestAnimationFrame(drawFrame);
function drawFrame(){
    frameCount++;

    bufferContext.fillStyle = 'rgb(0, 0, 0)';
    bufferContext.fillRect(0,0,viewportCanvas.width, viewportCanvas.height);

    render(bufferContext);

    // swap the buffer for the viewport
    viewportContext.drawImage(bufferCanvas, 0, 0);
    window.requestAnimationFrame(drawFrame);
}

function project(point){
    var x,y,z;
    [x,y,z] = point;
    var screenX = Math.floor(((x) / (z / depthScale)) + horizonX);
    var screenY = Math.floor(((y) / (z / depthScale)) + horizonY);
    return [screenX, screenY];
}

var points = [];
for (var i = 0; i < 1000; i++){
    points.push([Math.random() * 200 - 100,Math.random() * 200 - 100,Math.random() * 200]);
}

function render(ctx){
    // render the scene here
    for (var i = 0; i < points.length; i++){
        var coords = project(points[i]);
        var z = points[i][2];
        var distance = Math.floor(255 * 100 / (Math.abs(z)));
        ctx.fillStyle = `rgb(${distance }, ${distance}, ${ distance})`;
        ctx.fillRect(coords[0], coords[1], 2, 2);
        points[i][2]--;
    }

    var newPoints = points.filter(x => x[2] > 0);
    while (newPoints.length < 1000)
    {
        newPoints.push([Math.random() * 200 - 100,Math.random() * 200 - 100,200]);
    }
    points = newPoints;
    
}