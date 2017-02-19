var game = new Phaser.Game(800, 450, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('bg', '/roulette/images/bg.png');
  game.load.spritesheet('button', '/images/button_sprite_sheet.png', 120, 44);
}

var pocket;

function setPocket(number) {
  pocket.setText(parseInt(number))
}

function create() {
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVeritcally = true;
  game.scale.refresh();

  var image = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');

   image.anchor.set(0.5);
   image.inputEnabled = true;
   image.events.onInputDown.add(listener, this);

   text = game.add.text(250, 16, '', { fill: '#ffffff' });

  var style = { font: "16px Helvetica", fill: "#fff",
        align: "right", boundsAlignH: "left",      boundsAlignV: "top"};

  pocket  = game.add.text(200, 32, '', style);

  core.updateBalance()
  $.getJSON("/api/games/roulette.json", function(data) {setPocket(data.pocket)});

  var style = { font: "16px Helvetica", fill: "#fff",align: "center"};

  core.setPlayText("Spin!")
}

function matcher(x1,y1,x2,y2) {
  return function(x,y) {
    return x > x1 && x < x2 && y > y1 && y < y2
  }
}

function listener(sprite, pointer) {
  console.log(pointer.x+"," +pointer.y)
  $.each(
    [
      [matcher(462,301,544,329), placeRedBet],
      [matcher(552,297,628,326), placeBlackBet]
    ],
    function(i,v) {
      var m = v[0](pointer.x, pointer.y);
      if (m) {
        var fn = v[1];
        console.log("fn "+fn);
        fn();
      }
    }
  );

 // do something wonderful here
}

function placeBlackBet() {
  $.post("/api/games/roulette/bets/black.json?amount=" + core.coin)
    .done(function(data) {core.setBalance(data.balance)})
    .fail(function(data) {alert("Failed to place bet " + data);});
}
function placeRedBet() {
  $.post("/api/games/roulette/bets/red.json?amount=" + core.coin)
    .done(function(data) {core.setBalance(data.balance)})
    .fail(function(data) {alert("Failed to place bet " + data);});
}

function play () {
  $.ajax({type: "PUT", url: "/api/games/roulette/spin.json"})
    .done(function(data) {
      core.setBalance(data.balance);
      setPocket(data.pocket);
    })
  .fail(function(data) {alert("Failed to spin " + data);});
}

function update() {
}
