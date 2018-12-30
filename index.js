var AWS = require('aws-sdk');
var os = require('os');

var app_module = (function getParent(m){
    return (m.parent && getParent(m.parent)) || m;
})(module);
require('pkginfo')(app_module);

var Configured_Options = null;
var SNS = null;

function critical(message_or_error){
    if(!Configured_Options){
        console.error(new Error("critical() not configured yet!"), message);
        return;
    }

    var params = Object.assign({}, Configured_Options);
    var error_info = {};
    if(message_or_error.stack){
        error_info = message_or_error;
    }else{
        Error.captureStackTrace(error_info, critical);
    }
    params.Message = `${message_or_error} \n(stack:${error_info.stack})`;
    console.error(`${params.Subject} ${params.Message}`);
    SNS.publish(params, function(err){
        if(err) console.error("SNS send failed", err);
    })
}

critical.configure = function(options){
    if(Configured_Options){
        console.error(new Error("critical() configuration overwritten"));
    }
    Configured_Options = Object.assign({}, options);
    
    // the region option is used when constructing SNS, the others when
    // publishing
    var region = Configured_Options.region;
    delete Configured_Options.region;

    SNS = new AWS.SNS({region:region});

    Configured_Options.Subject =
        Configured_Options.Subject ||
        `Error on ${os.hostname()} ${process.env.NODE_ENV} in ${app_module.exports.name} ${app_module.exports.version}`;
};


process.on('uncaughtException', function(err){
    try{
        critical(err);
    }catch(e){
        console.error("Error handling uncaught error", e);
        console.error("The original error was", err);
    }
});

module.exports = critical;
