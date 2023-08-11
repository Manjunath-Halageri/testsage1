import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../core/services/dashboard.service';
import { DefectDashboardService } from '../../../../core/services/defect-dashboard.service';
import { ChartSelectEvent } from 'ng2-google-charts';
import { MatTableDataSource } from '@angular/material/table';
import { throwMatDialogContentAlreadyAttachedError } from '@angular/material';

@Component({
  selector: 'app-requirement-coverage-report',
  templateUrl: './requirement-coverage-report.component.html',
  styleUrls: ['./requirement-coverage-report.component.css', '../../../../layout/css/parent.css', '../../../../layout/css/table.css']
})
export class RequirementCoverageReportComponent implements OnInit {
  pieArray = [];
  selProjectName: string;
  releaseVersion: any;
  obj: any;
  allProData: any;
  projectId: any;
  AllProData1;
  AllProData2;
  AllProData3;
  AllProData4;
  AllProData5;
  AllProData10
  AllProData8
  AllProData9
  subchart = []
  myarray1 = []
  myarray2 = []
  subdata = []
  data1 = []
  isDataAvailable1: boolean;
  isDataAvailable2: boolean;

  constructor(private dashboardservice: DashboardService, private defectdashboardService: DefectDashboardService,) { }

  ngOnInit() {
    console.log(window.sessionStorage);
    this.releaseVersion = localStorage.getItem('releaseVersion');
    console.log(this.releaseVersion)
    this.selProjectName = sessionStorage.getItem('key');
    console.log(this.selProjectName)
    sessionStorage.setItem('moduleName', null);
    this.obj = {
      "projectSelection": this.selProjectName
    }
    // console.log(this.selProjectName)
    this.dashboardservice.getModuleFields(this.obj)
      .subscribe(async (data) => {
        this.allProData = data;
        this.projectId = this.allProData.projectId
        console.log(this.projectId)
        await this.searchData(this.projectId)

      })

  }


  searchData(projectId) {
    console.log(projectId)
    var obj = {
      "releaseVersion": this.releaseVersion,
      "projectId": projectId
    }
    this.defectdashboardService.searchRequirements(obj)
      .subscribe(async (data) => {
        this.AllProData1 = data;
        console.log(this.AllProData1);
        await this.data1.push(data)
        console.log(this.data1)
        this.searchData1(this.projectId)
      })

  }
  searchData1(projectId) {
    console.log(projectId)
    var obj = {
      "projectId": projectId
    }
    this.defectdashboardService.searchRequirementstwo(obj)
      .subscribe(async (data) => {
        this.AllProData2 = data;
        console.log(this.AllProData2);
        var subdataone = 0;
        // console.log(this.AllProData9[0].countData)
        for (var i = 0; i < this.AllProData2.length; i++) {
          if (this.AllProData2[i].countData > 0) {
            subdataone++
          }
          else {
            console.log("not needed")
          }
        }

        console.log(subdataone)

        this.subdata.push(subdataone)

        await this.data1.push(this.subdata)
        console.log(this.data1)
        this.searchData2(this.projectId)

      })

  }
  searchData2(projectId) {
    console.log(projectId)
    var obj = {
      "projectId": projectId
    }
    this.defectdashboardService.subchartMadhu2(obj)
      .subscribe((data) => {
        this.totalattempted = data;
        console.log(this.totalattempted)
      })
    this.defectdashboardService.searchRequirementsthree(obj)
      .subscribe(async (data) => {
        this.AllProData3 = data;
        console.log(this.AllProData3);
        this.totalExecutedCount = this.AllProData3.length
        this.totalPassCount = 0;
        this.totalFailCount = 0;
        for (var i = 0; i < this.AllProData3.length; i++) {
          if (this.AllProData3[i].pass == this.AllProData3[i].TestcaseCount) {
            this.totalPass.push(this.AllProData3[i])
            this.totalPassCount++
          } else {
            this.totalFail.push(this.AllProData3[i])
            this.totalFailCount++
          }
        }

        console.log(this.totalPass)
        console.log(this.totalFail)
        this.pieChartData(this.data1, this.totalattempted.length, this.totalExecutedCount, this.totalPassCount, this.totalFailCount)
      })

  }
  totalattempted;
  totalExecuted = [];
  totalPass = [];
  totalFail = [];
  totalExecutedCount;
  totalPassCount;
  totalFailCount;
  pieChartData(x, B, y, z, A) {
    this.isDataAvailable1 = true
    this.isDataAvailable2 = false
    this.isDataAvailableTable = false;
    this.isDataAvailable3 = false;
    this.isDataAvailable4 = false;
    this.isDataAvailable5 = false;
    this.isDataAvailable6 = false;
    this.isDataAvailable7 = false;

    var pArray = ['Requirements', 'TotalCount'];
    var pArray1 = ['No of Requirements'];
    var pArray2 = ['No of requirements with test cases'];
    var pArray6 = ['No of requirements attempted']
    var pArray3 = ['No of requirements Executed'];
    var pArray4 = ['No of requirements Pass'];
    var pArray5 = ['No of requirements Fail'];

    var data = x;
    var dataArray1 = data[0][0].requirementName;
    var dataArray2 = data[1][0];
    var dataArray6 = B;
    var dataArray3 = y
    var dataArray4 = z
    var dataArray5 = A



    console.log(this.pieArray)
    this.pieArray.push(pArray);
    pArray1.push(dataArray1);
    pArray2.push(dataArray2);
    pArray6.push(dataArray6);
    pArray3.push(dataArray3);
    pArray4.push(dataArray4);
    pArray5.push(dataArray5);

    this.pieArray.push(pArray1, pArray2, pArray6, pArray3, pArray4, pArray5);
    console.log(this.pieArray);
    this.pieChart.dataTable = this.pieArray;
  }



