// tslint:disable member-ordering
import firebase from 'firebase/app';
import FirestoreRoles, { FirestoreRolesConfiguration } from 'firestore-roles';
import {
  Configuration as RolesAuthConfiguration,
  RolesAuthModule,
  RolesAuthModuleImpl,
} from 'firestore-roles-vuex-module';
import { Module as VuexModule } from 'vuex';
import { Config } from '@/Config';

export class FirestoreRolesAdapter {
    public static INJECTION_KEY = 'rolesAdapterInjectionKey';

    private firestoreRoles: FirestoreRoles;

    private availableRoles: string[];

    private constructor(private config: Config) {
      this.firestoreRoles = new FirestoreRoles(config.rolesConfig, config.firestore);
      this.availableRoles = Object.keys(config.rolesConfig.roles);
    }

    public getAvailableRoles(): string[] {
      return this.availableRoles;
    }

    public isAvailableRole(role: string) {
      return this.availableRoles.indexOf(role) >= 0;
    }

    public async requestRole(uid: string, role: string) {
      return this.firestoreRoles.requestRole(uid, role);
    }

    public getConfig(): Config {
      return this.config;
    }

    public constructAuthModule(
      authCallbacks: RolesAuthConfiguration.AuthCallbacks,
      firebaseAuth: firebase.auth.Auth,
    ): VuexModule<RolesAuthModule.State, any> {
      const vuexModuleConfig: RolesAuthConfiguration = {
        roles: this.config.rolesConfig,
        callbacks: authCallbacks,
      };
      return RolesAuthModuleImpl.constructModule(
        vuexModuleConfig,
        firebaseAuth,
        this.config.firestore,
      );
    }

    public spreadToProvide() {
      return {
        [FirestoreRolesAdapter.INJECTION_KEY]: this,
      };
    }
}
