// @flow
import React from 'react';

export function crud() {
  return function<P: {}, S: {}>(
    WrappedComponent: Class<React.Component<any, P, S>>
  ): Class<React.Component<void, P, S>> {
    class Crud extends React.Component<void, P, S> {
      props: P;
      state: S;

      render() {
        return <WrappedComponent {...this.props} />;
      }
    }

    // Extract the name of the WrappedComponent
    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
    // Name the returned wrapper accordingly
    Crud.displayName = `Crud(${wrappedComponentName})`;

    return Crud;
  };
}