  public pieChart = {

    chartType: 'PieChart',
    dataTable: this.pieArray,
    options: {
      width: '100%', height: 350,
      is3D: true,
      colors: ['#52D726', 'orange', '#7CDDDD', 'blue', 'red', '#f542ec'],
      chartArea:{left:20,top:20,width:'100%',height:'75%'},
      pieSliceText: 'value',
      backgroundColor: {
        gradient: {
          color1: '#ddebef',
          color2: '#5391ea',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%',
          useObjectBoundingBoxUnits: true
        },
      },
      pieHole: 1.5,
          pieSliceTextStyle: {
            color: 'black',
          },
        },
  }
  select(event: ChartSelectEvent) {
    console.log(event.selectedRowFormattedValues[0])
    if (event.selectedRowFormattedValues[0] === "No of Requirements") {
      this.subChartOne(this.projectId)
    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements with test cases") {
      this.subChartTwo(this.projectId)
    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements attempted") {
      this.subchartThree(this.projectId)
    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements Executed") {
      // console.log(this.totalExecutedCount, this.totalPassCount, this.totalFailCount)

      this.subchartPieFour(this.totalExecutedCount, this.totalPassCount, this.totalFailCount)

    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements Pass") {

      this.isDataAvailable1 = false;
      this.isDataAvailable2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table2 = false;
      this.subchart1Table3 = false;
      this.isDataAvailable3 = false
      this.subchart2Table3 = false
      this.subchart2Table2 = false;
      this.subchart2Table1 = false;
      this.isDataAvailable4 = false;
      this.isDataAvailable5 = false;
      this.isDataAvailable6 = true;
      this.isDataAvailable7 = false;
      this.subchart6Table1 = true;
      this.subchart7Table1 = false;

    }

    else if (event.selectedRowFormattedValues[0] === "No of requirements Fail") {
      this.isDataAvailable1 = false;
      this.isDataAvailable2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table2 = false;
      this.subchart1Table3 = false;
      this.isDataAvailable3 = false
      this.subchart2Table3 = false
      this.subchart2Table2 = false;
      this.subchart2Table1 = false;
      this.isDataAvailable4 = false;
      this.isDataAvailable5 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = true;
      this.subchart6Table1 = false;
      this.subchart7Table1 = true;

      // alert("No of requirements Fail")
    }
    else {
      alert("NOt clicked")
    }
  }
  dataSource: MatTableDataSource<any>;
  subchart1Table1: string[] = ['Sl.No', 'RequirementId', 'RequirementName', 'Module', 'Feature'];
  subchart1TableTwo: string[] = ['Sl.No', 'RequirementId', 'RequirementName', 'Module', 'Feature'];
  subchart1TableThreeData: string[] = ['Sl.No', 'RequirementId', 'RequirementName', 'Module', 'Feature'];

