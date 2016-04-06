const variables = {
  version: process.env.npm_package_version,
};

export default function isomorphicVars() {
  if (typeof(window) === 'undefined') {
    return variables;
  }

  return window.isomorphicVars;
}
