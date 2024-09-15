import pandas as pd
import praw
from praw.models import MoreComments
import requests
from bs4 import BeautifulSoup
import argparse

clientId = 'j9xx6ZwvWE91ykFNaKLMDw'
clientSecret = 'rQIdac7AGHZ8njpAPogBlhlVNFjPeg'
userAgent = 'my_reddit_scraper/1.0'

# Reddit API credentials
reddit = praw.Reddit(client_id=clientId,
                     client_secret=clientSecret,
                     user_agent=userAgent,
                     username='BlackberryOk8487',
                     password='password123')

def search_reddit(query, subreddit_name='all', limit=5):
    search_results = reddit.subreddit(subreddit_name).search(query, limit=limit)
    
    result = ""
    
    for submission in search_results:
        submission.comments.replace_more(limit=0)
        for comment in submission.comments.list():
            result += comment.body + "\n"
    
    return result

def main():
    parser = argparse.ArgumentParser(description='Search Reddit and return relevant posts.')
    parser.add_argument('--query', type=str, required=True, help='Search query for Reddit posts')
    parser.add_argument('--subreddit', type=str, default='all', help='Subreddit to search in (default: all)')
    parser.add_argument('--limit', type=int, default=5, help='Number of posts to return (default: 5)')
    
    args = parser.parse_args()
    
    results = search_reddit(args.query, subreddit_name=args.subreddit, limit=args.limit)

    print(results)

if __name__ == '__main__':
    main()
