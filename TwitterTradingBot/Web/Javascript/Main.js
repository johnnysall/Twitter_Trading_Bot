

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

async function GetPortfolioPL() {
  let PortfolioPL = await eel.GetAccountData()()
  
  document.getElementById("DayPL").innerText = PortfolioPL[0];
  document.getElementById("BuyingPower").innerText = PortfolioPL[1];
  document.getElementById("Cash").innerText = PortfolioPL[2];
  document.getElementById("LongMarketValue").innerText = PortfolioPL[3];
  document.getElementById("Equity").innerText = PortfolioPL[4];
}

async function getPortfolio() {
  let PortfolioArray = await eel.GetPortfolioPY()()
  
  var table = document.getElementById("PortfolioTBL").getElementsByTagName('tbody')[0];
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }
  for (var i=0; i<PortfolioArray.length; i++) {
    var row = table.insertRow();
    for (var x=0; x<5; x++){
      if (x<4) {
        var cell = row.insertCell(x);
        cell.innerHTML = PortfolioArray[i][x];
      } 
      else {
        var Sell = "sell";
        var Buy = "buy";

        var cell = row.insertCell(x);
        cell.innerHTML = '<input type="button" id="Buybtn" value="Buy" onclick="ModalStockQuantity(\''+Buy+'\', \''+PortfolioArray[i][0]+'\', \''+PortfolioArray[i][1]+'\');">';
        
        var cell = row.insertCell(x);
        cell.innerHTML = '<input type="button" id="Sellbtn" value="Sell" onclick="ModalStockQuantity(\''+Sell+'\', \''+PortfolioArray[i][0]+'\', \''+PortfolioArray[i][1]+'\');">';
      };
    };
  };
};

eel.expose(BuyStocks);
async function BuyStocks(Side, Stock) {
  var Stock = document.getElementById("StockToBuy").value;
  var Quantity = document.getElementById("QuantityToBuy").value;
  var Side = document.getElementById("SideToBuy").value;

  let Status = await eel.Alpaca_Order(Stock, Quantity, Side)();
  document.getElementById("Status").innerHTML = Status;
}

function ModalStockQuantity(Side, Stock, CurrentAmount){
  modal.style.display = "block";
  document.getElementById("QuantityInput").value = null;

  document.getElementById("TextToShow").innerText = "How many " + Stock + " would you like to " + Side + ":";
  document.getElementById("QuantitySubmitBtn").onclick = function() {EditStockQuantity(Side, Stock, CurrentAmount)};
}

async function EditStockQuantity(Side, Stock, CurrentAmount, OrderAmount){
  OrderAmount = parseInt(document.getElementById("QuantityInput").value);
  CurrentAmountInt = parseInt(CurrentAmount);

  if (OrderAmount > 0) {
    if (Side === "buy"){
      let Status = await eel.Alpaca_Order(Stock, OrderAmount, Side)();
      document.getElementById("StatusOfQuantity").innerText = Status;
    }
    else {
      if (CurrentAmount >= OrderAmount) {
        let Status = await eel.Alpaca_Order(Stock, OrderAmount, Side)();
        document.getElementById("StatusOfQuantity").innerText = Status;
      }
      else {
        document.getElementById("StatusOfQuantity").innerText = "Please enter a Valid Number";
      }
    }
  }
  else{
    document.getElementById("StatusOfQuantity").innerText = "Please enter a Number";
  }

  
}


// Opening/ Closing Side Navigation Bar ------------------------
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



// Modal JS -----------------------------------------------------
// Get the modal
var modal = document.getElementById("myModal");

// When the user clicks on <span> (x), close the modal
function CloseModalFunc() {
  modal.style.display = "none";
  document.getElementById("StatusOfQuantity").innerText = "";
}





// Account Cash Pie Chart ----------------------------------------------------------
// Portfolio Pie Chart ----------------------------------------------------------
// Get Element to put Chart into
var PortfolioPCCanvas = document.getElementById('PortfolioPC');

// Set the data for the chart, including colours of the chart (Portfolio Chart)
var PortfolioPCData = {
  datasets: [
      {
        fill: false,
        backgroundColor: "rgb(44, 44, 44)",
        hoverBackgroundColor: "rgb(27, 27, 27)",
        borderColor: "rgb(0, 195, 255)",
      }
  ]
};

// Get Portfolio data from python and push to Pie Chart
async function PortfolioPieChartfunc() {
  let PortfolioPieChartData = await eel.GetPortfolioPY()();
  SymbolList = [];
  AmountList = [];
  
  for (var i=0; i<(PortfolioPieChartData.length); i++) {
    SymbolList.push(PortfolioPieChartData[i][0]);
    AmountList.push(PortfolioPieChartData[i][3]);
  };

  PortfolioPieChart.data.datasets[0].data = AmountList;
  PortfolioPieChart.data.labels = SymbolList;
  PortfolioPieChart.update();
}


// Create Pie Chart for the portfolio
var PortfolioPieChart = new Chart(PortfolioPCCanvas, {
  type: 'pie',
  data: PortfolioPCData,
  options: {
    maintainAspectRatio: true,
    
    legend: {
      labels: {
        fontColor: "#ccc",
        fontSize: 17.5
      }
    },

    tooltips: {
      enabled: true,
      mode: 'single',
      callbacks: {
        title: function(tooltipItem, data) {
          return data['labels'][tooltipItem[0]['index']];
        },
        label: function(tooltipItem, data) {
          var dataset = data['datasets'][0];
          var percent = Math.round((dataset['data'][tooltipItem['index']] / dataset["_meta"][0]['total']) * 100)
          return "£" + data['datasets'][0]['data'][tooltipItem['index']] + ' (' + percent + '%)';
        }
      },
      backgroundColor: "rgb(100, 100, 100)",
      borderColor: "rgb(0, 195, 255)",
      titleFontSize: 17.5,
      titleFont: "Helvetica,Arial,sans-serif",
      titleFontColor: '#ccc',
      bodyFontColor: '#ccc',
      bodyFont: "Helvetica,Arial,sans-serif",
      bodyFontSize: 14,
      displayColors: false
    }
  }
});