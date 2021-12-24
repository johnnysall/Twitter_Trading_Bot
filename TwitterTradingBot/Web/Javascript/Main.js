async function getTweets() {
    let TweetArray = await eel.FindTweetsPY()()
    Tweets.innerHTML = "";
    for (var i=0; i<TweetArray.length; i++) {
        var newTweetForm = document.createElement("P");
        newTweetForm.id = "form"+i;
        newTweetForm.innerText = TweetArray[i];
        document.getElementById("Tweets").appendChild(newTweetForm);
    }
}

async function getOrders() {
  let OrderArray = await eel.FindOrdersPY()()

  var table = document.getElementById("OrdersTBL").getElementsByTagName('tbody')[0];;
  while (table.rows.length > 1) {
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

/* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
  document.getElementById("main").style.marginLeft = "250px";
}
  
/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  document.getElementById("main").style.marginLeft = "0";
}