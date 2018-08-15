const { configs } = require('eslint-plugin-jest');

module.exports = {
    "extends": "airbnb-base",
    "env": {
        "node": true,
        "browser": false
    },
    "overrides": [
        {
            "files": [ '**/*.test.js' ],
            "plugins": ["jest"],
            "env": {
                "jest": true,
                "jest/globals": true
            },
            "rules": configs.recommended,
        }
    ]
};
