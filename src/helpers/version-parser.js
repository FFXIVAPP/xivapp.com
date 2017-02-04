const fs = require('fs');
const path = require('path');

const getDependencyVersionInfo = (parentPath, parentObject) => {
  const packagePath = path.join(parentPath, 'package.json');
  if (!fs.existsSync(packagePath)) {
    return;
  }
  const packageInfo = JSON.parse(fs.readFileSync(packagePath, {
    encoding: 'utf-8'
  }));
  if (!packageInfo.name) {
    return;
  }
  const dependency = {};
  dependency.version = packageInfo.version;
  // get the resolved hash of each package
  if (packageInfo._resolved) {
    dependency.resolved = packageInfo._resolved;
  }
  parentObject[packageInfo.name] = dependency;
  // if the depdency has dependencies loop through those
  for (const dependencyKey in packageInfo.dependencies) {
    if (!dependency.dependencies) {
      dependency.dependencies = {};
    }
    getDependencyVersionInfo(path.join(parentPath, 'node_modules', dependencyKey), dependency.dependencies);
  }
};

// read the package json and get dependency version info
const getVersionInfo = (packageRoot) => {
  const versionTree = {};
  getDependencyVersionInfo(packageRoot, versionTree);
  return versionTree;
};

module.exports = {
  getVersionInfo
};
