const express = reqquire('express');

const port = process.env.PORT || 5000;
const app = express();


app.listen((port) => {
    console.log(`Server running on port ${port}`);
})
module.exports = app;
