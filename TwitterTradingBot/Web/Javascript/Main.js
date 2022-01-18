// Get the Tweets gathered within python and display them in the table
async function getTweets(User) {
    let TweetArray = await eel.FindTweetsPY(User)()
    TweetList.innerHTML = "";
    for (var i=0; i<TweetArray.length; i+=2) {
        var newTweetForm = document.createElement("LI");
        newTweetForm.id = "form"+i;
        document.getElementById("TweetList").appendChild(newTweetForm);

        var newTweetLinkTweet = document.createElement("a");
        newTweetLinkTweet.id = "formTweet";
        newTweetLinkTweet.classList.add("GeneralText");
        newTweetLinkTweet.innerHTML = TweetArray[i];
        document.getElementById("form"+i).appendChild(newTweetLinkTweet);

        var newTweetDateCreated = document.createElement("a");
        newTweetDateCreated.id = "formDateCreated";
        newTweetDateCreated.classList.add("GeneralText");
        newTweetDateCreated.innerHTML = TweetArray[i+1];
        document.getElementById("form"+i).appendChild(newTweetDateCreated);
    }
}



// Get the Orders gathered within python and display them in the table
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



// Functions to show Portfolio/ Account Data
// Get Account Data from python and display the data
async function GetPortfolioPL() {
  let PortfolioPL = await eel.GetAccountData()()
  
  document.getElementById("DayPL").innerText = PortfolioPL[0];
  document.getElementById("BuyingPower").innerText = PortfolioPL[1];
  document.getElementById("Cash").innerText = PortfolioPL[2];
  document.getElementById("LongMarketValue").innerText = PortfolioPL[3];
  document.getElementById("Equity").innerText = PortfolioPL[4];
}

// Function to get Portfolio Data e.g. what stocks and quantity of each
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
        cell.innerHTML = '<input type="button" id="Buybtn" value="Buy" onclick="PortfolioModalStockQuantity(\''+Buy+'\', \''+PortfolioArray[i][0]+'\', \''+PortfolioArray[i][1]+'\');">';
        
        var cell = row.insertCell(x);
        cell.innerHTML = '<input type="button" id="Sellbtn" value="Sell" onclick="PortfolioModalStockQuantity(\''+Sell+'\', \''+PortfolioArray[i][0]+'\', \''+PortfolioArray[i][1]+'\');">';
      };
    };
  };
};

// Function to send a request to Python to buy a certain stock
eel.expose(BuyStocks);
async function BuyStocks(Side, Stock) {
  var Stock = document.getElementById("StockToBuy").value;
  var Quantity = document.getElementById("QuantityToBuy").value;
  var Side = document.getElementById("SideToBuy").value;

  let Status = await eel.Alpaca_Order(Stock, Quantity, Side)();
  document.getElementById("Status").innerHTML = Status;
}

// Display modal where user can Sell/ Buy stocks
function PortfolioModalStockQuantity(Side, Stock, CurrentAmount){
  document.getElementById("PortfolioModal").style.display = "block";
  document.getElementById("QuantityInput").value = null;

  document.getElementById("TextToShow").innerText = "How many " + Stock + " would you like to " + Side + ":";
  document.getElementById("QuantitySubmitBtn").onclick = function() {EditStockQuantity(Side, Stock, CurrentAmount)};
}

// Function to buy or sell stock within Portfolio
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



// Start Twitter Stream within Python ---------------------------
// General function to get Followers, which then returns array of follows
eel.expose(GetFollowers);
function GetFollowers(Direction) {
  const TwitterNameList = [];
  fetch('../AccountsToTrack.txt')
  .then(response => response.text())
  .then((data) => {
    var lines = data.split('\n');
    for(var line = 0; line < lines.length; line++){
      if (lines[line].indexOf(' ') !== -1) {
        console.log('string is empty or only contains spaces');
      }
      else if (lines[line].trim()) {
        TextToAdd = lines[line].replace(/(\r\n|\n|\r)/gm, "");
        TwitterNameList.push(TextToAdd);
      }
    };
    if (Direction == "DisplayFollowers") {
      DisplayFollowers(TwitterNameList);
    }
  })
  if (Direction == "StartTwitterStream") {
    return TwitterNameList;
  }
}

