package reusablePackage;

import java.net.URL;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.remote.AndroidMobileCapabilityType;
import io.appium.java_client.remote.MobileCapabilityType;

public class AllActions 
{
	public static AppiumDriver<MobileElement>driver;
	
	public void launchApplication(String deviceName,String Platform,String UDID,String platformVersion,String appPackage,String appActivity,String Url,String Port)
	{
		try
		 {
		    DesiredCapabilities caps = new DesiredCapabilities();
			caps.setCapability(MobileCapabilityType.DEVICE_NAME, deviceName);
			caps.setCapability(MobileCapabilityType.PLATFORM,Platform );
			caps.setCapability(MobileCapabilityType.UDID,UDID);  //"ZY3228SRS5"
			caps.setCapability(MobileCapabilityType.PLATFORM_VERSION,platformVersion);
		    caps.setCapability(AndroidMobileCapabilityType.APP_PACKAGE, appPackage);    //application appPackage name  //"com.meehappy.android"
			caps.setCapability(AndroidMobileCapabilityType.APP_ACTIVITY,appActivity );    //application appActivity name  //"com.meehappy.android.activities.LoginActivity"
			caps.setCapability("unicodeKeyboard", true);
			caps.setCapability("resetKeyboard", true);
			
			driver = new AndroidDriver<MobileElement>(new URL("http://"+Url+":"+Port+"/wd/hub"),caps);
			//driver = new AndroidDriver<MobileElement>(new URL("http://127.0.0.1:4723/wd/hub"),caps);
			
			driver.manage().timeouts().implicitlyWait(20, TimeUnit.SECONDS);
			
			Thread.sleep(5000);
		  }
		catch(Exception e)
		{
			e.printStackTrace();
		}	
		
	}

	public void sendKeys(String object,String input)
	  {
	   driver.findElementById(object).sendKeys(input);
	 // driver.findElement(object).sendKeys(input);
	  }


	 public void click(String object) throws InterruptedException
	  {
		WebElement ele= driver.findElement(By.xpath(object));
		WebDriverWait wait1 = new WebDriverWait(driver,60);
		wait1.until(ExpectedConditions.elementToBeClickable(ele));
		ele.click();
	  }
	  public void AssertionEquals(String xpath,String Expected)
	  {
		  try
		  {
			  WebElement ele=driver.findElementById(xpath);
			  String actual=ele.getText();
			  Assert.assertEquals(actual, Expected);
		  }
		  catch(Exception e)
		  {
			  e.printStackTrace();
		  }
	  }
	
}
