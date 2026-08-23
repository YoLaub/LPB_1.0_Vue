import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
  js.configs.recommended,
  // "essential" attrape les vraies erreurs (clés dupliquées, template
  // invalide, effets de bord dans un computed...) sans imposer de règles de
  // formatage — le code existant n'est pas passé par un formatter, on ne
  // veut pas que la CI soit rouge à cause d'indentation.
  ...pluginVue.configs['flat/essential'],
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Le projet a des composants avec plusieurs mots collés dans les
      // props (ex: Formulaire) et pas de convention stricte de nommage
      // multi-mot pour l'instant — on ne bloque pas la CI là-dessus.
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]