// Start Twitter Stream start of program
function StartTwitterStream() {
  var Followers = GetFollowers("StartTwitterStream");
  eel.StartTwitterStream(Followers)();
}

function StartNewTwitterStream(NewFollower) {
  console.log(NewFollower);
  eel.NewFilters(NewFollower)();
}



// Follower Function Section, inc Add/Delete Followers and display ------------------------------------------------
// Display Single Follower - Initiated when new user follows new user
eel.expose(DisplayFollower);
function DisplayFollower(Follower) {
  var table = document.getElementById("FollowerTBL").getElementsByTagName('tbody')[0];
  var row = table.insertRow();

  var cell = row.insertCell(0);
  cell.innerHTML = Follower;

  var cell = row.insertCell(1);
  cell.innerHTML = '<input type="button" id="UnFollowbtn" value="Unfollow" onclick="DeleteFollower(\''+Follower+'\');">';
}

// Display all Followers, called when page first loads up
eel.expose(DisplayFollowers);
async function DisplayFollowers(Followers) {
  var UsersBio = await eel.GetUsersBio(Followers)();

  for (var i=0; i<Followers.length; i++) {
    const Follower = Followers[i];

    var FollowerListRow = document.createElement("LI");
    FollowerListRow.classList.add("form"+i);
    FollowerListRow.id = "Followerform"+i;
    document.getElementById("FollowerList").appendChild(FollowerListRow);

    var FollowerUsername = document.createElement("a");
    FollowerUsername.classList.add("UsernameText");
    FollowerUsername.id = "FollowerformUsername";
    FollowerUsername.innerHTML = "@" + Followers[i];
    FollowerUsername.addEventListener('click', function() { GetFollowerData(Follower) });
    document.getElementById("Followerform"+i).appendChild(FollowerUsername);

    var UnfollowerButton = document.createElement("a");
    UnfollowerButton.id = "FollowerformUnfollow";
    UnfollowerButton.innerHTML = '<input type="button" id="UnFollowbtn" value="Unfollow" onclick="DeleteFollower(\''+Followers[i]+'\', \''+i+'\');">';
    document.getElementById("Followerform"+i).appendChild(UnfollowerButton);

    var FollowerBio = document.createElement("a");
    FollowerBio.classList.add("GeneralText");
    FollowerBio.id = "FollowerformBio";
    FollowerBio.innerHTML = UsersBio[i];
    FollowerBio.addEventListener('click', function() { GetFollowerData(Follower) });
    document.getElementById("Followerform"+i).appendChild(FollowerBio);   
  }
}

function GetFollowerData(User) {
  eel.GetUsersData(User)();
}

eel.expose(FollowersModal);
function FollowersModal(User, UserData, UserBio) {
  document.getElementById("FollowerTweetsModal").style.display = "block";
  document.getElementById("FollowerTweetsModalUserName").innerText = User;
  document.getElementById("FollowerTweetsModalFollowers").innerText = "Followers: " + UserData[0];
  document.getElementById("FollowerTweetsModalFollowing").innerText = "Following: " + UserData[1];
  document.getElementById("FollowerTweetsModalBio").innerText = UserBio;
  document.getElementById("TweetList").innerHTML = "";

  getTweets(User);
}

// Delete Follower, Called when user unfollows a user
function DeleteFollower(Follower, i) {
  console.log(Follower);
  var row = document.getElementById("Followerform"+i);
  row.parentNode.removeChild(row);

  eel.DeleteFollower(Follower)();
}

// Display modal where user can Follow new user
function FollowerModalStockQuantity(){
  document.getElementById("FollowerModal").style.display = "block";
  document.getElementById("FollowerInput").value = null;

  document.getElementById("TextToShow").innerText = "Who would you like to Follow: ";
  document.getElementById("FollowerSubmitBtn").onclick = function() {AddFollower()};
}

