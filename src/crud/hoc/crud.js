// @flow
import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import reduxCrud from 'redux-crud';
import axios from 'axios';
import type {Config} from './types';
import type {ResourceDefinition} from '../types/ResourceDefinition';
import type {ClassComponent} from '../types/ClassComponent';
import {nameHocWrapperComponent} from './utils';

const defaultConfig = {
  tokenToHeader: () => ({}),
  onAuthError: () => undefined,
  onError: () => undefined,
  fetchAllDataToRecords: responseData => responseData,
  fetchOneDataToRecord: responseData => responseData,
  createDataToRecord: responseData => responseData,
  updateDataToRecord: responseData => responseData
};

function validateConfig(config: Config) {
  return {
    ...defaultConfig,
    ...config
  };
}

/**
 * Higher order component that injects props to handle crud api calls
 */
export function createCrud(crudConfig: Config) {
  const config = validateConfig(crudConfig);

  /**
   * Selectors for injecting required props into the wrapper component.
   */
  const mapStateToProps = state => ({
    backendUrl: config.backendSelector(state),
    token: config.tokenSelector && config.tokenSelector(state)
  });

  /**
   * The actual HoC
   */
  return function(
    WrappedComponent: ClassComponent<any, any, any>
  ): ClassComponent<void, any, void> {
    /**
     * The wrapper component
     */
    class Crud extends React.Component {
      static propTypes = {
        backendUrl: PropTypes.string.isRequired,
        token: PropTypes.string,
        dispatch: PropTypes.func.isRequired
      };

      isAuthenticated = () => !!this.props.token;

      fetchAll = (resource: ResourceDefinition, replace = false) => {
        const baseActionCreators = this.initBaseActionCreators(resource);
        this.props.dispatch(baseActionCreators.fetchStart());

        const promise = axios({
          url: `${this.props.backendUrl}/${resource.path}`,
          method: 'get',
          headers: config.tokenToHeader(this.props.token)
        });

        promise
          .then(
            response => {
              this.props.dispatch(
                baseActionCreators.fetchSuccess(
                  config.fetchAllDataToRecords(response.data),
                  {replace}
                )
              );
            },
            error => {
              this.props.dispatch(
                baseActionCreators.fetchError(error.response.data.error)
              );
              this.handleAuthError(error.response.status);
              config.onError(
                this.props,
                resource,
                'fetchAll',
                error.response.data.error
              );
            }
          )
          .catch(err => {
            config.onError(this.props, resource, 'fetchAll', err.toString());
          });

        return promise;
      };

      fetchOne = (resource: ResourceDefinition, key: string) => {
        const baseActionCreators = this.initBaseActionCreators(resource);
        this.props.dispatch(baseActionCreators.fetchStart());

        const promise = axios({
          url: `${this.props.backendUrl}/${resource.path}/${key}`,
          method: 'get',
          headers: config.tokenToHeader(this.props.token)
        });

        promise
          .then(
            response => {
              this.props.dispatch(
                baseActionCreators.fetchSuccess([
                  config.fetchOneDataToRecord(response.data)
                ])
              );
            },
            error => {
              this.props.dispatch(
                baseActionCreators.fetchError(error.response.data.error)
              );
              this.handleAuthError(error.response.status);
              config.onError(
                this.props,
                resource,
                'fetchOne',
                error.response.data.error
              );
            }
          )
          .catch(err => {
            config.onError(this.props, resource, 'fetchOne', err.toString());
          });

        return promise;
      };

      clearAll = (resource: ResourceDefinition) => {
        const baseActionCreators = this.initBaseActionCreators(resource);
        this.props.dispatch(baseActionCreators.fetchStart());
        this.props.dispatch(
          baseActionCreators.fetchSuccess([], {replace: true})
        );
      };

      createResource = (resource: ResourceDefinition, entity: any) => {
        const key = resource.key || 'uuid';

        // Create a client id
        const cid = entity[key] || config.cuid();
        if (!entity[key]) {
          entity = Object.assign({}, entity, {[key]: cid});
        }

        const baseActionCreators = this.initBaseActionCreators(resource);
        this.props.dispatch(baseActionCreators.createStart(entity));

        const promise = axios({
          url: `${this.props.backendUrl}/${resource.path}`,
          method: 'post',
          headers: config.tokenToHeader(this.props.token),
          data: entity
        });

        promise
          .then(
            response => {
              this.props.dispatch(
                baseActionCreators.createSuccess(
                  config.createDataToRecord(response.data),
                  cid
                )
              );
            },
            error => {
              this.props.dispatch(
                baseActionCreators.createError(
                  error.response.data.error,
                  entity
                )
              );
              this.handleAuthError(error.response.status);
              config.onError(
                this.props,
                resource,
                'create',
                error.response.data.error
              );
            }
          )
          .catch(err => {
            config.onError(this.props, resource, 'create', err.toString());
          });

        return promise;
      };

      updateResource = (resource: ResourceDefinition, entity: any) => {
        const key = resource.key || 'uuid';

        const baseActionCreators = this.initBaseActionCreators(resource);
        this.props.dispatch(baseActionCreators.updateStart(entity));

        const promise = axios({
          url: `${this.props.backendUrl}/${resource.path}/${entity[key]}`,
          method: 'patch',
          headers: config.tokenToHeader(this.props.token),
          data: entity
        });

        promise
          .then(
            response => {
              this.props.dispatch(
                baseActionCreators.updateSuccess(
                  config.updateDataToRecord(response.data)
                )
              );
            },
            error => {
              this.props.dispatch(
                baseActionCreators.updateError(
                  error.response.data.error,
                  entity
                )
              );
              this.handleAuthError(error.response.status);
              config.onError(
                this.props,
                resource,
                'update',
                error.response.data.error
              );
            }
          )
          .catch(err => {
            config.onError(this.props, resource, 'update', err.toString());
          });

        return promise;
      };

      deleteResource = (resource: ResourceDefinition, entity: any) => {
        const key = resource.key || 'uuid';
        const baseActionCreators = this.initBaseActionCreators(resource);
        this.props.dispatch(baseActionCreators.deleteStart(entity));

        const promise = axios({
          url: `${this.props.backendUrl}/${resource.path}/${entity[key]}`,
          method: 'delete',
          headers: config.tokenToHeader(this.props.token)
        });

        promise
          .then(
            () => {
              this.props.dispatch(baseActionCreators.deleteSuccess(entity));
            },
            error => {
              this.props.dispatch(
                baseActionCreators.deleteError(
                  error.response.data.error,
                  entity
                )
              );
              this.handleAuthError(error.response.status);
              config.onError(
                this.props,
                resource,
                'delete',
                error.response.data.error
              );
            }
          )
          .catch(err => {
            config.onError(this.props, resource, 'delete', err.toString());
          });

        return promise;
      };

      /**
       * Makes sure props are ok and returns the base action creators
       */
      initBaseActionCreators(resource: ResourceDefinition) {
        if (config.tokenSelector && !this.isAuthenticated()) {
          throw new Error('CrudApi: Not authenticated');
        }

        const key = resource.key || 'uuid';
        return reduxCrud.actionCreatorsFor(resource.path, {key});
      }

      handleAuthError(status: number) {
        if (status === 401) {
          config.onAuthError(this.props);
        }
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            fetchAll={this.fetchAll}
            clearAll={this.clearAll}
            createResource={this.createResource}
            updateResource={this.updateResource}
            deleteResource={this.deleteResource}
          />
        );
      }
    }

    nameHocWrapperComponent(Crud, 'Crud', WrappedComponent);

    return connect(mapStateToProps)(Crud);
  };
}
