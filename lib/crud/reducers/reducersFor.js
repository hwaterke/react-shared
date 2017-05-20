'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reducersFor = reducersFor;

var _reduxCrud = require('redux-crud');

var _reduxCrud2 = _interopRequireDefault(_reduxCrud);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reducersFor(resource) {
  var key = resource.key || 'uuid';
  var baseReducer = _reduxCrud2.default.Map.reducersFor(resource.path, { key: key });
  var actionTypes = _reduxCrud2.default.actionTypesFor(resource.path);

  return function (state, action) {
    if (action.type === actionTypes.fetchSuccess) {
      if (action.data && action.data.replace === true) {
        // If replace is true, we want to replace the existing state instead of merging
        return baseReducer(undefined, action);
      }
    }
    return baseReducer(state, action);
  };
}