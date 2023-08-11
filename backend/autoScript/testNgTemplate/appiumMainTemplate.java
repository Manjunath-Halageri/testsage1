
import org.testng.Reporter;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Parameters;
import org.testng.annotations.Test;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.MobileElement;
import reuseablePackage.feature.AllActions;
import reuseablePackage.feature.JavaMethods;
import org.openqa.selenium.NoAlertPresentException;


public class className extends AllActions{
	
	String fileName             =  this.getClass().getSimpleName();            
	String packageName          =  this.getClass().getPackage().getName();     
	
	String methodName;                                                          
	
	AllActions actions          =  new AllActions();                            
  JavaMethods javamethod     =  new JavaMethods();

String reportRuncount = actions.getJsonValue(packageName,fileName, "ExecutionCount", "reportCount");//common added 27/03/19
    String suiteName = actions.getJsonValue(packageName,fileName,"SuiteName","suiteName");//common added 27/03/19
	String projectName=actions.getJsonValue(packageName,fileName, "ProjectName", "projectName"); 
    String type=actions.getJsonValue(packageName,fileName, "ExecutionType", "type"); 
    String path = actions.folderCreation(reportRuncount,suiteName,fileName,projectName,type);   //common
	String path1 = actions.folderCreation1(reportRuncount,suiteName,fileName,projectName,type);
    String browserName=new AllActions().getJsonValue(packageName,fileName, "BrowserDetails", "Browser");   //common
    String  browserVersion=new AllActions().getJsonValue(packageName,fileName, "BrowserDetails", "Version");  //common
    String ipAddress=new AllActions().getJsonValue(packageName,fileName, "IpAddress", "IP"); //common
    //String packageName=this.getClass().getPackage().getName();
	String screenshotOption=new AllActions().getJsonValue(packageName,fileName, "ScreenshotOption", "CaptureOnEveryStep");  //c  //c
    String failScreenshotoption = new AllActions().getJsonValue(packageName,fileName, "ScreenshotOption", "CaptureOnFailure");//channged
	int implicitTimeOut         =  Integer.parseInt( new AllActions().getJsonValue(packageName,fileName, "Timeout", "ImplicitWait")); 
	
	int ExplicitTimeOut         =   Integer.parseInt( new AllActions().getJsonValue(packageName,fileName, "Timeout", "ExplicitWait")); 
	
	
	// String appPackage           =  new AllActions().getJsonValue(packageName,fileName, "AppDetails", "AppPackage"); 
 //    String appActivity          =  new AllActions().getJsonValue(packageName,fileName, "AppDetails", "AppActivity");

    //StartVariableConfiguration

    //Script Starts From Here//

    //Start
    
}