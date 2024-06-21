<div align="center">
  
# NBA Fantasy Basketball Assistant

***

🏀 _A full-stack AI application for fantasy basketball enthusiasts._ 🏀

![9ed13d1846a5f262edaea59c29483c02](https://github.com/naishasinha/NBA-Fantasy-Assistant/assets/117387359/b33e4381-c769-42e4-b8f5-d794aebb213b)


***
## Overview 

<div align = "left">
The NBA Fantasy Basketball Assistant is a full-stack AI application designed to provide in-depth analysis and actionable insights for fantasy basketball enthusiasts. Leveraging detailed NBA game statistics, this tool aims to enhance users' decision-making by predicting team performances, analyzing matchups, and offering personalized recommendations.
</div>

## Core Features

<div align = "left">
  
### 📊 Team Performance Analysis
  
→ **Historical Data Insights**: _Analyze historical data over the last nine seasons to predict future team performances._ <br>
→ **Current Form**: _Calculate rolling averages of key statistics over recent games to determine current form and identify trends._

### 🏆 Matchup Analyzer 
→ **Historical Matchup Performance**: _Analyze historical matchups between teams to predict outcomes and evaluate matchup strengths and weaknesses._ <br>
→ **Performance Trends Against Specific Opponents**: _Highlight performance trends against specific types of opponents (e.g., teams with strong defense or high-scoring offenses)._

### 📝 Customizable Recommendations 
→ **User Criteria-Based Recommendations**: _Allow users to prioritize specific statistics and receive tailored recommendations._
</div>

***
## Project Details

### Navigating the Repository:
<table>
  <tr>
    <th>ML-Model</th>
    <td> 
      <ul>
        <li>
          <strong>ML-Model <a href = "ML-Model/README.md">README.md</a> file: </strong> <br> Provides details and explanations behind the web scraping and predictor model training process
        </li>  
      </ul>
    </td>
  </tr>
  
  <tr>
    <th>Client</th>
    <td>
      <ul>
        <li>
          incoming
        </li>  
      </ul>
    </td>
  </tr>
  <tr>
    <th>Server</th>
    <td>
      <ul>
        <li>
          incoming
        </li>  
      </ul>
    </td>
  </tr>
</table>

<div align="left">

```
nba-fantasy-assistant/
├── ml-model/
│   ├── README.md
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.js
│   │   │   ├── Header.css
│   │   │   ├── NavButton.js
│   │   │   ├── NavButton.css
│   │   ├── pages/
│   │   │   ├── TeamPerformanceAnalysis.js
│   │   │   ├── MatchupAnalyzer.js
│   │   │   ├── FantasyRecommendations.js
│   │   ├── App.js
│   │   ├── App.css
│   ├── package.json
├── server/
│   ├── server.js
│   ├── package.json
├── README.md
├── LICENSE
```
  
</div>

### Tech Stack:
incoming

### Running the Application:
<div align="left">

#### Front-End
1. Navigate to the `client` directory:

```
cd client
```

2. Install dependencies:

```
npm install
```

3. Start the React App:

```
npm start
```

#### Back-End
1. Navigate to the `server` directory:

```
cd server
```

2. Install dependencies:

```
npm install
```

2. Start the server:

```
node server.js
```

</div>

**Open your browser and go to `http://localhost:3000` to view the application.**

***
#### This project is [licensed](LICENSE) under the `MIT License`.
##### _Copyright (c) 2024 Naisha Sinha_

***
</div>
