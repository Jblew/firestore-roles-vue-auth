<template>
  <div v-if="hasRole">
    <slot></slot>
  </div>
  <div v-else>
    <RoleGuardBanComponent
      :role="role"
      :loading="loading"
      :requesting="isRequestingTheRole"
      :requestLoading="requestState.loading"
      :requestError="requestState.error"
      :requestSuccess="requestState.success"
      @requestRole="requestRole()"
      @checkRole="checkRole()"
    />
  </div>
</template>

<script lang="ts">
// tslint:disable no-console
import { AccountRecord } from 'firestore-roles';
import { RolesAuthModule } from 'firestore-roles-vuex-module';
import Vue from 'vue';

import { FirestoreRolesAdapter } from '../adapter';

import RoleGuardBanComponent from './RoleGuardBanComponent.vue';
import { getInjectedRolesAdapter, rolesAdapterInjectionSpread } from '../rolesAdapterInjection';

let timerHandle: ReturnType<typeof setTimeout> | undefined;
export default Vue.extend({
  ...rolesAdapterInjectionSpread,
  props: {
    role: String,
  },
  data() {
    return {
      requestState: {
        loading: false,
        error: '',
        success: false,
      },
    };
  },
  computed: {
    hasRole(): boolean {
      const role: string = this.role as any;
      return (
        RolesAuthModule.stateOf(this).state === RolesAuthModule.AuthState.AUTHENTICATED
        && RolesAuthModule.stateOf(this).roles[role] === true
      );
    },
    loading(): boolean {
      const role: string = this.role as any;
      return typeof RolesAuthModule.stateOf(this).roles[role] !== 'boolean';
    },
    isRequestingTheRole(): boolean {
      const role: string = this.role as any;
      return RolesAuthModule.stateOf(this).roleRequests[role] === true;
    },
    account(): AccountRecord | undefined {
      return RolesAuthModule.stateOf(this).account;
    },
    uid(): string {
      return this.account ? this.account.uid || '' : '';
    },
  },
  mounted() {
    this.checkRole();
  },
  methods: {
    requestRole() {
      (async () => {
        this.requestState.loading = true;
        this.requestState.success = false;
        this.requestState.error = '';
        try {
          console.log('Request role: ', { uid: this.uid, role: this.role });
          await getInjectedRolesAdapter(this).requestRole(this.uid, this.role as string);
          this.requestState.success = true;
        } catch (error) {
          console.error('Error in RoleGuardComponent.requestRole', error);
          this.requestState.error = error.message;
        }
        this.requestState.loading = false;
      })();
    },
    checkRole() {
      try {
        console.log('Checking role for ', this.account, this.role);
        RolesAuthModule.Actions.CheckRole.dispatch(this.$store.dispatch, this.role as string);
        this.requestState.success = false;

        this.scheduleCheckRole();
      } catch (error) {
        console.error('Error in RoleGuardComponent.checkRole', error);
      }
    },
    scheduleCheckRole() {
      try {
        const { roleCheckingIntervalSeconds } = getInjectedRolesAdapter(this).getConfig();
        const timeoutMs = 1000
          * (this.hasRole
            ? roleCheckingIntervalSeconds.whenHasRole
            : roleCheckingIntervalSeconds.whenDoesNotHaveRole);

        if (timerHandle) clearTimeout(timerHandle);
        timerHandle = setTimeout(() => this.checkRole(), timeoutMs);
      } catch (error) {
        console.error('Error in RoleGuardComponent.scheduleCheckRole', error);
      }
    },
  },
  components: {
    RoleGuardBanComponent,
  },
});
</script>
