import java.io.File;
import java.io.IOException;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.ITestResult;
import org.testng.Reporter;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterTest;
import org.testng.annotations.Test;
import reuseablePackage.feature.AllActions;
import reuseablePackage.feature.CustomizedReport2;
import reuseablePackage.feature.JavaMethods;
import java.net.MalformedURLException;
import java.lang.management.ManagementFactory;
public class className extends  AllActions {
	AllActions actions=new AllActions();   
    String fileName=this.getClass().getSimpleName();    //common
	String packageName=this.getClass().getPackage().getName();
    String browserName=new AllActions().getJsonValue(packageName,fileName, "BrowserDetails", "Browser");   //common
    String  browserVersion=new AllActions().getJsonValue(packageName,fileName, "BrowserDetails", "Version");  //common
    String ipAddress=new AllActions().getJsonValue(packageName,fileName, "IpAddress", "IP"); //common
	String scriptName=new AllActions().getJsonValue(packageName,fileName, "ScriptName", "scriptName"); //common
    //String packageName=this.getClass().getPackage().getName();   
    int implicitTimeOut=Integer.parseInt(new AllActions().getJsonValue(packageName,fileName, "Timeout", "ImplicitWait"));  //common
	//StartVariableConfiguration
	
	@Test(priority=0)
	public void step_0() throws Exception                                              //------------Method auto creation ------------//
	{
	try
	{ 
	actions.OpenNewBrowserForJmxGeneration(browserName, browserVersion,ipAddress,implicitTimeOut);
	
	}
	catch(Exception e)
	{
		actions.CloseCurrentTab();
		throw e;
	}
	}
		
	//Start
}