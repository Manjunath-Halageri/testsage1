import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';


@Injectable({
    providedIn: 'root'
})

export class PerformanceObjectsService {
    httpRequest = {
        "-guiclass": "HttpTestSampleGui",
        "-testclass": "HTTPSamplerProxy",
        "-testname": "",
        "-enabled": "true",
        "elementProp": [
            {
                "-name": "HTTPsampler.Arguments",
                "-elementType": "Arguments",
                "collectionProp": {
                    "-name": "Arguments.arguments",
                    "-self-closing": "true",
                    "elementProp": []
                }
            },
            {
                "#item": {
                    "boolProp": [
                        {
                            "-name": "HTTPSampler.follow_redirects",
                            "#text": "true"
                        },
                        {
                            "-name": "HTTPSampler.use_keepalive",
                            "#text": "true"
                        }
                    ]
                }
            },
            {
                "#item": {
                    "stringProp": [
                        {
                            "-name": "HTTPSampler.protocol",
                            "#text": ""
                        },
                        {
                            "-name": "HTTPSampler.domain",
                            "#text": ""
                        },
                        {
                            "#item": {
                                "intProp": {
                                    "-name": "HTTPSampler.port",
                                    "#text": "0"
                                }
                            }
                        },
                        {
                            "-name": "HTTPSampler.path",
                            "#text": ""
                        },
                        {
                            "-name": "HTTPSampler.method",
                            "#text": "GET"
                        }
                    ]
                }
            },
            {
                "-name": "HTTPSampler.header_manager",
                "-elementType": "HeaderManager",
                "-guiclass": "HeaderPanel",
                "-testclass": "HeaderManager",
                "-testname": "HTTP Header manager",
                "-enabled": "true",
                "collectionProp": {
                    "-name": "HeaderManager.headers",
                    "elementProp": [
                        {
                            "-name": "",
                            "-elementType": "Header",
                            "stringProp": [
                                {
                                    "-name": "Header.name",
                                    "#text": "test"
                                },
                                {
                                    "-name": "Header.value",
                                    "#text": "data"
                                }
                            ]
                        }
                    ]
                }
            }

        ]
    }
    httpHeader = {
        'collectionProp': {
            'elementProp': [
                {
                    'stringProp': [
                        {
                            '#text': ''
                        },
                        {
                            '#text': ''
                        }
                    ]
                }
            ]
        }
    }

    fileUploads = {
        "-name": "HTTPsampler.Files",
        "-elementType": "HTTPFileArgs",
        "collectionProp": {
            "-name": "HTTPFileArgs.files",
            "elementProp": [
                {
                    "-name": "",
                    "-elementType": "HTTPFileArg",
                    "stringProp": [
                        {
                            "-name": "File.path",
                            "#text": "D://ggggg"
                        },
                        {
                            "-name": "File.paramname",
                            "#text": "testt"
                        },
                        {
                            "-name": "File.mimetype"
                        }
                    ]
                }
            ]
        }
    }
    uniformTimer = {
        "#item": {
            "UniformRandomTimer": {
                "-guiclass": "UniformRandomTimerGui",
                "-testclass": "UniformRandomTimer",
                "-testname": "Uniform Random Timer",
                "-enabled": "true",
                "doubleProp": {
                    "name": "RandomTimer.range",
                    "value": "",
                    "savedValue": "0.0"
                },
                "stringProp": [
                    {
                        "-name": "ConstantTimer.delay",
                        "#text": ""
                    },
                    {
                        "-name": "TestPlan.comments",
                        "#text": "Recorded time was 0 milliseconds"
                    }
                ]
            }
        }
    }
    constantTimer = {
        "#item": {
            "ConstantTimer": {
                "-guiclass": "ConstantTimerGui",
                "-testclass": "ConstantTimer",
                "-testname": "Constant Timer",
                "-enabled": "true",
                "stringProp": {
                    "-name": "ConstantTimer.delay",
                    "#text": ""
                }
            }
        }
    }

