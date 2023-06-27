# qpoint-spa-proxy

A Qpoint middleware adapter to proxy single page applications (SPAs)

There are many hosting platforms which can allow you to easily host your SPA
with cacheability (i.e. CDN) but they don't offer much flexibility in terms of
hosting content on bucket storage or other persistent data storage options. Some
examples of SPA deployment platform services are:

- https://developers.cloudflare.com/pages/
- https://vercel.com/
- https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html
- https://docs.netlify.com/configure-builds/javascript-spas/
- (There are many many more options)

## What is a Single Page Application (SPA)

A single-page application (SPA) is a web application or website that operates
within a single web page, without requiring the entire page to be reloaded
during user interaction.

The key characteristic of SPAs is that they load the initial HTML, CSS, and
JavaScript required for the application to function, and subsequent interactions
or data retrieval are performed using asynchronous techniques, such as Ajax, to
retrieve data from the server and update the page dynamically. This approach may
allow for faster and more interactive user experiences, as only the relevant
parts of the page are updated instead of reloading the entire page.

SPAs often rely on JavaScript frameworks or libraries, such as React, Angular,
or Vue.js, to facilitate the development and management of complex user
interfaces and data interactions. These frameworks provide tools and
abstractions to handle routing, state management, and efficient rendering of
components.

SPAs have unique routing and proxy requirements due to path routing being
handled within the frontend application. Static assets (i.e. JavaScript files,
CSS files...) tend to exist at a certain path on the domain hosting the
application (i.e. `/static/*`) and any paths which aren't part of the static
application need to return the `index.html` file with a status of `200`.

## Usage

```ts
import Router from "@qpoint/router";
import proxy from "@qpoint/spa-proxy";

export default new Router()
  .use(proxy({
    entryPoint: '/index.html',
    assetsPath: '/assets',
    origins: {
      'localhost': 'http://127.0.0.1:8080',
      'acme.com': 'https://s3.amazonaws.com/acme'
    }
  }))
```

## Installation

```bash
npm add @qpoint/spa-proxy
```


## Config

`entryPoint` is the main application bundle. When an asset path is not explicitly matched, the request will be proxied to this origin.

`assetsPath` is the base url pattern to match when proxying to an asset.

`origins` is a mapping of 'Host' identifiers to origin endpoint urls. The 'Host' header is used to identify which endpoint to proxy to.
