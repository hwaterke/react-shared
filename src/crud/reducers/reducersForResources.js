// @flow
import type {ResourceDefinition} from '../types/ResourceDefinition';
import {combineReducers} from 'redux';
import {reducersFor} from './reducersFor';

/**
 * Creates a combined reducer for a list of resources.
 * The result is usually plugged under `resources`
 */
export function reducersForResources(resources: ResourceDefinition[]) {
  const reducers = {};

  resources.forEach(resource => (reducers[resource.path] = reducersFor(resource)));

  return combineReducers(reducers);
}
