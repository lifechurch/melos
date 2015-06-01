describe('youversion login', function() {
	var username_field = element(by.css("#username"));
	var password_field = element(by.css("#password"));
	var signin_button = element(by.css("#main button.action_button_green"));
	var username_element = element(by.css("#header span.user_name"));
	var error_element = element(by.css("#main .form_errors ul li:first-child"));
	var signout_button = element(by.css("#header li.header_profile_menu_signout"));
	var signin_link = element(by.css("#header li a.sign_in"));
	var more_link = element(by.css("#header_profile_trigger"));
	var testUrl = browser.params.testUrl;

	beforeEach(function() {
        isAngular(false);
		browser.get(testUrl + 'sign-in');
	});

    it('should NOT cache bad credentials', function() {
        var username = "matt";
        var password = "badpass";

        //browser.wait(protractor.ExpectedConditions.visibilityOf(username_field), 30000, "The element is still not visible.");

        username_field.clear();
        username_field.sendKeys(username);

        password_field.clear();
        password_field.sendKeys(password);

        signin_button.click();

        //browser.wait(protractor.ExpectedConditions.visibilityOf(error_element), 30000, "The element is still not visible.");

        expect(error_element.getText()).toEqual("The username or password you supplied is invalid.");

        password = "staging";

        username_field.clear();
        username_field.sendKeys(username);

        password_field.clear();
        password_field.sendKeys(password);

        signin_button.click();

        //browser.wait(protractor.ExpectedConditions.visibilityOf(username_element), 30000, "The element is still not visible.");

        expect(username_element.getText()).toEqual(username);
    });

	it('should NOT let you login with invalid credentials', function() {
		var username = "smeagol";
		var password = "MyPrecious";

        browser.wait(protractor.ExpectedConditions.visibilityOf(username_field), 30000, "The element is still not visible.");

		username_field.clear();
		username_field.sendKeys(username);

		password_field.clear();
		password_field.sendKeys(password);

		signin_button.click();

        browser.wait(protractor.ExpectedConditions.visibilityOf(error_element), 30000, "The element is still not visible.");

		expect(error_element.getText()).toEqual("No user with this username/email address");
	});

    it('should let you login with valid credentials', function() {
        var username = "matt";
        var password = "staging";

        browser.wait(protractor.ExpectedConditions.visibilityOf(username_field), 30000, "The element is still not visible.");

        username_field.clear();
        username_field.sendKeys(username);

        password_field.clear();
        password_field.sendKeys(password);

        signin_button.click();
        expect(username_element.getText()).toEqual(username);
    });

	it('should let you logout', function() {
		var username = "matt";
		var password = "staging";

        browser.wait(protractor.ExpectedConditions.visibilityOf(username_field), 30000, "The element is still not visible.");

		username_field.clear();
		username_field.sendKeys(username);

		password_field.clear();
		password_field.sendKeys(password);

		signin_button.click();

        browser.wait(protractor.ExpectedConditions.visibilityOf(username_element), 30000, "The element is still not visible.");

		expect(username_element.getText()).toEqual(username);


		//Currently getting an error that signout_button is not Visible
		more_link.click();

		signout_button.click();

        browser.wait(protractor.ExpectedConditions.visibilityOf(signin_link), 30000, "The element is still not visible.");

		expect(signin_link.getText()).toEqual("Sign in");
	});
});