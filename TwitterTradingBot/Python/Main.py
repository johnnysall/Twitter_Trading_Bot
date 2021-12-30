from os import stat
import tkinter
from tkinter import *
import tweepy
import alpaca_trade_api as tradeapi
from tweepy import auth
from Credentials import *
import eel
import pandas as pd
import datetime

# Configuring Eel ----------------------------------
# Comment out first one when on PC, Comment Second when on Laptop
#eel.init('C:/Users/Johnny Salloway/Documents/Coding/GitHub/Twitter_Trading_Bot/TwitterTradingBot/Web', allowed_extensions=['.js', '.html','.css'])
eel.init('D:/JohnSall/Documents/Uni/GitHub/Twitter_Trading_Bot/TwitterTradingBot/Web', allowed_extensions=['.js', '.html','.css'])

# Configuring Alpaca API ---------------------------
Alpaca_API = tradeapi.REST(Alpaca_API_Key, Alpaca_Secret_Key, Alpaca_Endpoint)
Alpaca_Account = Alpaca_API.get_account()

# Configuring Twitter API ---------------------------
Twitter_Auth = tweepy.OAuthHandler(Twitter_API_Key, Twitter_Secret_API_Key)
Twitter_Auth.set_access_token(Twitter_Access_Token, Twitter_Access_Token_Secret)
Twitter_API = tweepy.API(Twitter_Auth, wait_on_rate_limit=True)


# Function to add Tweets to list ------------------
@eel.expose
def FindTweetsPY():
    print("IT WORKED")
    # Find Tweets by "userID" ----------------------------
    userID = "MrZackMorris"
    tweets = Twitter_API.user_timeline(screen_name=userID, 
    # 200 is the maximum allowed count
    count=200,
    include_rts = False,
    # Necessary to keep full_text 
    # otherwise only the first 140 words are extracted
    tweet_mode = 'extended')

    TweetList = []
    for info in tweets[:25]:
        TweetList.append(info.user.screen_name + " Said:")
        TweetList.append(info.full_text)
    return TweetList


# Function to Add all the Orders to the list -------------
@eel.expose
def FindOrdersPY():
    OrderList = []
    ClosedOrders = Alpaca_API.list_orders(
        status='all',
        limit=100)
    for info in ClosedOrders:
        SubList = []
        SubList.append(info.symbol)
        SubList.append(info.qty)
        SubList.append(info.side)
        SubList.append(info.status)
        OrderList.append(SubList)
    return OrderList


# Market Order sent to Alpaca API (Side = Buy/ Short/ Sell)
@eel.expose
def Alpaca_Order(symbol, qty, side):
    try:
        Alpaca_API.submit_order(
            symbol=symbol.upper(),
            qty=qty,
            side=side.lower(),
            type='market',
            time_in_force='gtc')
        CurrentPrice = Alpaca_API.get_last_trade(symbol.upper())
        Status = qty + " " + symbol.upper() + " " + "Bought @" + str(CurrentPrice.price) + ", Total: £" + str(int(CurrentPrice.price)*int(qty))
    except:
        Status = "Invalid details"
    return Status


# Pull Portfolio from Alpaca API -----------------------
@eel.expose
def GetPortfolioPY():
    # Get a list of all of our positions.
    Portfolio = Alpaca_API.list_positions()
    PortfolioList = []

    for info in Portfolio:
        SubList = []
        SubList.append(info.symbol)
        SubList.append(info.qty)
        SubList.append("{:.2f}".format(float(info.market_value)/float(info.qty)))
        PortfolioList.append(SubList)
    return PortfolioList

# Start eel - establish connection from Python to Javascript
eel.start('Index.html')
