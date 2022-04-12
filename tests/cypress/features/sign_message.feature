Feature: Sign Message

  @basic
  Scenario: I should get the lisk signed message
    Given I login as genesis on devnet
    And I wait 2 seconds
    And I open signMessage modal
    When I fill test_Message in signMessageInput field
    And I click on nextBtn
    And I click on goBack
    Then signMessageInput should have value of test_Message
    When I click on nextBtn
    And I click on copyToClipboardBtn
    Then I should have the signed message in the clipboard