    reqHeader1 = {
        "-name": "HTTPSampler.header_manager",
        "-elementType": "HeaderManager",
        "-guiclass": "HeaderPanel",
        "-testclass": "HeaderManager",
        "-testname": "HTTP Header manager",
        "-enabled": "true",
        "collectionProp": {
            "-name": "HeaderManager.headers",
            "elementProp": [
                {
                    "-name": "",
                    "-elementType": "Header",
                    "stringProp": [
                        {
                            "-name": "Header.name",
                            "#text": "test"
                        },
                        {
                            "-name": "Header.value",
                            "#text": "data"
                        }
                    ]
                }
            ]
        }
    }

    reqHeader2 = {
        "HeaderManager": {
            "-guiclass": "HeaderPanel",
            "-testclass": "HeaderManager",
            "-testname": "HTTP Header manager",
            "-enabled": "true",
            "collectionProp": {
                "-reference": "../../../HTTPSamplerProxy/elementProp[2]/collectionProp",
                "-self-closing": "true"
            }
        }
    }

    reqTimer = {
        "#item": {
            "timer1": false,
            "timer2": false,
            "assertions": [],
            "regEx":[],
            "hashTree": [
                {
                    "HeaderManager": {
                        "-guiclass": "HeaderPanel",
                        "-testclass": "HeaderManager",
                        "-testname": "HTTP Header manager",
                        "-enabled": "true",
                        "collectionProp": {
                            "-reference": "../../../HTTPSamplerProxy[1]/elementProp[2]/collectionProp",
                            "-self-closing": "true"
                        }
                    },
                    "hashTree": [
                        {
                            "-self-closing": "true"
                        }
                    ]
                }
            ]
        }
    }

    csvFile = {
        "#item": {
            "CSVDataSet": {
                "-guiclass": "TestBeanGUI",
                "-testclass": "CSVDataSet",
                "-testname": "CSV Data Set Config",
                "-enabled": "true",
                "stringProp": [
                    {
                        "-name": "filename",
                        "#text": ""
                    },
                    {
                        "-name": "fileEncoding"
                    },
                    {
                        "-name": "variableNames"
                    },
                    {
                        "#item": {
                            "boolProp": {
                                "-name": "ignoreFirstLine",
                                "#text": "false"
                            }
                        }
                    },
                    {
                        "-name": "delimiter",
                        "#text": ","
                    },
                    {
                        "#item": {
                            "boolProp": [
                                {
                                    "-name": "quotedData",
                                    "#text": "false"
                                },
                                {
                                    "-name": "recycle",
                                    "#text": "true"
                                },
                                {
                                    "-name": "stopThread",
                                    "#text": "false"
                                }
                            ]
                        }
                    },
                    {
                        "-name": "shareMode",
                        "#text": "shareMode.all"
                    }
                ]
            }
        }
    }
    transactionController1 = {
        "-guiclass": "TransactionControllerGui",
        "-testname": "Transaction Controller",
        "-enabled": "true",
        "boolProp": {
            "-name": "TransactionController.includeTimers",
            "#text": "false"
        }
    }

    transactionController2 = {
        "#item": {
            "hashTree": [
                {
                    "HTTPSamplerProxy": []
                }
            ]
        }
    }

    viewResultTree = {
        "#item": {
            "ResultCollector": {
                "-guiclass": "ViewResultsFullVisualizer",
                "-testclass": "ResultCollector",
                "-testname": "View Results Tree",
                "-enabled": "true",
                "boolProp": {
                    "-name": "ResultCollector.error_logging",
                    "#text": "false"
                },
                "objProp": {
                    "name": "saveConfig",
                    "value": {
                        "-class": "SampleSaveConfiguration",
                        "time": "true",
                        "latency": "true",
                        "timestamp": "true",
                        "success": "true",
                        "label": "true",
                        "code": "true",
                        "message": "true",
                        "threadName": "true",
                        "dataType": "true",
                        "encoding": "true",
                        "assertions": "true",
                        "subresults": "true",
                        "responseData": "true",
                        "samplerData": "true",
                        "xml": "true",
                        "fieldNames": "true",
                        "responseHeaders": "true",
                        "requestHeaders": "true",
                        "responseDataOnError": "false",
                        "saveAssertionResultsFailureMessage": "true",
                        "assertionsResultsToSave": "0",
                        "bytes": "true",
                        "sentBytes": "true",
                        "url": "true",
                        "fileName": "true",
                        "hostname": "true",
                        "threadCounts": "true",
                        "sampleCount": "true",
                        "idleTime": "true",
                        "connectTime": "true"
                    }
                },
                "stringProp": {
                    "-name": "filename",
                    "#text": "D:\\resultTree.xml"
                }
            }
        }
    }