  subChartOne(projectId) {
    console.log(projectId)


    var obj = {
      "projectId": projectId,
      "totalRequirements": "totalRequirements",
    }
    var obj1 = {
      "projectId": projectId,
      "requirementsWithTestcases": "requirementsWithTestcases",
    }
    var obj2 = {
      "projectId": projectId,
      "tableData": "tableData",
    }
    this.subchart = []
    this.defectdashboardService.mainSubGraph(obj)
      .subscribe(async (data) => {
        this.AllProData8 = data;
        console.log(this.AllProData8);
        await this.subchart.push(this.AllProData8)
      })
    this.defectdashboardService.mainSubGraph(obj1)
      .subscribe(async (data) => {
        this.AllProData9 = data;
        console.log(data);
        var dataont = 0;
        var datatwo = 0
        // console.log(this.AllProData9[0].countData)
        for (var i = 0; i < this.AllProData9.length; i++) {
          if (this.AllProData9[i].countData == 0) {
            dataont++
          }
          else {
            datatwo++
          }
        }

        console.log(dataont, datatwo)

        this.myarray1.push(datatwo)
        this.myarray2.push(dataont)
        await this.subchart.push(this.myarray1)
        await this.subchart.push(this.myarray2)

        this.subPieChartData1(this.subchart)
      })
    this.defectdashboardService.mainSubGraph(obj2)
      .subscribe(async (data) => {
        this.AllProData10 = data;
        console.log(this.AllProData10);
        this.subchart1Tabletwo = []
        this.subchart1TableThree = []
        for (var i = 0; i < this.AllProData10.length; i++) {
          if (this.AllProData10[i].testcaseCount > 0) {
            this.subchart1Tabletwo.push(this.AllProData10[i])
          }
          else
            this.subchart1TableThree.push(this.AllProData10[i])
        }
        console.log(this.subchart1Tabletwo)
        console.log(this.subchart1TableThree)
      })
  }

  subchart1Tabletwo = []
  subchart1TableThree = []
  tableData;
  isDataAvailableTable: boolean;
  subchart1Table2: boolean;
  subchart1Table3: boolean;
  subchart6Table1: boolean
  subchart7Table1: boolean
  // 
  public selectable(event: ChartSelectEvent) {
    if (event.selectedRowFormattedValues[0] === "No of Requirements") {
      this.isDataAvailable2 = true
      this.isDataAvailableTable = true;
      this.subchart1Table2 = false;
      this.subchart1Table3 = false;

    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements having testcases") {
      this.isDataAvailable2 = true
      this.subchart1Table2 = true;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;


    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements not having testcases") {
      this.isDataAvailable2 = true
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = true;
    }
  }


  subPieChartData1(x) {
    this.isDataAvailable1 = false
    this.isDataAvailable2 = true
    this.isDataAvailableTable = false;
    this.subpieArray = []
    var subpArray = ['suitelevel', 'TotalNumber'];
    var subpArray1 = ['No of Requirements'];
    var subpArray2 = ['No of requirements having testcases'];
    var subpArray3 = ['No of requirements not having testcases'];

    var data = x;
    console.log(data)
    var subdataArray1 = data[0][0].requirementName;
    var subdataArray2 = data[1][0];

    var subdataArray3 = data[2][0];

    // console.log(subdataArray1,subdataArray2)
    this.subpieArray.push(subpArray);
    subpArray1.push(subdataArray1);
    subpArray2.push(subdataArray2);
    subpArray3.push(subdataArray3);

    this.subpieArray.push(subpArray1, subpArray2, subpArray3);
    console.log(this.subpieArray);
    this.sub1pieChart.dataTable = this.subpieArray;
  }
  subpieArray = [];

