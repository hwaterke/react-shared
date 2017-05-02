// @flow
import reduxCrud from 'redux-crud';
import type {ResourceDefinition} from '../types/ResourceDefinition';
import type {Action} from '../types/action';

export function reducersFor(resource: ResourceDefinition) {
  const key = resource.key || 'uuid';
  const baseReducer = reduxCrud.Map.reducersFor(resource.path, {key});
  const actionTypes = reduxCrud.actionTypesFor(resource.path);

  return function(state: {}, action: Action) {
    if (action.type === actionTypes.fetchSuccess) {
      if (action.data && action.data.replace === true) {
        // If replace is true, we want to replace the existing state instead of merging
        return baseReducer(undefined, action);
      }
    }
    return baseReducer(state, action);
  };
}
