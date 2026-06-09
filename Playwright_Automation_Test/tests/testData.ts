// Centralized Test Data for Playwright POM Automation Tests

export interface LoginCredentials {
    username?: string;
    password?: string;
}

export interface UserData {
    organization?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    address1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    phoneNumber?: string;
    role?: string;
    dob?: string;
}

export interface FeeData {
    name?: string;
    amount?: string;
    gla?: string;
    deferredRevenue?: string;
    glaAccount?: string;
    liability?: string;
}

export interface TaxData {
    addonName?: string;
    price?: string;
    maxNumAvailable?: string;
    gla?: string;
    glaAccount?: string;
}

export interface ProgramData {
    organization?: string;
    namePrefix?: string;
    connectedResource?: string;
    maxAttendance?: string;
    fee?: FeeData;
    tax?: TaxData;
}

export interface PassData {
    organization?: string;
    namePrefix?: string;
    passType?: string;
    numberPunches?: string;
    fee?: FeeData;
}

// Default Configuration values
export const DEFAULT_LOGIN_URL = 'https://yellow-plant-07ff7231e.5.azurestaticapps.net/';

export const DEFAULT_CREDENTIALS: Required<LoginCredentials> = {
    username: 'viveksytemadmin@gmail.com',
    password: 'viveksytemadmin',
};

export const DEFAULT_USER_DATA: Required<UserData> = {
    organization: 'Etrak demo 3',
    firstName: 'ranger',
    lastName: 'new',
    email: 'ranger1254@gmail.com',
    address1: 'Indore',
    city: 'Indore',
    state: 'Arizona',
    zipCode: '452015',
    phoneNumber: '(999)999-99999',
    role: 'rental',
    dob: '04/15/1994',
};

export const DEFAULT_PROGRAM_DATA: Required<ProgramData> = {
    organization: 'Etrak demo 3',
    namePrefix: 'Etrak demo',
    connectedResource: 'AM test',
    maxAttendance: '10',
    fee: {
        name: 'fee',
        amount: '020',
        gla: 'Gla test',
        deferredRevenue: 'Deferred Revenue Test KMO',
        glaAccount: 'SALES TAX',
        liability: '- Liability',
    },
    tax: {
        addonName: 'adding add on',
        price: '20',
        maxNumAvailable: '010',
        gla: 'Gla test',
        glaAccount: '', // Dynamic or fallback last option
    },
};

export const DEFAULT_PASS_DATA: Required<PassData> = {
    organization: 'Etrak demo 3',
    namePrefix: 'New Pass',
    passType: 'Punch Pass',
    numberPunches: '10',
    fee: {
        name: 'fee',
        amount: '050',
        gla: 'Gla test',
        deferredRevenue: 'Deferred Revenue Test KMO',
    },
};
