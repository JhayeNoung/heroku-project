const config = require('config');

// set zero to process.exit(0) means success, anything is a failure
module.exports = function(){
    if(!config.get("privateKey")){
        console.log("FATAL ERROR: privateKey is not defined.");
        // exit(1) means exit the process 
        process.exit(1);
    }
}