var painterlyTextures = require('painterly-textures');
console.log('painterly', painterlyTextures);
var createGame = require('voxel-hello-world');
var game = createGame({
  texturePath: painterlyTextures
});
