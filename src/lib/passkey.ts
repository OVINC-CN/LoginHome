export interface PublicKeyCredentialDescriptorJSON extends Omit<PublicKeyCredentialDescriptor, 'id'> {
    id: string;
}

export interface PublicKeyCredentialUserEntityJSON extends Omit<PublicKeyCredentialUserEntity, 'id'> {
    id: string;
}

export interface PublicKeyCredentialCreationOptionsJSON extends Omit<PublicKeyCredentialCreationOptions, 'challenge' | 'excludeCredentials' | 'user'> {
    challenge: string;
    excludeCredentials?: PublicKeyCredentialDescriptorJSON[];
    user: PublicKeyCredentialUserEntityJSON;
}

export interface PublicKeyCredentialRequestOptionsJSON extends Omit<PublicKeyCredentialRequestOptions, 'allowCredentials' | 'challenge'> {
    allowCredentials?: PublicKeyCredentialDescriptorJSON[];
    challenge: string;
}

export interface PasskeyRegistrationCredential {
    id: string;
    rawId: string;
    type: string;
    authenticatorAttachment: string | null;
    response: {
        attestationObject: string;
        clientDataJSON: string;
        transports: string[];
    };
}

export interface PasskeyAuthenticationCredential {
    id: string;
    rawId: string;
    type: string;
    authenticatorAttachment: string | null;
    response: {
        authenticatorData: string;
        clientDataJSON: string;
        signature: string;
        userHandle: string | null;
    };
}

export const isPasskeySupported = (): boolean =>
    typeof window !== 'undefined' && 'PublicKeyCredential' in window && Boolean(navigator.credentials);

export const base64urlToBuffer = (value: string): ArrayBuffer => {
    const padded = value + '='.repeat((4 - (value.length % 4)) % 4);
    const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i += 1) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
};

export const bufferToBase64url = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer);
    let binary = '';

    for (const byte of bytes) {
        binary += String.fromCharCode(byte);
    }

    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

export const decodeCreationOptions = (publicKey: PublicKeyCredentialCreationOptionsJSON): PublicKeyCredentialCreationOptions => ({
    ...publicKey,
    challenge: base64urlToBuffer(publicKey.challenge),
    excludeCredentials: (publicKey.excludeCredentials || []).map((item) => ({
        ...item,
        id: base64urlToBuffer(item.id),
    })),
    user: {
        ...publicKey.user,
        id: base64urlToBuffer(publicKey.user.id),
    },
});

export const decodeRequestOptions = (publicKey: PublicKeyCredentialRequestOptionsJSON): PublicKeyCredentialRequestOptions => ({
    ...publicKey,
    allowCredentials: (publicKey.allowCredentials || []).map((item) => ({
        ...item,
        id: base64urlToBuffer(item.id),
    })),
    challenge: base64urlToBuffer(publicKey.challenge),
});

const isPublicKeyCredential = (credential: Credential | null): credential is PublicKeyCredential =>
    Boolean(credential) && credential?.type === 'public-key';

const isAttestationResponse = (response: AuthenticatorResponse): response is AuthenticatorAttestationResponse =>
    'attestationObject' in response;

const isAssertionResponse = (response: AuthenticatorResponse): response is AuthenticatorAssertionResponse =>
    'authenticatorData' in response && 'signature' in response;

export const encodeRegistrationCredential = (credential: PublicKeyCredential): PasskeyRegistrationCredential => {
    if (!isAttestationResponse(credential.response)) {
        throw new Error('Passkey Registration Failed');
    }

    return {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,
        authenticatorAttachment: credential.authenticatorAttachment,
        response: {
            attestationObject: bufferToBase64url(credential.response.attestationObject),
            clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
            transports: credential.response.getTransports ? credential.response.getTransports() : [],
        },
    };
};

export const encodeAuthenticationCredential = (credential: PublicKeyCredential): PasskeyAuthenticationCredential => {
    if (!isAssertionResponse(credential.response)) {
        throw new Error('Passkey Authentication Failed');
    }

    return {
        id: credential.id,
        rawId: bufferToBase64url(credential.rawId),
        type: credential.type,
        authenticatorAttachment: credential.authenticatorAttachment,
        response: {
            authenticatorData: bufferToBase64url(credential.response.authenticatorData),
            clientDataJSON: bufferToBase64url(credential.response.clientDataJSON),
            signature: bufferToBase64url(credential.response.signature),
            userHandle: credential.response.userHandle ? bufferToBase64url(credential.response.userHandle) : null,
        },
    };
};

export const getPasskeyRegistrationCredential = async (
    publicKey: PublicKeyCredentialCreationOptionsJSON,
): Promise<PasskeyRegistrationCredential> => {
    const credential = await navigator.credentials.create({
        publicKey: decodeCreationOptions(publicKey),
    });

    if (!isPublicKeyCredential(credential)) {
        throw new Error('Passkey Registration Failed');
    }

    return encodeRegistrationCredential(credential);
};

export const getPasskeyAuthenticationCredential = async (
    publicKey: PublicKeyCredentialRequestOptionsJSON,
): Promise<PasskeyAuthenticationCredential> => {
    const credential = await navigator.credentials.get({
        publicKey: decodeRequestOptions(publicKey),
    });

    if (!isPublicKeyCredential(credential)) {
        throw new Error('Passkey Authentication Failed');
    }

    return encodeAuthenticationCredential(credential);
};
