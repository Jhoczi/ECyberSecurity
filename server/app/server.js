const express = require('express');
const cors = require('cors');

const app = express();

const corOptions = {
    origin: 'http://localhost:8081'
};

app.use(cors(corOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const Role = db.roles;

db.sequelize.sync({ force: true }).then(() => {
    console.log('Drop and Resync Db');
    initial();
});

function initial() {
    Role.create({
        id: 1,
        name: 'user'
    });
    Role.create({
        id: 2,
        name: 'admin'
    });
}

// routes
app.get("/", (req,res) => {
    res.json({message: "Welcome to the API App."});
});
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

// set ports
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});