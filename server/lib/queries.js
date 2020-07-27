import _ from 'lodash';
import Promise from 'bluebird';
import request from 'superagent';
import { managementApi, ValidationError } from 'auth0-extension-tools';

import config from './config';
import logger from './logger';
import multipartRequest from './multipartRequest';

const getToken = (req) => {
  const isAdministrator = req.user && req.user.access_token &&
    req.user.access_token.length;
  if (isAdministrator) {
    return Promise.resolve(req.user.access_token);
  }

  return managementApi.getAccessTokenCached(
    config('AUTH0_DOMAIN'),
    config('AUTH0_CLIENT_ID'),
    config('AUTH0_CLIENT_SECRET'),
  );
};

const makeRequest = (req, path, method, payload) =>
  new Promise((resolve, reject) => getToken(req).then((token) => {
    request(method, `https://${config('AUTH0_DOMAIN')}/api/v2/${path}`)
      .query(method === 'GET' ? payload : {})
      .send(method === 'GET' ? null : payload || {})
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          if (res && res.body) {
            logger.error(res.body);
          }

          return reject(err);
        }

        return resolve(res.body);
      });
  }),
);

export const getResourceServer = (req, audience) =>
  multipartRequest(req.auth0, 'resourceServers')
    .then((apis) => {
      const api = apis.filter(item => item.identifier === audience);
      return api.length && api[0];
    });

export const createResourceServer = (req) => {
  const payload = {
    name: config('API_NAME') || 'SSO Dashboard API',
    identifier: config('API_AUDIENCE') || 'urn:auth0-sso-dashboard',
    signing_alg: 'RS256',
    scopes: [
      { value: 'read:applications', description: 'Get applications' },
      { value: 'manage:applications', description: 'Manage applications' }
    ],
    token_lifetime: 86400
  };

  return makeRequest(req, 'resource-servers', 'POST', payload);
};

export const deleteResourceServer = req =>
  getResourceServer(req, 'urn:auth0-sso-dashboard')
    .then((api) => {
      if (api.id) {
        return makeRequest(req, `resource-servers/${api.id}`, 'DELETE');
      }

      return Promise.resolve();
    });

const getGrantId = req =>
  makeRequest(req, 'client-grants', 'GET', { client_id: config('AUTH0_CLIENT_ID'), audience: 'urn:auth0-authz-api' })
    .then(grants => grants.filter(item => (item.client_id === config('AUTH0_CLIENT_ID') && item.audience === 'urn:auth0-authz-api')))
    .then(grants => grants[0] && grants[0].id);


export const addGrant = req =>
  makeRequest(req, 'client-grants', 'POST', {
    client_id: config('AUTH0_CLIENT_ID'),
    audience: 'urn:auth0-authz-api',
    scope: [ 'read:users', 'read:groups' ]
  });

export const removeGrant = req =>
  getGrantId(req)
    .then(id => {
      if (id) {
        return makeRequest(req, `client-grants/${id}`, 'DELETE');
      }

      return Promise.resolve();
    });
