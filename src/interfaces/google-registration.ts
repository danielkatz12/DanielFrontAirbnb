import {RegistrationDetails} from "./registration-details.ts";

export interface GoogleRegistration extends RegistrationDetails {
    idToken: string;
}
