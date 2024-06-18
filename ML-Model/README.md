<div align="center">

# Predictor Model: Details
  
</div>

***
## NBA Data Web Scraping:
**Basketball Data Source:** https://www.basketball-reference.com <br>
**Year Timeline**: 2015-16 till 2023-24 NBA Season (8 seasons) <br> <br>
For ML model training, it is best to use as many data points and datasets (season years) as possible for optimal accuracy. 
However, given the nature of the game, I had to also consider the relevance of the timeframe I was choosing (ex. a game from 15 years ago would not be relevant to predict a game from this year).
Using both technical research and my knowledge of the game, I decided to keep the [2015 - 2016 NBA Season](https://www.nba.com/news/history-season-review-2015-16) as the starting point of my web scraping as it marks several key trends and shifts in the NBA that are relevant to modern basketball, including:

- **Three-Point Revolution**: The emphasis on three-point shooting and "spreading the floor out" became much more pronounced around this time, largely influenced by Stephen Curry and the Golden State Warriors.
- **Advanced Metrics**: Increased reliance on advanced metrics and analytics to guide team strategies and player evaluations.
- **Player Mobility**: Greater player movement through free agency and trades, leading to the formation of super teams and significant shifts in team dynamics.
- **Rule Changes**: Various rule changes aimed at increasing the pace of the game and scoring.

Refer to the [`NBA_DataScraping.ipynb`]() file for my web data scraping process.

***
## Machine Learning Model Training:
