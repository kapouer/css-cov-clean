#!/usr/bin/node

const getopts = require("getopts");
const Uncss = require('../');
const { readFile } = require('fs').promises;


const opts = getopts(process.argv.slice(2), {
	string: ['output'],
	boolean: ['links', 'forms', 'user'],
	default: {
		output: 'output'
	}
});

async function sitemapList(loc) {
	const buf = await readFile(loc);
	return buf.toString().split('\n').filter(line => line.length);
}

(async () => {
	const list = [];
	for (const loc of opts._) {
		if (/^https?:/.test(loc)) {
			list.push(loc);
		} else {
			list.push(... await sitemapList(loc));
		}
	}
	delete opts._;

	await Uncss.run(list, Object.assign({}, opts));
})();

