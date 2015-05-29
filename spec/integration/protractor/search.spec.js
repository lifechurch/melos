describe('youversion search', function() {
	var search_field = element(by.css("#header_search_input"));
	var search_button = element(by.css("#header_search_button"));	
	var search_header = element(by.css("#main article h1"));
	var niv_option = element(by.css("#version_form select option[value='111']"));
	var noresults_header = element(by.css("#noresults"));
	var testUrl = browser.params.testUrl;
	
	beforeEach(function() {
        isAngular(false);
        //browser.manage().window().setSize(768, 1024);
		browser.get(testUrl);
	});

	it('should search the bible', function() {
		var search_phrase = "Fawns";
		search_field.sendKeys(search_phrase);
		search_button.click();
		expect(search_header.getText()).toEqual("Search results for: " + search_phrase);

		niv_option.click();
		expect(noresults_header.isPresent()).toBeFalsy();
	});
	
});