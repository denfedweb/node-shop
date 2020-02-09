const express = require("express");
const app = express();
const PORT = 3100;

//public - name static files

app.use(express.static('public'));

app.set("view engine", "pug");

//data base connecting
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "!Fedorovici228",
    database: "shop"
});

app.listen(PORT || 3000, ()=>{
    console.log(`server started on port: ${PORT}`);
});

app.get('/', (req, res) => {
    con.query(
        'SELECT * FROM goods',
        function (err, res) {
            if(err) throw err;

            console.log(res);

        }
    );
    res.render('main', {
        foo: 4,
        bar: 7
    });
});

