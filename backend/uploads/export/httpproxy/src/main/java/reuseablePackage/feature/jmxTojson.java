package reuseablePackage.feature;
import java.io.FileWriter;
import java.nio.file.Files;
import java.nio.file.Paths;
import org.json.JSONObject;
import org.json.XML;
import com.github.underscore.lodash.U;

public class jmxTojson {
	public static void main(String args[]) throws Exception {
		System.out.println("hello");
//		String jmxFile = "D:\\hero.jmx";
		String jmxFile = args[0];
		System.out.println(args[0]);
		System.out.println(args[1]);
		String jmxString = new String(Files.readAllBytes(Paths.get(jmxFile)));
		String json = U.xmlToJson(jmxString);
		System.out.println(json);

		//String jsonFile ="D:\\hero.json";
		String jsonFile =args[1];
		try (FileWriter fileWriter = new FileWriter(jsonFile)){
		fileWriter.write(json);

		System.out.println("Successfully converted  to Json");
		}
		catch(Exception e)
		{
		e.printStackTrace();
		}
		}
}
