export const sendVerificationEmail = async (email: string, code: string, env: any) => {
    try {
        // 1. Get a fresh Access Token using the Refresh Token
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: env.GMAIL_CLIENT_ID,
                client_secret: env.GMAIL_CLIENT_SECRET,
                refresh_token: env.GMAIL_REFRESH_TOKEN,
                grant_type: 'refresh_token',
            }),
        });

        const tokenData = await tokenResponse.json();
        if (!tokenData.access_token) {
            console.error('Failed to refresh Gmail token:', tokenData);
            return false;
        }

        // 2. Construct the Email Content
        const subject = 'Your Verification Code';
        const body = `
<div style="font-family: sans-serif; padding: 20px; text-align: center; border: 1px solid #eee; border-radius: 8px;">
    <h2>Welcome to Freeducation!</h2>
    <p>Please enter the following code to verify your account:</p>
    <h1 style="color: #4F46E5; letter-spacing: 5px; margin: 20px 0;">${code}</h1>
    <p>This code will expire in 10 minutes.</p>
    <p style="font-size: 12px; color: #888; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
</div>
`;
        
        // 3. Format strictly for Gmail API (MIME message encoded in Base64URL)
        const utf8Subject = `=?utf-8?B?${btoa(subject)}?=`;
        const messageParts = [
            `From: Freeducation <mahfuz.alam.shohan@gmail.com>`,
            `To: ${email}`,
            `Subject: ${utf8Subject}`,
            `MIME-Version: 1.0`,
            `Content-Type: text/html; charset=utf-8`,
            ``,
            body,
        ];
        const message = messageParts.join('\n');
        
        const encodedMessage = btoa(unescape(encodeURIComponent(message)))
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        // 4. Send via Gmail API
        const sendResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${tokenData.access_token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                raw: encodedMessage,
            }),
        });

        if (sendResponse.ok) {
            return true;
        } else {
            console.error('Gmail Send Error:', await sendResponse.text());
            return false;
        }
    } catch (e) {
        console.error('Network Error:', e);
        return false;
    }
};
