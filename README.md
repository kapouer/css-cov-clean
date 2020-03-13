# dramaturge-uncss

Use native A+ browser coverage to strip unused css off website stylesheets.


## How does it work ?

It leverages chromium's css coverage tool - through playwright - to strip unused css.

To make sure it doesn't strip too much css, it is preferable to get the coverage
of multiple pages, implicitely by crawling, or explicitely, or both.


## How to ?

```
npm install dramaturge-uncss
npx dramaturge-uncss --links http://localhost:8080 http://localhost:8081
```

This outputs a directory `./output` with the stripped stylesheets.


## Options

Multiples url can be added.

- `--output`: string, output directory path
- `--links`: boolean, crawl using links
- `--forms`: boolean, crawl using forms
- `--user`: boolean, crawl in user mode

The user mode emits events on links and forms (whenever applicable) instead of
loading browser page.


## What's not so great

- source maps - alternative stylesheet languages
  that might be possible to implement though. Will accept PR.

- valid form posts
  Needs more work and probably mocking.

- missing: a deterministic page load event, a.k.a. 'idle' event
  especially in user mode.


## Install

Warning: node_modules size is ~360MB.

Linux users need to read [https://github.com/microsoft/playwright/blob/master/docs/troubleshooting.md#setting-up-chrome-linux-sandbox](Setting Up Chrome Linux Sandbox).

TL,DR: `sudo sysctl -w kernel.unprivileged_userns_clone=1`


## License

MIT, see LICENSE file.