  public sub1pieChart = {

    chartType: 'PieChart',
    dataTable: this.subpieArray,
    options: {
      // legend: { position: 'left' },
      // slices: {
      //   0: { offset: 0.3 },
      //   1: { offset: 0.2 },
      // },
      width: '100%', height: 300,
      is3D: true,
      colors: ['#52D726', 'blue', 'red'],
      title: 'SubChart1',
      chartArea:{left:20,top:20,width:'100%',height:'75%'},
      pieSliceText: 'value',
      backgroundColor: {
        gradient: {
          color1: '#ddebef',
          color2: '#5391ea',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%',
          useObjectBoundingBoxUnits: true
        },
      },
      pieHole: 1.5,
          pieSliceTextStyle: {
            color: 'black',
          },
      
    },
  }
  openMain() {
    this.isDataAvailable1 = true;
    this.isDataAvailable2 = false;
    this.isDataAvailableTable = false;
    this.subchart1Table2 = false;
    this.subchart1Table3 = false;
    this.isDataAvailable3 = false
    this.subchart2Table3 = false
    this.subchart2Table2 = false;
    this.subchart2Table1 = false;
    this.isDataAvailable4 = false;
    this.isDataAvailable5 = false;
    this.isDataAvailable6 = false;
    this.isDataAvailable7 = false;



  }
  mainSubChartTwo;
  SubChartTwoArray1 = []
  SubChartTwoArray2 = []
  SubChartTwoArray3 = []

  SubChartTwoArray2Table = []
  SubChartTwoArray3Table = []


  subChartTwo(projectId) {

    var obj = {
      "projectId": projectId
    }
    this.SubChartTwoArray1 = []
    this.SubChartTwoArray2Table = []
    this.SubChartTwoArray3Table = []
    console.log(projectId)
    this.defectdashboardService.mainSubChartTwoData(obj)
      .subscribe((data) => {
        this.mainSubChartTwo = data;
        console.log(this.mainSubChartTwo);
        this.SubChartTwoArray1.push(this.mainSubChartTwo.length);

        for (var i = 0; i < this.mainSubChartTwo.length; i++) {
          if (this.mainSubChartTwo[i].report > 0) {
            this.SubChartTwoArray2Table.push(this.mainSubChartTwo[i])
          }
          else {
            this.SubChartTwoArray3Table.push(this.mainSubChartTwo[i])

          }
        }
        console.log(this.SubChartTwoArray1)
        this.SubChartTwoArray2.push(this.SubChartTwoArray2Table.length)
        this.SubChartTwoArray3.push(this.SubChartTwoArray3Table.length)
        console.log(this.SubChartTwoArray1, this.SubChartTwoArray2)
        console.log(this.SubChartTwoArray3)
        this.subChartTwoData(this.SubChartTwoArray1, this.SubChartTwoArray2, this.SubChartTwoArray3)

      })

  }
  isDataAvailable3: boolean;
  subchart2Table1: boolean;
  subchart2Table2: boolean;
  subchart2Table3: boolean;
  subChart2pieArray = []
  isDataAvailable7: boolean;
  isDataAvailable6: boolean;

  subChartTwoData(x, y, z) {
    console.log(x, y, z)
    this.isDataAvailable1 = false
    this.isDataAvailable2 = false
    this.isDataAvailableTable = false;
    this.isDataAvailable3 = true;
    this.isDataAvailable4 = false;
    this.isDataAvailable5 = false;
    this.isDataAvailable6 = false;
    this.isDataAvailable7 = false;

    this.subChart2pieArray = []
    var subChart2pArray = ['suitelevel', 'AAA'];
    var subChart2pArray1 = ['No of requirements with testcases'];
    var subChart2pArray2 = ['No of requirements attempted'];
    var subChart2pArray3 = ['No of requirements not attempted'];

    // var data = x;
    // console.log(data)
    var subChart2Array1 = x[0]
    var subChart2Array2 = y[0]
    var subChart2Array3 = z[0]

    // console.log(subdataArray1,subdataArray2)
    this.subChart2pieArray.push(subChart2pArray);
    subChart2pArray1.push(subChart2Array1);
    subChart2pArray2.push(subChart2Array2);
    subChart2pArray3.push(subChart2Array3);

    this.subChart2pieArray.push(subChart2pArray1, subChart2pArray2, subChart2pArray3);
    console.log(this.subChart2pieArray);
    this.sub1ChartpieChart.dataTable = this.subChart2pieArray;
  }
  subChartpieArray = [];

