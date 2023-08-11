package reuseablePackage.feature;

import org.openqa.selenium.Proxy;
import org.zaproxy.clientapi.core.*;

public class ZapUtil {
    public static int progress;
    private static ClientApi api;
    public static Proxy proxy;
    private static ApiResponse apiResponse;

    private static final String zapAddress="localhost";
    private static final int zapPort = 8080;
    private static final String apiKey = null; //Please add your own api key from ZAP


    static{
        api= new ClientApi(zapAddress, zapPort, apiKey);
        System.out.println(api);
        System.out.println("//////////////////////////////////////////////////////////////////////////////////////////////////");
        proxy = new Proxy().setSslProxy(zapAddress + ":" + zapPort+"/v2/bla").setHttpProxy(zapAddress + ":" + zapPort+"/v2/bla");
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


    public static void generateZapReport() {
        if(api != null) {
			String title = "Zap Security Report";
			String template = "traditional-html";
			String description = "This is Zap Security test report";
			String reportfilename = "Zap-Report.html";
			String targetFolder = System.getProperty("user.dir");
			
			
			try {
				ApiResponse response = api.reports.generate(title, template, null, description, null, null, null, null, null, reportfilename, null, targetFolder, null);
				System.out.println("Zap report generated at this location:" + response.toString());
			} catch (ClientApiException e) {
				e.printStackTrace();
			}
		}
    }
}
