package reuseablePackage.feature;

import java.io.FileInputStream;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;



public class AllActions {
	public  String getData(String xlpath,String sheetName,int rowNum,int cellNum) throws Exception
	{

		try
		{

			FileInputStream fis = new FileInputStream(xlpath);     
			Workbook wb = WorkbookFactory.create(fis);	
			CellType type = wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getCellType();
			System.out.println("The TYPE = " + type);
			String value = "";

			if(type==CellType.STRING)
			{
				value = wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getStringCellValue();
				System.out.println("The Val1 " + value);
			}

			else if(type==CellType.NUMERIC)
			{
				int nuMvalue = (int)wb.getSheet(sheetName).getRow(rowNum).getCell(cellNum).getNumericCellValue();
				value = ""+ nuMvalue;
				System.out.println("The Val2 " + value);

			}
			else if(type==CellType.BOOLEAN)
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
}
