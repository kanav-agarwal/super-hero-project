module.exports = {
    superName: {
        id: 'superName',
        name: 'superName',
        label: 'Super Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Spider-Man'
    },
    realName: {
        id: 'realName',
        name: 'realName',
        label: 'Real Name',
        type: 'text',
        required: true,
        placeholder: 'e.g., Peter Parker'
    },
    superpower: {
        id: 'superpower',
        name: 'superpower',
        label: 'Superpower',
        type: 'text',
        required: true,
        placeholder: 'e.g., Web-slinging'
    },
    powerLevel: {
        id: 'powerLevel',
        name: 'powerLevel',
        label: 'Power Level (1-10)',
        type: 'number',
        required: true,
        min: 1,
        max: 10
    },
    secretIdentity: {
        id: 'secretIdentity',        
        name: 'secretIdentity',
        label: 'Has Secret Identity?',
        type: 'checkbox',
        required: false
    }
};