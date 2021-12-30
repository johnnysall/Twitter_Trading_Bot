async function getTweets() {
    let TweetArray = await eel.FindTweetsPY()()
    TweetList.innerHTML = "";
    for (var i=0; i<TweetArray.length; i+=2) {
        var newTweetForm = document.createElement("LI");
        newTweetForm.id = "form"+i;
        document.getElementById("TweetList").appendChild(newTweetForm);

        var newTweetLinkUsername = document.createElement("a");
        newTweetLinkUsername.id = "form"+"Username";
        newTweetLinkUsername.innerHTML = TweetArray[i];
        document.getElementById("form"+i).appendChild(newTweetLinkUsername);

        var newTweetLinkTweet = document.createElement("a");
        newTweetLinkTweet.id = "form"+"Tweet";
        newTweetLinkTweet.innerHTML = TweetArray[i+1];
        document.getElementById("form"+i).appendChild(newTweetLinkTweet);
    }
}


async function getTweets2() {
  let TweetArray = await eel.StartTweetListener()()
  Tweets.innerHTML = "";
  var newTweetForm = document.createElement("P");
  newTweetForm.id = "form"+i;
  newTweetForm.innerText = TweetArray[i];
  document.getElementById("Tweets").appendChild(newTweetForm);
}


function getTweet(Tweet) {
  var newTweetForm = document.createElement("P");
  newTweetForm.innerText = Tweet;
  document.getElementById("Tweets").appendChild(Tweet);
}


async function getOrders() {
  let OrderArray = await eel.FindOrdersPY()()

  var table = document.getElementById("OrdersTBL").getElementsByTagName('tbody')[0];;
  while (table.rows.length > 0) {
    table.deleteRow(0);
  }
  for (var i=0; i<OrderArray.length; i++) {
    var row = table.insertRow();
    for (var x=0; x<4; x++){
      var cell = row.insertCell(x);
      cell.innerHTML = OrderArray[i][x];
    }
  }
}


async function getPortfolio() {
  let PortfolioArray = await eel.GetPortfolioPY()()

  var table = document.getElementById("PortfolioTBL").getElementsByTagName('tbody')[0];
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  for (var i=0; i<PortfolioArray.length; i++) {
    var row = table.insertRow();
    for (var x=0; x<4; x++){
      if (x<3) {
        var cell = row.insertCell(x);
        cell.innerHTML = PortfolioArray[i][x];
      } 
      else {
        var cell = row.insertCell(x);
        cell.innerHTML = "<button id='Sellbtn';>Sell</button>";
        var cell = row.insertCell(x);
        cell.innerHTML = "<button id='Buybtn';>Buy</button>";
      }
    }
  }
}


eel.expose(BuyStocks);
async function BuyStocks() {
  var Stock = document.getElementById("StockToBuy").value;
  var Quantity = document.getElementById("QuantityToBuy").value;
  var Side = document.getElementById("SideToBuy").value;

  let Status = await eel.Alpaca_Order(Stock, Quantity, Side)();
  document.getElementById("Status").innerHTML = Status;
}


/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("mySidenav").style.borderColor = "#cccccc";
  document.getElementById("main").style.marginLeft = "250px";
}
  

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("mySidenav").style.borderColor = "rgb(23, 26, 36)";
  document.getElementById("main").style.marginLeft = "0";
}
