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
        function (err, response) {
            if(err) throw err;

            // console.log(res);
            const goods = {};
            response.forEach((item, idx)=>{
               goods[idx] = item;
            });
            res.render('main', {
                foo: 4,
                bar: 7,
                goods: JSON.parse(JSON.stringify(goods))
            });
        }
    );
});

app.get('/cat', (req, res) => {
    const catId = req.query.id;
    const cat = new Promise(function (resolve, reject) {
        con.query(
        `SELECT * FROM category WHERE id=${catId}`,
        function (err, response) {
            if (err) reject(err);
            resolve(response);
        });
    });
    const goods = new Promise(function (resolve, reject) {
        con.query(
        `SELECT * FROM goods WHERE category=${catId}`,
        function (err, result) {
            if (err) reject(err);
            resolve(result);
        });
    });
    Promise.all([cat, goods]).then(function (value) {
        console.log(value);
        res.render('categories', {
            cat: JSON.parse(JSON.stringify(value[0])),
            goods: JSON.parse(JSON.stringify(value[1]))
        });
    });
});
