import tkinter
from tkinter import *
import tweepy
import alpaca_trade_api as tradeapi
from Credentials import *

Alpaca_API = tradeapi.REST(Alpaca_API_Key, Alpaca_Secret_Key, Alpaca_Endpoint)
Alpaca_Account = Alpaca_API.get_account()

Twitter_Auth = tweepy.OAuthHandler(Twitter_API_Key, Twitter_Secret_API_Key)
Twitter_Auth.set_access_token(Twitter_Access_Token, Twitter_Access_Token_Secret)

Twitter_API = tweepy.API(Twitter_Auth)

window = Tk()

# Get a list of all of our positions.
portfolio = Alpaca_API.list_positions()

# Print the quantity of shares for each position.
for position in portfolio:
    print("{} shares of {}".format(position.qty, position.symbol))

#Function to buy the stock 
def Buy_Stock():
    Ticker = Ticker_To_Buy_Entry.get()
    Quantity = Quantity_To_Buy_Entry.get()
    Side = Side_To_Buy_Entry.get()

    try:
        float(Quantity)
        Side.lower()
        if isinstance(Ticker, str) == True:
            if Side == "buy" or Side == "short":
                try:
                    Alpaca_API.submit_order(
                        symbol=Ticker.upper(),
                        qty=Quantity,
                        side=Side,
                        type='market',
                        time_in_force='gtc'
                    )
                    validation.config(text="Buy Complete")
                except:
                    validation.config(text="Ticker Doesnt Exist")
            else:
                validation.config(text="Enter BUY/ SHORT")
        else:
            validation.config(text="Enter a valid ticker")
    except ValueError:
        validation.config(text="Enter a number")

#Label + Entry for Ticker
Ticker_To_Buy_Label = Label(window, text="Ticker:")
Ticker_To_Buy_Label.pack()
Ticker_To_Buy_Entry = Entry(window)
Ticker_To_Buy_Entry.pack()

#Label + Entry for Quantity
Quantity_To_Buy_Label = Label(window, text="Quantity:")
Quantity_To_Buy_Label.pack()
Quantity_To_Buy_Entry = Entry(window, textvariable="Quanity")
Quantity_To_Buy_Entry.pack()

#Label + Entry for Side
Side_To_Buy_Label = Label(window, text="Side:")
Side_To_Buy_Label.pack()
Side_To_Buy_Entry = Entry(window, textvariable="Side")
Side_To_Buy_Entry.pack()

#Buy Button
Ticker_To_Buy_Button = Button(window, text="Buy", command=Buy_Stock)
Ticker_To_Buy_Button.pack()

#Label for the validation text e.g. Buy Complete
validation = Label(window, text="")
validation.pack()

TweetListbox = Listbox(window, width=140)

TweetListbox.pack()

userID = "MrZackMorris"
tweets = Twitter_API.user_timeline(screen_name=userID, 
    # 200 is the maximum allowed count
    count=200,
    include_rts = False,
    # Necessary to keep full_text 
    # otherwise only the first 140 words are extracted
    tweet_mode = 'extended'
    )

Tweetnum = 0
for info in tweets[:10]:
    TweetListbox.insert(Tweetnum, info.full_text)
    Label(window, text=info.full_text).pack()
    Tweetnum += 1

window.mainloop()