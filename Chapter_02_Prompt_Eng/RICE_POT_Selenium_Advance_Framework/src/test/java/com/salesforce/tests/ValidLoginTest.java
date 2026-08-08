package com.salesforce.tests;

import com.salesforce.base.BaseTest;
import org.testng.Assert;
import org.testng.annotations.Test;

public class ValidLoginTest extends BaseTest {

    @Test(priority = 1)
    public void testLoginWithValidCredentials() {
        try {
            loginPage.doLogin(config.getProperty("valid.username"), config.getProperty("valid.password"));
            boolean dashboardLoaded = loginPage.waitForDashboardLoad();
            Assert.assertTrue(dashboardLoaded, "Login failed: dashboard did not load");
        } catch (Exception e) {
            Assert.fail("Valid login test failed: " + e.getMessage());
        }
    }

    @Test(priority = 2)
    public void testRememberMeFunctionality() {
        try {
            loginPage.checkRememberMe();
            loginPage.doLogin(config.getProperty("valid.username"), config.getProperty("valid.password"));
            boolean dashboardLoaded = loginPage.waitForDashboardLoad();
            Assert.assertTrue(dashboardLoaded, "Login with Remember Me failed");
        } catch (Exception e) {
            Assert.fail("Remember Me test failed: " + e.getMessage());
        }
    }

    @Test(priority = 3)
    public void testLoginPageUIElementsRendered() {
        try {
            Assert.assertTrue(loginPage.isUsernameFieldDisplayed(), "Username field not displayed");
            Assert.assertTrue(loginPage.isPasswordFieldDisplayed(), "Password field not displayed");
            Assert.assertTrue(loginPage.isLoginButtonDisplayed(), "Login button not displayed");
            Assert.assertTrue(loginPage.isRememberMeCheckboxDisplayed(), "Remember Me checkbox not displayed");
            Assert.assertTrue(loginPage.isLoginFormDisplayed(), "Login form not displayed");
        } catch (Exception e) {
            Assert.fail("UI elements test failed: " + e.getMessage());
        }
    }
}
