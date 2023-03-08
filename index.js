const { SNSClient, PublishCommand } = require("@aws-sdk/client-sns");
const { hostname } = require("os");

const app_module = (function getParent(m){
    return (m.parent && getParent(m.parent)) || m;
})(module);
require('pkginfo')(app_module);

let Configured_Options = null;
let SNS = null;

function critical(message_or_error){
    if(!Configured_Options){
        console.error(new Error("critical() not configured yet!"), message_or_error);
        return;
    }

    const params = Object.assign({}, Configured_Options);
    let error_info = {};
    if(message_or_error.stack){
        error_info = message_or_error;
    }else{
        Error.captureStackTrace(error_info, critical);
    }
    params.Message = `${message_or_error} \n(stack:${error_info.stack})`;
    console.error(`${params.Subject} ${params.Message}`);

    SNS.send(new PublishCommand(params)).catch(err => {
        console.error("SNS send failed", err);
    });
}

critical.configure = function(options){
    if(Configured_Options){
        console.error(new Error("critical() configuration overwritten"));
    }
    Configured_Options = Object.assign({}, options);
    
    // the region option is used when constructing SNS, the others when
    // publishing
    const region = Configured_Options.region;
    delete Configured_Options.region;

    SNS = new SNSClient({region:region});

    Configured_Options.Subject =
        Configured_Options.Subject ||
        `Error on ${hostname()} ${process.env.NODE_ENV} in ${app_module.exports.name} ${app_module.exports.version}`;
};


process.on('uncaughtException', function(err){
    try{
        critical(err);
    }catch(e){
        console.error("Error handling uncaught error", e);
        console.error("The original error was", err);
    }
});

module.exports = critical
