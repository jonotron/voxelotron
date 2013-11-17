var game = require('./game').start();

game.on('critters', function() {
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

})
