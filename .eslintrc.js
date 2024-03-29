module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'jsx-a11y', 'import'],
    rules: {
        'max-lines-per-function': ['error', { max: 500 }],
        // Add more rules as needed...
    },
    parserOptions: {
        project: './tsconfig.json',
    },
};