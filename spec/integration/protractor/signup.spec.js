describe('youversion signup', function() {
	var email_element = element(by.css("#user_email"));	
	var fn_element = element(by.css("#user_first_name"));
	var ln_element = element(by.css("#user_last_name"));
	var un_element = element(by.css("#user_username"));	
	var pw_element = element(by.css("#user_password"));	
	var register_button = element(by.css("#main input.action_button_green"));
	var register_confirm = element(by.css("#main h1.keep"));

    var dl_pw_element = element(by.css("#password"));
    var dl_confirm_button_1 = element(by.css("input.confirm.action_button_red"));
    var dl_confirm_button_2 = element(by.css("input.action_button_red.danger"));
    var dl_flash_error = element(by.css("#flash_error"));
    var dl_free_link = element(by.css("#main article p a"));
    var username_field = element(by.css("#username"));
    var password_field = element(by.css("#password"));
    var signin_button = element(by.css("#main button.action_button_green"));

    var testUrl = browser.params.testUrl;

    var now = new Date();
    var randomString = now.getTime().toString() + "_" + Math.floor((Math.random() * 1000000) + 1).toString();
    var email = "ci_user_" + randomString + "@yv.com";
    var fn = "User" + randomString;
    var ln = "Test" + randomString;
    var un = "User" + randomString;
    var pw = "password";

    beforeEach(function() {
        isAngular(false);
	});

	it('should let me register', function() {
        browser.get(testUrl + '/sign-up');

        browser.wait(protractor.ExpectedConditions.elementToBeClickable(register_button), 10000, "The element is still not visible.");

		email_element.sendKeys(email);
		fn_element.sendKeys(fn);
		ln_element.sendKeys(ln);
		un_element.sendKeys(un);
		pw_element.sendKeys(pw);

		register_button.click();

        browser.wait(protractor.ExpectedConditions.visibilityOf(register_confirm), 30000, "The element is still not visible.");

        expect(register_confirm.getText()).toEqual("Thanks for registering!");
	});

// These lines need to be left in place:
//  They should be commented out  until we have a way of
//  verifying a user account automatically.
//
//    it('should not let me delete my account with a bad password', function() {
//        browser.get(testUrl + '/sign-in');
//
//        username_field.clear();
//        username_field.sendKeys(un);
//
//        password_field.clear();
//        password_field.sendKeys(pw);
//
//        signin_button.click();
//
//        browser.get(testUrl + '/users/' + un + '/delete_account');
//
//        dl_pw_element.clear();
//        dl_pw_element.sendKeys('badpass');
//
//        dl_confirm_button_1.click();
//        dl_confirm_button_2.click();
//
//        expect(dl_flash_error.getText()).toEqual("Incorrect Password");
//    });
//
//    it('should let me delete my account', function() {
//        browser.get(testUrl + '/sign-in');
//
//        username_field.clear();
//        username_field.sendKeys(un);
//
//        password_field.clear();
//        password_field.sendKeys(pw);
//
//        signin_button.click();
//
//        browser.get(testUrl + '/users/' + un + '/delete_account');
//
//        dl_pw_element.clear();
//        dl_pw_element.sendKeys(pw);
//
//        dl_confirm_button_1.click();
//        dl_confirm_button_2.click();
//
//        expect(dl_free_link.getText()).toEqual("http://www.bible.com/free-bible-apps");
//    });
    

});