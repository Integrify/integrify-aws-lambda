var IntegrifyLambda = function(config) {
    this.inputs = config.inputs || [];
    this.outputs = config.outputs || [];
    this.execute = config.execute;
    this.config = config
    this.handler = (event, context, callback) => {
        var me = this;

        switch(event.operation) {
            //your function must include the getInputs method which should return and array of JSON objects representing the data expected by your 'execute' function (see below)
            //you would call getInputs when configuring the task to get the fields that you can prefill
            case 'config.getInputs':

                callback(null, me.inputs);
                break;
            //your function must include the getOutputs method which should return and array of JSON objects representing the data retruned by your 'execute' function (see below)
            //you would call getOutputs when configuring a task to get the fields to capture
            case 'config.getOutputs':

                callback(null, me.outputs);
                break;
            //your function must include the execute method which should return a JSON object with key:value pairs based on the output variables described in getOutputs (see above)
            // pur task engine would call execute and pass inputs to use in your handler funtion
            case 'runtime.execute':
                me.execute(event, context, function(err,result){
                    return callback(err,result);

                })
                break;

            default:
                return callback('invalid operation');

        }
    }

}
module.exports = IntegrifyLambda;