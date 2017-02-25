Accounts.yunpian = {};

var smslists = new Mongo.Collection('yunpian.smslists');

Yunpian = function (yunpianoptions) {
  var self = this;
  // options = _.extend({
  //   // default
  // }, options);

  check(yunpianoptions, {
    apikey: String,
    tpl_id: String
  });

  self.apikey = yunpianoptions.apikey;
  self.tpl_id = yunpianoptions.tpl_id;

  //self.client = new twilio(options.sid, options.token);

};

Yunpian.prototype.sendSMS = function (options, callback) {
  var self = this;

  options = _.extend({
  	apikey:self.apikey,
    tpl_id:self.tpl_id
  }, options);

  check(options, {
  	apikey: String,
    mobile: String,
    tpl_id: String,
    tpl_value:String
    //statusCallback: Match.Optional(String)
  });

  return Meteor.wrapAsync(self.sendMessage).call(self, options, callback);
};

Yunpian.prototype.sendMessage = function (options, callback) {
  	var self = this;

  	check(options, {
  		apikey: String,
	    mobile: String,
	    tpl_id: String,
      tpl_value:String
	 });

	if (_.isFunction(options)) {
	    callback = options;
	    options = {};
	}

	HTTP.post('https://sms.yunpian.com/v1/sms/tpl_send.json', {
		params: _.pick(options,'apikey','mobile','tpl_id','tpl_value')
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