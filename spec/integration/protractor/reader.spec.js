describe('youversion reader', function() {
	var publicNotes = element.all(by.repeater('note in notes track by $index'));
	var expandNotesButton = element(by.css("#widget-notes .open"));
	var nextNotesButton = element(by.css("#widget-notes .next"));
	var chapterNextButton = element(by.css(".reader-next"));
	var chapterPrevButton = element(by.css(".reader-prev"));	
	var chapterDropDown = element(by.css("#menu_book_chapter_trigger h2"));
	var bookSelectTrigger = element(by.id("menu_book_chapter_trigger"));
	var johnLink = element(by.css("[data-book='jhn']"));
	var john1Link = element(by.css("#chapter_selector li:first-child"));
	var versionSelectTrigger = element(by.id("menu_version_trigger"));
	var nivLink = element(by.css("[data-abbrev='niv'] td a"));
	var verse1Content = element(by.css("[data-usfm='GEN.2.1] .content"));
	var testUrl = browser.params.testUrl;

	beforeEach(function() {
        isAngular(false);
		browser.get(testUrl + 'bible/1/gen.2.kjv');
	});

	it('should have a title', function() {
		expect(browser.getTitle()).toEqual('Genesis 2, King James Version (KJV) | Chapter 2 | The Bible App | Bible.com');
	});

	it('should open public notes', function() {
        isAngular(true);
		expect(publicNotes.count()).toEqual(0);
		expandNotesButton.click();
		expect(publicNotes.count()).toEqual(5);
	});

	it('should go to next chapter', function() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(chapterNextButton), "10000", "The element is still not visible.");
		chapterNextButton.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(chapterDropDown), "30000", "The element is still not visible.");
		expect(browser.getTitle()).toEqual('Genesis 3, King James Version (KJV) | Chapter 3 | The Bible App | Bible.com');
		expect(chapterDropDown.getText()).toEqual('Genesis 3');
	});

	it('should go to prev chapter', function() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(chapterPrevButton), "10000", "The element is still not visible.");
		chapterPrevButton.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(chapterDropDown), "30000", "The element is still not visible.");
		expect(browser.getTitle()).toEqual('Genesis 1, King James Version (KJV) | Chapter 1 | The Bible App | Bible.com');
		expect(chapterDropDown.getText()).toEqual('Genesis 1');
	});

	it('should go to john 1', function() {
        browser.wait(protractor.ExpectedConditions.elementToBeClickable(bookSelectTrigger), "10000", "The element is still not visible.");
		bookSelectTrigger.click();
		johnLink.click();
		john1Link.click();
        browser.wait(protractor.ExpectedConditions.visibilityOf(chapterDropDown), "30000", "The element is still not visible.");
		expect(browser.getTitle()).toEqual('John 1, King James Version (KJV) | Chapter 1 | The Bible App | Bible.com');
		expect(chapterDropDown.getText()).toEqual('John 1');
	});

	// This test is failing due to some strange strings in the staging database for Versions
	// it('should load NIV', function() {
	// 	versionSelectTrigger.click();
	// 	nivLink.click();
	// 	expect(verse1Content.getText()).toContain('Thus the heavens and the earth were completed in all their vast array.');
	// });
});