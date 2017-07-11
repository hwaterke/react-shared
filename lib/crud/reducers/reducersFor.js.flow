// @flow
import reduxCrud from 'redux-crud';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export function reducersFor(resource: ResourceDefinition) {
  const key = resource.key || 'uuid';
  return reduxCrud.Map.reducersFor(resource.path, {key});
}