  public sub1ChartpieChart = {

    chartType: 'PieChart',
    dataTable: this.subChart2pieArray,
    options: {
      // legend: { position: 'left' },
      // slices: {
      //   0: { offset: 0.3 },
      //   1: { offset: 0.2 },
      // },
      width: '100%', height: 300,
      is3D: true,
      colors: ['#52D726', 'blue', 'red'],
      title: 'SubChart2',
      chartArea:{left:20,top:20,width:'100%',height:'75%'},
      pieSliceText: 'value',
      backgroundColor: {
        gradient: {
          color1: '#ddebef',
          color2: '#5391ea',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%',
          useObjectBoundingBoxUnits: true
        },
      },
      pieHole: 1.5,
          pieSliceTextStyle: {
            color: 'black',
          },
    },
  }

  public subChart2selectable(event: ChartSelectEvent) {
    if (event.selectedRowFormattedValues[0] === "No of requirements with testcases") {
      this.isDataAvailable2 = false
      this.isDataAvailableTable = false;
      this.subchart1Table2 = false;
      this.isDataAvailable3 = true;
      this.subchart2Table1 = true;
      this.subchart2Table2 = false;
      this.subchart1Table3 = false;
      this.subchart2Table3 = false;
      this.isDataAvailable4 = false;
      this.isDataAvailable5 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;

    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements attempted") {
      this.isDataAvailable2 = false
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;
      this.subchart2Table2 = true;
      this.isDataAvailable3 = true;
      this.subchart2Table1 = false;
      this.subchart2Table3 = false;
      this.isDataAvailable4 = false;
      this.isDataAvailable5 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;


    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements not attempted") {
      this.isDataAvailable2 = false
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;
      this.isDataAvailable3 = true;
      this.subchart2Table3 = true
      this.subchart2Table2 = false;
      this.subchart2Table1 = false;
      this.isDataAvailable4 = false;
      this.isDataAvailable5 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;




    }
  }

  subchartThree(x) {
    console.log(x)
    var obj = {
      "projectId": x
    }
    // alert("aaa")
    this.defectdashboardService.subchartMadhu1(obj)
      .subscribe((data) => {
        console.log(data)
        this.testscriptData = data;
        console.log(this.testscriptData)
        this.executionCompleted = []
        this.executionInprogress = []
        var executedCount = 0;
        var inprogressCount = 0;
        for (var i = 0; i < this.testscriptData.length; i++) {
          if ((this.testscriptData[i].TestcaseCount) == (this.testscriptData[i].tscount)) {
            this.executionCompleted.push(this.testscriptData[i])
            executedCount++
          } else {
            this.executionInprogress.push(this.testscriptData[i])
            inprogressCount++
          }
        }
        // this.executionInprogress.push(this.testscriptData[2])
        console.log(this.executionCompleted, executedCount)
        console.log(this.executionInprogress, inprogressCount)
        this.subChartThreeData(this.testscriptData.length, executedCount, inprogressCount)
      })

  }
  testscriptData;
  reportsData;
  executionCompleted = [];
  executionInprogress = [];
  subChart3pieArray = []
  isDataAvailable4: boolean;

