Feature: Registration

  Create a new account

  Scenario: Click through the registration process
    When I am on Register page
    And I click on chooseAvatar
    And I click on getPassphraseButton
    And I remember my passphrase
    And I click on itsSafeBtn
    And I confirm my passphrase
    And I click on passphraseConfirmButton
    Then I see this title: Perfect! You're all set