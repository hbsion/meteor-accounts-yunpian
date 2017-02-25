Package.describe({
  name: 'hbsion:accounts-yunpian',
  version: '0.0.2',
  summary: 'Allow users to login with yunpian send sms to phone number.',
  git: 'https://github.com/hbsion/meteor-accounts-yunpian.git'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.2.7');

  api.use([
    'random',
    'jperl:match-ex@1.0.0',
    'mongo'
  ], 'server');

  api.use([
    'accounts-base',
    'check',
    'http'
  ], ['client', 'server']);

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  api.addFiles('yunpian.js', 'server');

  api.addFiles('yunpian_server.js', 'server');
  api.addFiles('yunpian_client.js', 'client');
});
