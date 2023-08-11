module.exports = function (app) {
    var db = require('../dbDeclarations').url;

    console.log("Test Data Generation server is working ")

    app.get('/testDataTypeDetails', (req, res) => {
        db.autoGenerate.find({}, (err, doc) => {
            console.log(req.body);
            res.json(doc);
            console.log(doc)
        })
    })
}