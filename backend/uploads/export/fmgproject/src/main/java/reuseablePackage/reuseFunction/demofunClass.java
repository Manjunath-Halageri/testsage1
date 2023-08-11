
package reuseablePackage.reuseFunction;
import reuseablePackage.feature.AllActions;
import org.openqa.selenium.WebDriver;
public class demofunClass{
	
	public static ThreadLocal<WebDriver> driver = new ThreadLocal<>();
	
	public demofunClass(ThreadLocal<WebDriver> driver) {

		this.driver=driver;
	}
	AllActions actions = new AllActions();
public void demofun() throws Exception
{
actions.EnterApplicationURL("https://the-internet.herokuapp.com/login");







}
}



































// package reuseablePackage.feature;

// import java.util.concurrent.TimeUnit;

// import org.openqa.selenium.By;
// import org.openqa.selenium.WebDriver;
// import org.openqa.selenium.WebElement;
// import org.openqa.selenium.chrome.ChromeDriver;
// import org.openqa.selenium.chrome.ChromeOptions;
// import java.net.MalformedURLException;

// public class demofunClass extends  AllActions {
// 	public static WebDriver driver;
	
// 	AllActions actionObject = new AllActions();
	
// 	}  
// }