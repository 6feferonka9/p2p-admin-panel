import react from 'eslint-plugin-react/configs/recommended.js';
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import tsParser from '@typescript-eslint/parser';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config({
  files: ['**/*.{ts,tsx}'],
  ignores: ['./.next/**', './node_modules/**', './public/**'],
  extends: [
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    eslintPluginUnicorn.configs['flat/recommended'],
    react,
  ],
  plugins: {
    "react-hooks": reactHooks,
  },
  rules: {
    ...reactHooks.configs.recommended.rules,
    'unicorn/filename-case': "off",
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-useless-undefined': 'off',
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "max-len": 0,
    "react/react-in-jsx-scope": "off",
    "react/prop-types": 'off',
  },
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      sourceType: 'module',
      project: './tsconfig.json',
    }
  }
},
{
  // disable type-aware linting on JS files
  files: ['**/*.js'],
  ...tseslint.configs.disableTypeChecked,
});