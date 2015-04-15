describe('youversion signup', function() {
	var email_element = element(by.css("#user_email"));	
	var fn_element = element(by.css("#user_first_name"));
	var ln_element = element(by.css("#user_last_name"));
	var un_element = element(by.css("#user_username"));	
	var pw_element = element(by.css("#user_password"));	
	var register_button = element(by.css("#main input.action_button_green"));
	var register_confirm = element(by.css("#main h1.keep"));
	var testUrl = browser.params.testUrl;

	beforeEach(function() {
		browser.get(testUrl + '/sign-up');
	});

	it('should let me register', function() {
		var now = new Date();
		var randomString = now.getTime().toString() + "_" + Math.floor((Math.random() * 1000000) + 1).toString();
		var email = "ci_user_" + randomString + "@yv.com";
		var fn = "User" + randomString;
		var ln = "Test" + randomString;
		var un = "User" + randomString;
		var pw = "password";

		email_element.sendKeys(email);
		fn_element.sendKeys(fn);
		ln_element.sendKeys(ln);
		un_element.sendKeys(un);
		pw_element.sendKeys(pw);

		register_button.click();

		expect(register_confirm.getText()).toEqual("Thanks for registering!");
	});	
});