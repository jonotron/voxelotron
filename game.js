var createGame = require('voxel-engine');

var game = createGame({
  generateChunks: false,
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

var container = document.getElementById('container');
game.appendTo(container);

var createPlayer = require('voxel-player')(game);
var shama = createPlayer('shama.png');
shama.yaw.position.set(0, 10, 0);
shama.possess();

game.paused = false;
