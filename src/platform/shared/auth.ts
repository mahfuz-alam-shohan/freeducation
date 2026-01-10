// Helper to create a signed token (simplified JWT-like structure)
export async function createToken(payload: any, secret: string): Promise<string> {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encodedHeader = btoa(JSON.stringify(header));
    const encodedPayload = btoa(JSON.stringify({
        ...payload,
        exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days expiration
    }));

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signatureInput));
    const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));

    return `${signatureInput}.${encodedSignature}`;
}

export async function verifyToken(token: string, secret: string): Promise<any | null> {
    try {
        const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
        if (!encodedHeader || !encodedPayload || !encodedSignature) return null;

        const signatureInput = `${encodedHeader}.${encodedPayload}`;
        const key = await crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(secret),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );
        
        const signature = Uint8Array.from(atob(encodedSignature), c => c.charCodeAt(0));
        const isValid = await crypto.subtle.verify("HMAC", key, signature, new TextEncoder().encode(signatureInput));

        if (!isValid) return null;

        const payload = JSON.parse(atob(encodedPayload));
        if (payload.exp < Date.now()) return null; // Token expired

        return payload;
    } catch (e) {
        return null;
    }
}

export async function hashPassword(password: string, salt: string): Promise<string> {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );
    
    const bits = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: "SHA-256"
        },
        key,
        256
    );
    
    return Array.from(new Uint8Array(bits))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}


