'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.byIdSelector = byIdSelector;
exports.arraySelector = arraySelector;

var _reselect = require('reselect');

var byIdSelectorRegistry = {};
function byIdSelector(resourceDefinition) {
  if (!byIdSelectorRegistry[resourceDefinition.path]) {
    byIdSelectorRegistry[resourceDefinition.path] = function (state) {
      return state.resources[resourceDefinition.path];
    };
  }

  return byIdSelectorRegistry[resourceDefinition.path];
}

var arraySelectorRegistry = {};

function arraySelector(resourceDefinition) {
  if (!arraySelectorRegistry[resourceDefinition.path]) {
    arraySelectorRegistry[resourceDefinition.path] = (0, _reselect.createSelector)(byIdSelector(resourceDefinition), function (resourceById) {
      return Object.values(resourceById);
    });
  }

  return arraySelectorRegistry[resourceDefinition.path];
}