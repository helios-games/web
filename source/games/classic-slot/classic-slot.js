var game = new Phaser.Game(core.canvas.getWidth(), core.canvas.getHeight(), Phaser.AUTO, 'canvas', {
  preload: preload,
  create: create,
  update: update,
  render: render
});

function preload() {
  game.load.image('bg', '/games/classic-slot/images/bg.png');
  game.load.image('fg', '/games/classic-slot/images/fg.png');
  game.load.spritesheet('symbols', '/games/classic-slot/images/symbols.png', 420/3, 420/3 ,9);
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.setScreenSize();
}

var sprites = [];
var reels;
var geo;
var stops = [];

function create() {
  game.add.image(game.world.centerX ,game.world.centerY, 'bg').anchor.set(0.5)

  geo = [
    {x: game.world.centerX - 170, y: game.world.centerY},
    {x: game.world.centerX, y: game.world.centerY},
    {x: game.world.centerX + 170, y: game.world.centerY}
  ];

  $.getJSON(core.api("/games/classic-slot"), function(data) {
    stops = data.stops;
    reels = data.reels;
    for (var reelIndex = 0; reelIndex < data.reels.length; reelIndex++) {
      var reel = reels[reelIndex];
      for (var stop = 0; stop < reel.length; stop++) {
        var sprite = game.add.sprite(geo[reelIndex].x,geo[reelIndex].y,'symbols')
        sprite.anchor.set(0.5)
        sprite.frame = reel[stop];
        sprite.reelIndex = reelIndex;
        sprite.stop  = stop;
        sprite.reposition = function() {
          this.y = geo[this.reelIndex].y + (this.stop - stops[this.reelIndex]) % reels[this.reelIndex].length * 130;
        };
        sprite.reposition();
        sprites.push(sprite);
      }
    };
    game.add.image(game.world.centerX ,game.world.centerY, 'fg').anchor.set(0.5)
    core.ready();
  });

  core.addButton("Spin!", spin);
}
var timeout;
function random() {
  $.each(stops, function(i, stops) {
    stops[i] = (stops[i] + 1) % reels[i].length;
  });
  timeout = setTimeout(random, 100);
}
function spin() {
  core.unready();
  random();
  $.post({url: core.api("/games/classic-slot/spins"), data: JSON.stringify({amount: core.coin}), contentType: 'application/json'})
    .done(function(data) {
      clearTimeout();
      stops = data.stops;
      core.setBalance(data.balance);
    })
    .fail(core.handleError)
    .always(function() {
      clearTimeout(timeout);
      core.ready();
    })
}

function update() {
  $.each(sprites, function(i, sprite) {
    sprite.reposition();
  });
}

function render() {
  // game.debug.cameraInfo(game.camera, 32, 32);
}
