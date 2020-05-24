import _ from "lodash";

/*
 * Determine if user has required group to access to application.
 */
// eslint-disable-next-line import/prefer-default-export
export const hasGroup = (userGroups, appGroups) => {
  if (!appGroups || !appGroups.length) {
    return true;
  }

  const intersection = _.intersection(userGroups, appGroups);
  return intersection && intersection.length >= 1;
};
