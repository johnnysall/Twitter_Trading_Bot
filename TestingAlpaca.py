import tkinter
from tkinter import *
import tweepy
import alpaca_trade_api as tradeapi

Alpaca_Endpoint = "https://paper-api.alpaca.markets"
Alpaca_API_Key = "PKPKLT6IQAA8XS3D88Q0"
Alpaca_Secret_Key = "zRQ7pCN01WLGDXToqPlnKiveTYzRikZlvgToCgow"

Alpaca_API = tradeapi.REST(Alpaca_API_Key, Alpaca_Secret_Key, Alpaca_Endpoint)
Alpaca_Account = Alpaca_API.get_account()
print (Alpaca_Account.status)

#Submit market order 
Alpaca_API.submit_order(
    symbol="AAPL",
    qty=1,
    side="buy",
    type="market",
    time_in_force="gtc"
)

# Get a list of all of our positions.
portfolio = Alpaca_API.list_positions()

# Print the quantity of shares for each position.
for position in portfolio:
    print("{} shares of {}".format(position.qty, position.symbol))
