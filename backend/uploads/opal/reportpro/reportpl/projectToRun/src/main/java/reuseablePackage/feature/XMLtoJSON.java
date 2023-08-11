package reuseablePackage.feature;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.json.JSONObject;
import org.json.XML;

public class XMLtoJSON {

	public static void main(String[] args) throws Exception {
		int PRETTY_PRINT_INDENT_FACTOR = 10;

		String xmlFile = System.getProperty("user.dir") + "\\target\\surefire-reports\\testng-results.xml";

		String xmlString = new String(Files.readAllBytes(Paths.get(xmlFile)));
		JSONObject xmlJSONObj = XML.toJSONObject(xmlString);

		String jsonFile = System.getProperty("user.dir") + "\\target\\surefire-reports\\Report.json";

		try (FileWriter fileWriter = new FileWriter(jsonFile)){
		fileWriter.write(xmlJSONObj.toString(PRETTY_PRINT_INDENT_FACTOR));

		System.out.println("Successfully converted xml report to Json");
		}
		catch(Exception e)
		{
		e.printStackTrace();
		}

	}

}
