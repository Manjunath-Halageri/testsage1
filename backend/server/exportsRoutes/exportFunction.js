const path = require("path");

class MainExport {


    /*Logic Description:This function is used to Push the client project in to his Git Repository.
    intial it will init the folder
    add all the files 
    commit it
    and finally push the project
     */
    exportUserProjectTorepo(req, res) {
        // https://github.com/madhu2nv/myScript.git
        console.log("ssssssssssssssssssssssssssssssssss", req.body)
        const simplePath = path.join(__dirname, `../../uploads/export/${req.body.exportProjectName}`)
        const remote = `https://${req.body.userPassword}@${req.body.userGitRepo.split('://')[1]}`;
        console.log(remote)
        require('simple-git')(simplePath)
            .init()
            .addConfig("core.safecrlf", false, (err, doc) => {
                if (err) throw err;
                console.log("Configuration Updated Successfully")
            })
            .add('./*', (err) => {
                if (err) console.log(err)
                console.log("Files Added Successfully")
            })
            .commit(req.body.userComments, () => {
                console.log("Commit is Done")
            })
            .addRemote('origin', remote, (err) => {
                if (err) throw handelFatalError(err, res, simplePath)
                console.log("Add Remote Completed")
            })
            .push('origin', 'master', (err) => {
                if (err) throw handelRepositoryNotFound(err, res, simplePath);
                console.log("Push is Completed")
                res.json('Export Completed Please Check Your Repository...!!!')
            })
            .removeRemote('origin', () => { })
    }
}

/*Logic Description: This function handels the Repository Error like
-> Repository not found 
-> Invalid Credential
-> Access Denied to the User
*/
function handelRepositoryNotFound(err, res, simplePath) {
    require('simple-git')(simplePath)
        .removeRemote('origin', () => {
            console.log("ss ",err)
            if (err.includes("remote: Repository not found.")) {
                res.json({ Error: 'Repository not found' })
            }
            else if (err.includes("unable to access")) {
                res.json({ Error: 'Invalid Access Token.Please Try Again' })
            }
            else if (err.includes("remote: Permission")) {
                res.json({ Error: 'Sorry...!!!Access Denied to the User' })
            }
            else {
                res.json({ Error: 'Some Error has Encountered.Please Try Again' })
            }
        })
}//handelRepositoryNotFound

/*Logic Description: This function handels the Fatal  Errors like
-> remote origin already exists
*/
function handelFatalError(message, res, simplePath) {
    if (message.includes("fatal: remote origin already exists.")) {
        require('simple-git')(simplePath)
            .removeRemote('origin', () => {
                res.json({ Error: "Some Error Occured Please Try Again...!!!" })
            })
    }

}//handelFatalError
process.on('unhandledRejection', (reason, promise) => { })




module.exports = MainExport
