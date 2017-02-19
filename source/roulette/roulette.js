var game = new Phaser.Game(800, 450, Phaser.AUTO, 'canvas', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('bg', '/roulette/images/bg.png');
  game.load.spritesheet('button', '/images/button_sprite_sheet.png', 120, 44);
}

var pocket;

function label(game, x, y, key, text, style, callback, callbackContext, overFrame, outFrame, downFrame, upFrame){
  var button =  game.add.button(x, y, key,  callback, callbackContext, overFrame, outFrame, downFrame, upFrame);
  style.wordWrap =  true;
  style.wordWrapWidth =  button.width;
  var text = game.add.text(Math.floor(button.x + button.width / 2), Math.floor(button.y + button.height / 2), text, style);
  text.anchor.set(0.5);
  return {button: button, text: text};
};


function setPocket(number) {
  pocket.setText(parseInt(number))
}

function create() {
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVeritcally = true;
  game.scale.refresh();

  game.add.image(0,0,"bg")

  var style = { font: "16px Helvetica", fill: "#fff",
        align: "right", boundsAlignH: "left",      boundsAlignV: "top"};

  pocket  = game.add.text(200, 32, '', style);

  core.updateBalance()
  $.getJSON("/api/games/roulette.json", function(data) {setPocket(data.pocket)});

  var style = { font: "16px Helvetica", fill: "#fff",align: "center"};

  var y = 370;
  label(this.game, 280, y, "button", "Black", style,function() {
    $.post("/api/games/roulette/bets/black.json?amount=" + core.coin)
      .done(function(data) {core.setBalance(data.balance)})
      .fail(function(data) {alert("Failed to place bet " + data);});
    }, this, 1, 0, 2);

  label(this.game, 400, y, "button", "Red", style,function() {
    $.post("/api/games/roulette/bets/red.json?amount=" + core.coin)
      .done(function(data) {core.setBalance(data.balance)})
      .fail(function(data) {alert("Failed to place bet " + data);});
  }, this, 1, 0, 2);

   core.setPlayText("Spin!")
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
