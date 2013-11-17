var game = require('./game').start();

game.once('tick', function() {
  game.createCritters();
});

game.on('critters', function() {
  var rabbit = game.rabbit;
  var wolf = game.wolf;
  var player = game.player;

  rabbit.notice(player, {radius: 10, collisionRadius:5});
  wolf.notice(rabbit, {radius: 15, collisionRadius: 2});

  wolf.on('notice', function(p) {
    wolf.lookAt(p);
    wolf.run();
  });

  wolf.on('collide', function(p) {
  })

  rabbit.on('notice', function(p) {
    //console.log('notice', p);
    rabbit.lookAt(p);
  });

  rabbit.on('frolic', function(p) {
    console.log('frolic');
    rabbit.walkaround(); 
  });

  rabbit.on('collide', function(p) {
    if (p.wolf) rabbit = null; 
  })

})

