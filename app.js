const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const list = require('./homefetch.js');
const loading = require('./fetching.js');

const app = express();

const ssrData = {};

app.get('/home',(req,res,err)=>{
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write('<h2>Book List</h2>')
    list().then((list)=>{
        for(let i = 0; i<list.length; i++){
            res.write(`<div><p><a href="/book?id=${list[i].link}">${list[i].text} ${list[i].link}</a></p></div>`)
        }
        res.end();
    })
});
	
app.get('/book', (req, res, err) => {
    const booknum = req.query.id;
    res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
    res.write(`<html><head><title>theBook 쉽게보기</title></head><body><div style="width: 700px;margin: 0 auto;">` );
    if (!ssrData[booknum]) {
        console.log('making ssr rendering');
        res.write('Loading...');
        loading(booknum)
            .then(bookContents=>{
                ssrData[booknum] = bookContents;
                res.write(ssrData[booknum]);
                res.write('</div></body></html>');
                res.end();
            })
            .catch(()=>{
                res.write('<h1>404 ERROR</h1>');
                res.write('</div></body></html>');
                res.end();
            })
    } else {
        res.write(ssrData[booknum]);
        res.write('</div></body></html>');
        res.end();
    }

});
app.listen(3000, () => {
    console.log('listening from 3000')
});


