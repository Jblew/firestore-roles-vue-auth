import { FirestoreRolesAdapter } from './adapter';

export const rolesAdapterInjectionSpread = {
  inject: [FirestoreRolesAdapter.INJECTION_KEY],
};

export function getInjectedRolesAdapter(aThis: any): FirestoreRolesAdapter {
  return aThis[FirestoreRolesAdapter.INJECTION_KEY];
}
