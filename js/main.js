// 0: Raw, 1: Time, 2: Moment time, 3: Participant, 4: msg, 5: emoji array, 6: sentiment array, 7: secs since last msg, 8: text processing - unused


var opacity1,
opacity2,
oopacity1,
oopacity2,
world,
globew;
var stuff = true;
var time = 0;
var counter = 1;
var queue = [];
var nframes = 0;

var user = [];

function counterplus(){
  //counter += 1;
  time = parseInt(Data_Store.split_text[counter][2].format("X"))-5;
}

function switchopacity(){
  switch (opacity1) {
    case oopacity1:
      document.getElementById("user").textContent="Nutzer: "+user[0];
      opacity1 = oopacity2;
      opacity2 = oopacity1;
      break;

    case oopacity2:
    document.getElementById("user").textContent="Nutzer: "+user[1];
      opacity2 = oopacity2;
      opacity1 = oopacity1;
      break;

  }
}

function users(){
  var stuffcount = 0;
  while (user.length<2){
    if(Data_Store.split_text[stuffcount][3]){
      user.push(Data_Store.split_text[stuffcount][3]);
    }
    stuffcount += 1;
  }
  document.getElementById("user").textContent="Nutzer: "+user[0];
}

function checker(){
  if(time == 0){
    time = parseInt(Data_Store.first_date.format("X")-1);
    users();
  }
  if(stuff == true){
    time+=10;
    //console.log("firstdate: "+parseInt(Data_Store.first_date.format("X")));
    //console.log("time: "+time);

  }
  queue[0] = Data_Store.split_text[counter];
  for (var i = 0; i < queue.length; i++) {
    var eigenehurenvariable;
    try {
    eigenehurenvariable = parseInt(queue[i][2].format("X"));
    } catch {
      eigenehurenvariable = 0;
    }

    if(eigenehurenvariable<=time){
      var ny = world.height/2+world.height/6 * -(queue[i][6][2]);
      var nx = world.width;
      var msg = queue[i][4];
      var size = queue[i][4].length;
      var weight = queue[i][6][2];
      var usern;
      if(queue[i][3].includes(user[0])){
        usern = 1;
      } else if(queue[i][3].includes(user[1])) {
        usern = 2;
      } else {
        usern = 1;
      }

      globew.adder(nx, ny, size, weight, usern, eigenehurenvariable, msg);
      counter+=1;
      try{
      for (var i = world.globes.length-3; i < world.globes.length-1; i++) {
        if(world.globes[i].time < eigenehurenvariable && world.globes[i].time > eigenehurenvariable-56000){
          world.globes[world.globes.length-1].addline(world.globes[i]);
        }
        for (var j = 0; j < world.globes[world.globes.length-1].lines.length; j++) {
          world.globes[world.globes.length-1].lines[j].create();
        }
      }
    } catch {}

      world.globes[world.globes.length-1].create();
      if(world.globes.length >30){
        world.globes[0].destroy();
        world.globes.shift();
      }
      //i -= 1;
        //console.log(queue);
    }
  }
}


function globeinit(){

oopacity1 = 0.3;
oopacity2 = 1;

  opacity2 = oopacity2;
  opacity1 = oopacity1;

world = new GlobeWorld(document.getElementById('green'));
world.create();
globew = new GlobeWorker(world);

for (var i = 0; i < 10; i++) {
  //globew.adder(Math.random()*(world.width/2)+world.width/4,Math.random()*(world.height/2)+world.height/4, Math.random()*100^0.5+50, Math.random()*10-5, Math.round(Math.random())+1);
}


for (var i = world.globes.length-1; i >= 0; i--) {
  if(world.globes[i+2]){
    for (var j = 1; j < 3; j++) {
      world.globes[i].addline(world.globes[i+j]);
    }
    for (var j = 0; j < world.globes[i].lines.length; j++) {
      world.globes[i].lines[j].create();
    }
  }
}

for (var i = 0; i < world.globes.length; i++) {
  world.globes[i].create();
}

world.two.bind('update', function(frameCount) {

  //console.log(nframes);
  if(nframes <= 0){
    checker();
    document.getElementById("time").textContent="Zeit: "+moment(time).format("X");
    nframes = 1;
  }
  nframes -= 1;

  world.update();
  for (var i = 0; i < world.globes.length; i++) {
    globew.activeGlobe = world.globes[i];
    globew.vincinity(world.globes[i]);
  }

  for (var i = 0; i < world.globes.length; i++) {
    world.globes[i].update();
  }

  for (var i = 0; i < world.globes.length; i++) {
    world.globes[i].draw();
  }

}).play();
};
