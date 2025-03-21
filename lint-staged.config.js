export default {
  '*.{js,ts,vue}': ['eslint --fix', 'prettier --write'],
  '*.{json,md,html}': ['prettier --write'],
  '*.{css,less}': ['prettier --write', 'stylelint --fix'],
};
