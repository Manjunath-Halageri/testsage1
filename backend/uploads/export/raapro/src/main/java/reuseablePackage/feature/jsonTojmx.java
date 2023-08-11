package reuseablePackage.feature;

import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.json.JSONObject;
import org.json.XML;
import com.github.underscore.lodash.U;

public class jsonTojmx {
	public static void main(String args[]) throws Exception {
		System.out.println("hello");
//		String jsonFile = "D:\\hero.json";
		String jsonFile = args[0];
		System.out.println(args[0]);
		System.out.println(args[1]);
		String jsonString = new String(Files.readAllBytes(Paths.get(jsonFile)));
		String jmx = U.jsonToXml(jsonString);
		//System.out.println(jmx);

//		String jmxFile = "D:\\hero1.jmx";
		String jmxFile = args[1];
		try (FileWriter fileWriter = new FileWriter(jmxFile)) {
			fileWriter.write(jmx);

			System.out.println("Successfully converted to jmx");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
