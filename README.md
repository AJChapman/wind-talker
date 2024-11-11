# Wind Talker Client-Side Rendering

Currently running at https://freeflightwx.com/new/

## To start Developing

Install the required npm packages with:

```bash
npm install
```

If you later have trouble with e.g. `npm run build` then try changing your node version.
I do this with node version manager (`nvm`):

```bash
nvm install --lts
nvm use --lts
```

## To use Locally and Develop

Start the development server with:

```bash
npm run dev
```

Now navigate a browser to http://localhost:5173 (or whichever port `npm run dev` says to use).

## To Build

```bash
npm run build
```

The web application is now available in the `build/` folder.

## To Deploy

Make sure you have built first (see above).

The server uses FTP, so I use `lftp` like this (changing `<username>`, `<password>` and `<host>` to the correct values:

```
lftp :~> open ftp://<username>:<password>@<host>
lftp :~> set ftp:ssl-protect-data true
lftp <username>@<host>:/> cd public_html/new
lftp freeflightwx@s05ae.syd6.hostingplatform.net.au:/public_html/new> lcd build
lftp freeflightwx@s05ae.syd6.hostingplatform.net.au:/public_html/new> mirror --reverse --delete --use-cache --verbose --no-perms --no-umask --parallel=2
```

Note that if you run a new build and still have `lftp` open you will need to run `lcd ../build` before running the mirror command again.
Also be very certain that you are in `public_html/new`, otherwise you will wipe some other directory!

## To Add a Site

Until I figure out how to automate this, there are several places you need to change:

1. Add your site in `src/freeflightwx-sites.ts` (copy and change one of the others), and add it to `allSites` in the same file.
2. Add a mapping from the site's path to its data table in `$data_tables` in `static/fetch.php`.
3. Add its path to the list of entry points in `svelte.config.js`.
4. (optional) Add it to `src/routes/+page.svelte` to include it on the home page.

## To Add a Group of Sites

After you have added the individual sites:

1. Add your group in `src/freeflightwx-sites.ts` (copy and change one of the others), and add it to `allGroups` in the same file.
2. Add its path to the list of entry points in `svelte.config.js`.
3. (optional) Add it to `src/routes/+page.svelte` to include it on the home page.
