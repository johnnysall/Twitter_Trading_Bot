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
import threading
from alpaca_trade_api.stream import Stream
import asyncio
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
import re

#nltk.download()

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
    print(symbol, qty, side)
    try:
        Alpaca_API.submit_order(
            symbol=symbol.upper(),
            qty=int(qty),
            side=side.lower(),
            type='market',
            time_in_force='gtc')
        CurrentPrice = Alpaca_API.get_last_trade(symbol.upper())
        Status = "Order Submitted: " + side.upper() + " " + str(qty) + " " + symbol.upper() + " @" + str(CurrentPrice.price) + ", Total: £" + str(float(CurrentPrice.price)*float(qty))
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
        SubList.append(info.market_value)
        PortfolioList.append(SubList)
    return PortfolioList

@eel.expose
def GetAccountData():
    # Get account info
    Account = Alpaca_API.get_account()

    # Create list which will include all account data to then return to Javascript
    AccountData = []

    # Create variables to append to list -----------------------------------
    # Check our current balance vs. our balance at the last market close
    BalanceChange = float(Account.equity) - float(Account.last_equity)

    AccountData.append("$" + "{:.2f}".format(BalanceChange))
    AccountData.append("$" + "{:.2f}".format(float(Account.buying_power)))
    AccountData.append("$" + "{:.2f}".format(float(Account.cash)))
    AccountData.append("$" + "{:.2f}".format(float(Account.long_market_value)))
    AccountData.append("$" + "{:.2f}".format(float(Account.equity)))

    return AccountData


# Alpaca API Stream -------------------------------------------
@eel.expose
async def trade_callback(t):
    print('trade', t)
    

# Initiate Class Instance
stream = Stream(Alpaca_API_Key,
                Alpaca_Secret_Key,
                base_url=('https://paper-api.alpaca.markets'),
                data_feed='iex')  # <- replace to SIP if you have PRO subscription


@eel.expose
def StartWebSocket():
    # subscribing to event
    stream.subscribe_trades(trade_callback, 'AAPL')
    asyncio.set_event_loop(asyncio.new_event_loop())
    stream.run()

# Twitter (Tweepy) API Stream -------------------------------------------
# Subclass Stream to print IDs of Tweets received
class TweetStreamer(tweepy.Stream):
    global sia
    sia = SentimentIntensityAnalyzer()

    def on_status(self, status):
        words = status.text.upper().split()
        result = [word for word in words if len(word) > 1 and word[0]=="$" and word[1:].isalpha()]

        if len(result) == 1:
            print(result[0])
            print(sia.polarity_scores(status.text))

        else:
            print("Error")

def StartTwitterStream():
    # Initialize instance of the subclass
    Streamer = TweetStreamer(
    Twitter_API_Key, 
    Twitter_Secret_API_Key,
    Twitter_Access_Token, 
    Twitter_Access_Token_Secret)

    # Filter realtime Tweets by keyword
    Streamer.filter(follow=["1337392050803761154"])


def StartApp():
    #print("HEllooooo")
    eel.start('Index.html')

#t1 = threading.Thread(target = StartWebSocket, args=())
#t1.start() 

t2 = threading.Thread(target = StartTwitterStream, args=())
t2.start() 

StartApp()
#t1.join()
t2.join()



