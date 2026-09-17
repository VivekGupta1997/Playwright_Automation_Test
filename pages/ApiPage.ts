import { APIRequestContext, APIResponse } from '@playwright/test';
import testData from '../testData.json';

export interface ApiUserPayload {
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
    organization?: string;
    [key: string]: any;
}

export interface ApiProgramPayload {
    name?: string;
    organization?: string;
    connectedResource?: string;
    maxAttendance?: string | number;
    startDate?: string;
    endDate?: string;
    fee?: {
        name: string;
        amount: string | number;
        gla?: string;
    };
    [key: string]: any;
}

export interface ApiPassPayload {
    name?: string;
    passType?: string;
    passLevel?: string;
    numberPunches?: string | number;
    organization?: string;
    fee?: {
        name: string;
        amount: string | number;
        gla?: string;
    };
    [key: string]: any;
}

export interface ApiEventPayload {
    name?: string;
    connectedResource?: string;
    maxAttendance?: string | number;
    userTicketLimit?: string | number;
    familyTicketLimit?: string | number;
    organization?: string;
    [key: string]: any;
}

export interface ApiResourcePayload {
    name?: string;
    connectedResource?: string;
    organization?: string;
    fees?: Array<{
        name: string;
        amount: string | number;
        gla?: string;
    }>;
    [key: string]: any;
}

export class ApiPage {
    private authToken: string | null = null;
    readonly baseUrl: string;

    constructor(
        readonly request: APIRequestContext,
        baseUrl: string = testData.app.baseUrl
    ) {
        this.baseUrl = baseUrl;
    }

    /**
     * Set auth token manually for authenticated requests
     */
    setAuthToken(token: string) {
        this.authToken = token;
    }

    /**
     * Get active authentication token
     */
    getAuthToken(): string | null {
        return this.authToken;
    }

