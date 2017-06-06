Feature: i18n/Localization
  In order to: Read the Bible in my own language
  As a:        Visitor
  I want to:   Set the site language.

  @i18n @wip
  Scenario: English/French
    When I go to "/sign-in"
    Then "en" should be selected for "choose_language"
    When I go to "/de/sign-in"
    Then "de" should be selected for "choose_language"
    When I go to "/sign-in"
    Then I should be on "/de/sign-in"
    And "de" should be selected for "choose_language"
