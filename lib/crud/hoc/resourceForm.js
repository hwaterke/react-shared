'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.resourceForm = resourceForm;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _utils = require('./utils');

var _reduxForm = require('redux-form');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * HOC to provide CRUD functionality to a form.
 */
function resourceForm(config) {
  var configuration = _extends({
    formToResource: function formToResource(v) {
      return v;
    },
    resourceToForm: function resourceToForm(v) {
      return v;
    }
  }, config);

  return function (WrappedComponent) {
    // Make a redux-form from the WrappedComponent
    var ReduxFormedWrappedComponent = (0, _reduxForm.reduxForm)({
      form: configuration.resource.path,
      enableReinitialize: true,
      validate: configuration.validate
    })(WrappedComponent);

    var ResourceForm = function (_React$Component) {
      _inherits(ResourceForm, _React$Component);

      function ResourceForm() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ResourceForm);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ResourceForm.__proto__ || Object.getPrototypeOf(ResourceForm)).call.apply(_ref, [this].concat(args))), _this), _this.onSubmit = function (data) {
          var key = configuration.resource.key || 'uuid';
          var entity = configuration.formToResource(data, _this.props);
          if (_this.props.updatedResource && _this.props.updatedResource[key]) {
            entity[key] = _this.props.updatedResource[key];
            _this.props.updateResource(configuration.resource, entity);
          } else {
            _this.props.createResource(configuration.resource, entity);
          }
          _this.props.postSubmit && _this.props.postSubmit();
        }, _this.deleteResource = function () {
          var key = configuration.resource.key || 'uuid';
          _this.props.deleteResource(configuration.resource, _defineProperty({}, key, _this.props.updatedResource[key]));
          _this.props.postSubmit && _this.props.postSubmit();
        }, _this.getPassThroughProps = function () {
          var passThroughProps = _extends({}, _this.props);
          delete passThroughProps.fetchAll;
          delete passThroughProps.clearAll;
          delete passThroughProps.createResource;
          delete passThroughProps.updateResource;
          delete passThroughProps.deleteResource;
          return passThroughProps;
        }, _temp), _possibleConstructorReturn(_this, _ret);
      }

      /**
       * Delete the updatedResource
       */


      _createClass(ResourceForm, [{
        key: 'render',
        value: function render() {
          // Compute props that will passthrough.
          var passThroughProps = this.getPassThroughProps();

          return _react2.default.createElement(ReduxFormedWrappedComponent, _extends({}, passThroughProps, {
            onSubmit: this.onSubmit,
            deleteResource: this.deleteResource,
            initialValues: configuration.resourceToForm(this.props.updatedResource, passThroughProps),
            isCreate: this.props.updatedResource == null,
            isUpdate: this.props.updatedResource != null
          }));
        }
      }]);

      return ResourceForm;
    }(_react2.default.Component);

    ResourceForm.propTypes = {
      updatedResource: configuration.resource.propType,
      createResource: _propTypes2.default.func.isRequired,
      updateResource: _propTypes2.default.func.isRequired,
      deleteResource: _propTypes2.default.func.isRequired,
      postSubmit: _propTypes2.default.func
    };


    (0, _utils.nameHocWrapperComponent)(ResourceForm, 'ResourceForm', ReduxFormedWrappedComponent);

    return configuration.crud(ResourceForm);
  };
}