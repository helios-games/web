
var core = {
  coin: 1,
  buttonTextToFn: {},
  setCoin: function (coin) {
    core.coin = coin;
  },
  getBalance: function() {
    return parseFloat($("#balance").text());
  },
  setBalance: function (amount, step) {
    var balance = this.getBalance();
    if (isNaN(balance) || amount < balance) {
      $("#balance").text(amount)
    } else {
        var step = step  != undefined ? step : parseFloat((amount - balance) / 10);
        $("#balance").text(Math.min(amount, balance + step));
        if (amount != balance) {
          setTimeout(function(){core.setBalance(amount, step)}, 100);
        }
    }
  },
  updateBalance: function() {
    $.getJSON("/api/service/wallet.json", function(data) {core.setBalance(data.balance)});
  },
  play: function() {
    play();
  },
  addButton: function(text, fn) {
    core.buttonTextToFn[text] = fn;
    $("#buttons").append("<a class=\"button\" href=\"javascript:core.buttonTextToFn['" + text + "']();\">" + text + "</a>")
  }
}
