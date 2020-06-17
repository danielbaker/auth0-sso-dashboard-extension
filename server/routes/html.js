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
      Array.prototype.findIndex||Object.defineProperty(Array.prototype,"findIndex",{value:function(r){if(null==this)throw new TypeError('"this" is null or not defined');var e=Object(this),t=e.length>>>0;if("function"!=typeof r)throw new TypeError("predicate must be a function");for(var n=arguments[1],i=0;i<t;){var o=e[i];if(r.call(n,o,i,e))return i;i++}return-1},configurable:!0,writable:!0});
      !function(e){("object"!=typeof exports||"undefined"==typeof module)&&"function"==typeof define&&define.amd?define(e):e()}(function(){"use strict";function e(n){var t=this.constructor;return this.then(function(e){return t.resolve(n()).then(function(){return e})},function(e){return t.resolve(n()).then(function(){return t.reject(e)})})}var n=setTimeout;function a(e){return e&&"undefined"!=typeof e.length}function o(){}function i(e){if(!(this instanceof i))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],s(e,this)}function r(o,r){for(;3===o._state;)o=o._value;0!==o._state?(o._handled=!0,i._immediateFn(function(){var e=1===o._state?r.onFulfilled:r.onRejected;if(null!==e){var n;try{n=e(o._value)}catch(t){return void u(r.promise,t)}f(r.promise,n)}else(1===o._state?f:u)(r.promise,o._value)})):o._deferreds.push(r)}function f(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof i)return e._state=3,e._value=n,void c(e);if("function"==typeof t)return void s(function o(e,n){return function(){e.apply(n,arguments)}}(t,n),e)}e._state=1,e._value=n,c(e)}catch(r){u(e,r)}}function u(e,n){e._state=2,e._value=n,c(e)}function c(e){2===e._state&&0===e._deferreds.length&&i._immediateFn(function(){e._handled||i._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;n<t;n++)r(e,e._deferreds[n]);e._deferreds=null}function l(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}function s(e,n){var t=!1;try{e(function(e){t||(t=!0,f(n,e))},function(e){t||(t=!0,u(n,e))})}catch(o){if(t)return;t=!0,u(n,o)}}i.prototype["catch"]=function(e){return this.then(null,e)},i.prototype.then=function(e,n){var t=new this.constructor(o);return r(this,new l(e,n,t)),t},i.prototype["finally"]=e,i.all=function(n){return new i(function(r,i){if(!a(n))return i(new TypeError("Promise.all accepts an array"));var f=Array.prototype.slice.call(n);if(0===f.length)return r([]);var u=f.length;function c(n,e){try{if(e&&("object"==typeof e||"function"==typeof e)){var t=e.then;if("function"==typeof t)return void t.call(e,function(e){c(n,e)},i)}f[n]=e,0==--u&&r(f)}catch(o){i(o)}}for(var e=0;e<f.length;e++)c(e,f[e])})},i.resolve=function(n){return n&&"object"==typeof n&&n.constructor===i?n:new i(function(e){e(n)})},i.reject=function(t){return new i(function(e,n){n(t)})},i.race=function(r){return new i(function(e,n){if(!a(r))return n(new TypeError("Promise.race accepts an array"));for(var t=0,o=r.length;t<o;t++)i.resolve(r[t]).then(e,n)})},i._immediateFn="function"==typeof setImmediate?function(e){setImmediate(e)}:function(e){n(e,0)},i._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var t=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"function"!=typeof t.Promise?t.Promise=i:t.Promise.prototype["finally"]||(t.Promise.prototype["finally"]=e)});
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
