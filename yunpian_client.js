Meteor.loginWithYunpian = function (phone, code, callback) {
  Accounts.callLoginMethod({
    methodArguments: [{
      yunpian: true,
      phone: phone,
      code: code
    }],
    userCallback: callback
  });
};

Meteor.sendVerificationCode = function (phone, callback) {
  Meteor.call('accounts-yunpian.sendVerificationCode', phone, callback);
};