accounts-yunpian
=============
Allow users to login with their phone number smsgateway https://www.yunpian.com.

##Usage

`meteor add hbsion:accounts-yunpian`

**Server**

```
// Configure to use yunpian.
Accounts.yunpian.configure({
  yunpian: {
    apikey: "************", //required
    tpl_id: "12345678", //required "你的验证码#code#"
  }
});
```

**Client**

```
// Send the verification code sms.
Meteor.sendVerificationCode('13800138000');
```

```
// Login with the verification code sms.
Meteor.loginWithYunpian('13800138000', '1234');
```