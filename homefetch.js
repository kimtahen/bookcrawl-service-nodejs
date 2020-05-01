const axios = require('axios');
const cheerio = require('cheerio');

module.exports = function(){
	let list = [];
	return axios.get('https://thebook.io/')
	.then(data=>{
		const $ = cheerio.load(data.data);
		$('a.mdl-button').each((index,item)=>{
			list.push({
			text : item.children[0].data.replace(/^\s+|\s+$/g,''),
			link : item.attribs.href.substring(19,this.length)
			})
		});
		return list;
	});
}

