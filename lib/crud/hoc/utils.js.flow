// @flow
import type {ClassComponent} from '../types/ClassComponent';

/**
 * Sets the displayName of a WrapperComponent of an HoC
 */
export function nameHocWrapperComponent(
  WrapperComponent: ClassComponent<any, any, any>,
  prefix: string,
  WrappedComponent: ClassComponent<any, any, any>
) {
  // Extract the name of the WrappedComponent
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  // Name the returned wrapper accordingly
  WrapperComponent.displayName = `${prefix}(${wrappedComponentName})`;
}
