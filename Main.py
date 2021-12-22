import tkinter
from tkinter import *
import tweepy

API_KEY = '1ERko18WmPT8CrcvtR14WImpm'
API_SECRET_KEY = 'aCQ8j5mc4lvOOmVZSqvHCD6X1fANQxzim23lz2lVuzFOYqIlCE'
ACCESS_TOKEN = '1337392050803761154-ma914HbmzzukYazAD8NFqk5yICoOjM'
ACCESS_TOKEN_SECRET = 'M7sReDo1EZMQgkDOheokAxpR9ecaoJKbVLX808mAgTnq9'

auth = tweepy.OAuthHandler(API_KEY, API_SECRET_KEY)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)

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

window.mainloop()