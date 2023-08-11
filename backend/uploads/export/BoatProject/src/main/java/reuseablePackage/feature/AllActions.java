
package reuseablePackage.feature;
import org.apache.commons.io.FileUtils;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.openqa.selenium.By;
import org.openqa.selenium.Cookie;
import org.openqa.selenium.Keys;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.Platform;
import org.openqa.selenium.Point;
//import org.openqa.selenium.Rectangle;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.internal.FindsById;
import org.openqa.selenium.Dimension;
import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;
import java.awt.AWTException;
import java.awt.HeadlessException;
import java.awt.Rectangle;
import java.awt.Robot;
import java.awt.Toolkit;
import java.awt.image.BufferedImage;
import javax.imageio.ImageIO;
import org.openqa.selenium.JavascriptExecutor;
import java.io.PrintWriter;  
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.net.MalformedURLException;
import org.openqa.selenium.remote.DesiredCapabilities;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.asserts.SoftAssert;
import org.openqa.selenium.JavascriptExecutor;
//////////////////////

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.sun.jna.NativeLibrary;
import uk.co.caprica.vlcj.player.MediaPlayer;
import uk.co.caprica.vlcj.player.MediaPlayerFactory;
import uk.co.caprica.vlcj.runtime.RuntimeUtil;
///////////////////

import atu.testrecorder.ATUTestRecorder;
import io.appium.java_client.MobileElement;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.remote.AndroidMobileCapabilityType;
import io.appium.java_client.remote.MobileCapabilityType;
import org.openqa.selenium.JavascriptExecutor;		

import org.openqa.selenium.NoAlertPresentException;
import java.net.URL;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.ArrayList;
import java.util.Set;
import java.util.concurrent.TimeUnit;
public class AllActions

{

	// public static WebDriver driver;
	public static ThreadLocal<WebDriver> driver = new ThreadLocal<>();

	public  ATUTestRecorder recorder;

	public String Option="Yes";

	SoftAssert soft=new SoftAssert();

	/////////////////newly addded as per the testing team/////////////


	private final Logger logger =  LoggerFactory.getLogger(AllActions.class);
	private static final String[] OPTIONS = {
			"--quiet",
			"--quiet-synchro",
			"--intf",
			"dummy"
	};

	private static final String RECORDINGFORMAT = ".mp4";
	private static final String SOUT    = ":sout=#transcode{vcodec=h264,vb=%d,scale=%f}:duplicate{dst=file{dst=%s}}";
	private static final String MRL     = "screen://";
	private static final String FPS     = ":screen-fps=%d";
	private static final String CACHING = ":screen-caching=%d";

	private static final int    fps     = 24;//80
	private static final int    caching = 500;
	private static final int    bits    = 1024;
	private static final float  scale   = 1.5f;

	private MediaPlayerFactory mediaPlayerFactory;
	private MediaPlayer mediaPlayer;
	public String address;

	//--------------------------------------------Browser specific Actions -------------------------------------------------------//



	public void OpenNewBrowserForJmxGeneration(String browserName, String Version,String hubIPAddress,int timeout) throws MalformedURLException {
		if(browserName.equals("Chrome"))///Chrome
		{
			System.out.println(browserName);
			System.out.println(Version);
			System.out.println(hubIPAddress);
			System.out.println(timeout);
			//String downloadFilepath = "D:/Data/new_code/backend/uploads/opal/smallProj/small01/projectToRun";
			HashMap<String, Object> chromePrefs = new HashMap<String, Object>();
			chromePrefs.put("profile.default_content_settings.popups", 0);
			//chromePrefs.put("download.default_directory", downloadFilepath);

			ChromeOptions opt= new ChromeOptions();

			opt.setExperimentalOption("prefs", chromePrefs); 
			opt.addExtensions(new File("./BlazeMeter01.crx"));

			System.out.println("Launching Google browser");

			DesiredCapabilities capabilities = new DesiredCapabilities();
			capabilities.setCapability("browser", "Chrome");
			capabilities.setCapability("browser_version",Version);
			capabilities.setCapability(ChromeOptions.CAPABILITY, opt);
			System.out.println(capabilities);
			// capabilities.setPlatform(Platform.LINUX);

			String hubNewAddress=hubIPAddress+"/wd/hub";
			// driver = new RemoteWebDriver(new URL(hubNewAddress), capabilities);
			driver.set(new RemoteWebDriver(new URL(hubNewAddress),capabilities));
			

			//System.setProperty("webdriver.get().chrome.driver","F:/20_09_18_Checking/TestNGProject/Drivers/chromedriver.get().exe");
			//driver = new ChromeDriver();
			driver.get().manage().window().maximize();
			driver.get().manage().timeouts().implicitlyWait(timeout, TimeUnit.SECONDS);
			System.out.println("Successfully Navigated to the URL");
		}
		else
		{
			System.out.println("Launching Firefox browser");

			DesiredCapabilities cap = DesiredCapabilities.firefox();
			// cap.setPlatform(Platform.LINUX);
			cap.setCapability("version", Version);

			String hubNewAddress=hubIPAddress+"/wd/hub";
			//driver = new RemoteWebDriver(new URL(hubNewAddress), cap);
			driver.set(new RemoteWebDriver(new URL(hubNewAddress), cap));
			driver.get().manage().window().maximize();
			driver.get().manage().timeouts().implicitlyWait(timeout, TimeUnit.SECONDS);
			System.out.println("Successfully Navigated to the URL");
		}
	}


