const express = require('express');

const routes = require('./routes/index');

const port = process.env.PORT || 5000;
const host = '127.0.0.1';
const app = express();

app.use('/', routes);

app.listen(host, port, () => {
  console.log(`Server running on port ${port}`);
});
export default app;
