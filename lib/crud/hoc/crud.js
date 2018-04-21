'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createCrud = createCrud;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactRedux = require('react-redux');

var _reduxCrud = require('redux-crud');

var _reduxCrud2 = _interopRequireDefault(_reduxCrud);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _utils = require('./utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultConfig = {
  tokenToHeader: function tokenToHeader() {
    return {};
  },
  onAuthError: function onAuthError() {
    return undefined;
  },
  onError: function onError() {
    return undefined;
  },
  fetchAllDataToRecords: function fetchAllDataToRecords(responseData) {
    return responseData;
  },
  fetchOneDataToRecord: function fetchOneDataToRecord(responseData) {
    return responseData;
  },
  createDataToRecord: function createDataToRecord(responseData) {
    return responseData;
  },
  updateDataToRecord: function updateDataToRecord(responseData) {
    return responseData;
  }
};

function validateConfig(config) {
  return _extends({}, defaultConfig, config);
}

/**
 * Higher order component that injects props to handle crud api calls
 */
function createCrud(crudConfig) {
  var config = validateConfig(crudConfig);

  /**
   * Selectors for injecting required props into the wrapper component.
   */
  var mapStateToProps = function mapStateToProps(state) {
    return {
      backendUrl: config.backendSelector(state),
      token: config.tokenSelector && config.tokenSelector(state)
    };
  };

  /**
   * The actual HoC
   */
  return function (WrappedComponent) {
    /**
     * The wrapper component
     */
    var Crud = function (_React$Component) {
      _inherits(Crud, _React$Component);

      function Crud() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Crud);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Crud.__proto__ || Object.getPrototypeOf(Crud)).call.apply(_ref, [this].concat(args))), _this), _this.isAuthenticated = function () {
          return !!_this.props.token;
        }, _this.fetchAll = function (resource) {
          var replace = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

          var baseActionCreators = _this.initBaseActionCreators(resource);
          _this.props.dispatch(baseActionCreators.fetchStart());

          var promise = (0, _axios2.default)({
            url: _this.props.backendUrl + '/' + resource.path,
            method: 'get',
            headers: config.tokenToHeader(_this.props.token)
          });

          promise.then(function (response) {
            _this.props.dispatch(baseActionCreators.fetchSuccess(config.fetchAllDataToRecords(response.data), { replace: replace }));
          }, function (error) {
            _this.props.dispatch(baseActionCreators.fetchError(error.response.data.error));
            _this.handleAuthError(error.response.status);
            config.onError(_this.props, resource, 'fetchAll', error.response.data.error);
          }).catch(function (err) {
            config.onError(_this.props, resource, 'fetchAll', err.toString());
          });

          return promise;
        }, _this.fetchOne = function (resource, key) {
          var baseActionCreators = _this.initBaseActionCreators(resource);
          _this.props.dispatch(baseActionCreators.fetchStart());

          var promise = (0, _axios2.default)({
            url: _this.props.backendUrl + '/' + resource.path + '/' + key,
            method: 'get',
            headers: config.tokenToHeader(_this.props.token)
          });

          promise.then(function (response) {
            _this.props.dispatch(baseActionCreators.fetchSuccess([config.fetchOneDataToRecord(response.data)]));
          }, function (error) {
            _this.props.dispatch(baseActionCreators.fetchError(error.response.data.error));
            _this.handleAuthError(error.response.status);
            config.onError(_this.props, resource, 'fetchOne', error.response.data.error);
          }).catch(function (err) {
            config.onError(_this.props, resource, 'fetchOne', err.toString());
          });

          return promise;
        }, _this.clearAll = function (resource) {
          var baseActionCreators = _this.initBaseActionCreators(resource);
          _this.props.dispatch(baseActionCreators.fetchStart());
          _this.props.dispatch(baseActionCreators.fetchSuccess([], { replace: true }));
        }, _this.createResource = function (resource, entity) {
          var key = resource.key || 'uuid';

          // Create a client id
          var cid = entity[key] || config.cuid();
          if (!entity[key]) {
            entity = Object.assign({}, entity, _defineProperty({}, key, cid));
          }

          var baseActionCreators = _this.initBaseActionCreators(resource);
          _this.props.dispatch(baseActionCreators.createStart(entity));

          var promise = (0, _axios2.default)({
            url: _this.props.backendUrl + '/' + resource.path,
            method: 'post',
            headers: config.tokenToHeader(_this.props.token),
            data: entity
          });

          promise.then(function (response) {
            _this.props.dispatch(baseActionCreators.createSuccess(config.createDataToRecord(response.data), cid));
          }, function (error) {
            _this.props.dispatch(baseActionCreators.createError(error.response.data.error, entity));
            _this.handleAuthError(error.response.status);
            config.onError(_this.props, resource, 'create', error.response.data.error);
          }).catch(function (err) {
            config.onError(_this.props, resource, 'create', err.toString());
          });

          return promise;
        }, _this.updateResource = function (resource, entity) {
          var key = resource.key || 'uuid';

          var baseActionCreators = _this.initBaseActionCreators(resource);
          _this.props.dispatch(baseActionCreators.updateStart(entity));

          var promise = (0, _axios2.default)({
            url: _this.props.backendUrl + '/' + resource.path + '/' + entity[key],
            method: 'patch',
            headers: config.tokenToHeader(_this.props.token),
            data: entity
          });

          promise.then(function (response) {
            _this.props.dispatch(baseActionCreators.updateSuccess(config.updateDataToRecord(response.data)));
          }, function (error) {
            _this.props.dispatch(baseActionCreators.updateError(error.response.data.error, entity));
            _this.handleAuthError(error.response.status);
            config.onError(_this.props, resource, 'update', error.response.data.error);
          }).catch(function (err) {
            config.onError(_this.props, resource, 'update', err.toString());
          });

          return promise;
        }, _this.deleteResource = function (resource, entity) {
          var key = resource.key || 'uuid';
          var baseActionCreators = _this.initBaseActionCreators(resource);
          _this.props.dispatch(baseActionCreators.deleteStart(entity));

          var promise = (0, _axios2.default)({
            url: _this.props.backendUrl + '/' + resource.path + '/' + entity[key],
            method: 'delete',
            headers: config.tokenToHeader(_this.props.token)
          });

          promise.then(function () {
            _this.props.dispatch(baseActionCreators.deleteSuccess(entity));
          }, function (error) {
            _this.props.dispatch(baseActionCreators.deleteError(error.response.data.error, entity));
            _this.handleAuthError(error.response.status);
            config.onError(_this.props, resource, 'delete', error.response.data.error);
          }).catch(function (err) {
            config.onError(_this.props, resource, 'delete', err.toString());
          });

          return promise;
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      _createClass(Crud, [{
        key: 'initBaseActionCreators',


        /**
         * Makes sure props are ok and returns the base action creators
         */
        value: function initBaseActionCreators(resource) {
          if (config.tokenSelector && !this.isAuthenticated()) {
            throw new Error('CrudApi: Not authenticated');
          }

          var key = resource.key || 'uuid';
          return _reduxCrud2.default.actionCreatorsFor(resource.path, { key: key });
        }
      }, {
        key: 'handleAuthError',
        value: function handleAuthError(status) {
          if (status === 401) {
            config.onAuthError(this.props);
          }
        }
      }, {
        key: 'render',
        value: function render() {
          return _react2.default.createElement(WrappedComponent, _extends({}, this.props, {
            fetchAll: this.fetchAll,
            clearAll: this.clearAll,
            createResource: this.createResource,
            updateResource: this.updateResource,
            deleteResource: this.deleteResource
          }));
        }
      }]);

      return Crud;
    }(_react2.default.Component);

    Crud.propTypes = {
      backendUrl: _propTypes2.default.string.isRequired,
      token: _propTypes2.default.string,
      dispatch: _propTypes2.default.func.isRequired
    };


    (0, _utils.nameHocWrapperComponent)(Crud, 'Crud', WrappedComponent);

    return (0, _reactRedux.connect)(mapStateToProps)(Crud);
  };
}