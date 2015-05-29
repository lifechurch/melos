describe('youversion plans', function() {

	var search_field = element(by.css("#plan-search input.field.autofocus"));
	var search_button = element(by.css("#plan-search input.submit"));
	var featured_button = element(by.css("#plan-index .sidebar dd:nth-child(3) a"));
	var plans_header = element(by.css("#plan-index h1:first-child"));
	var spanish_option = element(by.css("#plan-index select.language option[value='es']"));
	var language_header = element(by.css("#filter-message"));
	var testUrl = browser.params.testUrl;

	beforeEach(function() {
        isAngular(false);
		browser.get(testUrl + 'reading-plans');
	});

	it('should perform a search', function() {
		var search_phrase = "Jesus";

        browser.wait(protractor.ExpectedConditions.visibilityOf(search_field), "30000", "The element is still not visible.");

		search_field.sendKeys(search_phrase);
		search_button.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(search_field), "30000", "The element is still not visible.");
		expect(search_field.getAttribute('value')).toEqual(search_phrase);
	});

	it ('should show featured plans', function() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(featured_button), "30000", "The element is still not clickable.");
		featured_button.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(plans_header), "30000", "The element is still not visible.");
		expect(plans_header.getText()).toEqual("Browse Featured Plans");
	});

	it ('should view Spanish plans', function() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(spanish_option), "30000", "The element is still not clickable.");
		spanish_option.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(language_header), "30000", "The element is still not visible.");
		expect(language_header.getText()).toEqual("Only showing plans available in Español (Latinoamérica) (View in English)");
	});

});