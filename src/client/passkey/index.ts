// import { startRegistration } from "@simplewebauthn/browser"
import { browserSupportsWebAuthn } from '@simplewebauthn/browser';
import { registration } from './registration';
import { authentication } from './authentication';
export async function init() {
    const emailInput = document.getElementById('field-email') as HTMLInputElement
    if (!browserSupportsWebAuthn()) {
        console.log(
            'It seems this browser does not support WebAuthn/Passkey. Reach out to the plugin author')
        return;
    }
    const response = await fetch('/api/admin/passkey/init', {
        method: 'POST',
        body: JSON.stringify({ data: { email: emailInput.value } })
    });
    const { data } = await response.json()
    if (Object.entries(data).length === 0) {
        return await registration(emailInput.value)
    }
    return await authentication({
        backedUp: data['passkey']['backedUp'],
        counter: data['passkey']['counter'],
        credentialId: data['passkey']['credentialId'],
        deviceType: data['passkey']['deviceType'],
        publicKey: data['passkey']['publicKey'],
        transports: data['passkey']['transports']
    }, emailInput.value)
}

