const express = require('express')


const feedbackRoute = require('./routes/feedback');
const aiRoute = require('./routes/ai')

const app = express()
const port = process.env.PORT || 5000

require('./initDB')();

app.use(express.json());

app.use('/api/feedback', feedbackRoute);
app.use('/api/ai', aiRoute)

app.listen(port, () => console.log(`ONOBOT listening on http://localhost:${port}!`))