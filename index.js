var game = require('./game').start();

game.once('tick', function() {
  game.createCritters();
});

game.on('critters', function() {
  var rabbit = game.rabbit;
  var wolf = game.wolf;
  var player = game.player;

  rabbit.notice(player, {distance: 10, collisionDistance:5});

  rabbit.on('notice', function(p) {
    rabbit.lookAt(p); 
    rabbit.move(0,0,0.05);
    console.log('I <3 you');
  });

  rabbit.on('frolic', function(p) {
    console.log('I bunny');
    rabbit.rotation.y += 45 * Math.PI / 180;
    rabbit.move(0,0,0.05);
  });

})