    /**
     * Construct default headers including Content-Type and optional Authorization token
     */
    private getHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...extraHeaders
        };
        if (this.authToken) {
            headers['Authorization'] = `Bearer ${this.authToken}`;
        }
        return headers;
    }

    // ─── 1. Authentication API ────────────────────────────────────────────────

    /**
     * Test Login API endpoint
     */
    async login(
        username: string = testData.credentials.admin.username,
        password: string = testData.credentials.admin.password,
        endpoint: string = '/api/auth/login'
    ): Promise<APIResponse> {
        const response = await this.request.post(`${this.baseUrl}${endpoint}`, {
            data: { username, password },
            headers: this.getHeaders()
        });

        if (response.ok()) {
            const body = await response.json().catch(() => null);
            if (body && (body.token || body.accessToken)) {
                this.authToken = body.token || body.accessToken;
            }
        }

        return response;
    }

    // ─── 2. User Management APIs ─────────────────────────────────────────────

    /**
     * Create a new user via API
     */
    async createUser(
        userData: ApiUserPayload = {},
        endpoint: string = '/api/users'
    ): Promise<APIResponse> {
        const timestamp = Date.now();
        const payload: ApiUserPayload = {
            firstName: userData.firstName || testData.user.firstName,
            lastName: userData.lastName || testData.user.lastName,
            email: userData.email || `api_user_${timestamp}@gmail.com`,
            address1: userData.address1 || testData.user.address1,
            city: userData.city || testData.user.city,
            state: userData.state || testData.user.state,
            zipCode: userData.zipCode || testData.user.zipCode,
            phoneNumber: userData.phoneNumber || testData.user.phoneNumber,
            role: userData.role || testData.user.role,
            dob: userData.dob || testData.user.dob,
            organization: userData.organization || testData.organization,
            ...userData
        };

        return await this.request.post(`${this.baseUrl}${endpoint}`, {
            data: payload,
            headers: this.getHeaders()
        });
    }

    /**
     * Get list of users via API
     */
    async getUsers(
        queryParams: Record<string, string> = {},
        endpoint: string = '/api/users'
    ): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}${endpoint}`, {
            params: queryParams,
            headers: this.getHeaders()
        });
    }

    /**
     * Get specific user details by User ID via API
     */
    async getUserById(
        userId: string | number,
        endpoint: string = '/api/users'
    ): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}${endpoint}/${userId}`, {
            headers: this.getHeaders()
        });
    }

    /**
     * Update user details via API
     */
    async updateUser(
        userId: string | number,
        userData: Partial<ApiUserPayload>,
        endpoint: string = '/api/users'
    ): Promise<APIResponse> {
        return await this.request.put(`${this.baseUrl}${endpoint}/${userId}`, {
            data: userData,
            headers: this.getHeaders()
        });
    }

    /**
     * Delete user via API
     */
    async deleteUser(
        userId: string | number,
        endpoint: string = '/api/users'
    ): Promise<APIResponse> {
        return await this.request.delete(`${this.baseUrl}${endpoint}/${userId}`, {
            headers: this.getHeaders()
        });
    }

    // ─── 3. Offerings Creation APIs ──────────────────────────────────────────

    /**
     * Create a Program Offering via API
     */
    async createProgram(
        programData: ApiProgramPayload = {},
        endpoint: string = '/api/offerings/programs'
    ): Promise<APIResponse> {
        const payload: ApiProgramPayload = {
            name: programData.name || `API Program ${Date.now()}`,
            organization: programData.organization || testData.organization,
            connectedResource: programData.connectedResource || testData.program.connectedResource,
            maxAttendance: programData.maxAttendance || testData.program.maxAttendance,
            fee: programData.fee || {
                name: testData.program.fee.name,
                amount: testData.program.fee.amount,
                gla: testData.program.fee.gla
            },
            ...programData
        };

        return await this.request.post(`${this.baseUrl}${endpoint}`, {
            data: payload,
            headers: this.getHeaders()
        });
    }

    /**
     * Get Program Offerings via API
     */
    async getPrograms(
        queryParams: Record<string, string> = {},
        endpoint: string = '/api/offerings/programs'
    ): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}${endpoint}`, {
            params: queryParams,
            headers: this.getHeaders()
        });
    }

    /**
     * Create a Pass Offering via API
     */
    async createPass(
        passData: ApiPassPayload = {},
        endpoint: string = '/api/offerings/passes'
    ): Promise<APIResponse> {
        const payload: ApiPassPayload = {
            name: passData.name || `API Pass ${Date.now()}`,
            passType: passData.passType || testData.pass.passType,
            passLevel: passData.passLevel || testData.pass.passLevel,
            numberPunches: passData.numberPunches || testData.pass.numberPunches,
            organization: passData.organization || testData.organization,
            fee: passData.fee || {
                name: testData.pass.fee.name,
                amount: testData.pass.fee.amount,
                gla: testData.pass.fee.gla
            },
            ...passData
        };

        return await this.request.post(`${this.baseUrl}${endpoint}`, {
            data: payload,
            headers: this.getHeaders()
        });
    }

    /**
     * Get Pass Offerings via API
     */
    async getPasses(
        queryParams: Record<string, string> = {},
        endpoint: string = '/api/offerings/passes'
    ): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}${endpoint}`, {
            params: queryParams,
            headers: this.getHeaders()
        });
    }

    /**
     * Create an Event Offering via API
     */
    async createEvent(
        eventData: ApiEventPayload = {},
        endpoint: string = '/api/offerings/events'
    ): Promise<APIResponse> {
        const payload: ApiEventPayload = {
            name: eventData.name || `API Event ${Date.now()}`,
            connectedResource: eventData.connectedResource || testData.event.connectedResource,
            maxAttendance: eventData.maxAttendance || testData.event.maxAttendance,
            userTicketLimit: eventData.userTicketLimit || testData.event.userTicketLimit,
            familyTicketLimit: eventData.familyTicketLimit || testData.event.familyTicketLimit,
            organization: eventData.organization || testData.organization,
            ...eventData
        };

        return await this.request.post(`${this.baseUrl}${endpoint}`, {
            data: payload,
            headers: this.getHeaders()
        });
    }

    /**
     * Get Event Offerings via API
     */
    async getEvents(
        queryParams: Record<string, string> = {},
        endpoint: string = '/api/offerings/events'
    ): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}${endpoint}`, {
            params: queryParams,
            headers: this.getHeaders()
        });
    }

    /**
     * Create a Resource via API
     */
    async createResource(
        resourceData: ApiResourcePayload = {},
        endpoint: string = '/api/resources'
    ): Promise<APIResponse> {
        const payload: ApiResourcePayload = {
            name: resourceData.name || `${testData.resource.namePrefix} ${Date.now()}`,
            connectedResource: resourceData.connectedResource || testData.resource.connectedResource,
            organization: resourceData.organization || testData.organization,
            ...resourceData
        };

        return await this.request.post(`${this.baseUrl}${endpoint}`, {
            data: payload,
            headers: this.getHeaders()
        });
    }

    /**
     * Get Resources via API
     */
    async getResources(
        queryParams: Record<string, string> = {},
        endpoint: string = '/api/resources'
    ): Promise<APIResponse> {
        return await this.request.get(`${this.baseUrl}${endpoint}`, {
            params: queryParams,
            headers: this.getHeaders()
        });
    }

    // ─── 4. Generic HTTP Utilities ───────────────────────────────────────────

    async get(url: string, options: Parameters<APIRequestContext['get']>[1] = {}): Promise<APIResponse> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
        return await this.request.get(fullUrl, {
            ...options,
            headers: { ...this.getHeaders(), ...options.headers }
        });
    }

    async post(url: string, data?: any, options: Parameters<APIRequestContext['post']>[1] = {}): Promise<APIResponse> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
        return await this.request.post(fullUrl, {
            data,
            ...options,
            headers: { ...this.getHeaders(), ...options.headers }
        });
    }

    async put(url: string, data?: any, options: Parameters<APIRequestContext['put']>[1] = {}): Promise<APIResponse> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
        return await this.request.put(fullUrl, {
            data,
            ...options,
            headers: { ...this.getHeaders(), ...options.headers }
        });
    }

    async patch(url: string, data?: any, options: Parameters<APIRequestContext['patch']>[1] = {}): Promise<APIResponse> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
        return await this.request.patch(fullUrl, {
            data,
            ...options,
            headers: { ...this.getHeaders(), ...options.headers }
        });
    }

    async delete(url: string, options: Parameters<APIRequestContext['delete']>[1] = {}): Promise<APIResponse> {
        const fullUrl = url.startsWith('http') ? url : `${this.baseUrl}${url.startsWith('/') ? url : '/' + url}`;
        return await this.request.delete(fullUrl, {
            ...options,
            headers: { ...this.getHeaders(), ...options.headers }
        });
    }
}
