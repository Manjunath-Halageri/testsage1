
package pom;

import org.openqa.selenium.WebDriver;

import org.openqa.selenium.WebElement;

import org.openqa.selenium.support.FindAll;

import org.openqa.selenium.support.FindBy;

import org.openqa.selenium.support.PageFactory;

import java.util.List;

import reuseablePackage.feature.AllActions;


public class demo {

// public WebDriver driver=null;
// public demo (WebDriver driver)
// 	{
// 		this.driver = driver;
// 		PageFactory.initElements(AllActions.driver, this);        // Reusable is a Reusable class where we initalize Web Driver ( public static WebDriver driver =null)
//     }
    
ThreadLocal<WebDriver> driver;
	 	public demo (ThreadLocal<WebDriver> driver)
	{
		this.driver = driver;
		PageFactory.initElements(driver.get(), this);    
	}	


@FindBy(id="username")public WebElement uname;

@FindBy(xpath="//input[@id='password']")public WebElement password3;

@FindBy(xpath="//button[@class='radius']")public WebElement buttonobj4;
//pomStart
	


}
