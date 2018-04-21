// @flow
import type {ResourceDefinition} from '../types/ResourceDefinition';

export type Config = {
  +backendSelector: (state: any) => string,
  +tokenSelector?: (state: any) => ?string,
  +tokenToHeader?: (token: string) => {[headerName: string]: string},
  +onAuthError?: (props: any) => void,
  +onError?: (
    props: any,
    resource: ResourceDefinition,
    operation: string,
    error: any
  ) => void,
  +cuid: () => string,
  +fetchAllDataToRecords?: (responseData: any) => any[],
  +fetchOneDataToRecord?: (responseData: any) => any,
  +createDataToRecord?: (responseData: any) => any,
  +updateDataToRecord?: (responseData: any) => any
};

export type ResourceFormConfig = {
  crud: Function,
  resource: ResourceDefinition,
  formToResource?: (data: {}, ownProps?: {}) => {},
  resourceToForm?: (resource?: {}, ownProps?: {}) => ?{},
  validation?: (data: {}) => {}
};
