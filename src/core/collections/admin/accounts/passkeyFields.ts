import { Field } from "payload";

export const PasskeyFields: Field[] = [
    {
        name: 'id',
        type: 'text',
        required: true,
    },
    {
        name: 'publicKey',
        type: 'json',
        required: true,
    },
    {
        name: 'counter',
        type: 'number',
        required: true,
    },
    {
        name: 'transports',
        type: 'json',
        required: true,
    },
    {
        name: 'deviceType',
        type: 'text',
        required: true,
    },
    {
        name: 'backedUp',
        type: "checkbox",
        required: true,
    }
]