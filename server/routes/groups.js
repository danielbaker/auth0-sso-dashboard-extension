import { Router } from 'express';

import config from '../lib/config';
import { requireScope } from '../lib/middlewares';

export default (storage) => {
  const api = Router();

  api.get('/', requireScope('manage:applications'), (req, res, next) => {
    const groups = config('USER_GROUPS')
    if (!groups) {
      return res.json([]);
    }

    return res.json(groups.split(',').map(g => g.trim()).map(g => ({_id: g, name: g})));
  });

  return api;
};
