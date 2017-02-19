
var core = {
  coin: 1,
  setCoin: function (coin) {
    core.coin = coin;
  },
  setBalance: function (amount) {
    $("#balance").text(amount)
  },
  setPlayText: function (text) {
    $("#play").text(text)
  },
  updateBalance: function() {
    $.getJSON("/api/service/wallet.json", function(data) {core.setBalance(data.balance)});
  },
  play: function() {
    play();
  }
}
