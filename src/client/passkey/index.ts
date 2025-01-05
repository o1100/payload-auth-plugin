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
    let attResp;
    try {
        // Pass the options to the authenticator and wait for a response
        attResp = await startRegistration({ optionsJSON: optionsJSON.options });
    } catch (error) {
        // Some basic error handling
        console.log(error);

    }

}