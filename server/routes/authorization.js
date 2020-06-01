import { Router } from 'express';

import config from '../lib/config';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:authorization'), (req, res, next) => {
    const enabled = !!config('USER_GROUPS');
    return res.json({ authorizationApiAvailable: enabled, authorizationEnabled: enabled });
  });

  return api;
};
