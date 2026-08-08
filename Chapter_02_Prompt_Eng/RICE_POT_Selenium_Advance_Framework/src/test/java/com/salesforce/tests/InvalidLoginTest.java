package com.salesforce.tests;

import com.salesforce.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class InvalidLoginTest extends BaseTest {

    @Test(priority = 1)
    public void testLoginWithWrongPassword() {
        try {
            loginPage.doLogin(config.getProperty("valid.username"), "WrongPassword123!");
            boolean errorShown = loginPage.isErrorMessageDisplayed();
            Assert.assertTrue(errorShown, "Error message not displayed for wrong password");
        } catch (Exception e) {
            Assert.fail("Wrong password test failed: " + e.getMessage());
        }
    }

    @Test(priority = 2)
    public void testLoginWithEmptyUsername() {
        try {
            loginPage.doLogin("", config.getProperty("valid.password"));
            boolean errorShown = loginPage.isErrorMessageDisplayed();
            Assert.assertTrue(errorShown, "Error message not displayed for empty username");
        } catch (Exception e) {
            Assert.fail("Empty username test failed: " + e.getMessage());
        }
    }

    @Test(priority = 3)
    public void testLoginWithEmptyPassword() {
        try {
            loginPage.doLogin(config.getProperty("valid.username"), "");
            boolean errorShown = loginPage.isErrorMessageDisplayed();
            Assert.assertTrue(errorShown, "Error message not displayed for empty password");
        } catch (Exception e) {
            Assert.fail("Empty password test failed: " + e.getMessage());
        }
    }

    @Test(priority = 4)
    public void testLoginWithBothFieldsEmpty() {
        try {
            loginPage.doLogin("", "");
            boolean errorShown = loginPage.isErrorMessageDisplayed();
            Assert.assertTrue(errorShown, "Error message not displayed for empty fields");
        } catch (Exception e) {
            Assert.fail("Both fields empty test failed: " + e.getMessage());
        }
    }

    @Test(priority = 5)
    public void testLoginWithInvalidEmailFormat() {
        try {
            loginPage.doLogin("notanemail", config.getProperty("valid.password"));
            boolean errorShown = loginPage.isErrorMessageDisplayed();
            Assert.assertTrue(errorShown, "Error message not displayed for invalid email format");
        } catch (Exception e) {
            Assert.fail("Invalid email format test failed: " + e.getMessage());
        }
    }
}
