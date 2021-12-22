from tkinter import *
import tweepy
import alpaca_trade_api as tradeapi

Alpaca_Endpoint = "https://paper-api.alpaca.markets"
Alpaca_API_Key = "PKPKLT6IQAA8XS3D88Q0"
Alpaca_Secret_Key = "zRQ7pCN01WLGDXToqPlnKiveTYzRikZlvgToCgow"

Alpaca_API = tradeapi.REST(Alpaca_API_Key, Alpaca_Secret_Key, Alpaca_Endpoint)
Alpaca_Account = Alpaca_API.get_account()

root = Tk()
root.geometry("400x200")



root.mainloop()