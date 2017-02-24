var yunpianCodes = new Mongo.Collection('meteor_accounts_yunpian');

Meteor.methods({
  'accounts-yunpian.sendVerificationCode': function (phone) {
    check(phone, String);

    return Accounts.yunpian.sendVerificationCode(phone);
  }
});

// Handler to login with a phone number and code.
Accounts.registerLoginHandler('yunpian', function (options) {
  if (!options.yunpian) return;

  check(options, {
    yunpian: Boolean,
    phone: MatchEx.String(1),
    code: MatchEx.String(1),
  });

  return Accounts.yunpian.verifyCode(options.phone,options.code);
});

Accounts.yunpian.configure = function (options) {
  check(options, Match.OneOf(
    {
      yunpian: {
        apikey: String,
      }
    }, {
      lookup: MatchEx.Function(),
      sendVerificationCode: MatchEx.Function(),
      verifyCode: MatchEx.Function()
    }
  ));

  if (options.yunpian) {
    Accounts.yunpian.client = new Yunpian(options.yunpian);
  } else {
    Accounts.yunpian.lookup = options.lookup;
    Accounts.yunpian.sendVerificationCode = options.sendVerificationCode;
    Accounts.yunpian.verifyCode = options.verifyCode;
  }
};


Accounts.yunpian.sendVerificationCode = function (phone) {
  if (!Accounts.yunpian.client) throw new Meteor.Error('accounts-yunpian has not been configured');

  var phonereg = /^(1)[0-9]{10}$/gi;
  if (!phonereg.test(Number(phone))) {
    throw new Meteor.Error('not a mobile number');
  }

  var code = Math.floor(1000 + Math.random() * 9000) + '';

  // Clear out existing codes
  yunpianCodes.remove({mobile: phone});

  // Generate a new code.
  yunpianCodes.insert({mobile: phone, code: code});

  Accounts.yunpian.client.sendSMS({
    mobile: phone,
    text: '您的验证码是'+ code +'。如非本人操作，请忽略本短信'
  },function(err,res){
    //if(err) throw new Meteor.Error('no send sms');
  });

};

Accounts.yunpian.verifyCode = function (phone, code) {
  // var lookup = Accounts.yunpian.client.lookup(phone);
  // if (lookup && lookup.phone_number){
  //   phone = lookup.phone_number;
  // } else {
  //   throw new Meteor.Error("Couldn't normalize the phone");
  // };
  // console.log(phone);
  var user = Meteor.users.findOne({mobile: phone});
  if (!user) {
    //新建用户
    userId = Meteor.users.insert({
      mobile:phone,
      createdAt:new Date(),
    })
    //throw new Meteor.Error('Invalid phone number');
  } else {
    userId = user._id;
  }

  var validCode = yunpianCodes.findOne({mobile: phone, code: code});
  if (!validCode) throw new Meteor.Error('Invalid verification code');
  // Clear the verification code after a succesful login.

  yunpianCodes.remove({mobile: phone});
  return {userId: userId};
};