	public void OpenNewBrowser(String browserName, String Version,String hubIPAddress,int timeout) throws MalformedURLException {
		if(browserName.equals("Chrome"))///Chrome
		{
		System.out.println("Launching Google browser");

		ChromeOptions option = new ChromeOptions();
		option.addArguments("--no-sandbox");
		option.addArguments("--disable-dev-shm-usage");
		option.addArguments("--headless");
		option.addArguments("disable-infobars");
		option.addArguments("disable-gpu");

		DesiredCapabilities capabilities = DesiredCapabilities.chrome();
		capabilities.setCapability("version",Version);
		// capabilities.setPlatform(Platform.LINUX);

		String hubNewAddress=hubIPAddress+"/wd/hub";
		// driver = new RemoteWebDriver(new URL(hubNewAddress), capabilities);
		driver.set(new RemoteWebDriver(new URL(hubNewAddress),capabilities));
		//System.setProperty("webdriver.get().chrome.driver","F:/20_09_18_Checking/TestNGProject/Drivers/chromedriver.get().exe");
		//driver = new ChromeDriver();
		driver.get().manage().window().maximize();
		driver.get().manage().timeouts().implicitlyWait(timeout, TimeUnit.SECONDS);
		System.out.println("Successfully Navigated to the URL");
		}
		else
		{
		System.out.println("Launching Firefox browser");

		DesiredCapabilities cap = DesiredCapabilities.firefox();
		// cap.setPlatform(Platform.LINUX);
		cap.setCapability("version", Version);

		String hubNewAddress=hubIPAddress+"/wd/hub";
		//driver = new RemoteWebDriver(new URL(hubNewAddress), cap);
		driver.set(new RemoteWebDriver(new URL(hubNewAddress), cap));
		driver.get().manage().window().maximize();
		driver.get().manage().timeouts().implicitlyWait(timeout, TimeUnit.SECONDS);
		System.out.println("Successfully Navigated to the URL");
		}
		}
		
	public void startRecording(String scriptName) throws InterruptedException {
		
		  driver.get().get("https://auth.blazemeter.com/auth/realms/blazect/protocol/saml/clients/blazemeter"); 
		  ((RemoteWebDriver)driver.get()).findElementById("username").sendKeys("cmkulkarni987@gmail.com");
		  ((RemoteWebDriver)driver.get()).findElementById("password").sendKeys("Chidu@05");
		  
		  ((RemoteWebDriver) driver.get()).findElementById("kc-login").click();
		 

		driver.get().get("chrome-extension://mbopgmdnpcbohhpnfglgohlbhfongabi/main.html");
		driver.get().switchTo().frame("iframe");
		((RemoteWebDriver) driver.get()).findElementById("name").sendKeys(scriptName);
		((RemoteWebDriver) driver.get()).findElementById("record").click();
		System.out.println("done");
		 
	}

	public void stopRecording() throws InterruptedException {
		Thread.sleep((5000));
		driver.get().get("chrome-extension://mbopgmdnpcbohhpnfglgohlbhfongabi/main.html");
		//driver.get().switchTo().window(address);
		address = driver.get().getWindowHandle();
		driver.get().switchTo().frame("iframe");
		((RemoteWebDriver) driver.get()).findElementById("stop").click();
		((RemoteWebDriver) driver.get()).findElementById("button-edit-jmeter").click();
		//Thread.sleep((10000));
		Set<String>s=driver.get().getWindowHandles();
		for(String i: s) {
			driver.get().switchTo().window(i);
		}
		((RemoteWebDriver) driver.get()).findElementById("upload-jmx").click();
		Thread.sleep(3000);
		driver.get().switchTo().window(address);
		driver.get().switchTo().frame("iframe");
		List<WebElement> list=((RemoteWebDriver) driver.get()).findElementsByName("domains");
		System.out.println("rakesh\n"+list+"manu");
		for(WebElement e : list) { 
		e.click();
		}
		
		list=((RemoteWebDriver) driver.get()).findElementsByClassName("button");
		for(WebElement e : list) { 
			if (e.isDisplayed()) {
		e.click();
			}
		}
		
		//logout
		Thread.sleep(8000);
		driver.get().get("https://a.blazemeter.com/app/logout");
		driver.get().quit();
	}


	public void Refresh()    
	{
		driver.get().navigate().refresh();
	}


	@SuppressWarnings("static-access")
	public void CloseCurrentTab()
	{
		this.driver.get().close();
	}


	public void CloseAllTabs()
	{
		driver.get().quit();
	}


	public void AcceptAlert() throws Exception 

	{

		driver.get().switchTo().alert().accept();

	}//method Updated on 12/08/2019 by testing team


	public void DismissAlert() throws Exception
	{
		driver.get().switchTo().alert().dismiss();
	}////method Updated on 12/08/2019 by testing team

	public String GetAlertText()
	{
		String output=driver.get().switchTo().alert().getText();
		return output;
	}

	public void NavigateForward()   
	{
		driver.get().navigate().forward();
	}


	public void NavigateBack()  
	{
		driver.get().navigate().back();
	}


	public void EnterApplicationURL(String input) throws Exception   
	{
		driver.get().get(input);
	}


	public String GetPageTitle() throws Exception    
	{
		String output =driver.get().getTitle();
		return output;
	}


	public void MaximizeBrowserWindow() throws Exception   
	{
		driver.get().manage().window().maximize();
	}//method Updated on 12/08/2019 by testing team


	public Set<String> GetMultipleWindowHandles()
	{

		Set<String> output = driver.get().getWindowHandles();
		return output;
	}

	public String GetCurrentBrowserWindowHandle()
	{
		String output=driver.get().getWindowHandle();
		return output;
	}////method Updated on 12/08/2019 by testing team

	public void SwitchToWindowTab(String input)
	{
		int count =1;
		int data = Integer.parseInt(input);
		Set<String> tabs = driver.get().getWindowHandles();
		for(String id:tabs){
			if(count == data){
				driver.get().switchTo().window(id);
				break;
			}
			count++;
		}
	}

	public void OpenNewTab() throws AWTException
	{
		//driver.get().findElement(By.cssSelector("body")).sendKeys(Keys.CONTROL + "t");
		JavascriptExecutor executor = (JavascriptExecutor) driver.get();
		executor.executeScript("window.open();");
		System.out.println("tab created");
	}



	public void waitToNavigate() throws Exception
	{
		driver.get().navigate().wait();
	}


	//		List<Cookie >cook= .....load the stuff
	//		Iterator<Cookie> it =cook.iterator();
	//		while (it.hasNext()) {
	//		  String output=it.next();
	//		  System.out.println(string);
	//		}
	public String GetCookieName()
	{
		String output = null;
		for(Cookie ck : driver.get().manage().getCookies())							
		{	
			output=ck.getName();
		}
		return output;
	}

