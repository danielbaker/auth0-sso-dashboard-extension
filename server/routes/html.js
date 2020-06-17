import fs from 'fs';
import ejs from 'ejs';
import path from 'path';
import { urlHelpers } from 'auth0-extension-express-tools';

import config from '../lib/config';

export default () => {
  const template = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <title><%= config.TITLE %></title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <% if (assets.favicon) { %><link rel="shortcut icon" href="<%= assets.favicon %>"><% } %>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styles/zocial.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/manage/v0.3.1672/css/index.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdn.auth0.com/styleguide/4.6.13/index.min.css" />
    <% if (assets.style) { %><link rel="stylesheet" type="text/css" href="/app/<%= assets.style %>" /><% } %>
    <% if (assets.version) { %><link rel="stylesheet" type="text/css" href="//cdn.auth0.com/extensions/auth0-sso-dashboard/assets/auth0-sso-dashboard.ui.<%= assets.version %>.css" /><% } %>
    <% if (assets.customCss) { %><link rel="stylesheet" type="text/css" href="<%= assets.customCss %>" /><% } %>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/javascript">
      // IE polyfills
      String.prototype.startsWith||Object.defineProperty(String.prototype,"startsWith",{value:function(t,n){var r=n>0?0|n:0;return this.substring(r,r+t.length)===t}}),String.prototype.endsWith||(String.prototype.endsWith=function(t,n){return(void 0===n||n>this.length)&&(n=this.length),this.substring(n-t.length,n)===t});
    </script>
    <script type="text/javascript" src="//cdn.auth0.com/js/auth0/8.6/auth0.min.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/manage/v0.3.1672/js/bundle.js"></script>
    <script type="text/javascript">window.config = <%- JSON.stringify(config) %>;</script>
    <% if (assets.vendors) { %><script type="text/javascript" src="/app/<%= assets.vendors %>"></script><% } %>
    <% if (assets.app) { %><script type="text/javascript" src="/app/<%= assets.app %>"></script><% } %>
    <% if (assets.bundle) { %><script type="text/javascript" src="<%= assets.bundle %>"></script><% } %>
    <% if (assets.version) { %>
    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-sso-dashboard/assets/auth0-sso-dashboard.ui.vendors.<%= assets.version %>.js"></script>
    <script type="text/javascript" src="//cdn.auth0.com/extensions/auth0-sso-dashboard/assets/auth0-sso-dashboard.ui.<%= assets.version %>.js"></script>
    <% } %>
  </body>
  </html>
  `;

  return (req, res, next) => {
    if (req.url.indexOf('/api') === 0) {
      return next();
    }

    const settings = {
      AUTH0_CUSTOM_DOMAIN: config('AUTH0_CUSTOM_DOMAIN'),
      AUTH0_DOMAIN: config('AUTH0_DOMAIN'),
      IS_APPLIANCE: config('IS_APPLIANCE'),
      AUTH0_CLIENT_ID: config('EXTENSION_CLIENT_ID'),
      AUTH0_MANAGE_URL: config('AUTH0_MANAGE_URL') || 'https://manage.auth0.com',
      ALLOW_AUTHZ: config('ALLOW_AUTHZ'),
      BASE_URL: config('PUBLIC_URL'),
      BASE_PATH: urlHelpers.getBasePath(req),
      TITLE: config('TITLE')
    };

    // Render from CDN.
    const clientVersion = process.env.CLIENT_VERSION;
    if (clientVersion) {
      return res.send(ejs.render(template, {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          favicon: config('FAVICON_URL'),
          version: clientVersion
        }
      }));
    }

    // Render locally.
    return fs.readFile(path.join(__dirname, '../../dist/manifest.json'), 'utf8', (err, manifest) => {
      const locals = {
        config: settings,
        assets: {
          customCss: config('CUSTOM_CSS'),
          favicon: config('FAVICON_URL'),
          bundle: 'http://localhost:3000/app/bundle.js'
        }
      };

      if (!err && manifest) {
        locals.assets = {
          customCss: config('CUSTOM_CSS'),
          favicon: config('FAVICON_URL'),
          ...JSON.parse(manifest)
        };
      }

      // Render the HTML page.
      res.send(ejs.render(template, locals));
    });
  };
};
