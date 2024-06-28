const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/api/data', (req,res) => {
    res.json({
        data: "Server data"
    })
})

app.get('/kobe', (req, res) => {
    res.json({
        data: "Kobe Bryant's performance data"
    });
});

app.get('/michael', (req, res) => {
    res.json({
        data: "Michael Jordan's performance data"
    });
});

app.get('/lebron', (req, res) => {
    res.json({
        data: "Lebron James' performance data"
    });
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))