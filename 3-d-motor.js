var Vertex = function(x, y, z) {
	this.x = parseFloat(x);
	this.y = parseFloat(y);
	this.z = parseFloat(z);
};
var zoom = 1;
var Vertex2D = function(x, y) {
	this.x = parseFloat(x);
	this.y = parseFloat(y);
};

class fileObj{
    constructor(vertices, faces) {
        this.vertices = vertices;
        this.faces = faces;
      }

}
var objects = [];
var obj_global = new fileObj([],[]);

 // real canvas
var canvas = document.getElementById('cnv');
// Objects style


var create_obj_from_a_file = function(fileObj,zoom){
    vertices = [];
    faces = [];
    /*
    re_center_x_list = [];
    re_center_y_list = [];
    re_center_z_list= [];
    for(i=0;i<fileObj.verticles.length;i++){
        re_center_x_list.push(Math.abs(fileObj.verticles[i][0])); // for center the object with coordonate of verticles
        re_center_y_list.push(Math.abs(fileObj.verticles[i][1]));
        re_center_z_list.push(Math.abs(fileObj.verticles[i][2]));
    }
    console.log(re_center_x_list);

    var re_center_x = Math.max(...re_center_x_list);
    var re_center_y = Math.max(...re_center_y_list);
    var re_center_z  = Math.max(...re_center_z_list);
    console.log(re_center_x);
    */
   
    for(i=0;i<fileObj.vertices.length;i++){
        vertices.push(new Vertex(parseInt(fileObj.vertices[i][0]*zoom,10),parseInt(fileObj.vertices[i][1]*zoom,10),parseInt(fileObj.vertices[i][2]*zoom,10)));
    }
    for(i=0;i<fileObj.faces.length;i++){
        faces.push([vertices[fileObj.faces[i][0]-1],vertices[fileObj.faces[i][1]-1],vertices[fileObj.faces[i][2]-1]]);
    }
    
    obj_global.vertices = vertices;
    obj_global.faces = faces;
};
var zoom_canvas = function(){
    
    //create_obj_from_a_file(objects[0],zoom);
    for(i=0;i<objects[0].vertices.length;i++){
        objects[0].vertices[i].x = objects[0].vertices[i].x*2;
        objects[0].vertices[i].y = objects[0].vertices[i].y*2;
        objects[0].vertices[i].z = objects[0].vertices[i].z*2;
    }
    
 
  }
  var dezoom_canvas = function(){
    
    //create_obj_from_a_file(objects[0],zoom);
    for(i=0;i<objects[0].vertices.length;i++){
        objects[0].vertices[i].x = objects[0].vertices[i].x/2;
        objects[0].vertices[i].y = objects[0].vertices[i].y/2;
        objects[0].vertices[i].z = objects[0].vertices[i].z/2;
    }
    
 
  }

var Cube = function(center, side) {
	// Generate the vertices
	var d = side / 2;

	this.vertices = [
        new Vertex(center.x - d, center.y - d, center.z + d),
        new Vertex(center.x - d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z - d),
        new Vertex(center.x + d, center.y - d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z + d),
        new Vertex(center.x + d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z - d),
        new Vertex(center.x - d, center.y + d, center.z + d)
	];

	// Generate the faces
	this.faces = [
		[this.vertices[0], this.vertices[1], this.vertices[2], this.vertices[3]],
        [this.vertices[3], this.vertices[2], this.vertices[5], this.vertices[4]],
        [this.vertices[4], this.vertices[5], this.vertices[6], this.vertices[7]],
        [this.vertices[7], this.vertices[6], this.vertices[1], this.vertices[0]],
        [this.vertices[7], this.vertices[0], this.vertices[3], this.vertices[4]],
        [this.vertices[1], this.vertices[6], this.vertices[5], this.vertices[2]]
	];
};

function project(M) {
	return new Vertex2D(M.x, M.z);
}