	public String GetCookieValue()
	{

		String output = null;
		for(Cookie ck : driver.get().manage().getCookies())							
		{	
			output=ck.getValue();
		}
		return output;

	}//updated on 27-08-2019


	public String GetCookieDomain()
	{
		String output = null;
		for(Cookie ck : driver.get().manage().getCookies())							
		{	
			output=ck.getDomain();
		}
		return output;
	}


	public String GetCookiePath()
	{
		String output = null;
		for(Cookie ck : driver.get().manage().getCookies())							
		{	
			output=ck.getPath();
		}
		return output;
	}


	public Date GetCookieExpiryDate()
	{
		Date output = null;
		for(Cookie ck : driver.get().manage().getCookies())							
		{	
			output=ck.getExpiry();
		}
		return output;

	}


	public boolean CheckCookieIsSecured()
	{
		boolean  output = false;
		for(Cookie ck : driver.get().manage().getCookies())							
		{	
			output=ck.isSecure();
		}
		return output ;

	}//Updated on 27-08-2019


	public void DeleteAllCookieDetails()
	{
		driver.get().manage().deleteAllCookies();
	}  ///Updated on 27-08-2019


	public void DeleteCookies(Cookie input)
	{
		driver.get().manage().deleteCookie(input);
	}


	public void DeleteCookieName(String input)
	{
		driver.get().manage().deleteCookieNamed(input);
	}/////Updated on 27-08-2019


	public void AddCookies(String cookie,String cookieValue)
	{
		Cookie cook=new Cookie(cookie,cookieValue);
		driver.get().manage().addCookie(cook);
	}


	public Set<Cookie>  GetAllCookiesDetails()
	{
		// Cookie output = null;
		Set<Cookie> cookies =driver.get().manage().getCookies();
		// for(Cookie cook:cookies)
		// {
		// 	output=cook;
		// }
		return cookies;
	}//method Updated on 12/08/2019 by testing team


	//------------------------------------------------------Object Specific-------------------------------------------------------//

	public void ClearData(WebElement Object)
	{
		Object.clear();
	}////method Updated on 12/08/2019 by testing team



	public int GetSizeOfList(List<WebElement> Object)
	{	
		int var=Object.size()-1;
		return var;
	}

	public String GetOneObjectFromListByIndex(List<WebElement> Object,int i) throws Exception
	{
		String output=Object.get(i).getText();
		return output;
	}


	public String Equals(WebElement Object, String input)
	{
		String output=Object.getText();
		output.equals(input);
		return output;
	}

	public String GetAttribute(WebElement Object, String input)
	{
		String output = Object.getAttribute(input);
		return output;
	}

	@SuppressWarnings("unchecked")
	public Dimension GetSizeOfObject(WebElement Object)   //Updatedd 27/08/19
	{

		Dimension output = Object.getSize();
		return output;
	}//updated on 27-08-2019

	public String GetTagName(WebElement Object)
	{
		String output = Object.getTagName();
		return output;
	}////method Updated on 12/08/2019 by testing team

	public boolean CheckObjectIsSelected(WebElement Object)
	{
		boolean output = Object.isSelected();
		return output;

	}

	public boolean CheckObjectIsDisplayed(WebElement Object)
	{
		boolean output = Object.isDisplayed();
		return output;

	}

	public boolean CheckObjectIsEnabled(WebElement Object)
	{
		boolean output = Object.isEnabled();
		return output;

	}
	public void ClickOnSubmitButton(WebElement Object)
	{
		Object.submit();
	}

	/*public Rectangle GetRect(WebElement Object)
			{
				Rectangle output = Object.getRect();
				return output;

			}*/

	public Point GetLocationOfObject(WebElement Object)
	{
		Point output = Object.getLocation();
		return output;

	}

	public String GetCssValue(WebElement Object,String input)
	{
		String output = Object.getCssValue(input);
		return output;
	}

	public int GetHashcodeOfObject(WebElement Object)
	{
		int output = Object.hashCode();
		return output;
	}

	public String ConvertToString(WebElement Object)
	{
		String output = Object.toString();
		return output;

	}

	public String GetObjectText(WebElement Object)
	{
		String output = Object.getText();
		return output;

	}

	//--------------------------------------------Drop Down selction -----------------------------------------------------//