    samplerResult = {
        "tn": "",
        "t": "",
        "ct": "",
        "lt": "",
        "by": "",
        "sby": "",
        "sc": "",
        "ec": "",
        "dt": "",
        "rc": "",
        "rm": "",
        "ts": "",
        "date": "",
        "requestHeader": {
            "content": ""
        },
        "responseHeader": {
            "content": ""
        },
        "responseData": {
            "content": ""
        },
        "method": {
            "content": ""
        },
        "java.net.URL": "",
        "queryString": {
            "content": ""
        },
        "cookies": {
            "content": ""
        }
    }

    listenerObj = {
        "#item": {
            "ResultCollector": {
                "-guiclass": "ViewResultsFullVisualizer",
                "-testclass": "ResultCollector",
                "-testname": "View Results Tree",
                "-enabled": "true",
                "boolProp": {
                    "-name": "ResultCollector.error_logging",
                    "#text": "false"
                },
                "objProp": {
                    "name": "saveConfig",
                    "value": {
                        "-class": "SampleSaveConfiguration",
                        "time": "true",
                        "latency": "true",
                        "timestamp": "true",
                        "success": "true",
                        "label": "true",
                        "code": "true",
                        "message": "true",
                        "threadName": "true",
                        "dataType": "true",
                        "encoding": "true",
                        "assertions": "true",
                        "subresults": "true",
                        "responseData": "true",
                        "samplerData": "true",
                        "xml": "true",
                        "fieldNames": "true",
                        "responseHeaders": "true",
                        "requestHeaders": "true",
                        "responseDataOnError": "false",
                        "saveAssertionResultsFailureMessage": "true",
                        "assertionsResultsToSave": "0",
                        "bytes": "true",
                        "sentBytes": "true",
                        "url": "true",
                        "fileName": "true",
                        "hostname": "true",
                        "threadCounts": "true",
                        "sampleCount": "true",
                        "idleTime": "true",
                        "connectTime": "true"
                    }
                },
                "stringProp": {
                    "-name": "filename",
                    "#text": "viewResultTree.xml"
                }
            }
        }
    }

    responseAssertion = {
        "#item": {
            "ResponseAssertion": {
                "-guiclass": "AssertionGui",
                "-testclass": "ResponseAssertion",
                "-testname": "Response Assertion",
                "-enabled": "true",
                "collectionProp": {
                    "-name": "Asserion.test_strings",
                    "-self-closing": "true",
                    "stringProp": []
                },
                "stringProp": [
                    {
                        "-name": "Assertion.custom_message"
                    },
                    {
                        "-name": "Assertion.test_field",
                        "#text": "Assertion.response_data"
                    },
                    {
                        "-name": "Assertion.scope",
                        "#text": "parent"
                    }
                ],
                "boolProp":
                {
                    "-name": "Assertion.assume_success",
                    "#text": "false"
                },
                "intProp":
                {
                    "-name": "Assertion.test_type",
                    "#text": "16"
                }
            }
        }
    }

    assertionObj = {
        "failure": false,
        "name": "Response Assertion",
        "error": false,
        "failureMessage": ""
    }

    regExObj = {
        "#item": {
            "RegexExtractor": {
                "-guiclass": "RegexExtractorGui",
                "-testclass": "RegexExtractor",
                "-testname": "Regular Expression Extractor",
                "-enabled": "true",
                "stringProp": [
                    {
                        "-name": "RegexExtractor.useHeaders",
                        "#text": "false"
                    },
                    {
                        "-name": "RegexExtractor.refname",
                        "#text": ""
                    },
                    {
                        "-name": "RegexExtractor.regex",
                        "#text": ""
                    },
                    {
                        "-name": "RegexExtractor.template",
                        "#text": ""
                    },
                    {
                        "-name": "RegexExtractor.default"
                    },
                    {
                        "-name": "RegexExtractor.match_number",
                        "#text": ""
                    },
                    {
                        "-name": "Sample.scope",
                        "#text": "all"
                    }
                ]
            }
        }
    }
}