import stylisticJs from '@stylistic/eslint-plugin-js';
import stylisticTs from '@stylistic/eslint-plugin-ts';
import parserTs from '@typescript-eslint/parser';

export default [{
  plugins: {
    '@stylistic/js': stylisticJs,
    '@stylistic/ts': stylisticTs
  },
  files: [
    '**/*.js',
    '**/*.cjs',
    '**/*.mjs',
    '**/*.ts',
    '**/*.tsx'
  ],
  languageOptions: {
    parser: parserTs,
  },
  rules: {
    indent: ['error', 2, {
      SwitchCase: 1
    }],
    quotes: ['error', 'single'],
    semi: ['error', 'always']
  },

  ignores: [
    'build/*',
    'node_modules/*',
  ]
}];
