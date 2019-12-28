<template>
    <v-container class="auth-view" fluid fill-height>
        <v-layout align-center justify-center>
            <v-flex xs12 sm6 md4>
                <v-card class="elevation-20">
                    <v-toolbar color="primary" flat dark>
                        <v-toolbar-title v-if="loading">{{ text.loading }}...</v-toolbar-title>
                        <v-toolbar-title v-else>{{ text.logInPanelTitle }}...</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <div id="firebaseui-auth-container"></div>
                        <div v-if="loading" class="text-center px-5 py-5">
                            <v-progress-circular
                                :size="70"
                                :width="7"
                                color="accent"
                                indeterminate
                            ></v-progress-circular>
                        </div>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script lang="ts">
import { RolesAuthModule } from 'firestore-roles-vuex-module';
import Vue from 'vue';
import { FirebaseAuthHelper } from '../FirebaseAuthHelper';
import { getInjectedRolesAdapter, rolesAdapterInjectionSpread } from '../rolesAdapterInjection';

export default Vue.extend({
  ...rolesAdapterInjectionSpread,
  mounted() {
    const { authProviders, basePath } = getInjectedRolesAdapter(this).getConfig();
    FirebaseAuthHelper.startFirebaseAuthUI(
      '#firebaseui-auth-container',
      basePath,
      authProviders,
    );
  },
  computed: {
    text() {
      const { labels } = getInjectedRolesAdapter(this).getConfig();
      return {
        logInPanelTitle: labels.logInPanelTitle,
        loading: labels.loading,
      };
    },
    loading(): boolean {
      return RolesAuthModule.stateOf(this).state === RolesAuthModule.AuthState.LOADING;
    },
  },
});
</script>
