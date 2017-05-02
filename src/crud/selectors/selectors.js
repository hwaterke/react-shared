// @flow
import {createSelector} from 'reselect';
import type {ResourceDefinition} from '../types/ResourceDefinition';

const byIdSelectorRegistry = {};

export function byIdSelector(resourceDefinition: ResourceDefinition) {
  if (!byIdSelectorRegistry[resourceDefinition.path]) {
    byIdSelectorRegistry[resourceDefinition.path] = state =>
      state.resources[resourceDefinition.path];
  }

  return byIdSelectorRegistry[resourceDefinition.path];
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
