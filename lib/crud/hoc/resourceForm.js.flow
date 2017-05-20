// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {nameHocWrapperComponent} from './utils';
import {reduxForm} from 'redux-form';
import type {ResourceDefinition} from '../types/ResourceDefinition';
import type {ClassComponent} from '../types/ClassComponent';

/**
 * HOC to provide CRUD functionality to a form.
 */
export function resourceForm(
  crud: Function,
  resource: ResourceDefinition,
  formToResource: Function = v => v,
  resourceToForm: Function = v => v
) {
  return function(WrappedComponent: ClassComponent<any, any, any>): ClassComponent<void, any, void> {
    // Make a redux-form from the WrappedComponent
    const ReduxFormedWrappedComponent = reduxForm({
      form: resource.path,
      enableReinitialize: true
    })(WrappedComponent);

    class ResourceForm extends React.Component {
      static propTypes = {
        updatedResource: PropTypes.object,
        createResource: PropTypes.func.isRequired,
        updateResource: PropTypes.func.isRequired,
        deleteResource: PropTypes.func.isRequired,
        postSubmit: PropTypes.func
      };

      onSubmit = data => {
        const key = resource.key || 'uuid';
        const entity = formToResource(data, this.props);
        if (this.props.updatedResource && this.props.updatedResource[key]) {
          entity[key] = this.props.updatedResource[key];
          this.props.updateResource(resource, entity);
        } else {
          this.props.createResource(resource, entity);
        }
        this.props.postSubmit && this.props.postSubmit();
      };

      /**
       * Delete the updatedResource
       */
      deleteResource = () => {
        const key = resource.key || 'uuid';
        this.props.deleteResource(resource, {
          [key]: this.props.updatedResource[key]
        });
        this.props.postSubmit && this.props.postSubmit();
      };

      getPassThroughProps = () => {
        const passThroughProps = {...this.props};
        delete passThroughProps.fetchAll;
        delete passThroughProps.clearAll;
        delete passThroughProps.createResource;
        delete passThroughProps.updateResource;
        delete passThroughProps.deleteResource;
        delete passThroughProps.postSubmit;
        return passThroughProps;
      };

      render() {
        // Compute props that will passthrough.
        const passThroughProps = this.getPassThroughProps();

        return (
          <ReduxFormedWrappedComponent
            {...passThroughProps}
            onSubmit={this.onSubmit}
            deleteResource={this.deleteResource}
            initialValues={resourceToForm(this.props.updatedResource, passThroughProps)}
            isCreate={this.props.updatedResource == null}
            isUpdate={this.props.updatedResource != null}
          />
        );
      }
    }

    nameHocWrapperComponent(ResourceForm, 'ResourceForm', ReduxFormedWrappedComponent);

    return crud(ResourceForm);
  };
}
