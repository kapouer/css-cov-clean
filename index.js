const getopts = require("getopts");
const coverage = require('./coverage');
const { readFile } = require('fs').promises;


const opts = getopts(process.argv.slice(2), {
	string: ['output'],
	boolean: ['links', 'forms'],
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

	await coverage.run(list, Object.assign({}, opts));
})();

