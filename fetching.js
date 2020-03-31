const axios = require('axios');
const cheerio = require('cheerio');

module.exports = (booknum) =>{
    let $href = [];
    let bookContents = "";
    return axios.get(`https://thebook.io/${booknum}`)
        .then(dataa=>{
            const $ = cheerio.load(dataa.data);
            $('section.book-toc>ul>li>a').each((index, item)=>{$href.push(item.attribs.href)});

            function contentLoad(URL){
                return new Promise((resolve, reject)=>{
                    axios.get(`https://thebook.io${URL}`)
                        .then(res=>{
                            const $ = cheerio.load(res.data);
                            bookContents += `<div style="border: 1px solid black;padding: 0 10px;">${$.html($('section#page_content'))}</div><br>`;
                        })
                        .then(()=>{
                            resolve();
                        });
                })
            }

            return (async ()=>{
                for(let i = 0; i<$href.length; i++){
                    await contentLoad($href[i]);
                }
                return Promise.resolve(bookContents);
            })();

        })



};
