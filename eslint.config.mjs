// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Your custom configs here
  {
    rules: {
      // Global
      semi: 2,
      quotes: ['error', 'single'],
      '@typescript-eslint/no-unused-vars': 'error',
      'quote-props': ['error', 'as-needed'],
      // Vue
      'vue/multi-word-component-names': 0,
      'vue/html-closing-bracket-newline': [
        'error',
        {
          singleline: 'never',
          multiline: 'never',
        },
      ],
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: 1,
          multiline: 1,
        },
      ],
      'vue/html-indent': [
        'error',
        2,
        {
          attribute: 1,
          baseIndent: 1,
          // closeBracket: 0,
          alignAttributesVertically: true,
          ignores: [],
        },
      ],
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'always',
            normal: 'never',
          },
        },
      ],
      'vue/no-v-html': 0,
    },
  },
);
