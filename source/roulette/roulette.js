var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
  game.load.image('logo', '/images/logo.png');
  game.load.spritesheet('spin_button', '/roulette/images/spin_button_sprite_sheet.png', 193, 71);
}

var balance, pocket, spinButton;

function create() {
  game.add.sprite(0, 0, 'logo');
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVeritcally = true;
  game.scale.refresh();

  var style = { font: "16px Helvetica", fill: "#fff",
        align: "right",
        boundsAlignH: "left",
        boundsAlignV: "top",
        wordWrap: true, wordWrapWidth: 300 };

  balance = game.add.text(200, 16, 'Balance 0', style);
  pocket  = game.add.text(200, 32, '', style);

  $.getJSON("/api/service/wallet.json",  function(data) {balance.setText("Balance " + data.balance)});
  $.getJSON("/api/games/roulette.json",  function(data) {pocket.setText(data.pocket)});

   spinButton = game.add.button(game.world.width - 95 * 2, 440, 'spin_button', spin, this, 2, 1, 0);
}

function spin () {
  spin.inputEnabled = false;
  $.ajax({type: "PUT", url: "/api/games/roulette/spin.json"})
    .done(function(data) {
      balance.setText("Balance " + data.balance)
      pocket.setText(data.pocket)
    })
  .fail(function(data) {
      alert( "error" + data);
    })
    .always(function() {
        spin.inputEnabled = true;
    });
}

function update() {
}
