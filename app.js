const express = require("express");
const app = express();
const PORT = 3200;

//public - name static files

app.use(express.static('public'));

app.set("view engine", "pug");

//data base connecting
const mysql = require('mysql');

//что бы получить боди ажакс запроса
app.use(express.json());

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
    let cat = new Promise((resolve, reject) =>{
        con.query('select id,name, cost, image, category from (select id,name,cost,image,category, if(if(@curr_category != category, @curr_category := category, \'\') != \'\', @k := 0, @k := @k + 1) as ind   from goods, ( select @curr_category := \'\' ) v ) goods where ind < 3', (err, result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
    let catDescription = new Promise((resolve, reject) =>{
        con.query('select * from category', (err, result)=>{
            if(err) return reject(err);
            resolve(result);
        });
    });
    Promise.all([cat, catDescription]).then((value)=>{
        res.render('index', {
            goods: JSON.parse(JSON.stringify(value[0])),
            cat: JSON.parse(JSON.stringify(value[1]))
        });
    });
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
        // console.log(value);
        res.render('categories', {
            cat: JSON.parse(JSON.stringify(value[0])),
            goods: JSON.parse(JSON.stringify(value[1]))
        });
    });
});

app.get('/goods', (req, res) => {
    // console.log(res);
    con.query(`SELECT * FROM goods WHERE id=${req.query.id}`, (err, result)=>{
        if (err) throw err;
        res.render('goods', {goods: JSON.parse(JSON.stringify(result))});
    });
});

app.post('/get-category-list', (req, res) => {
  // console.log(req.body);
    con.query('SELECT id, category FROM category', (err, result)=>{
        if (err) throw err;
        res.json(result);
    });
});

app.post('/get-goods-info', (req, res) => {
    // console.log(req.body.key);
    if(req.body.key.length != 0){
        con.query('SELECT id, name, cost FROM goods WHERE id IN ('+ req.body.key.join(",") +')', (err, result)=>{
            if (err) throw err;
            const goods = {};
            result.forEach((item)=>{
                goods[item['id']] = item;
            });
            res.json(goods);
        });
    } else {
        res.send('0');
    }
});