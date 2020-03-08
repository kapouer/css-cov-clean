const { chromium } = require('playwright-chromium');
const fs = require('fs').promises;
const makeDir = require('make-dir');
const URL = require('url');
const Path = require('path');

exports.run = async function(urls, opts) {
	const cov = await exports.coverage(urls, opts);
	await exports.write(opts.dir, cov);
};

exports.coverage = async function(list, opts) {
	const browser = await chromium.launch({
		// dumpio: true
	});
	const context = await browser.newContext({
		ignoreHTTPSErrors: true,
		bypassCSP: true
	});
	const page = await context.newPage();
	
	await page.coverage.startCSSCoverage({
		resetOnNavigation: false
	});
	
	await prepare(page);
	
	const visits = {};
	await crawl(page, list, visits, opts);

	const cov = await page.coverage.stopCSSCoverage();
	browser.close();
	return cov;
}

exports.write = async function(rootPath, cov) {
	await Promise.all(cov.map(async obj => {
		await writeFile(rootPath, obj);
	}));
};

async function prepare(page) {
	// await page.route('**/*.{png,jpg,jpeg,mp4,webp,webm,gif,svg}', request => request.abort());
	await page.evaluate(function() {
		Object.defineProperty(document, "visibilityState", {
			configurable: true,
			get: function() { return "prerender"; }
		});
	});
}

async function crawl(page, list, visits, opts) {
	for (const url of list) {
		if (visits[url]) continue;
		visits[url] = true;
		await page.goto(url);
		const obj = await page.evaluate(function(opts) {
			if (opts.links) return {
				links: document.links.filter(link => {
					return link.hostname == document.location.hostname;
				}).map(link => link.href)
			};
		}, opts);	
		await crawl(page, obj.links, visits, opts);
	}
}

async function writeFile(rootPath, item) {
	const urlObj = URL.parse(item.url);
	const filePath = Path.join(rootPath, urlObj.pathname);
	var list = item.ranges.map((range) => {
		return item.text.slice(range.start, range.end);
	});
	await makeDir(Path.dirname(filePath));
	await fs.writeFile(filePath, list.join('\n'));
}
