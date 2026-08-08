package com.salesforce.pages;

import com.salesforce.utils.WaitUtils;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.TimeoutException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import org.openqa.selenium.support.PageFactory;

public class LoginPage {

    private WebDriver driver;
    private WaitUtils waitUtils;

    @FindBy(xpath = "//input[@id='username']")
    private WebElement usernameField;

    @FindBy(xpath = "//input[@id='password']")
    private WebElement passwordField;

    @FindBy(xpath = "//input[@id='Login']")
    private WebElement loginButton;

    @FindBy(xpath = "//input[@id='rememberUn']")
    private WebElement rememberMeCheckbox;

    @FindBy(xpath = "//div[@id='error']")
    private WebElement errorMessage;

    @FindBy(xpath = "//form[@id='login_form']")
    private WebElement loginForm;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.waitUtils = new WaitUtils(driver, 15);
        PageFactory.initElements(driver, this);
    }

    public void enterUsername(String username) {
        try {
            waitUtils.waitForVisible(usernameField);
            usernameField.clear();
            usernameField.sendKeys(username);
        } catch (NoSuchElementException | TimeoutException e) {
            throw new RuntimeException("Username field not found or not interactable", e);
        }
    }

    public void enterPassword(String password) {
        try {
            waitUtils.waitForVisible(passwordField);
            passwordField.clear();
            passwordField.sendKeys(password);
        } catch (NoSuchElementException | TimeoutException e) {
            throw new RuntimeException("Password field not found or not interactable", e);
        }
    }

    public void clickLogin() {
        try {
            waitUtils.waitForClickable(loginButton);
            loginButton.click();
        } catch (NoSuchElementException | TimeoutException e) {
            throw new RuntimeException("Login button not found or not clickable", e);
        }
    }

    public void doLogin(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLogin();
    }

    public void checkRememberMe() {
        try {
            waitUtils.waitForClickable(rememberMeCheckbox);
            if (!rememberMeCheckbox.isSelected()) {
                rememberMeCheckbox.click();
            }
        } catch (NoSuchElementException | TimeoutException e) {
            throw new RuntimeException("Remember Me checkbox not found or not interactable", e);
        }
    }

    public void uncheckRememberMe() {
        try {
            waitUtils.waitForClickable(rememberMeCheckbox);
            if (rememberMeCheckbox.isSelected()) {
                rememberMeCheckbox.click();
            }
        } catch (NoSuchElementException | TimeoutException e) {
            throw new RuntimeException("Remember Me checkbox not found or not interactable", e);
        }
    }

    public boolean isErrorMessageDisplayed() {
        try {
            return errorMessage.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public String getErrorMessageText() {
        try {
            waitUtils.waitForVisible(errorMessage);
            return errorMessage.getText();
        } catch (NoSuchElementException | TimeoutException e) {
            return "";
        }
    }

    public boolean isUsernameFieldDisplayed() {
        try {
            return usernameField.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public boolean isPasswordFieldDisplayed() {
        try {
            return passwordField.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public boolean isLoginButtonDisplayed() {
        try {
            return loginButton.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public boolean isRememberMeCheckboxDisplayed() {
        try {
            return rememberMeCheckbox.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public boolean isLoginFormDisplayed() {
        try {
            return loginForm.isDisplayed();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    public boolean waitForDashboardLoad() {
        try {
            return waitUtils.waitForUrlContains("lightning");
        } catch (Exception e) {
            return false;
        }
    }
}
