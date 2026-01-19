type GmailEnv = {
  GMAIL_CLIENT_ID: string;
  GMAIL_CLIENT_SECRET: string;
  GMAIL_REFRESH_TOKEN: string;
};

const assertGmailConfig = (env: GmailEnv): void => {
  const missing = [
    ["GMAIL_CLIENT_ID", env.GMAIL_CLIENT_ID],
    ["GMAIL_CLIENT_SECRET", env.GMAIL_CLIENT_SECRET],
    ["GMAIL_REFRESH_TOKEN", env.GMAIL_REFRESH_TOKEN],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Gmail configuration: ${missing.join(", ")}.`);
  }
};

const buildRawEmail = (to: string, subject: string, body: string): string => {
  const headers = [
    `To: ${to}`,
    "From: Freeducation <noreply@freeducation>",
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
  ];

  return [...headers, "", body].join("\r\n");
};

const toBase64Url = (value: string): string =>
  btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");

const fetchAccessToken = async (env: GmailEnv): Promise<string> => {
  assertGmailConfig(env);
  const payload = new URLSearchParams({
    client_id: env.GMAIL_CLIENT_ID,
    client_secret: env.GMAIL_CLIENT_SECRET,
    refresh_token: env.GMAIL_REFRESH_TOKEN,
    grant_type: "refresh_token",
  });

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: payload.toString(),
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const data = (await response.json()) as { error_description?: string; error?: string };
      errorDetail = data.error_description || data.error || errorDetail;
    } catch {
      // Ignore JSON parse errors, fall back to status text.
    }
    throw new Error(`Unable to refresh Gmail access token: ${errorDetail}.`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Missing Gmail access token.");
  }

  return data.access_token;
};

export const sendStudentVerificationEmail = async (
  env: GmailEnv,
  {
    to,
    name,
    code,
  }: {
    to: string;
    name: string;
    code: string;
  },
): Promise<void> => {
  const accessToken = await fetchAccessToken(env);
  const subject = "Verify your Freeducation account";
  const body = `Hi ${name},

Use the verification code below to complete your Freeducation signup:

${code}

If you did not request this, you can ignore this email.`;

  const rawMessage = buildRawEmail(to, subject, body);
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ raw: toBase64Url(rawMessage) }),
  });

  if (!response.ok) {
    let errorDetail = response.statusText;
    try {
      const data = (await response.json()) as { error?: { message?: string } };
      errorDetail = data.error?.message || errorDetail;
    } catch {
      // Ignore JSON parse errors, fall back to status text.
    }
    throw new Error(`Unable to send verification email: ${errorDetail}.`);
  }
};
