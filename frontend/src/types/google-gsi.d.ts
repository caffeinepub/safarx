// TypeScript declarations for Google Identity Services (GSI) client library

interface GoogleCredentialResponse {
    credential: string; // JWT token
    select_by: string;
    clientId: string;
}

interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
    context?: string;
    ux_mode?: 'popup' | 'redirect';
    login_uri?: string;
    native_callback?: (response: GoogleCredentialResponse) => void;
    itp_support?: boolean;
}

interface GsiButtonConfiguration {
    type?: 'standard' | 'icon';
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: string | number;
    locale?: string;
}

interface GoogleAccountsId {
    initialize(config: GoogleIdConfiguration): void;
    prompt(momentListener?: (notification: PromptMomentNotification) => void): void;
    renderButton(parent: HTMLElement, options: GsiButtonConfiguration): void;
    disableAutoSelect(): void;
    storeCredential(credential: { id: string; password: string }, callback: () => void): void;
    cancel(): void;
    revoke(hint: string, callback: (done: RevocationResponse) => void): void;
}

interface PromptMomentNotification {
    isDisplayMoment(): boolean;
    isDisplayed(): boolean;
    isNotDisplayed(): boolean;
    getNotDisplayedReason(): string;
    isSkippedMoment(): boolean;
    getSkippedReason(): string;
    isDismissedMoment(): boolean;
    getDismissedReason(): string;
    getMomentType(): string;
}

interface RevocationResponse {
    successful: boolean;
    error: string;
}

interface GoogleAccounts {
    id: GoogleAccountsId;
}

interface Window {
    google?: {
        accounts: GoogleAccounts;
    };
}
