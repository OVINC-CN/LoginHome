import http from '@/api/index';
import type {
    PasskeyAuthenticationCredential,
    PasskeyRegistrationCredential,
    PublicKeyCredentialCreationOptionsJSON,
    PublicKeyCredentialRequestOptionsJSON,
} from '@/lib/passkey';

export interface PasskeyLoginOptionsResponse {
    challenge_id: string;
    publicKey: PublicKeyCredentialRequestOptionsJSON;
}

export interface PasskeyRegisterOptionsResponse {
    challenge_id: string;
    publicKey: PublicKeyCredentialCreationOptionsJSON;
}

export interface PasskeyLoginResponse {
    code?: string;
}

export interface PasskeyRegisterPendingResponse {
    passkey_code: string;
}

export const getPasskeyLoginOptionsAPI = (data: { is_oauth: boolean }): Promise<PasskeyLoginOptionsResponse> =>
    http.post('/account/passkey_login_options/', data);

export const passkeyLoginAPI = (data: {
    challenge_id: string;
    credential: PasskeyAuthenticationCredential;
    is_oauth: boolean;
}): Promise<PasskeyLoginResponse> => http.post('/account/passkey_login/', data);

export const getPasskeyRegisterOptionsAPI = (data: { display_name?: string }): Promise<PasskeyRegisterOptionsResponse> =>
    http.post('/account/passkey_register_options/', data);

export const passkeyRegisterPendingAPI = (data: {
    challenge_id: string;
    credential: PasskeyRegistrationCredential;
    name: string;
}): Promise<PasskeyRegisterPendingResponse> => http.post('/account/passkey_register_pending/', data);
