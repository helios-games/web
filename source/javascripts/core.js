
var core = {
  coin: 1,
  api: function(path) {return "/api" + path + ".json"},
  //api: function(path) {return "http://localhost:8080/" + path},
  buttonTextToFn: {},
  setCoin: function (coin) {
    core.coin = coin;
  },
  canvas: {
    getWidth: function() {
      return $(window).width()
    },
    getHeight: function() {
      return $(window).height() - 120;
    }
  },
  getBalance: function() {
    return parseFloat($("#balance").text());
  },
  setBalance: function (amount, step) {
    var balance = this.getBalance();
    if (isNaN(balance) || amount < balance) {
      $("#balance").text(amount.toFixed(2));
    } else {
        var step = step  != undefined ? step : parseFloat((amount - balance) / 10);
        $("#balance").text(Math.min(amount, balance + step).toFixed(2));
        if (amount != balance) {
          setTimeout(function(){core.setBalance(amount, step)}, 50);
        }
    }
  },
  updateBalance: function() {
    $.getJSON(core.api("/wallet")).done(function(data) {core.setBalance(data.balance)});
  },
  addButton: function(text, fn) {
    core.buttonTextToFn[text] = fn;
    $("#buttons").append("<a class=\"button\" href=\"javascript:core.buttonTextToFn['" + text + "']();\">" + text + "</a>")
  },
  handleError: function(x,t,e) {
    alert(e.responseJSON ? e.responseJSON.message : t);
  },
  ready: function() {
    core.updateBalance();
    window.addEventListener('resize', function() {
      game.scale.setSize(window.innerWidth, window.innerHeight);
    }.bind(this));
  }
}
