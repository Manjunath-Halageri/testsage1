
package pom;

import org.openqa.selenium.WebDriver;

import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.FindAll;

import org.openqa.selenium.support.FindBy;

import org.openqa.selenium.support.PageFactory;

import java.util.List;

import reuseablePackage.feature.AllActions;


public class ih {

// public WebDriver driver=null;
// public ih (WebDriver driver)
// 	{
// 		this.driver = driver;
// 		PageFactory.initElements(AllActions.driver, this);        // Reusable is a Reusable class where we initalize Web Driver ( public static WebDriver driver =null)
//     }
    
ThreadLocal<WebDriver> driver;
	 	public ih (ThreadLocal<WebDriver> driver)
	{
		this.driver = driver;
		PageFactory.initElements(driver.get(), this);    
	}	


@FindBy(id="username")public WebElement input;

@FindBy(id="password")public WebElement input2;

@FindBy(xpath="/html[1]/body[1]/div[2]/div[1]/div[1]/form[1]/button[1]/i[1]")public WebElement button;
//pomStart
	


}
