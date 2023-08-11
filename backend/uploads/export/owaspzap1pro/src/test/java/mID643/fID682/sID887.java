
package mID643.fID682;
import java.io.File;
import java.io.IOException;
import java.util.Set;
import java.util.Date;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.NoAlertPresentException;
import org.openqa.selenium.Dimension;
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
public class manju2 extends  AllActions {
	AllActions actions=new AllActions();  
	JavaMethods javamethod =  new JavaMethods();  
    String fileName=this.getClass().getSimpleName();    //common
	String packageName=this.getClass().getPackage().getName();   
    String methodName;                                  //common
    // String path=new AllActions().folderCreation(fileName);   //common
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
    int implicitTimeOut=Integer.parseInt(new AllActions().getJsonValue(packageName,fileName, "Timeout", "ImplicitWait"));  //common
    String screenshotOption=new AllActions().getJsonValue(packageName,fileName, "ScreenshotOption", "CaptureOnEveryStep");  //c  //c
    String failScreenshotoption = new AllActions().getJsonValue(packageName,fileName, "ScreenshotOption", "CaptureOnFailure");//channged
	String vmName = ManagementFactory.getRuntimeMXBean().getName();
        int p = vmName.indexOf("@");
        String pid = vmName.substring(0, p);
	
	@Test(priority=0)
	public void step_0() throws Exception                                              //------------Method auto creation ------------//
	{
	try
	{ 
	actions.OpenNewBrowser(browserName, browserVersion,ipAddress,implicitTimeOut);
	// String videoPath=actions.startVideoRecord(reportRuncount,suiteName,fileName);
	String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();       
	actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption);

	Reporter.log(browserName);
    Reporter.log(browserVersion);
    Reporter.log(actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption));
    // Reporter.log(videoPath);


	}
	catch(Exception e)
	{
		String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();     
        actions.CaptureOnFailure(path1,methodName,failScreenshotoption);
        Reporter.log(browserName);
        Reporter.log(browserVersion);
        Reporter.log(actions.CaptureOnFailure(path1,methodName,failScreenshotoption));
		//actions.CaptureOnFailure(reportRuncount,suiteName,fileName,failScreenshotoption);
		e.printStackTrace();
		// actions.captureDOM(path,fileName);
		// actions.stopVideoRecord();
		actions.CloseCurrentTab();
		throw e;
	}
	}
		
}