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
    Then I should see "Browse Plans"
    And I should see a link to "My Plans" 
    And I should see a link to "The One Year ® Bible" 
    And I should see "1 Year"
    And I should see a link to "Life Application Study Bible ® Devotion" 
    And I should see "Joyce Meyer: Promises for Your Everyday Life - a Daily Devotional"
    And I should see "New Thru 30"
    And I should see "30 Days"
    #And I should see pagination links

Scenario: user searches for a reading plan
    Given a user named "testuser" exists
    And I am logged in as "testuser"
    When I go to the reading plans index page
    Then I should not see "A Plan normally not visible in 1st page"
    When I fill in "Plan_Search" with "Plan not normally visible substring"
    And I click "Search"
    Then I should see a link to "A Plan normally not visible in 1st page"

Scenario: User filters readings plans page by language
    Given a user named "testuser" exists
    And I am logged in as "testuser"
    When I go to the reading plans index page
    Then I should see "English"
    And I should not see "Deutsch"
    #And I should see "A specific English Plan Name"
    When I go to "/de/sign-in"
    And I go to the reading plans index page
    Then I should see "Deutsch"
    And I should not see "English"
    #And I should see "A specific German Plan Name"

Scenario: User filters reading plans by category
    Given a user named "testuser" exists
    And I am logged in as "testuser"
    When I go to the reading plans index page
    Then "All" should be selected
    And I should not see "A specific filtered Plan Name"
    When I follow "Devotional"
    Then "All Devotional Plans" should be selected
    And I should see "Browse: "
    And I should see a link to "All Plans"
    And I should see "Devotional Plans"
    And I should not see "Youth"
    And I should not see "A specific non-filtered Plan Name"
    And I should see a link to "A specific filtered Plan Name"
    When I follow "All Plans"
    And I follow "Topical"   
    Then "All Topical Plans" should be selected
    And I should see "Youth"
    When I follow "Youth"
    Then I should see a link to "All Plans"
    And I should see a " : "
    And I should see a link to "Topical"
    And I should see "All Youth Plans"
    And "All Youth Plans" should be selected
    And I should see "A specific Plan Name"

Scenario: User visits readings plan page to which he isn't subscribed
    Given a user named "plan_user1" exists
    And I have beta access as "plan_user1"
    When I go to the reading plans index page
    And I follow "Life Application Study Bible ® Devotion"
    Then I should see "Browse: "
    And I should see a link to "All Plans"
    And I should see "Life Application Study Bible ® Devotion"
    And I should see "Learn to apply God's Word more fully in your life with the Life Application Study Bible® Devotion. Each day you will receive a brief devotional featuring a Scripture verse and note taken from the Life Application Study Bible ® designed to help you apply the Bible to your life."
    And I should see "More Info" in the sidebar
    And I should see "Length: 1 year"
    And I should see a link to "View Sample Reading Plan"
    And I should see a link to "Users reading this plan"
    And I should see a link to "Start This Plan"
    And I should see "Publisher" in the sidebar
    And I should see "We'd like to thank Tyndale House Publishers for their generosity in providing the Life Application Study Bible ® Devotion." in the sidebar
    And I should see a link to "About Tyndale House" in the sidebar
    And I should see "Tyndale's Plans" in the sidebar
    And I should see a link to "The One Year ® Bible" in the sidebar

@wip
Scenario: User reads a sample day from a plan
    Given a user named "plan_user2" exists
    And I have beta access as "plan_user2"
    When I go to the "Life Application Study Bible ® Devotion" reading plan page
    And I click "View Sample Reading Plan"
@wip
Scenario: User subscribes to a new reading plan
    Given a user named "plan_user3" exists
    And I have beta access as "plan_user3"
    When I go to the "Life Application Study Bible ® Devotion" reading plan page
    And I click "Start This Plan"
    
Scenario: User visits his readings plans page but has no subscriptions

Scenario: User visits his readings plans page and has subscriptions

Scenario: User visits a readings plan page to which he is subscribed

Scenario: User views calendar/overview for his subscribed reading plan without a completed day

Scenario: User views a day for his subscribed reading plan

Scenario: User completes a reference, but not all, for a day in his subscribed reading plan

Scenario: User views calendar/overview for his subscribed reading plan with a partially completed day

Scenario: User completes all references for a day his subscribed reading plan

Scenario: User views calendar/overview for his subscribed reading plan with a fully completed day