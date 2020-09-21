function Globe(location, radius, weight,two, gworld, user, ttime, msg){
  this.location = location || new Vector(); //globe has a position
  this.radius = radius || 10; // globe has a size
  this.weight = weight || 0; // globe has a weight based on size (maybe other way around?)
  this.circle;
  this.text;
  this.user = user;
  this.line;
  this.msg = msg;
  this.time = ttime;
  this.opacity = 1;
  this.two = two;
  this.median = 0;
  this.world = gworld;
  this.lines = [];
  switch (true) {
    case (weight<=this.median):
    this.material = -1;

      break;

    case (weight>this.median):
    this.material = 1;

      break;

    default: this.material = -1;

  }

  this.addline = function(globe){
    var posvect = this.location.clone().subtract(globe.location);
    var length = posvect.length();
    var rotate = posvect.toAngles();

    this.lines.push(new Line(this.location.x, this.location.y, length, rotate, this, globe, this.two, this.world));
  }

  this.updateLine = function(aline){
    this.applyforce(new Vector(0, this.location.x-this.world.height/2+this.world.height/6*this.weight));
    var posvect = this.location.clone().subtract(aline.globe.location);
    var length = posvect.length();
    var rotate = posvect.toAngles();
    aline.update(this.location.x, this.location.y, rotate);
  }

  this.grav = this.weight*this.material*0.1; // globe has a gravitation (based on weight?)
  this.inertia = new Vector();
  this.externalForce = new Vector();
  this.dampening = 0.9;

  this.applyforce = function(force){
    this.externalForce.add(force);
  };

  this.update = function(){ //update globe
    this.inertia = Vector.multiply(this.inertia,this.dampening); //dampen speed by factor
    this.inertia = Vector.add(this.inertia,this.externalForce); //add external externalForce

    for (var i = 0; i < this.lines.length; i++) {
      this.updateLine(this.lines[i]);
    }
    this.externalForce.set(0,0);
    this.location = Vector.add(this.location,this.inertia);
    return;
  };

  this.create = function(){ // runs on creation, sets variables
    this.circle = this.two.makeCircle(this.location.x,this.location.y, this.radius);
    //this.line = this.two.makeLine(this.location.x, this.location.y, this.location.x+this.externalForce.x, this.location.y+this.externalForce.y);
    this.text = this.two.makeText(this.msg, this.location.x, this.location.y);
    this.text.family = 'Work Sans';
    this.text.fill = '#AAA';

    this.circle.fill = "hsl("+(this.material*50+50)+", 41%, 81%)";
    this.circle.stroke = "hsl(100, 0%, 100%)"; // Accepts all valid css color
    this.circle.linewidth = 7;
    return;
  };

  this.destroy = function(){ // removes globe
    this.circle.remove();
    this.text.remove();
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].line.remove();
    }
    return;
  };
  this.draw = function(){ // renders globe
    //this.line.remove();
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].draw();
    }
    var in_min = 0,
      out_min = 0,
      in_max = this.world.width,
      out_max = 1;

    //var opac = (this.location.x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
    //var opac2 = (-(((opac*3)-1.5)**2)+1);
    //this.text.value = opac2+" "+opac;
    switch (this.user) {
      case 1:
        this.opacity = opacity1;

        break;

      case 2:
        this.opacity = opacity2;

        break;
      default:

    }
    this.circle.opacity = this.opacity;
    this.text.opacity = this.opacity;
    for (var i = 0; i < this.lines.length; i++) {
      this.lines[i].line.opacity = this.opacity;
    }
    this.circle.translation.set(this.location.x, this.location.y);
    this.text.translation.set(this.location.x, this.location.y);
    return;
  };
}

