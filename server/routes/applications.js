import _ from 'lodash';
import uuid from 'uuid';
import { Router } from 'express';

import config from '../lib/config';
import { requireScope } from '../lib/middlewares';
import { moveApplication, saveApplication, deleteApplication } from '../lib/applications';
import { hasGroup } from '../lib/user';
import multipartRequest from '../lib/multipartRequest';


export default (auth0, storage) => {
  const api = Router();
  api.get('/clients', auth0, requireScope('manage:applications'), (req, res, next) => {
    multipartRequest(req.auth0, 'clients', { is_global: false, fields: 'client_id,name,callbacks,app_type' })
      .then(clients => _.chain(clients)
        .sortBy((client) => client.name.toLowerCase())
        .value()
      )
      .then(clients => res.json(clients))
      .catch(next);
  });

  api.get('/', requireScope('read:applications'), (req, res, next) => {
    let applications;
    storage.read()
      .then(apps => {
        applications = apps.applications || { };
        return null;
      })
      .then(() => storage.read())
      .then((data) => {
        return req.user["http://sso-dashboard.com/groups"]
      })
      .then((userGroups) => {
        const result = { };

        Object.keys(applications).map((key) => {
          const app = applications[key];
          if (app.enabled && app.loginUrl && (hasGroup(userGroups, app.groups))) {
            result[key] = app;
          }
          return app;
        });

        return result;
      })
      .then(apps => res.json(_.map(apps, (app, id) => ({ ...app, id }))))
      .catch(next);
  });

  /*
   * Get a list of applications.
   */
  api.get('/all', requireScope('manage:applications'), (req, res, next) => {
    storage.read()
      .then(apps => res.json(_.map(apps.applications || {}, (app, id) => ({ ...app, id }))))
      .catch(next);
  });

  /*
   * Get application.
   */
  api.get('/:id', requireScope('manage:applications'), (req, res, next) => {
    storage.read()
      .then(apps => res.json({ application: apps.applications[req.params.id] }))
      .catch(next);
  });

  /*
   * Update application.
   */
  api.put('/:id', requireScope('manage:applications'), (req, res, next) => {
    saveApplication(req.params.id, req.body, storage)
      .then(() => res.status(204).send())
      .catch(next);
  });

  /*
   * move application.
   */
  api.patch('/:id/:direction(-[0-9]*|[0-9]*)', requireScope('manage:applications'), (req, res, next) => {
    moveApplication(req.params.id, parseInt(req.params.direction, 10), storage)
      .then(() => res.status(204).send())
      .catch(next);
  });

  /*
   * Create application.
   */
  api.post('/', requireScope('manage:applications'), (req, res, next) => {
    const id = uuid.v4();
    saveApplication(id, req.body, storage)
      .then(() => res.status(201).send({ id }))
      .catch(next);
  });

  /*
   * Delete application.
   */
  api.delete('/:id', requireScope('manage:applications'), (req, res, next) => {
    deleteApplication(req.params.id, storage)
      .then(() => res.status(204).send())
      .catch(next);
  });
  return api;
};
