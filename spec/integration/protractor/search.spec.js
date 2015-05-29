describe('youversion search', function() {
	var search_field = element(by.css("#header_search_input"));
	var search_button = element(by.css("#header_search_button"));	
	var search_header = element(by.css("#main article h1"));
	var niv_option = element(by.css("#version_form select option[value='111']"));
	var noresults_header = element(by.css("#noresults"));
	var testUrl = browser.params.testUrl;
	
	beforeEach(function() {
        isAngular(false);
		browser.get(testUrl);
	});

	it('should search the bible', function() {
		var search_phrase = "Fawns";

        browser.wait(protractor.ExpectedConditions.presenceOf(search_field), "10000", "The element is still not visible.");

		search_field.sendKeys(search_phrase);
		search_button.click();

        browser.wait(protractor.ExpectedConditions.visibilityOf(search_header), "30000", "The element is still not visible.");

		expect(search_header.getText()).toEqual("Search results for: " + search_phrase);

		niv_option.click();
		expect(noresults_header.isPresent()).toBeFalsy();
	});
	
});