function Line(x,y, length, rotation, oglobe, globe, two, gworld){
  this.rotation = (rotation*Math.PI)/180;
  this.length = length;
  this.origin = new Vector(x,y);
  this.offset;
  this.line;
  this.oglobe = oglobe;
  this.globe = globe;
  this.two = two;
  this.world = gworld;
  this.haveibeencreated = false;
  this.create =function(){
    if(this.haveibeencreated == false){
      this.line = new Two.Line(this.oglobe.location.x, this.oglobe.location.y, this.globe.location.x, this.globe.location.y);//this.two.makeLine(this.origin.x,this.origin.y,this.origin.x+this.length,this.origin.y);
      this.two.add(this.line);
      this.line.linewidth = 7;
      this.line.cap = "round";
      this.line.stroke = "#FFF";
      this.line.rotation = 0; //this.rotation;
      this.haveibeencreated = true;
    }
  }

  this.update =function(x,y,rotation){
    this.origin.x = x;
    this.origin.y = y;
    this.length = Vector.subtract(this.origin,this.globe.location).length();
    //this.rotation = (rotation*Math.PI)/180;
    this.line.translation.set(0,0);
    var betweenv = Vector.subtract(this.origin.clone(), this.globe.location.clone());
    var offset1 = Vector.multiply(betweenv.normalize(),this.oglobe.radius).negative().add(this.origin);
    var offset2 = Vector.multiply(betweenv.normalize(),this.globe.radius).add(this.globe.location);
    this.line.vertices[0].set(offset1.x, offset1.y);
    this.line.vertices[1].set(offset2.x, offset2.y);

    this.line._update();
  }

  this.draw = function(){
    //this.line.translation.set(this.origin.x, this.origin.y);
    //this.line.rotation = this.rotation;
  }
}

function GlobeWorld(domnode){
  this.domnode = domnode; //getelement of container dom objects
  this.height = this.domnode.offsetHeight;
  this.width = this.domnode.offsetWidth;
  this.globes = [];
  this.two;
  this.m2m = new Vector;
  this.middle;
  this.gmiddle = new Vector;
  this.physics = {
    gravity : 9.81,
    dampening : 0.2,
    gravitydirection : new Vector()
  };
  this.create = function(){
    this.two = new Two({ width: this.domnode.clientWidth, height: this.domnode.clientHeight }).appendTo(domnode);
    this.middle = new Vector(this.width/3, this.height/2);
    };

  this.update = function(){
    for (var i = 0; i < this.globes.length; i++) {
      if(this.globes[i].location.x < -(this.globes[i].radius + 200)){
        this.globes[i].destroy();
        this.globes.splice(i,1);
        return;
      }
    }
    this.gmiddle.set(0, 0);
    for (var i = 0; i < this.globes.length; i++) {
      this.globes[i].applyforce(this.m2m);
      this.gmiddle.add(this.globes[i].location);

    }
    this.gmiddle = this.gmiddle.clone().divide(this.globes.length);
    this.m2m = this.gmiddle.clone();
    this.m2m.subtract(this.middle);
    this.m2m = this.m2m.multiply(0.005);
    this.m2m = this.m2m.negative();
    //console.log(this.m2m.x+","+this.m2m.y+"   "+this.gmiddle.x+"   "+this.gmiddle.y);
  };
  this.newglobe = function(location, radius, weight, user, time, msg){
    var tempglobe = new Globe(location, radius, weight, this.two, this, user, time, msg);
    this.globes.push(tempglobe);
  };

  this.draw = function(){
    for (var i = 0; i < this.globes.length; i++) {
      this.globes[i].draw();
    }
  }
}

function GlobeWorker(activeworld){
  this.activeworld = activeworld;
  this.activeGlobe;
  this.maxdist = 10;

  this.vincinity = function(){
    for (var i = 0; i < this.activeworld.globes.length; i++) {

      var pointvector = Vector.subtract(this.activeGlobe.location,activeworld.globes[i].location)
      var middledist = pointvector.length();
      var radii = this.activeGlobe.radius+activeworld.globes[i].radius;
      var weights = this.activeGlobe.weight*activeworld.globes[i].weight;
      if(Math.abs(middledist) > Math.abs(this.activeGlobe.weight+activeworld.globes[i].weight))
      {
        var g = 10*((weights)/(middledist**2*1));///this.activeGlobe.weight; // G*()(m1*m2) / r^2)
        var pointvector2 = pointvector.clone().normalize().multiply(g);
        activeworld.globes[i].applyforce(pointvector2);
      }
      if(Math.abs(middledist) < radii){ // if the distance between the centers is smaller than the combined radii
          activeworld.globes[i].applyforce(Vector.divide(pointvector, 80).negative());
      }
    }
    return;
  }

  this.adder = function(nx, ny, size, weight, user, time, msg){
    activeworld.newglobe(new Vector(nx, ny), size, weight, user, time, msg);
  };

  this.remover = function(number){
    for (var i = 0; i < number; i++) {
      world.globes.shift();
    }
  }
}