  subChartThreeData(x, y, z) {
    console.log(x, y, z)
    this.isDataAvailable1 = false
    this.isDataAvailable2 = false
    this.isDataAvailableTable = false;
    this.isDataAvailable3 = false;
    this.isDataAvailable4 = true;
    this.isDataAvailable5 = false;
    this.isDataAvailable6 = false;
    this.isDataAvailable7 = false;



    this.subChart3pieArray = []
    var subChart3pArray = ['subchart3', 'data'];
    var subChart3pArray1 = ['No of requirements attempted'];
    var subChart3pArray2 = ['No of requirements completed'];
    var subChart3pArray3 = ['No of requirements in-progress'];

    // var data = x;
    // console.log(data)
    var subChart3Array1 = x
    var subChart3Array2 = y
    var subChart3Array3 = z

    // console.log(subdataArray1,subdataArray2)
    this.subChart3pieArray.push(subChart3pArray);
    subChart3pArray1.push(subChart3Array1);
    subChart3pArray2.push(subChart3Array2);
    subChart3pArray3.push(subChart3Array3);

    this.subChart3pieArray.push(subChart3pArray1, subChart3pArray2, subChart3pArray3);
    console.log(this.subChart3pieArray);
    this.subChart3pieChart.dataTable = this.subChart3pieArray;
  }
  // subChartpieArray = [];

  public subChart3pieChart = {

    chartType: 'PieChart',
    dataTable: this.subChart3pieArray,
    options: {
      // legend: { position: 'left' },
      // slices: {
      //   0: { offset: 0.3 },
      //   1: { offset: 0.2 },
      // },
      width: '100%', height: 300,
      is3D: true,
      colors: ['#52D726', 'blue', 'red'],
      title: 'SubChart3',
      chartArea:{left:20,top:20,width:'100%',height:'75%'},
      pieSliceText: 'value',
      backgroundColor: {
        gradient: {
          color1: '#ddebef',
          color2: '#5391ea',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%',
          useObjectBoundingBoxUnits: true
        },
      },
      pieHole: 1.5,
          pieSliceTextStyle: {
            color: 'black',
          },
    },
  }

  subchart3Table1: boolean;
  subchart3Table2: boolean;
  subchart3Table3: boolean;

  public subChart3selectable(event: ChartSelectEvent) {
    if (event.selectedRowFormattedValues[0] === "No of requirements attempted") {
      this.isDataAvailable2 = false
      this.isDataAvailableTable = false;
      this.subchart1Table2 = false;
      this.isDataAvailable3 = false;
      this.subchart2Table1 = false;
      this.subchart2Table2 = false;
      this.subchart1Table3 = false;
      this.subchart2Table3 = false;
      this.isDataAvailable4 = true;
      this.subchart3Table1 = true;
      this.subchart3Table2 = false;
      this.subchart3Table3 = false;
      this.isDataAvailable5 = false;
      this.subchart4Table1 = false;
      this.subchart4Table2 = false;
      this.subchart4Table3 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;

    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements completed") {
      this.isDataAvailable2 = false
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;
      this.subchart2Table2 = false;
      this.isDataAvailable3 = false;
      this.subchart2Table1 = false;
      this.subchart2Table3 = false;
      this.isDataAvailable4 = true;
      this.subchart3Table1 = false;
      this.subchart3Table2 = true;
      this.subchart3Table3 = false;
      this.isDataAvailable5 = false;
      this.subchart4Table1 = false;
      this.subchart4Table2 = false;
      this.subchart4Table3 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;



    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements in-progress") {
      this.isDataAvailable2 = false
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;
      this.isDataAvailable3 = false;
      this.subchart2Table3 = false
      this.subchart2Table2 = false;
      this.subchart2Table1 = false;
      this.isDataAvailable4 = true;
      this.subchart3Table1 = false;
      this.subchart3Table2 = false;
      this.subchart3Table3 = true;
      this.isDataAvailable5 = false;
      this.subchart4Table1 = false;
      this.subchart4Table2 = false;
      this.subchart4Table3 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;



    }
  }
  isDataAvailable5: boolean;
  subchart4Table1: boolean;
  subchart4Table2: boolean;
  subchart4Table3: boolean;
  subChart4pieArray = []
  subchartPieFour(x, y, z) {
    console.log(x, y, z)
    this.isDataAvailable1 = false
    this.isDataAvailable2 = false
    this.isDataAvailableTable = false;
    this.isDataAvailable3 = false;
    this.isDataAvailable4 = false;
    this.isDataAvailable5 = true;
    this.isDataAvailable6 = false;
    this.isDataAvailable7 = false;



    this.subChart4pieArray = []
    var subChart4pArray = ['subchart3', 'data'];
    var subChart4pArray1 = ['No of requirements Executed'];
    var subChart4pArray2 = ['No of requirements Pass'];
    var subChart4pArray3 = ['No of requirements Fail'];

    // var data = x;
    // console.log(data)
    var subChart4Array1 = x
    var subChart4Array2 = y
    var subChart4Array3 = z

    // console.log(subdataArray1,subdataArray2)
    this.subChart4pieArray.push(subChart4pArray);
    subChart4pArray1.push(subChart4Array1);
    subChart4pArray2.push(subChart4Array2);
    subChart4pArray3.push(subChart4Array3);

    this.subChart4pieArray.push(subChart4pArray1, subChart4pArray2, subChart4pArray3);
    console.log(this.subChart4pieArray);
    this.subChart4pieChart.dataTable = this.subChart4pieArray;
  }
  // subChartpieArray = [];

