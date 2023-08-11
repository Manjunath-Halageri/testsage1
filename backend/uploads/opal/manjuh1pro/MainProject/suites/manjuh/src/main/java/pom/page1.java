
package pom;

import org.openqa.selenium.WebDriver;

import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.FindAll;

import org.openqa.selenium.support.FindBy;

import org.openqa.selenium.support.PageFactory;

import java.util.List;

import reuseablePackage.feature.AllActions;


public class page1 {

// public WebDriver driver=null;
// public page1 (WebDriver driver)
// 	{
// 		this.driver = driver;
// 		PageFactory.initElements(AllActions.driver, this);        // Reusable is a Reusable class where we initalize Web Driver ( public static WebDriver driver =null)
//     }
    
ThreadLocal<WebDriver> driver;
	 	public page1 (ThreadLocal<WebDriver> driver)
	{
		this.driver = driver;
		PageFactory.initElements(driver.get(), this);    
	}	


@FindBy(id="username")public WebElement username;

@FindBy(id="password")public WebElement userpwd;

@FindBy(xpath="//i[@class='fa fa-2x fa-sign-in']")public WebElement button;
//pomStart
	


}
