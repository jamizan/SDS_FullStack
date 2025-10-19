const express = require('express');
const path = require('path');
require('dotenv').config({ path: '.env' });

const app = express();

// setup static folder
//app.use(express.static(path.join(__dirname, 'public')));


app.listen(process.env.PORT, () => console.log('Server running on port ' + process.env.PORT));

