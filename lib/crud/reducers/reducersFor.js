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
  return _reduxCrud2.default.Map.reducersFor(resource.path, { key: key });
}