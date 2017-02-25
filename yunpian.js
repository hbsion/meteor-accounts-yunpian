Accounts.yunpian = {};

var smslists = new Mongo.Collection('yunpian.smslists');

Yunpian = function (yunpianoptions) {
  var self = this;
  // options = _.extend({
  //   // default
  // }, options);

  check(yunpianoptions, {
    apikey: String
  });

  self.apikey = yunpianoptions.apikey;

  //self.client = new twilio(options.sid, options.token);

};

Yunpian.prototype.sendSMS = function (options, callback) {
  var self = this;

  options = _.extend({
  	apikey:self.apikey
  }, options);

  check(options, {
  	apikey: String,
    mobile: String,
    text: String,
    //statusCallback: Match.Optional(String)
  });

  return Meteor.wrapAsync(self.sendMessage).call(self, options, callback);
};

Yunpian.prototype.sendMessage = function (options, callback) {
  	var self = this;

  	check(options, {
  		apikey: String,
	    mobile: String,
	    text: String
	});

	if (_.isFunction(options)) {
	    callback = options;
	    options = {};
	}

	HTTP.post('https://sms.yunpian.com/v2/sms/single_send.json', {
		data: _.pick(options,'mobile','text','apikey')
	}, function (error, response) {
		if (error) {
			callback(error);
		} else {
			//记录
			data = _.extend(response.data,{
				mobile:options.mobile
			});
			smslists.insert(response.data);
			callback(null, response.data);
		}
	});
};