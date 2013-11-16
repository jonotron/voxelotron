var createGame = require('voxel-engine');
var player = require('voxel-player');
var highlight = require('voxel-highlight');

var game = createGame({
  generateChunks: false,
  chunkDistanct: 3
});

var terrain = require('voxel-perlin-terrain');
var chunkSize = 32;

var generateChunk = terrain('foo', 0, 5, 20);

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


// attach the game to the body of the webpage
var container = document.body;
game.appendTo(container);

game.paused = false;
