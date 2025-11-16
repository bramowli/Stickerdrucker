const express = require('express')
const app = express()
const port = 3000

app.get('/', function(req,res) {
  res.sendFile('public/index.html', { root: __dirname });
});

app.get(/^(.+)$/, function(req, res) {
    res.sendFile('public/' + req.params[0], { root: __dirname });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
