
import { startRegistration } from "@simplewebauthn/browser"
export async function registration(email: string) {
    const resp = await fetch('/api/admin/passkey/generate-registration-options', {
        method: 'POST',
        body: JSON.stringify({ data: { email } })
    });
    const optionsJSON = await resp.json();
    try {
        const registrationResp = await startRegistration({ optionsJSON: optionsJSON.options });
        await fetch('/api/admin/passkey/verify-registration', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { email, registration: registrationResp } }),
        });
    } catch (error) {
        console.log(error);
    }
}