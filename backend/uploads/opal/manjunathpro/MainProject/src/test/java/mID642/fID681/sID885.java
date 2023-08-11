
package mID642.fID681;
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


public class sID885 extends  AllActions {
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
	String zapIPAddress = new AllActions().getJsonValue(packageName,fileName, "ZapIPAddress", "IP");
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
	actions.setUp(zapIPAddress);
	actions.OpenNewBrowserzap(browserName, browserVersion,ipAddress,implicitTimeOut);
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
		@Test(priority=1)
        public void step_1() throws Exception
        {
        try
        {
            actions.EnterApplicationURL("https://the-internet.herokuapp.com/login");

            try{
            driver.get().switchTo().alert();
        }
        catch(NoAlertPresentException e){
            String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();
    actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption);
    Reporter.log(browserName);
    Reporter.log(browserVersion);
    Reporter.log(actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption));
        }
            }
        catch(Exception e)
        {
        String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();     
        actions.CaptureOnFailure(path1,methodName,failScreenshotoption);
        Reporter.log(browserName);
        Reporter.log(browserVersion);
        Reporter.log(actions.CaptureOnFailure(path1,methodName,failScreenshotoption));
        e.printStackTrace();
        actions.captureDOM(path,fileName);
        String status="FAIL";
        javamethod.MongoDBUpdate(status,reportRuncount,fileName,pid);
        actions.CloseCurrentTab();
        driver.get().quit();
        throw e;
        } 
        };

            @Test(priority=2)
        public void step_2() throws Exception
        {
        try
        {
            actions.testSpider();

            try{
            driver.get().switchTo().alert();
        }
        catch(NoAlertPresentException e){
            String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();
    actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption);
    Reporter.log(browserName);
    Reporter.log(browserVersion);
    Reporter.log(actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption));
        }
            }
        catch(Exception e)
        {
        String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();     
        actions.CaptureOnFailure(path1,methodName,failScreenshotoption);
        Reporter.log(browserName);
        Reporter.log(browserVersion);
        Reporter.log(actions.CaptureOnFailure(path1,methodName,failScreenshotoption));
        e.printStackTrace();
        actions.captureDOM(path,fileName);
        String status="FAIL";
        javamethod.MongoDBUpdate(status,reportRuncount,fileName,pid);
        actions.CloseCurrentTab();
        driver.get().quit();
        throw e;
        } 
        };

            @Test(priority=3)
        public void step_3() throws Exception
        {
        try
        {
            actions.generateZapReport(zapIPAddress);

            try{
            driver.get().switchTo().alert();
        }
        catch(NoAlertPresentException e){
            String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();
    actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption);
    Reporter.log(browserName);
    Reporter.log(browserVersion);
    Reporter.log(actions.CaptureScreenShotAtEachStep(path,methodName,screenshotOption));
        }
            
        String status="PASS";
        javamethod.MongoDBUpdate(status,reportRuncount,fileName,pid);  
        actions.AssertAll(); 
        driver.get().quit();
            }
        catch(Exception e)
        {
        String methodName=Thread.currentThread().getStackTrace()[1].getMethodName();     
        actions.CaptureOnFailure(path1,methodName,failScreenshotoption);
        Reporter.log(browserName);
        Reporter.log(browserVersion);
        Reporter.log(actions.CaptureOnFailure(path1,methodName,failScreenshotoption));
        e.printStackTrace();
        actions.captureDOM(path,fileName);
        String status="FAIL";
        javamethod.MongoDBUpdate(status,reportRuncount,fileName,pid);
        actions.CloseCurrentTab();
        driver.get().quit();
        throw e;
        } 
        };

           
}