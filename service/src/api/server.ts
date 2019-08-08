require('dotenv').config();
//require('./server/db-conn');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// gives server access to static files generated by running yarn build in client
app.use(express.static('./client/build/'));

// mount routes
app.use('/api/global/', require('./global-route').router);

// the asterisk is very important!! as it allows client side routing
// with react-router or w/e client side routing package you use
app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: __dirname + '/client/build/' });
  });

const port = process.env.PORT || 8001;
app.listen(port, () => console.log(`DivEnact running on port ${port}`));