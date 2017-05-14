// @flow
import type {ResourceDefinition} from '../types/ResourceDefinition';

export type Config = {
  +backendSelector: (state: any) => string,
  +tokenSelector: (state: any) => ?string,
  +tokenToHeader: (token: string) => {[headerName: string]: string},
  +onAuthError: (props: {}) => void,
  +onError: (props: {}, resource: ResourceDefinition, operation: string, error: any) => void,
  +cuid: () => string
};
