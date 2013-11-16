var createGame = require('voxel-engine');
var player = require('voxel-player');
var highlight = require('voxel-highlight');
var critter = require('voxel-critter');

var game = createGame({
  generateChunks: false,
  chunkDistance: 1 
});

var terrain = require('voxel-perlin-terrain');
var chunkSize = 32;

var generateChunk = terrain('foo', 0, 1, 20);

game.voxels.on('missingChunk', function(p) {  
  var voxels = generateChunk(p, chunkSize);
  var chunk = {
    position: p,
    dims: [chunkSize, chunkSize, chunkSize],
    voxels: voxels
  }
  game.showChunk(chunk);
});


// create a player to controll
var createPlayer = player(game);
var avatar = createPlayer('player.png');
avatar.yaw.position.set(0, 10, 0);
avatar.possess();

// enable highlighting for block placement and removal
var blockPosPlace;
var blockPosErase;

var hl = game.highlighter = highlight(game, {color: 0x0000cc });
hl.on('highlight',          function (voxelPos) { blockPosErase = voxelPos });
hl.on('remove',             function (voxelPos) { blockPosErase = null });
hl.on('highlight-adjacent', function (voxelPos) { blockPosPlace = voxelPos });
hl.on('remove-adjacent',    function (voxelPos) { blockPosPlace = null });

var currentMaterial = 1;
var firing = false;

game.on('fire', function (target, state) {
  if (firing) return;
  
  firing = true;
  setTimeout(function() { firing = false; }, 100);

  var position = blockPosPlace;
  if (position) {
    game.createBlock(position, currentMaterial) 
  } else {
    position = blockPosErase;
    if (position) game.setBlock(position, 0);
  }
});

// add a critter
game.once('tick', function() {
  var critterCreator = critter(game);
  var rabbit = new Image();
  rabbit.onload = function() {
    var r = critterCreator(rabbit);
    console.log(r);
    r.position.x = avatar.yaw.position.x;
    r.position.y = avatar.yaw.position.y;
    r.position.z = avatar.yaw.position.z - 10;

    r.notice(avatar, { radius: 15, collisionRadius: 7 });

    r.on('block', function() {
      r.stuck = true;
      r.jump();
      game.setTimeout(function() {
        r.move(0,0,0.2); 
      },100);
    });

    r.on('notice', function(p) {
      r.lookAt(p); 
      r.move(0,0,0.02);
      console.log('I <3 you');
    });

    r.on('frolic', function(p) {
      console.log('I bunny');
    });

    r.on('collide', function(p) {
      //r.jump();
    });

    game.setTimeout(function() {
      if (r.noticed) return;


      r.rotation.y += Math.random() * Math.PI / 2 - Math.PI / 4;
      r.move(0,0,0.05 * Math.random());
    }, 500);

  };

  rabbit.src = '/rabbit.png';
});



// attach the game to the body of the webpage
var container = document.body;
game.appendTo(container);

game.paused = false;
