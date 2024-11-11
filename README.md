# Wind Talker Client-Side Rendering

## To use Locally and Develop

```bash
npm install
npm run proxy
```

The proxy is necessary to be able to get data from freeflightwx.com and not have CORS problems.

And in another console tab:

```bash
npm run dev
```

Now navigate a browser to http://localhost:5173 (or whichever port `npm run dev` says to use).

## To Build

```bash
npm install
npm run build
```

The web application is now available in the `dist/` folder.
