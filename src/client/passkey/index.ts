import { startRegistration } from "@simplewebauthn/browser"
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';
export async function registration() {
    const emailInput = document.getElementById('field-email') as HTMLInputElement
    if (!browserSupportsWebAuthn()) {
        console.log(
            'It seems this browser does not support WebAuthn/Passkey. Reach out to the plugin author')
        return;
    }
    const resp = await fetch('http://localhost:3000/api/admin/passkey/generate-registration-options', {
        method: 'POST',
        body: JSON.stringify({ data: { email: emailInput.value } })
    });
    const optionsJSON = await resp.json();
    try {
        const registrationResp = await startRegistration({ optionsJSON: optionsJSON.options });
        await fetch('http://localhost:3000/api/admin/passkey/verify-registration', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: { email: emailInput.value, registration: registrationResp } }),
        });
    } catch (error) {
        console.log(error);
    }

}