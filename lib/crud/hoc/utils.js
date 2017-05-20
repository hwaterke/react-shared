'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nameHocWrapperComponent = nameHocWrapperComponent;


/**
 * Sets the displayName of a WrapperComponent of an HoC
 */
function nameHocWrapperComponent(WrapperComponent, prefix, WrappedComponent) {
  // Extract the name of the WrappedComponent
  var wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  // Name the returned wrapper accordingly
  WrapperComponent.displayName = prefix + '(' + wrappedComponentName + ')';
}