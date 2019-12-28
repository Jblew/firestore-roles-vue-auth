import { FirestoreRolesConfiguration } from 'firestore-roles';

export interface Config {
    labels: Labels;
    rolesConfig: FirestoreRolesConfiguration;
    firestore: firebase.firestore.Firestore;
    roleCheckingIntervalSeconds: RoleCheckingIntervalSeconds;
    authProviders: string[];
    basePath: string;
}

export interface RoleCheckingIntervalSeconds {
    whenHasRole: number;
    whenDoesNotHaveRole: number;
}

export interface Labels {
    checkingRole: string;
    missingRole: string;
    checkingIfSufficientRole: string;
    insufficientRole: string;
    yourAccountIsNotConfirmed: string;
    requestAnAccess: string;
    requestAccessExplanation: string;
    requestAccessSuccess: string;
    alreadyRequestingTheRole: string;
    checkRoleAgain: string;
    logInPanelTitle: string;
    loading: string;
}
