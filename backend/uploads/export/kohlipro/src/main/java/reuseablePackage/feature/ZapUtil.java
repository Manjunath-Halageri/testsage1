package reuseablePackage.feature;

import java.io.*;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
//import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.Proxy;
import org.zaproxy.clientapi.core.*;

public class ZapUtil {
    public static int progress;
    private static ClientApi api;
    public static Proxy proxy;
    private static ApiResponse apiResponse;

    //
    private static final int zapPort = 8080;
    private static final String apiKey = "123456789"; //Please add your own api key from ZAP


    public static void setUp(String zapAddress){
        api= new ClientApi(zapAddress, zapPort, apiKey);
        System.out.println(api);
        System.out.println("//////////////////////////////////////////////////////////////////////////////////////////////////");
        proxy = new Proxy().setSslProxy(zapAddress + ":" + zapPort).setHttpProxy(zapAddress + ":" + zapPort);
    }

    public static void passiveScan() {
        try {
            api.pscan.enableAllScanners();
            api.pscan.setEnabled("True");
            System.out.println("///////////////////////////starting passive scan//////////////////////////");
            apiResponse = api.pscan.recordsToScan();
            String tempVal = ((ApiResponseElement) apiResponse).getValue();
            while (!tempVal.equals("0")) {
                System.out.println("passive scan is in progress");
                apiResponse = api.pscan.recordsToScan();
                tempVal = ((ApiResponseElement) apiResponse).getValue();
            }
            System.out.println("passive scan is completed");
        } catch (ClientApiException e) {
            e.printStackTrace();
        }
    }


    public static void generateReport(String zapIpAddress) {
            ChromeOptions chromeOptions = new ChromeOptions();
            String proxyadd = zapIpAddress=+":8080";
            Proxy proxy = new Proxy();
            proxy.setHttpProxy(proxyadd);
            proxy.setSslProxy(proxyadd);
            chromeOptions.setCapability("proxy", proxy);
            WebDriver driver1  = new ChromeDriver(chromeOptions);
             driver1.manage().timeouts().implicitlyWait(30, TimeUnit.SECONDS);
             driver1.get("http://"+zapIpAddress+":8080/UI/core/other/htmlreport");
             driver1.manage().timeouts().pageLoadTimeout(30, TimeUnit.SECONDS);
             driver1.findElement(By.id("apikey")).sendKeys("oqfnbkan2404g2201kpfm8sgoe");
             driver1.findElement(By.id("button")).click();

             SimpleDateFormat dateFormatForFoldername = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
             Date currentDate = new Date();
             String folderDateFormat = dateFormatForFoldername.format(currentDate);
         try {
             URL oracle = new URL(driver1.getCurrentUrl());
             BufferedReader in = new BufferedReader(
             new InputStreamReader(oracle.openStream()));
             @SuppressWarnings("resource")
			BufferedWriter writer = new BufferedWriter(new FileWriter("Reports"+File.separator+"OwaspReport-"+folderDateFormat+".html"));

             String inputLine;
             while ((inputLine = in.readLine()) != null){
                 try{
                     writer.write(inputLine);
                 }
                 catch(IOException e){
                     e.printStackTrace();
                     return;
                 }
             }
             in.close();
             writer.close();
             driver1.quit();
         }
         catch(Exception ex) {
             System.out.println(ex.getMessage());
             ex.printStackTrace();
         } 
    }
}
