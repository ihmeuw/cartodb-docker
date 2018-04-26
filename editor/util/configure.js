const fs = require('fs');

const yaml = require('js-yaml');
const yargs = require('yargs');

const merge = require('./merge.js');

const CONFIG_DIR = '/cartodb/config';
const APP_CONFIG_FILE = CONFIG_DIR + '/app_config.yml';
const DB_CONFIG_FILE = CONFIG_DIR + '/database.yml';

const {
  app_config,
  database,
  public_host,
  public_port
} = yargs
  .usage('Usage: $0 [OPTIONS]')
  .describe('a', `YAML files to merge to form the app configuration file; files earlier in the list take precedence over files later in the list`)
  .alias('a', 'app_config')
  .array('a')
  .describe('d', `YAML files to merge to form the database configuration file; files earlier in the list take precedence over files later in the list`)
  .alias('d', 'database')
  .array('d')
  .describe('h', 'hostname on which the app will be exposed')
  .alias('h', 'public_host')
  .describe('p', 'port on which the app will be exposed')
  .alias('p', 'public_port')
  .demand(['a', 'd'])
  .argv;

const appConfigFiles = app_config.map(createAbsoluteFilepath);
const dbConfigFiles = database.map(createAbsoluteFilepath);

const PUBLIC_HOST = public_host || process.env.PUBLIC_HOST || 'localhost';
const PUBLIC_PORT = public_port || process.env.PUBLIC_PORT || '80';

// These next two values are used to build URLs for the browser. If we're using the default port,
// 80, we don't want to include it. If we're using a port besides the default, we MUST include it,
// or the URL won't work.
const PUBLIC_URL = (
  PUBLIC_PORT == '80'
  ? PUBLIC_HOST
  : `${PUBLIC_HOST}:${PUBLIC_PORT}`
);
const PORT_IF_NOT_DEFAULT = (
  PUBLIC_PORT == '80'
  ? null
  : PUBLIC_PORT
);

const DEFAULT_USER = process.env.DEFAULT_USER || 'username';

const configEnv = {
  PUBLIC_HOST,
  PUBLIC_PORT,
  PUBLIC_URL,
  PORT_IF_NOT_DEFAULT,
  DEFAULT_USER,
};

// Do environment substitution on app config files, supplying PUBLIC_HOST and PUBLIC_PORT.
for (const filename of appConfigFiles) {
  envsubst(filename, configEnv);
}

// Create app config by merging files.
mergeYMLFiles(appConfigFiles, APP_CONFIG_FILE);
// Create database config by merging files.
mergeYMLFiles(dbConfigFiles, DB_CONFIG_FILE);

function createAbsoluteFilepath(filename) {
  return `${CONFIG_DIR}/${filename}`;
}

// Modify specified file in place, substituting variables in the key-value mapping object `env`.
// This works in the manner of shell variable substitution, using the forms $VAR and ${VAR}.
function envsubst(filename, env) {
  const content = fs.readFileSync(filename, 'utf8');
  const output = Object.keys(env).reduce((acc, key) => {
    const regex = new RegExp('(?:\\$\\{' + key + '\\}|\\$' + key + ')', 'g');
    return acc.replace(regex, env[key]);
  }, content);
  fs.writeFileSync(filename, output);
}

function mergeYMLFiles(inputFiles, outputFile) {
  // convert contents of YAML files to JS objects
  const inputObjects = inputFiles.map(filename => loadObjectFromYMLFile(filename));
  // merge objects; objects earlier in the array take precedence over those later in the array
  const merged = merge(...inputObjects);
  // write the merged object to a file
  writeObjectToYMLFile(merged, outputFile);
}

function loadObjectFromYMLFile(filename) {
  const content = fs.readFileSync(filename, 'utf8');
  return yaml.safeLoad(content, { json: true });
}

function writeObjectToYMLFile(object, filename) {
  const ymlString = yaml.safeDump(object);
  fs.writeFileSync(filename, ymlString);
}