function AddFollower() {
  var Follower = document.getElementById("FollowerInput").value;
  eel.AddFollower(Follower)();
}

// Add Follower, called when user follows new user
eel.expose(AddFollowerToTable);
function AddFollowerToTable(Follower) {
  var table = document.getElementById("FollowerTBL").getElementsByTagName('tbody')[0];
  var row = table.insertRow();
  row.id = Follower;

  var cell = row.insertCell(0);
  cell.innerHTML = Follower;

  var cell = row.insertCell(1);
  cell.innerHTML = '<input type="button" id="Buybtn" value="Unfollow" onclick="DeleteFollower(\''+Follower+'\');">';

  AddFollowerStatus("You're now Following: " + Follower)
}

eel.expose(AddFollowerStatus);
function AddFollowerStatus(Status) {
  document.getElementById("StatusOfFollower").innerText = Status;
  StartNewTwitterStream()();
}



// Bought Function Section, Section to show what stocks have been bought becuase of what tweets
// AddRow for when User follows new user which then needs to be added to the table
function AddRowToAutomatedBotList(Username, Tweet, StockBought, i) {
  var newTweetForm = document.createElement("LI");
  newTweetForm.classList.add("form"+i);
  newTweetForm.id = "NewTweetform"+i;
  document.getElementById("BoughtTweetList").appendChild(newTweetForm);

  var newUsername = document.createElement("a");
  newUsername.classList.add("UsernameText");
  newUsername.id = "NewTweetform"+"Username";
  newUsername.innerHTML = "@" + Username + " Said:";
  document.getElementById("NewTweetform"+i).appendChild(newUsername);

  var newTweet = document.createElement("a");
  newTweet.classList.add("GeneralText");
  newTweet.id = "NewTweetform"+"Tweet";
  newTweet.innerHTML = Tweet;
  document.getElementById("NewTweetform"+i).appendChild(newTweet);

  var newStockBought = document.createElement("a");
  newStockBought.classList.add("GeneralText");
  newStockBought.id = "NewTweetform"+"StockBought";
  newStockBought.innerHTML = "Bought: " + StockBought;
  document.getElementById("NewTweetform"+i).appendChild(newStockBought);
}

// Update bought tweets is used to find the last 3 lines of the text document,
// Uses these lines to call AddRow function so that the lines are added to table
eel.expose(UpdateBoughtTweets);
function UpdateBoughtTweets() {
  if (document.URL.includes("Automatic.html")){
    fetch('../StockTweetsBought.txt')
    .then(response => response.text())
    .then((data) => {
      var lines=data.split(/\r\n/);
      var Username = lines[(lines.length)-4];
      var Tweet = lines[(lines.length)-3];
      var StockBought = lines[(lines.length)-2];
      var index = (((lines.length)-1)/3);

      AddRowToAutomatedBotList(Username, Tweet, StockBought, index);
    })
  }
};

// ReadTextFile is a function to simply return each line of the text file as an array for use in other functions
// And is used to add each user to the table 
eel.expose(ReadTextFile);
function ReadTextFile() {
  fetch('../StockTweetsBought.txt')
  .then(response => response.text())
  .then((data) => {
    var lines=data.split(/\r\n/);
    var IterationNum = (((lines.length)-1)/3);

    for (var i=0; i<IterationNum; i++){
      var index = (i*3);
      var Username = lines[(lines.length)-index-4];
      var Tweet = lines[(lines.length)-index-3];
      var StockBought = lines[(lines.length)-index-2];
      
      AddRowToAutomatedBotList(Username, Tweet, StockBought, i);
    }
  })
};



// Modal JS ----------------------------------------------------------------------------
// Portfolio Modal ---------------------------------------------------------------------
// When the user clicks on <span> (x), close the modal
function CloseModalFunc(ID, StatusID) {
  if (StatusID != "Empty") {
    document.getElementById(StatusID).innerText = "";
  }
  document.getElementById(ID).style.display = "none";
  
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