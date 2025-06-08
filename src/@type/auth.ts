export interface OAuthProfile {
    id: string;
    emails?: Array<{ value: string }>;
    displayName?: string;
    provider: string;
}

export interface UserData {
    id: string;
    email: string;
    name: string;
    role: string;
    is_verified: boolean;
    oauth_provider: string;
    oauth_id: string;
    last_login: string;
    login_count: number;
}