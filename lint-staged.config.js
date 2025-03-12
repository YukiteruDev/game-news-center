export default {
  './backend/**/*.{js,ts}': 'pnpm --filter backend test',
  '*.{js,ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,html}': ['prettier --write'],
  '*.css': ['prettier --write', 'stylelint --fix'],
};
