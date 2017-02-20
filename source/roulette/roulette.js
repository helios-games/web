var game = new Phaser.Game(800, 450, Phaser.AUTO, 'canvas', {
  preload: preload,
  create: create,
  update: update
});

function preload() {
  game.load.image('bg', '/roulette/images/bg.png');
  game.load.image('chip', '/roulette/images/chip.png');
  game.load.image('ball', '/roulette/images/ball.png');
}

var ball;
// 37 == 00
// starts at 180 degrees and goes clockwise
var pockets = [
  0, 28, 9, 26, 30, 11, 7, 20, 32, 17, 5, 22, 34, 15, 3, 24, 36, 13, 1, 37, 27, 10, 25, 29, 12, 8, 19, 31, 18, 6, 21, 33, 16, 4, 23, 35, 14, 2
];
var chips = [];
var wheel = {
  x: 162,
  y: 227
};
var wallet = {
  x: 400,
  y: 500
};
var red = {
  x: 462,
  y: 301,
  r: 544,
  b: 329,
  w: 544 - 462,
  h: 329 - 301
};
var black = {
  x: 552,
  y: 297,
  r: 628,
  b: 326,
  w: 628 - 552,
  h: 326 - 297
};
var numbers = {
  x: 375,
  y: 153,
  r: 715,
  b: 258,
  w: 715 - 375,
  h: 258 - 153
};

function setPocket(number) {
  console.log("pocket number " + number)
  $.each(pockets, function(i, v) {
    if (v == number) {
      console.log("i " + i)
      var a = (1 / 4 - (1 - i / pockets.length)) * 2 * Math.PI;
      var r = 75;
      var x = wheel.x + r * Math.cos(a);
      var y = wheel.y + r * Math.sin(a);
      game.add.tween(ball).to({
        x: x,
        y: y
      }, 500).start();
    }
  })
}

function create() {
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVeritcally = true;
  game.scale.refresh();

  var bg = game.add.sprite(game.world.centerX, game.world.centerY, 'bg');

  bg.anchor.set(0.5);
  bg.inputEnabled = true;
  bg.events.onInputDown.add(listener, this);

  ball = game.add.sprite(wheel.x, wheel.y, 'ball');
  ball.anchor.set(0.5);

  core.setPlayText("Spin!")
  core.updateBalance()

  $.getJSON("/api/games/roulette.json", function(data) {
    setPocket(data.pocket);
    $.each(data.bets, function(i, bet) {
      switch (bet.type) {
        case "number":
          console.log("bet.pocket " + bet.pocket)
          var x = numbers.x + ((bet.pocket - 1) / 3 + 0.5) * (numbers.w / 12);
          var y = numbers.y + (2 - (bet.pocket - 1) % 3 + 0.5) * (numbers.h / 3);

          chips.push(addChip(x, y));
          break;
        case "red":
          chips.push(addChip(red.x + red.w / 2, red.y + red.h / 2));
          break;
        case "black":
          chips.push(addChip(black.x + black.w / 2, black.y + black.h / 2));
          break;
      }
    })
  });
}

function matcher(x1, y1, x2, y2) {
  return function(x, y) {
    return x > x1 && x < x2 && y > y1 && y < y2
  }
}

function listener(sprite, pointer) {
  console.log(pointer.x + "," + pointer.y)
  $.each(
    [
      [matcher(red.x, red.y, red.r, red.b), placeRedBet],
      [matcher(black.x, black.y, black.r, black.b), placeBlackBet],
      [matcher(numbers.x, numbers.y, numbers.r, numbers.b), placeNumberBet]
    ],
    function(i, v) {
      var m = v[0](pointer.x, pointer.y);
      if (m) {
        var fn = v[1];
        // console.log("fn "+fn);
        fn(pointer);
      }
    }
  );
}

function addChip(x, y) {
  var chip = game.add.image(wallet.x, wallet.y, "chip")
  chip.anchor.set(0.5)
  game.add.tween(chip).to({
    x: x,
    y: y
  }, 250).start();
  return chip;
}

function placeBet(type, location, options) {
  options = options || {};
  var chip = addChip(location.x, location.y);
  $.post("/api/games/roulette/bets/" + type + ".json?amount=" + core.coin + "&number=" + options.number)
    .done(function(data) {
      chips.push(chip);
      core.setBalance(data.balance)
    })
    .fail(function(data) {
      chip.kill();
      alert("Failed to place bet " + data);
    });
}

function placeBlackBet(pointer) {
  placeBet("black", pointer)
}

function placeRedBet(pointer) {
  placeBet("red", pointer)
}

function placeNumberBet(pointer) {
  var x = parseInt(12 * (pointer.x - numbers.x) / numbers.w);
  var y = 3 - parseInt(3 * (pointer.y - numbers.y) / numbers.h);
  var number = x * 3 + y;

  console.log("x " + x + ", y " + y + ", number " + number)

  placeBet("number", pointer, {
    number: number
  })
}

function play() {
  $.ajax({
      type: "PUT",
      url: "/api/games/roulette/spin.json"
    })
    .done(function(data) {
      $.each(chips, function(i, v) {
        var tween = game.add.tween(v).to(wallet, 250)
        tween.onComplete.add(function() {
          v.kill();
        });
        tween.start();
      });
      core.setBalance(data.balance);
      setPocket(data.pocket);
    })
    .fail(function(data) {
      alert("Failed to spin " + data);
    });
}

function update() {}
