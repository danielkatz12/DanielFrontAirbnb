import {RegistrationDetails} from "./registration-details.ts";

export interface StandardRegistration extends RegistrationDetails {
    username: string;
    password: string;
}
