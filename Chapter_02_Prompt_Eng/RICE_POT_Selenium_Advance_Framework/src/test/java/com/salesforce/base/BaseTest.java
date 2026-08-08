package com.salesforce.base;

import com.salesforce.pages.LoginPage;
import com.salesforce.utils.ConfigReader;
import io.github.bonigarcia.wdm.WebDriverManager;
import java.time.Duration;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeTest;

public class BaseTest {

    protected WebDriver driver;
    protected LoginPage loginPage;
    protected ConfigReader config;

    @BeforeTest
    public void setUp() {
        try {
            config = ConfigReader.getInstance();
            WebDriverManager.chromedriver().setup();
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--disable-notifications");
            driver = new ChromeDriver(options);
            driver.manage().window().maximize();
            driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(config.getIntProperty("implicit.wait")));
            driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(config.getIntProperty("page.load.timeout")));
            driver.get(config.getProperty("base.url"));
            loginPage = new LoginPage(driver);
        } catch (Exception e) {
            if (driver != null) {
                driver.quit();
            }
            throw new RuntimeException("BaseTest setup failed", e);
        }
    }

    @AfterTest
    public void tearDown() {
        try {
            if (driver != null) {
                driver.quit();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
