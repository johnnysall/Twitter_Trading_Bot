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

/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("SideNav").style.width = "250px";
    document.getElementById("MainPage").style.marginLeft = "250px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
  }
  
  /* Set the width of the side navigation to 0 */
  function closeNav() {
    document.getElementById("SideNav").style.width = "0";
    document.getElementById("MainPage").style.marginLeft = "0";
    document.body.style.backgroundColor = "white";
  }