	public void SelectDropDownByText(WebElement Object,String input) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(Object);
			selectDropdown.selectByVisibleText(input);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}

	}

	public void SelectDropDownByValue(WebElement Object,String input) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(Object);                        //driver.get().findElement(By.xpath(object)));
			selectDropdown.selectByValue(input);

		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}

	}

	public void SelectDropDownByIndex(WebElement object,int input) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(object);
			selectDropdown.selectByIndex(input);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}

	public void DeselectDropDownByText(WebElement Object,String input) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(Object);
			selectDropdown.deselectByVisibleText(input);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}

	}

	public void DeselectDropDownByValue(WebElement Object,String input) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(Object);
			selectDropdown.deselectByValue(input);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}

	}

	public void DeselectDropDownByIndex(WebElement Object,int input) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(Object);
			selectDropdown.deselectByIndex(input);
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}

	public boolean CheckForMultipleDropDown(WebElement Object) throws Exception
	{
		try
		{
			boolean output=false;
			Select selectDropdown = new Select(Object);
			output= selectDropdown.isMultiple();
			return output;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}////method Updated on 12/08/2019 by testing team


	public void DeselectAllDropDown(WebElement Object) throws Exception
	{
		try
		{
			Select selectDropdown = new Select(Object);
			selectDropdown.deselectAll();
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}


	public String  GetFirstSelectedDropDownText(WebElement Object) throws Exception
	{
		try
		{
			Select drpElement =new Select(Object);
			String firstOption=drpElement.getFirstSelectedOption().getText();
			return firstOption;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}

	public int  GetAllDropDownOptionLength(WebElement Object) throws Exception
	{
		try
		{
			int output = 0;
			Select drpElement = new Select(Object);
			List<WebElement> allOptions=drpElement.getOptions();
			output = allOptions.size();
			System.out.println(output);
			// for (WebElement webElement : allOptions){
			// 	output=webElement.getText();
			// 	System.out.println(webElement.getText());
			// }
			return output;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}////method Updated on 12/08/2019 by testing team


	/**********************Validations**************************/

	public void ValidateObjectText(WebElement Object,String input) throws Exception
	{
		try
		{
			String ele=Object.getText();
			if(ele.equals(input))
			{
				System.out.println("Successful - Text "+ input +" are successfully validated");
			}
			else 
			{
				System.out.println("Fail - Text "+ input + "doesnt exist");
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}////updated on 27-08-2019


	public void ValidateObjectContainText(WebElement Object,String input) throws Exception  //Updated 27/08/19
	{
		try
		{
			String ele=Object.getText();
			if(ele.contains(input))
			{
				System.out.println(" Pass - Object contains  "+ input +" text ");
			}
			else
			{
				System.out.println(" Fail - Object doesnt contains  "+ input +" text ");
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
			throw e;
		}
	}////updated on 27-08-2019

	public void AssertEqualsForDouble(double actual, double expected)  //New Added
	{
		soft.assertEquals(actual, expected);
	}

	public void AssertNotEqualsForDouble(double actual, double expected)  //New Added
	{
		soft.assertNotEquals(actual, expected);   
	}


	//--------------------------------------KeyBoard and Mouse ----------------------------------------------------------------//


	public void RightClickOnObject(WebElement Object)
	{
		Actions act=new Actions(driver.get());
		act.contextClick(Object).perform(); 
	}////method Updated on 12/08/2019 by testing team

	public void ClickObjectFromListByIndex(List<WebElement> Object , int var) throws Exception 
	{
		Object.get(var).click();
	}

	public void DoubleClick(WebElement Object)
	{
		Actions act = new Actions(driver.get());
		act.doubleClick(Object).build().perform();
	}

	public void ClickAndHold(WebElement Object)
	{

		Actions act = new Actions(driver.get());
		act.clickAndHold(Object).build().perform();

	}
	//			public void Release()
	//			{
	//				Actions act = new Actions(driver);
	//				act.release();
	//			}

	public void Wait() throws InterruptedException
	{
		Actions act = new Actions(driver.get());
		act.wait();
	}

	public void Wait(int time) throws InterruptedException
	{
		Actions act = new Actions(driver.get());
		act.wait(5000);
	}
	public void Release(WebElement Object)
	{
		Actions act = new Actions(driver.get());
		act.release(Object).perform();

	}

	public void Perform()
	{
		Actions act = new Actions(driver.get());
		act.perform();

	}
	public void RightClick()
	{
		Actions act = new Actions(driver.get());
		act.contextClick();
	}

	public void DragAndDrop(WebElement Object,WebElement Object1)
	{
		Actions act = new Actions(driver.get());
		act.dragAndDrop(Object, Object1).perform();

	}

	public void MoveToObject(WebElement Object)
	{
		Actions act = new Actions(driver.get());
		act.moveToElement(Object).perform();
	}////method Updated on 12/08/2019 by testing team


	public void moveByOffset(int xOffset,int yOffset)
	{
		Actions act = new Actions(driver.get());
		act.moveByOffset(xOffset, yOffset);

	}

	public void moveElementWithOffsetValue(WebElement Object,int xOffset,int yOffset)
	{
		Actions act = new Actions(driver.get());
		act.moveToElement(Object, xOffset, yOffset);
	}

	public void dragAndDropElementWithOffsetValue(WebElement Object,int xOffset,int yOffset)
	{
		Actions act = new Actions(driver.get());
		act.dragAndDropBy(Object, xOffset, yOffset);

	}

	public void EnterData(WebElement Object,String input) throws Exception
	{

		Object.sendKeys(input);
	}	  

	public void Click(WebElement Object) throws Exception
	{
		Object.click();
	}

	//------------------------------------JsonFile-------------------------------------------------------------------------------//

	public String getJsonValue(String packageName,String className,String JsonMainKeyWord,String jsonSubKeyword) 

	{

		try
		{

			String []parts =packageName.split("\\.");
			String part1=parts[0];
			String part2=parts[1];
			System.out.println("./src/test/java/"+part1+"/"+part2+"/");
			String fileName="./src/test/java/"+part1+"/"+part2+"/"+className+"Config"+".json"; //onhold 
			File file=new File(fileName); 

			JSONParser parser=new JSONParser();

			FileReader reader=new FileReader(file.getAbsolutePath());
			Object obj=parser.parse(reader);

			JSONObject jsonObject = (JSONObject) obj;

			JSONObject jsonObject1 = (JSONObject) jsonObject.get(JsonMainKeyWord);

			String output=(String) jsonObject1.get(jsonSubKeyword); 

			return output;

		}
		catch(Exception e)
		{
			e.printStackTrace();
			return null;
		}


	}

	// domCapture starte////////////


	@SuppressWarnings("resource")
	public String captureDOM(String folderPath,String fileName) throws IOException
	{
		String source=driver.get().getPageSource();
		File f = null;

		System.out.println(folderPath);
		System.out.println(fileName);
		DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy-H-m-s");  
		Date date = new Date();
		f=new File("./src/main/java/dom/"+fileName+dateFormat.format(date)+".html");

		//PrintWriter out= new PrintWriter("./"+"DOM/"+fileName+dateFormat.format(date)+".html");
		PrintWriter out= new PrintWriter("./src/main/java/dom/"+fileName+".html");
		out.println(source);
		out.close();
		return source;

	}

	// domCapturend

	//------------------------------------Video recording --------------------------------------------------------------//

	public String startVideoRecord(String executionCount,String suiteName,String fileName) throws Exception {
		File file=null;
		try
		{
			NativeLibrary.addSearchPath(RuntimeUtil.getLibVlcLibraryName(), System.getProperty("user.dir")+"/lib");//
			System.setProperty("VLC_PLUGIN_PATH",  System.getProperty("user.dir")+"/lib/plugins");
			mediaPlayerFactory = new MediaPlayerFactory(OPTIONS);
			mediaPlayer = mediaPlayerFactory.newHeadlessMediaPlayer();

			String mp4FileName = getFile(executionCount+"_"+suiteName+"_"+fileName);
			System.out.println("Video recording started successfully, "+ mp4FileName);
			mediaPlayer.playMedia(MRL, getMediaOptions(mp4FileName));
			file=new File("./Videos/"+executionCount+"_"+suiteName+"_"+fileName+ RECORDINGFORMAT);
		}
		catch(Exception e)
		{
			//startVideoRecord();
			//driver.get().close();
			e.printStackTrace();
			throw e;
		}
		return file.getAbsolutePath();
	}

	public void stopVideoRecord() throws Exception {
		mediaPlayer.stop();
		System.out.println("Video recording stoppped successfully");

	}


	private String getFile(String fileName) {				 
		File file=null;
		try
		{
			File dir = new File(System.getProperty("user.dir"), "Videos");
			return dir.getAbsolutePath() + "/" + fileName+".mp4";
		}
		catch(Exception e)
		{
			//startVideoRecord();
			//driver.get().close();
			e.printStackTrace();
			throw e;
		}
		//return file.getAbsolutePath();
	}


	private String[] getMediaOptions(String destination) {
		return new String[] {
				String.format(SOUT, bits, scale, destination),
				String.format(FPS, fps),
				String.format(CACHING, caching)
		};
	}

	//-----------------------------------get Method name------------------------------------------------------//	


	public String getmethodName()
	{
		String fileName=Thread.currentThread().getStackTrace()[1].getMethodName();
		return fileName;
	}


	//-----------------------------------Screenshot folder creation ------------------------------------------------------------//


	public String folderCreation(String executionCount,String suiteName,String fileName,String projectName,String type)
					{
						//File path=file.getAbsoluteFile();
						File file=null;
						DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy H-m-s");  //yy-MM-dd HH-mm-ss
						Date date = new Date();
						System.out.println(type.equals("execution"));
						System.out.println(type=="execution");
						// File file=new File("./Screenshot/EachStepScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						if(type.equals("execution")){
							file=new File("../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/EachStepScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("schedule")||type.equals("ReSchedule")){
							file=new File("../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/EachStepScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("jenkins")){
							file=new File("../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("NormalException")){
							file=new File("../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/EachStepScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("SchedulerException")){
							file=new File("../../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/EachStepScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						} else if(type.equals("Main")){
							file=new File("./Screenshot/EachStepScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}
						System.out.println("File is " +type);
						
						 
						if (!file.isDirectory()) {
						boolean success = file.mkdirs();
						System.out.println("type is " +success);
						}
						System.out.println("path is " + file.getAbsolutePath());
						return file.getAbsolutePath();
					}




						public String folderCreation1(String executionCount,String suiteName,String fileName,String projectName,String type)
					{
						File file=null;
						DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy H-m-s");  //yy-MM-dd HH-mm-ss
						Date date = new Date();
						// File file=new File("./Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						
					if(type.equals("execution")){
							file=new File("../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("schedule")||type.equals("ReSchedule")){
							file=new File("../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}
						else if(type.equals("jenkins")){
							file=new File("../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("NormalException")){
							file=new File("../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}else if(type.equals("SchedulerException")){
							file=new File("../../../../../../../../../UI/uploads/images/"+projectName+"/"+suiteName+"/Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						} else if(type.equals("Main")){
							file=new File("./Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"/"+fileName);
						}
						System.out.println("File is " +type);
						if (!file.isDirectory()) {
						boolean success = file.mkdirs();
						System.out.println("type is " +success);
						}
						System.out.println("path1 is " + file.getAbsolutePath());
						return file.getAbsolutePath();
					}


	//-------------------------------------Capture Screenshot on Failure-----------------------------------------------------------------//
	///Changed on 20-03-19 suggested by testing team (Abhilash,Srikanth)				
	// public String CaptureOnFailure(int executionCount,String suiteName,String fileName,String option) throws IOException {
	// File f = null;
	// if(option.equals("Yes"))
	// {
	// DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy H-m-s"); //yy-MM-dd HH-mm-ss
	// Date date = new Date();
	// File scrFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
	// try {

	// FileUtils.copyFile(scrFile, new File("./ScreenShot/FailedScreenshot/"+ fileName + "-"+dateFormat.format(date) + ".png"));
	// f =new File("./ScreenShot/FailedScreenshot/"+executionCount+"-"+suiteName+"/"+fileName+".png");
	// } 
	// catch (IOException e) {
	// System.out.println(e.getMessage());
	// }
	// catch (Exception e) {
	// e.printStackTrace();
	// }
	// return f.getAbsolutePath();
	// }
	// else
	// {
	// return null;
	// }
	// }

	// public String CaptureOnFailure(String executionCount,String suiteName,String fileName,String option) throws IOException, AWTException {
	// File f = null;
	// if(option.equals("Yes"))
	// {
	// try
	// {
	// //Rectangle screenRectangle = new Rectangle(Toolkit.getDefaultToolkit().getScreenSize());	
	// BufferedImage image = new Robot().createScreenCapture(new Rectangle(Toolkit.getDefaultToolkit().getScreenSize()));
	// f=new File("./Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"_"+fileName+".png");
	// ImageIO.write(image, "png", f);
	// }
	// catch (IOException e) {
	// System.out.println(e.getMessage());
	// e.printStackTrace();//
	// throw e;//
	// }
	// catch (Exception e) {
	// e.printStackTrace();
	// }
	// return f.getAbsolutePath();
	// }

	// else
	// {
	// return null;
	// }
	// }


	//----------------------------------------- Capture ScreenShot for EveryStep ------------------------------------------------//
	///Changed on 20-03-19 suggested by testing team (Abhilash,Srikanth)
	// public String CaptureScreenShotAtEachStep(String folderPath,String fileName,String option) throws IOException 
	// {
	// File f = null;
	// if(option.equals("Yes"))
	// {
	// DateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy-H-m-s"); 
	// Date date = new Date();
	// File scrFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
	// try 
	// {

	// FileUtils.copyFile(scrFile, new File(folderPath+"/"+fileName+".png"));
	// f =new File(folderPath+"/"+fileName+".png");


	// } 
	// catch (IOException e) 
	// {
	// System.out.println();
	// }

	// }
	// if(option.equals("Yes"))
	// {
	// return f.getAbsolutePath();
	// }
	// else
	// {
	// return null;
	// }
	// }

	// public String CaptureOnFailure(String executionCount,String suiteName,String fileName,String option) throws IOException {
	// 						File f = null;
	// 						if(option.equals("Yes"))
	// 						{
	// 						File scrFile = ((TakesScreenshot)driver).getScreenshotAs(OutputType.FILE);
	// 						try {

	// 							FileUtils.copyFile(scrFile, new File("./Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"_"+fileName+".png"));
	// 							f=new File("./Screenshot/FailedScreenshot/"+executionCount+"_"+suiteName+"_"+fileName+".png");
	// 							 } 
	// 						catch (IOException e) {
	// 							System.out.println(e.getMessage());
	// 						}
	// 						catch (Exception e) {
	// 							e.printStackTrace();
	// 						}
	// 						}
	// 						return f.getAbsolutePath();
	// 					}

	public String CaptureOnFailure(String folderPath,String fileName,String option) throws IOException {
		File f = null;
		if(option.equals("Yes"))
		{
			File scrFile = ((TakesScreenshot)driver.get()).getScreenshotAs(OutputType.FILE);
			try {
				FileUtils.copyFile(scrFile, new File(folderPath+"/"+fileName+".png"));
				f =new File(folderPath+"/"+fileName+".png");//add
			} 
			catch (IOException e) {
				System.out.println(e.getMessage());
			}
			catch (Exception e) {
				e.printStackTrace();
			}
		}
		return f.getAbsolutePath();
	}




	// public String CaptureScreenShotAtEachStep(String folderPath,String fileName,String option) throws IOException, HeadlessException, AWTException 

	// {
	// File f = null;
	// if(option.equals("Yes"))
	// {	
	// try
	// {
	// BufferedImage image = new Robot().createScreenCapture(new Rectangle(Toolkit.getDefaultToolkit().getScreenSize()));//get dimesion of the screen and create a image 
	// f=new File(folderPath+"/"+fileName+".png");
	// ImageIO.write(image, "png", f);
	// }
	// catch (IOException e) 
	// {
	// System.out.println();
	// }

	// }
	// if(option.equals("Yes"))
	// {
	// return f.getAbsolutePath();
	// }
	// else
	// {
	// return null;
	// }
	// }	

	public String CaptureScreenShotAtEachStep(String folderPath,String fileName,String option) throws IOException{//original method

		File f = null;
		if(option.equals("Yes"))
		{
			File scrFile = ((TakesScreenshot)driver.get()).getScreenshotAs(OutputType.FILE);	
			FileUtils.copyFile(scrFile, new File(folderPath+"/"+fileName+".png"));
			f =new File(folderPath+"/"+fileName+".png");//add
		}
		return f.getAbsolutePath();
	}	


	////////////keyBoard Methods///////////////////////////////

	public void KeyEnter(WebElement Object) throws Exception
	{
		//   WebDriverWait wait=new WebDriverWait (driver,ExplicitWait);
		//   wait.until(ExpectedConditions.elementToBeClickable(Object));
		Object.sendKeys(Keys.ENTER);
	}	


	public void ArrowDown() throws Exception
	{
		Actions act = new Actions(driver.get());
		act.sendKeys(Keys.ARROW_DOWN).build().perform();
	}

	public void ArrowUp() throws Exception
	{
		Actions act = new Actions(driver.get());
		act.sendKeys(Keys.ARROW_UP).build().perform();
	}

	public void ArrowLeft() throws Exception
	{
		Actions act = new Actions(driver.get());
		act.sendKeys(Keys.ARROW_LEFT).build().perform();
	}

	public void ArrowRight() throws Exception
	{
		Actions act = new Actions(driver.get());
		act.sendKeys(Keys.ARROW_RIGHT).build().perform();
	}


	public void BackSpace(WebElement Object) throws Exception
	{
		Object.sendKeys(Keys.BACK_SPACE);
	}

	public void SpaceBar(WebElement Object) throws Exception
	{
		Object.sendKeys(Keys.SPACE);
	}

	public void Tab(WebElement Object) throws Exception
	{
		Object.sendKeys(Keys.TAB);
	}



	////////////////end/////////////////////////


	///////////////////// scrol//////////////////////

	public  void Scroll(int x,int y)
	{
		System.out.println("Calling Scrollllllllllllllllllllllll");
		List<Integer> args = new ArrayList<>();
		args.add(x);
		args.add(y);
		JavascriptExecutor js =  (JavascriptExecutor)driver.get();

		js.executeScript(String.format("window.scrollBy(x=%d,y=%d)", args.toArray()));
	}


	// scroll end/////////////////////////////////



	//////////////////////////// Waits method///////////////////////////////



	public void SimpleWait(int Timeout) throws InterruptedException
	{

		Thread.sleep(Timeout);
	}

	public boolean AlertIsPresent(int ExplicitWait) throws Exception
	{
		try
		{

			WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
			if(wait.until(ExpectedConditions.alertIsPresent()) == null)
			{
				return false;
			}

			else 
			{
				return true;
			}
		}
		catch (Exception e)
		{
			e.printStackTrace();
		}
		return false;

	}


	public boolean ElementSelectionStateToBe(WebElement Object,int ExplicitWait) throws Exception
	{

		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		boolean bool =   wait.until(ExpectedConditions.elementSelectionStateToBe(Object,true));
		return bool;

	}


	public boolean ElementToBeClickable(WebElement Object,int ExplicitWait) throws Exception
	{
		try
		{
			WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
			if(wait.until(ExpectedConditions.elementToBeClickable(Object))==null)
			{
				return false;
			}
			else
			{
				return true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return false;

	}						

	public boolean IsElementToBeSelected(WebElement Object,int ExplicitWait) throws Exception
	{
		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		boolean bool= wait.until(ExpectedConditions.elementToBeSelected(Object));
		return bool;
	}

	public boolean IsFrameToBeAvailableAndSwitchToIt(WebElement Object,int ExplicitWait) throws Exception
	{
		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		if(wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(Object)) == null)
		{
			return true;

		}
		else
		{
			return false;
		}
	}


	public boolean IsTextToBePresentInElement(WebElement Object,String input,int ExplicitWait) throws Exception
	{
		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		boolean bool =  wait.until(ExpectedConditions.textToBePresentInElement(Object, input));
		return bool;
	}

	public boolean IsTextToBePresentInElementValue(WebElement Object,String input,int ExplicitWait) throws Exception
	{
		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		boolean bool= wait.until(ExpectedConditions.textToBePresentInElementValue(Object, input));
		return bool;
	}

	public boolean IsTitels(String title,int ExplicitWait) throws Exception
	{
		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		boolean bool = wait.until(ExpectedConditions.titleIs(title));
		return bool;
	}


	public boolean IsTitleContains(String title,int ExplicitWait) throws Exception
	{
		WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
		boolean bool =  wait.until(ExpectedConditions.titleContains(title));
		return bool;
	}


	public boolean VisibilityOfElement(WebElement Object,int ExplicitWait) throws Exception
	{

		try
		{

			WebDriverWait wait=new WebDriverWait (driver.get(),ExplicitWait);
			if(wait.until(ExpectedConditions.visibilityOf(Object))==null)
			{
				return false;
			}
			else 
			{
				return true;
			}
		}
		catch(Exception e)
		{
			e.printStackTrace();
		}
		return false;
	}

	public boolean IsTextToBePresentInElement(WebElement Object,int Timeout,String input)
	{

		WebDriverWait wait = new WebDriverWait(driver.get(), Timeout);
		boolean bool = wait.until(ExpectedConditions.textToBePresentInElement(Object, input));
		return bool;
	}		 
	//						



	///////////////////////// waits method ends///////////////////////////////////////////




	///////////////////////// waits method ends///////////////////////////////////////////



	//------------------------------------Soft Assertions --------------------------------------------------------------------//


	public void AssertEqualsForBoolean(boolean actual, boolean expected)
	{
		soft.assertEquals(actual, expected);
	}

	public void AssertEqualsForSingleCharacter(char actual, char expected)
	{
		soft.assertEquals(actual, expected);
	}

	public void AssertEqualsForLong(long actual, long expected)
	{
		soft.assertEquals(actual, expected);
	}



	public void AssertEqualsForInteger(int actual, int expected)

	{
		soft.assertEquals(actual, expected);
	}////method Updated on 12/08/2019 by testing team

	public void AssertEqualsForString(String actual, String expected)
	{
		soft.assertEquals(actual, expected);
		System.out.println("comparing this assertions");
	}


	public void AssertEqualsForObject(WebElement actual,WebElement expected)
	{
		soft.assertEquals(actual, expected);
	}




	public void AssertTrueConditionWithMessage(boolean input,String message)
	{
		soft.assertTrue(input, message);
	}


	public void AssertFalseCondtionWithMessage(boolean input,String message)
	{
		soft.assertFalse(input, message);

	}

	public void AssertFalseConditionForObject(boolean input)
	{
		soft.assertFalse(input);
	}


	public void AssertNotEqualsForBoolean(boolean actual, boolean expected)
	{
		soft.assertNotEquals(actual, expected);
	}

	public void AssertNotEqualsForSingleCharacter(char actual, char expected)
	{
		soft.assertNotEquals(actual, expected);
	}

	public void AssertNotEqualsForLong(long actual, long expected)
	{
		soft.assertNotEquals(actual, expected);
	}

	public void AssertNotEqualsForInteger(int actual, int expected)
	{
		soft.assertNotEquals(actual, expected);
	}////method Updated on 12/08/2019 by testing team

	public void AssertNotEqualsForString(String actual, String expected)
	{
		soft.assertNotEquals(actual, expected);
	}


	public void AssertNotEqualsForObject(WebElement actual,WebElement expected)
	{
		soft.assertNotEquals(actual, expected);
	}


	//				public void AssertNotEquals(long actual, long expected)
	//				{
	//					soft.assertNotEquals(actual, expected);
	//				}



	public void AssertNullForObject(WebElement Object)
	{
		soft.assertNull(Object);
	}

	public void AssertNullForObjectWithMessage(WebElement Object, String Message)
	{
		soft.assertNull(Object, Message);
	}

	public void AssertNotNullForObject(WebElement Object)
	{
		soft.assertNotNull(Object);
	}

	public void AssertNotNullForObjectWithMessage(WebElement Object, String Message)
	{
		soft.assertNotNull(Object, Message);
	}


	public void AssertNull(WebElement Object, String Message)
	{
		soft.assertNull(Object);
	}

	public void AssertSameObject(WebElement actualObject,WebElement expectedObject)
	{
		soft.assertSame(actualObject, expectedObject);
	}


	public void AssertSameObjectWithMessage(WebElement actualObject,WebElement expectedObject, String Message)
	{
		soft.assertSame(actualObject, expectedObject, Message);
	}


	public void AssertNotSameObject(WebElement actualObject,WebElement expectedObject)
	{
		soft.assertNotSame(actualObject, expectedObject);
	}


	public void AssertNotSameObjectWithMessage(WebElement actualObject,WebElement expectedObject, String Message)
	{
		soft.assertNotSame(actualObject, expectedObject, Message);
	}



	//---------------------------Three Inputs ------------------------------------------------------------------//


	public void AssertNotEqualsForObjectWithMessage(WebElement actualObject,WebElement expectedObject,String Message)
	{

		soft.assertNotEquals(actualObject,expectedObject,Message);

	} //

	public void AssertNotEqualsWithFloatData(float actual,float expected,float delta)
	{
		soft.assertNotEquals(actual, expected, delta);
	}//


	public void AssertNotEqualsWithDoubleData(double actual,double expected,double delta)
	{
		soft.assertNotEquals(actual, expected, delta);
	}//


	public void AssertAll()
	{
		soft.assertAll();
	}





	//				public void assertNotSameWithMessage(WebElement actualObject,WebElement expectedObject,String Message)
	//				{
	//					soft.assertNotSame(actualObject,expectedObject,Message);
	//				}


	public void AsserEqualsForIntegerWithMessage(int actual,int expected,String message)
	{                                                             	
		soft.assertEquals(actual, expected, message);
	}//




	public void AssertEqualsForObjectWithMessage(WebElement actual,WebElement expected,String message)
	{
		soft.assertSame(actual,expected,"two reference objects are point to the same object");
	} //



	//				public void assertEqualsWithFloatTypeData(float actual,float expected,float delta)
	//				{
	//					soft.assertEquals(actual, expected, delta);
	//				}

	//				public void assertEqualsWithDoubleTypeData(double actual,double expected,double delta)
	//				{
	//					softAssert.assertEquals(actual, expected, delta);
	//				}

	public void AssertEqualsForLongTypeWithMessage(long actual,long expected,String message)
	{
		soft.assertEquals(actual, expected, message);
	}



	//------------------------------------Excel data ----------------------------------------------------------------------------//






	// public String getData(String xlPath,String sheetName,int rowNum,int cellNum)
	// {
	// 	String data="";
	// 	 try
	// 	 {
	// 		FileInputStream fis=new FileInputStream(xlPath);
	// 		Workbook w1= WorkbookFactory.create(fis);
	// 		Sheet s1=w1.getSheet(sheetName);
	// 		 Row r1=s1.getRow(rowNum);
	// 		  Cell c1=r1.getCell(cellNum);
	// 		  data=c1.getStringCellValue();
	// 		  return data;
	// 		 }
	// 	  catch(Exception e)
	// 	   {
	// 		  e.printStackTrace();
	// 		  return "";
	// 	   }


	// } 



	public  String getData(String xlpath,String sheetName,int rowNum,int cellNum) throws Exception
	{

		try
		{

			FileInputStream fis = new FileInputStream(xlpath);     
			Workbook wb = WorkbookFactory.create(fis);	
			int type = wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getCellType();
			System.out.println("The TYPE = " + type);
			String value = "";

			if(type==Cell.CELL_TYPE_STRING)
			{
				value = wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getStringCellValue();
				System.out.println("The Val1 " + value);
			}

			else if(type==Cell.CELL_TYPE_NUMERIC)
			{
				int nuMvalue = (int)wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getNumericCellValue();
				value = ""+ nuMvalue;
				System.out.println("The Val2 " + value);

			}
			else if(type==Cell.CELL_TYPE_BOOLEAN)
			{
				boolean boolValue =  wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getBooleanCellValue();
				value = ""+boolValue;
				System.out.println("The Val3 " + value);
			}
			return value;
		}
		catch(Exception e)
		{
			e.printStackTrace();
			return "";
		}
	}


	public void setData(String xlPath,String sheetName,int rowNum,int cellNum,String data)

	{
		try
		{
			FileInputStream fis=new FileInputStream(xlPath);
			Workbook w1=WorkbookFactory.create(fis);
			Sheet s1=w1.getSheet(sheetName);
			Row r1=s1.createRow(rowNum);
			Cell c1=r1.createCell(cellNum);
			c1.setCellValue(data);

			FileOutputStream fos=new FileOutputStream(xlPath);
			w1.write(fos);

		}

		catch(Exception e)
		{
			e.printStackTrace();
		}


	}
	public int getNumberData(String xlPath,String sheetName,int rowNum,int cellNum)
	{
		int data=-1;
		try
		{
			FileInputStream fis=new FileInputStream(xlPath);
			Workbook w1= WorkbookFactory.create(fis);
			Sheet s1=w1.getSheet(sheetName);
			Row r1=s1.getRow(rowNum);
			Cell c1=r1.getCell(cellNum);
			data=(int)(c1.getNumericCellValue());
			return data;
		}

		catch(Exception e)
		{
			e.printStackTrace();
			return data;
		}



	} 


	public String  getData1(String xlPath,String sheetName,int rowNum,int cellNum) throws Exception
	{


		FileInputStream fis=new FileInputStream(xlPath);
		Workbook w1= WorkbookFactory.create(fis);
		Sheet s1=w1.getSheet(sheetName);
		Row r1=s1.getRow(rowNum);
		Cell c1=r1.getCell(cellNum);
		String data=c1.getStringCellValue(); 
		return data;

	}	

	public boolean handleWindowAlert()
	{
		try
		{
			driver.get().switchTo().alert().accept();
		}
		catch (NoAlertPresentException e) 
		{ 
			System.out.println("No Alert Present");
			return false;
		} 
		return true;
	}


	public void OpenApplication(String deviceName,String platform,String UDID,String platformVersion, int timeout,String appPackage , String appActivity, String appiumAddress) throws Exception 

	{         
		DesiredCapabilities caps = new DesiredCapabilities();
		caps.setCapability(MobileCapabilityType.DEVICE_NAME, deviceName);   //"Abilash"
		caps.setCapability(MobileCapabilityType.PLATFORM, platform);   //"Android"
		caps.setCapability(MobileCapabilityType.PLATFORM_VERSION,platformVersion);
		caps.setCapability(MobileCapabilityType.UDID,UDID);  //"ZY3228SRS5"


		caps.setCapability(AndroidMobileCapabilityType.APP_PACKAGE, appPackage);    //application appPackage name
		caps.setCapability(AndroidMobileCapabilityType.APP_ACTIVITY, appActivity);   
		caps.setCapability("unicodeKeyboard", true);
		caps.setCapability("resetKeyboard", true);

		//driver = new AndroidDriver<MobileElement>(new URL("http://"+appiumAddress+"/wd/hub"),caps);
		driver.set(new AndroidDriver<MobileElement>(new URL("http://"+appiumAddress+"/wd/hub"),caps));
		//driver.get().hideKeyboard();
		//driver = new AndroidDriver<MobileElement>(new URL("http://0.0.0.0:4723/wd/hub"),caps);     //"http://127.0.0.1:4723/wd/hub"  //"+appiumAddress+
		System.out.println("2 - testing");
		driver.get().manage().timeouts().implicitlyWait(timeout, TimeUnit.SECONDS);
		//	driver.get().switchTo().defaultContent();
	}

	public void ThreadSleep(String data) throws InterruptedException {
		int t = Integer.parseInt(data);
		Thread.sleep(t);
	}













































}
















































