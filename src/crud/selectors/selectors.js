// @flow
import {createSelector} from 'reselect';
import type {ResourceDefinition} from '../types/ResourceDefinition';

export function byIdSelector(resourceDefinition: ResourceDefinition) {
  return state => state.resources[resourceDefinition.path];
}

const arraySelectorRegistry = {};

export function arraySelector(resourceDefinition: ResourceDefinition) {
  if (!arraySelectorRegistry[resourceDefinition.path]) {
    arraySelectorRegistry[resourceDefinition.path] = createSelector(
      byIdSelector(resourceDefinition),
      resourceById => Object.values(resourceById)
    );
  }
  return arraySelectorRegistry[resourceDefinition.path];
}
