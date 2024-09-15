import pandas as pd
import praw
from praw.models import MoreComments
import requests
from bs4 import BeautifulSoup
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Reddit API credentials
clientId = 'j9xx6ZwvWE91ykFNaKLMDw'
clientSecret = 'rQIdac7AGHZ8njpAPogBlhlVNFjPeg'
userAgent = 'my_reddit_scraper/1.0'

# Initialize Reddit API
reddit = praw.Reddit(client_id=clientId,
                     client_secret=clientSecret,
                     user_agent=userAgent,
                     username='BlackberryOk8487',
                     password='password123')

# Function to search Reddit
def search_reddit(query, subreddit_name='all', limit=5):
    search_results = reddit.subreddit(subreddit_name).search(query, limit=limit)
    
    result = ""
    
    for submission in search_results:
        submission.comments.replace_more(limit=0)
        for comment in submission.comments.list():
            result += comment.body + "\n"
    
    return result

# Flask route to handle Reddit search
@app.route('/search-reddit', methods=['GET'])
def search_reddit_route():
    print("got here1")
    query = request.args.get('query')
    subreddit = request.args.get('subreddit', default='all')
    limit = int(request.args.get('limit', default=1))
    print("got here2")
    if not query:
        return jsonify({'error': 'Query parameter is required'}), 400
    
    # Call the search_reddit function
    results = search_reddit(query, subreddit_name=subreddit, limit=limit)
    print("got here 3")
    return jsonify({'results': results})

# Run the app
if __name__ == '__main__':
    app.run(debug=True)