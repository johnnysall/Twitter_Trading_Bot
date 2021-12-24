import tkinter
from tkinter import *
import tweepy
import alpaca_trade_api as tradeapi
from Credentials import *
import eel

eel.init('C:/Users/Johnny Salloway/Documents/Coding/GitHub/Twitter_Trading_Bot/TestingReactPython')

Alpaca_API = tradeapi.REST(Alpaca_API_Key, Alpaca_Secret_Key, Alpaca_Endpoint)
Alpaca_Account = Alpaca_API.get_account()

Twitter_Auth = tweepy.OAuthHandler(Twitter_API_Key, Twitter_Secret_API_Key)
Twitter_Auth.set_access_token(Twitter_Access_Token, Twitter_Access_Token_Secret)

Twitter_API = tweepy.API(Twitter_Auth)

# Get a list of all of our positions.
portfolio = Alpaca_API.list_positions()

# Print the quantity of shares for each position.
for position in portfolio:
    print("{} shares of {}".format(position.qty, position.symbol))

userID = "MrZackMorris"
tweets = Twitter_API.user_timeline(screen_name=userID, 
    # 200 is the maximum allowed count
    count=200,
    include_rts = False,
    # Necessary to keep full_text 
    # otherwise only the first 140 words are extracted
    tweet_mode = 'extended'
    )

@eel.expose
def FindTweetsPY():
    TweetList = []
    for info in tweets[:10]:
        TweetList.append(info.full_text)
    return TweetList

@eel.expose
def testing(text):
    print(text)


eel.start('Main.html')