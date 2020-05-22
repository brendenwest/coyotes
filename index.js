const fs = require('fs')
const fetch = require('node-fetch')
const util = require('util');
const streamPipeline = util.promisify(require('stream').pipeline);

const download = (url, num) => {
	let extension = url.substring(url.lastIndexOf(".")+1)
  fetch(url)
  .then(res => {
	if (!res.ok) {
		throw new Error(`unexpected response ${res.statusText}`);
	}
	return streamPipeline(res.body, fs.createWriteStream(`./images/coyote_${num}.${extension}`, {emitClose: true}));
  })
  .catch(err => console.log('Bad URL: ' + url))
}

fetch('http://www.image-net.org/api/text/imagenet.synset.geturls?wnid=n02114855')
    .then(res => res.text())
    .then(body => body.split("\r\n"))
    .then(urls => {
    	for (num in urls) {
    		download(urls[num], num)
			}
		})
