// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {nameHocWrapperComponent} from './utils';
import {reduxForm} from 'redux-form';
import type {ClassComponent} from '../types/ClassComponent';
import type {ResourceFormConfig} from './types';

/**
 * HOC to provide CRUD functionality to a form.
 */
export function resourceForm(config: ResourceFormConfig) {
  const configuration = {
    formToResource: v => v,
    resourceToForm: v => v,
    ...config
  };

  return function(
    WrappedComponent: ClassComponent<any, any, any>
  ): ClassComponent<void, any, void> {
    // Make a redux-form from the WrappedComponent
    const ReduxFormedWrappedComponent = reduxForm({
      form: configuration.resource.path,
      enableReinitialize: true,
      validate: configuration.validate
    })(WrappedComponent);

    class ResourceForm extends React.Component {
      static propTypes = {
        updatedResource: configuration.resource.propType,
        createResource: PropTypes.func.isRequired,
        updateResource: PropTypes.func.isRequired,
        deleteResource: PropTypes.func.isRequired,
        postSubmit: PropTypes.func
      };

      onSubmit = data => {
        const key = configuration.resource.key || 'uuid';
        const entity = configuration.formToResource(data, this.props);
        if (this.props.updatedResource && this.props.updatedResource[key]) {
          entity[key] = this.props.updatedResource[key];
          this.props.updateResource(configuration.resource, entity);
        } else {
          this.props.createResource(configuration.resource, entity);
        }
        this.props.postSubmit && this.props.postSubmit();
      };

      /**
       * Delete the updatedResource
       */
      deleteResource = () => {
        const key = configuration.resource.key || 'uuid';
        this.props.deleteResource(configuration.resource, {
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
            initialValues={configuration.resourceToForm(
              this.props.updatedResource,
              passThroughProps
            )}
            isCreate={this.props.updatedResource == null}
            isUpdate={this.props.updatedResource != null}
          />
        );
      }
    }

    nameHocWrapperComponent(
      ResourceForm,
      'ResourceForm',
      ReduxFormedWrappedComponent
    );

    return configuration.crud(ResourceForm);
  };
}
