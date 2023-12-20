const express = require('express');

const routes = require('./routes/index');

const port = process.env.PORT || 5000;
const app = express();

app.use('/', routes);
const host = '0.0.0.0';
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
export default app;
