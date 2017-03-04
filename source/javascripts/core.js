String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var core = {
  coin: 1,
  api: function(path) {return "/api" + path + ".json"},
  //api: function(path) {return "http://localhost:8080/" + path},
  buttons: {},
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
    return $.getJSON(core.api("/wallet")).done(function(data) {core.setBalance(data.balance)});
  },
  addButton: function(text, fn) {
    var id = text.hashCode();
    core.buttons[text] = function() {
      if (!$("#" + id).hasClass("disabled")) {fn();}
    };
    $("#buttons").append("<a id=\"" + id + "\"class=\"button disabled\" href=\"javascript:core.buttons['" + text + "']();\">" + text + "</a>")
  },
  disableButton: function(id) {
    $("#" + id.hashCode()).addClass("disabled");
  },
  enableButton: function(id) {
    $("#" + id.hashCode()).removeClass("disabled");
  },
  handleError: function(x,t,e) {
    $("#modal").text(x.responseJSON && x.responseJSON.message ? x.responseJSON.message : e);
    $("#modal").modal({"fadeDuration": 100});
  },
  unready: function() {
    $("#coin0").addClass("disabled");
    $("#coin1").addClass("disabled");
    $("#coin2").addClass("disabled");
    for (var id in core.buttons) {
      core.disableButton(id);
    }
  },
  ready: function() {
    $("#coin0").removeClass("disabled");
    $("#coin1").removeClass("disabled");
    $("#coin2").removeClass("disabled");
    for (var id in core.buttons) {
      core.enableButton(id);
    }
    if (isNaN(core.getBalance())) {
      core.updateBalance();
    }
  }
}

$(document).ready(function() {
  window.addEventListener('resize', function() {
    game.scale.setSize(window.innerWidth, window.innerHeight);
  }.bind(this));
});
