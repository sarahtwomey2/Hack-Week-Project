#!/usr/bin/python3
#this bot posts text to a subreddit, specifically a hard-coded link to an image
#to connect this to the website we should change the title variable to whatever the user wants it to be
#and change the structure varaible to a link to the meme the user created.

import praw
import pdb
import re
import os
import logging
import subprocess
import requests
import webbrowser


#Reddit instance
reddit = praw.Reddit('bot1')

subreddit = reddit.subreddit('memezou')


title = "Hello World"
structure = "https://i.pinimg.com/736x/05/91/fd/0591fdd8374b00d310d11d87c6150f88--excited-cat-beautiful-love.jpg"

message = subreddit.submit(title, structure, send_replies=False)
print("posting to r/memezou")
