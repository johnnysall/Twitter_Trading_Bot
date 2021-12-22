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















'''
API_KEY = '1ERko18WmPT8CrcvtR14WImpm'
API_SECRET_KEY = 'aCQ8j5mc4lvOOmVZSqvHCD6X1fANQxzim23lz2lVuzFOYqIlCE'
ACCESS_TOKEN = '1337392050803761154-ma914HbmzzukYazAD8NFqk5yICoOjM'
ACCESS_TOKEN_SECRET = 'M7sReDo1EZMQgkDOheokAxpR9ecaoJKbVLX808mAgTnq9'

Twitter_API_Key = '1ERko18WmPT8CrcvtR14WImpm'
Twitter_Secret_API_Key = 'aCQ8j5mc4lvOOmVZSqvHCD6X1fANQxzim23lz2lVuzFOYqIlCE'
Twitter_Access_Token = '1337392050803761154-ma914HbmzzukYazAD8NFqk5yICoOjM'
Twitter_Access_Token_Secret = 'M7sReDo1EZMQgkDOheokAxpR9ecaoJKbVLX808mAgTnq9'

auth = tweepy.OAuthHandler(Twitter_API_Key, Twitter_Secret_API_Key)
auth.set_access_token(Twitter_Access_Token, Twitter_Access_Token_Secret)

api = tweepy.API(auth)

window = Tk()

userID = "MrZackMorris"

tweets = api.user_timeline(screen_name=userID, 
                           # 200 is the maximum allowed count
                           count=200,
                           include_rts = False,
                           # Necessary to keep full_text 
                           # otherwise only the first 140 words are extracted
                           tweet_mode = 'extended'
                           )

for info in tweets[:10]:
    Label(window, text=info.full_text).pack()
    print(info.full_text)
    print("\n")

window.mainloop()'''