  public subChart4pieChart = {

    chartType: 'PieChart',
    dataTable: this.subChart4pieArray,
    options: {
      width: '100%', height: 300,
      is3D: true,
      colors: ['#52D726', 'blue', 'red'],
      title: 'SubChart4',
      chartArea:{left:20,top:20,width:'100%',height:'75%'},
      pieSliceText: 'value',
      backgroundColor: {
        gradient: {
          color1: '#ddebef',
          color2: '#5391ea',
          x1: '0%', y1: '0%',
          x2: '100%', y2: '100%',
          useObjectBoundingBoxUnits: true
        },
      },
      pieHole: 1.5,
          pieSliceTextStyle: {
            color: 'black',
          },
    },
  }

  public subChart4selectable(event: ChartSelectEvent) {
    if (event.selectedRowFormattedValues[0] === "No of requirements Executed") {
      this.isDataAvailable2 = false
      this.isDataAvailableTable = false;
      this.subchart1Table2 = false;
      this.isDataAvailable3 = false;
      this.subchart2Table1 = false;
      this.subchart2Table2 = false;
      this.subchart1Table3 = false;
      this.subchart2Table3 = false;
      this.isDataAvailable4 = false;
      this.subchart3Table1 = false;
      this.subchart3Table2 = false;
      this.subchart3Table3 = false;
      this.isDataAvailable5 = true;
      this.subchart4Table1 = true;
      this.subchart4Table2 = false;
      this.subchart4Table3 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;

    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements Pass") {
      this.isDataAvailable2 = false
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;
      this.subchart2Table2 = false;
      this.isDataAvailable3 = false;
      this.subchart2Table1 = false;
      this.subchart2Table3 = false;
      this.isDataAvailable4 = false;
      this.subchart3Table1 = false;
      this.subchart3Table2 = false;
      this.subchart3Table3 = false;
      this.isDataAvailable5 = true;
      this.subchart4Table1 = false;
      this.subchart4Table2 = true;
      this.subchart4Table3 = false;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;



    }
    else if (event.selectedRowFormattedValues[0] === "No of requirements Fail") {
      this.isDataAvailable2 = false
      this.subchart1Table2 = false;
      this.isDataAvailableTable = false;
      this.subchart1Table3 = false;
      this.isDataAvailable3 = false;
      this.subchart2Table3 = false
      this.subchart2Table2 = false;
      this.subchart2Table1 = false;
      this.isDataAvailable4 = false;
      this.subchart3Table1 = false;
      this.subchart3Table2 = false;
      this.subchart3Table3 = false;
      this.isDataAvailable5 = true;
      this.subchart4Table1 = false;
      this.subchart4Table2 = false;
      this.subchart4Table3 = true;
      this.isDataAvailable6 = false;
      this.isDataAvailable7 = false;
    }
  }

}