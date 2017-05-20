'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducersForResources = reducersForResources;

var _redux = require('redux');

var _reducersFor = require('./reducersFor');

/**
 * Creates a combined reducer for a list of resources.
 * The result is usually plugged under `resources`
 */
function reducersForResources(resources) {
  var reducers = {};

  resources.forEach(function (resource) {
    return reducers[resource.path] = (0, _reducersFor.reducersFor)(resource);
  });

  return (0, _redux.combineReducers)(reducers);
}