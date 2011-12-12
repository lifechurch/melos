Feature: Reading Plans view
  In order to: Work with a reading plan
  As a:        User
  I want to:   Search for, subscribe to, unsubscribe from, read in, and complete reading plans

  Background:
    Given these users exist:
      | username | password | email address           |
      | testuser | tenders  | testuser@youversion.com |
    And I have beta access as "testuser", "tenders"
    Given a user named "testuser" exists
    
  Scenario: User visits readings plans index page
    Given a user named "testuser" exists
    And I am logged in as "testuser"
    When I go to the reading plans index page
    Then I should see "Reading Plans"
    And I should see "Explore Reading Plans"
    And I should see a link to "All Reading Plans"
    And I should see a link to "My Reading Plans" 
    And I should see a link to "Topical" 
    And I should see "Reading Plans" 
    And I should see a link to "The One Year ® Bible" 
    And I should see "» 1 Year"
    And I should see "Experience the insights and joy gained from reading the entire Bible. You can do it in as little as 15 minutes a day with The One Year ® Bible, the world's most popular annual reading Bible. Daily readings from the Old Testament, New Testament, Psalms, and Proverbs will guide you through God’s Word in one year."
    And I should see "We'd like to thank Tyndale House Publishers for their generosity in providing The One Year ® Bible. To learn more about The One Year ® Bible, please visit: http://www.newlivingtranslation.com/05discoverthenlt/oyb.asp"
    And I should see a link to "About The Publisher"
    And I should see a link to "Plan Overview"
    And I should see a link to "Start This Plan"
    And I should see a link to "Life Application Study Bible ® Devotion" 
    And I should see "Joyce Meyer: Promises for Your Everyday Life - a Daily Devotional"
    And I should see "New Thru 30"
    And I should see "» 30 Days"
    #And I should see pagination links

Scenario: User filters readings plans page
    
Scenario: User visits readings plan page to which he isn't subscribed

Scenario: User visits his readings plans page but has no subscriptions

Scenario: User reads a sample day from a plan

Scenario: User subscribes to a new reading plan

Scenario: User visits his readings plans page and has subscriptions

Scenario: User visits a readings plan page to which he is subscribed

Scenario: User views calendar/overview for his subscribed reading plan without a completed day

Scenario: User views a day for his subscribed reading plan

Scenario: User completes a reference, but not all, for a day in his subscribed reading plan

Scenario: User views calendar/overview for his subscribed reading plan with a partially completed day

Scenario: User completes all references for a day his subscribed reading plan

Scenario: User views calendar/overview for his subscribed reading plan with a fully completed day