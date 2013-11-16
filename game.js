var createGame = require('voxel-engine');
var player = require('voxel-player');

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

// attach the game to the body of the webpage
var container = document.body;
game.appendTo(container);

game.paused = false;
