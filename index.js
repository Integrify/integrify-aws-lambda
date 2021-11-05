var IntegrifyLambda = function(config) {
    this.inputs = config.inputs || [];
    this.outputs = config.outputs || [];
    this.execute = config.execute;
    this.config = config
    this.icon = config.icon;
    this.helpUrl = config.helpUrl;
    this.handler = async (event, context, callback) => {
        var me = this;

        switch(event.operation) {

            //get the task icon used for this task image for the task
            case 'config.getIcon':
                if (callback) {
                    callback(null, me.icon);
                } else {
                    return me.icon;
                }
               
                break;

            //optional help url that will be displayed in Integrify
            case 'config.getHelpUrl':
               
                if (callback) {
                    callback(null, me.helpUrl);
                } else {
                    return me.helpUrl;
                }
                break;

            //your function must include the getInputs method which should return and array of JSON objects representing the data expected by your 'execute' function (see below)
            //you would call getInputs when configuring the task to get the fields that you can prefill
            case 'config.getInputs':
                if (callback) {
                    callback(null, me.inputs);
                } else {
                    return me.inputs;
                }
              
                break;
            //your function must include the getOutputs method which should return and array of JSON objects representing the data retruned by your 'execute' function (see below)
            //you would call getOutputs when configuring a task to get the fields to capture
            case 'config.getOutputs':
                if (callback) {
                    callback(null, me.outputs);
                } else {
                    return me.outputs;
                }
               
                break;
            //your function must include the execute method which should return a JSON object with key:value pairs based on the output variables described in getOutputs (see above)
            // pur task engine would call execute and pass inputs to use in your handler funtion
            case 'runtime.execute':
                if (callback) {
                    me.execute(event, context, function(err,result){
                        return callback(err,result);
    
                    })
                } else {
                    return await me.execute(event,context);
                }
                
                break;

            default:
                return callback('invalid operation');

        }
    }

}
module.exports = IntegrifyLambda;