function render(objects, ctx, dx, dy) {
	// Clear the previous frame
	ctx.clearRect(0, 0, 2*dx, 2*dy);
    

	// For each object
	//for (var i = 0, n_obj = objects.length; i < n_obj; ++i) {
		// For each face
		for (var j = 0, n_faces = objects[0].faces.length; j < n_faces; ++j) {
			// Current face
			var face = objects[0].faces[j];

			// Draw the first vertex
            
			//var P = project(face[0]);
			ctx.beginPath();
			ctx.moveTo(face[0].x + dx, -face[0].z + dy);

			// Draw the other vertices
            /*
			for (var k = 1, n_vertices = face.length; k < n_vertices; ++k) {
				P = project(face[k]);
				ctx.lineTo(P.x + dx, -P.y + dy);
			}*/
            //P1 = project(face[1]);
			ctx.lineTo(face[1].x + dx, -face[1].z + dy);
            //P2 = project(face[2]);
			ctx.lineTo(face[2].x + dx, -face[2].z + dy);
            

			// Close the path and draw the face
			ctx.closePath();
			ctx.stroke();
			ctx.fill();
		}
	//}
}

(function() {
	// Fix the canvas width and height
	
    const inputElement = document.getElementById("formFileLg");

   
    
    //var context2 = canvas2.getContext('2d');


	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	var dx = canvas.width / 2;
	var dy = canvas.height / 2;

	
    var ctx = canvas.getContext('2d');
    //ctx.scale(3,3);
	ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
	ctx.fillStyle = 'rgba(0, 150, 255, 0.3)';

	// Create the cube
	var cube_center = new Vertex(0, 11*dy/10, 0);
    var object_center = new Vertex(0,0,0);
	var cube = new Cube(cube_center, dy);
	objects.push(cube);

	// First render
	render(objects, ctx, dx, dy);

	// Events
	var mousedown = false;
	var mx = 0;
	var my = 0;
    inputElement.addEventListener("change", handleFiles, false);
	canvas.addEventListener('mousedown', initMove);
	document.addEventListener('mousemove', move);
	document.addEventListener('mouseup', stopMove);

    function handleFiles() {
        const reader = new FileReader();
        console.log(this.files[0]);
        let f = this.files[0]
        reader.onload = (function(theFile) {
            return function(e) {
              
              //console.log( e.target.result);
              FileLines = e.target.result.split("\r\n");
              vertices = []
              faces = []
              for(i=0;i<FileLines.length;i++){
                if(FileLines[i][0]=="v"){
                    vertices.push([parseFloat(FileLines[i].split(" ")[1]),parseFloat(FileLines[i].split(" ")[2]),parseFloat(FileLines[i].split(" ")[3])]);
 
                } else if(FileLines[i][0] == "f"){
                    faces.push([parseFloat(FileLines[i].split(" ")[1]),parseFloat(FileLines[i].split(" ")[2]),parseFloat(FileLines[i].split(" ")[3])])
                }
              }
              obj_global.vertices = vertices;
              obj_global.faces = faces;
              
              create_obj_from_a_file(obj_global,zoom);
              
              objects.pop();
              objects.push(obj_global);
            };
          })(f);
        reader.readAsText(f);

      }
	// Rotate a vertice
	function rotate(M, center, theta, phi) {
        // Rotation matrix coefficients
    	var ct = Math.cos(theta);
    	var st = Math.sin(theta);
    	var cp = Math.cos(phi);
    	var sp = Math.sin(phi);

		// Rotation
		var x = M.x - center.x;
		var y = M.y - center.y;
		var z = M.z - center.z;

		M.x = ct * x - st * cp * y + st * sp * z + center.x;
		M.y = st * x + ct * cp * y - ct * sp * z + center.y;
		M.z = sp * y + cp * z + center.z;
	}

	// Initialize the movement
	function initMove(evt) {
		clearTimeout(autorotate_timeout);
		mousedown = true;
		mx = evt.clientX;
		my = evt.clientY;
	}

	function move(evt) {
		if (mousedown) {
			var theta = (evt.clientX - mx) * Math.PI / 360;
			var phi = (evt.clientY - my) * Math.PI / 180;

			for (var i = 0; i < objects[0].vertices.length; ++i)
				rotate(objects[0].vertices[i], object_center, theta, phi);

			mx = evt.clientX;
			my = evt.clientY;

			render(objects, ctx, dx, dy);
		}
	}

	function stopMove() {
		mousedown = false;
		autorotate_timeout = setTimeout(autorotate, 2000);
	}

	function autorotate() {
		for (var i = 0; i < objects[0].vertices.length; ++i)
			rotate(objects[0].vertices[i], object_center, -Math.PI / 720, Math.PI / 720);

		render(objects, ctx, dx, dy);

		autorotate_timeout = setTimeout(autorotate, 30);
	}
	autorotate_timeout = setTimeout(autorotate, 2000);
})();
