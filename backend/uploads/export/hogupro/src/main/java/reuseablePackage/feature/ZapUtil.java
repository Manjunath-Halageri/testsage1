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


}
