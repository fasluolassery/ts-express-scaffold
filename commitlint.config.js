module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Enforce that commit messages must always have a scope: e.g. feat(auth): add login
    'scope-empty': [2, 'never'],

    // Enforce a blank line between the header (first line) and the body
    'body-leading-blank': [2, 'always'],

    // Require a body explaining the changes (the bullet points of what we have done)
    'body-empty': [2, 'never'],
  },
};
