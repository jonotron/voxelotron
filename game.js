var createGame = require('voxel-engine');
var player = require('voxel-player');
var highlight = require('voxel-highlight');
var critter = require('voxel-critter');

var game = createGame({
  generateChunks: false,
  chunkDistance: 1,
  controls: { discreteFire: true }
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

game.on('fire', function (target, state) {
  var position = blockPosPlace;
  if (position) {
    game.createBlock(position, currentMaterial) 
  } else {
    position = blockPosErase;
    if (position) game.setBlock(position, 0);
  }
});

// add a wolf and a rabbit and add them in front of hte player
game.createCritters = function(cb) {
  var critterCreator = critter(game);

  var rabbitImage = new Image();
  rabbitImage.src = '/rabbit.png';

  rabbitImage.onload = function() {
    var r = game.rabbit = critterCreator(rabbitImage);
    r.position.x = avatar.yaw.position.x - 6;
    r.position.y = avatar.yaw.position.y;
    r.position.z = avatar.yaw.position.z - 12;

    var wolfImage = new Image();
    wolfImage.src = "/wolf.png";
    wolfImage.onload = function() {
      var wolf = game.wolf = critterCreator(wolfImage);
      wolf.position.x = avatar.yaw.position.x + 6;
      wolf.position.y = avatar.yaw.position.y;
      wolf.position.z = avatar.yaw.position.z - 12;

      cb();
    }

  };
}
// add a critter
game.once('tick', function() {
  game.createCritters(function() {
    var rabbit = game.rabbit;
    var wolf = game.wolf;

    rabbit.notice(avatar, {distance: 10, collisionDistance:5});

    game.rabbit.on('notice', function(p) {
      game.rabbit.lookAt(p); 
      game.rabbit.move(0,0,0.05);
      console.log('I <3 you');
    });

    game.rabbit.on('frolic', function(p) {
      console.log('I bunny');
      game.rabbit.rotation.y += 45 * Math.PI / 180;
      game.rabbit.move(0,0,0.05);
    });

  });
});



// attach the game to the body of the webpage
var container = document.body;
game.appendTo(container);

game.paused = false;
