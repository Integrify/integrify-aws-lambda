#integrify-aws-lambda [![Build Status](https://travis-ci.org/Integrify/integrify-aws-lambda.svg?branch=master)](https://travis-ci.org/Integrify/integrify-aws-lambda)


### A Node module that makes creating Integrify compatible AWS Lambda functions easier.
Integrify AWS Lambda Tasks can be used in an Integrify Process to execute custom code. Integrify will trigger the *execute* function defined in the configuration object
 and pass inputs to it in the *event* object from the Integrify Process. Your Lambda function may return outputs to the Integrify Process synchronously or asynchronously. 

## Installation:
`npm install integrify-aws-lambda`

## Usage:

**Basic example**
~~~~
//require this module
var integrifyLambda = require('integrify-aws-lambda');

//create a new Integrfiy AWS Lambda object passing in a configuration object with inputs, outputs and your execute function 
var myLambda = new integrifyLambda({
    helpUrl: "https://help.for.my.function",
    inputs: [{key:"userName", type:"string"}],
    outputs:[{key:"message", type:"string"}],
    execute: (event, context, callback) => {
        "use strict";
        callback(null, {message: 'Hello there ' + event.inputs.userName});
    }

});

//Export the handler function of the new object
exports.handler = myLambda.handler
~~~~

**Package for AWS:**

Zip your function.js file and node_modules folder. See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-create-deployment-pkg.html
 
##API

###IntegrifyLambda(`config`)
Generate a Handler function based on the AWS Lambda specification for Node.js 4.3 (http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html)

* `config` - (Object) Required configuration object needed to generate your Lambda handler
    * `inputs` - (Optional) An Array of objects that define a *key* and *type*. This is used by Integrify when configuring and executing your Lambda task.
        * `key` - (Required) the name that Integrify should give the value it passes into your function `{userName: "Bob"}`
        * `type` - (Required) the data type of the value that your function is expecting. `string|numeric|date`
    * `outputs` - (Optional) An Array of objects that define a *key* and *type*. This is used by Integrify when configuring and when mapping outputs back into your Lambda Task after executing.
        * `key` - (Required) the name of the value that your function will return to Integrify `{message: "Bob"}`
        * `type` - (Required) the data type of the value that Integrify should expect as a result of executing your function.  `string|numeric|date`
    * `execute(event, context, callback`  - (Required) the function to execute
        * `event` - passed in by AWS when triggered by Integrify. This will expose the *inputs* passed to your function by integrify `event.inputs.userName`
        * `context` - passed in by AWS when triggered. See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
        * `callback` - passed in by AWS when triggered. Used to return values or an error. See http://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-handler.html
 
## Example
 ~~~~

 const IntegrifyLambda = require('integrify-aws-lambda')
 
 const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
 const config = {
    inputs: [{key:"name", type:"string", min:0, max:10},
        {key:"targetDate", type:"date", required:true},
        {key:"birthday", type:"date", required:true}
    ],
    outputs: [{key:"name", type:"string", min:0, max:10},
        {key:"age", type:"int"},
        {key:"ageAtTargetYear", type:"numeric"},
        {key:"daysLived", type:"numeric"},
        {key:"message", type: "string"}
    ],
    icon: "https://daily.integrify.com/integrify/resources/css/taskshapes/counter.svg",
    helpUrl: "http://www.integrify.com",
    execute: async function(event, context){
        var returnVals = {};
        try {
            let _age = _calculateAge(new Date(event.inputs.birthday));
            returnVals.age = _age;
            let _daysLived = _age * 365;
            returnVals.daysLived = _daysLived;
            let _ageAtTargetYear = _calculateAge(new Date(event.inputs.birthday), new Date(event.inputs.targetDate));
            returnVals.ageAtTargetYear = _ageAtTargetYear;
            let _message  = `Hi ${event.inputs.name}. You are ${_age} years old. You have lived ${_daysLived} days. You will be ${_ageAtTargetYear} on ${new Date(event.inputs.targetDate)}.`
            returnVals.message = _message;
           
            await delay(1);
            return returnVals;

        } catch(e){
            throw new Error('birthday and targetDate are required and must be a valid date.');
        }
    }
}
 
 let _calculateAge = function _calculateAge(birthday, target) {
     // birthday is a date. target is a date, is optional and defaults to today
     var endDate = target ? target : Date.now();
     var ageDifMs = endDate - birthday.getTime();
     var ageDate = new Date(ageDifMs); // miliseconds from epoch
     return Math.abs(ageDate.getUTCFullYear() - 1970);
 }
 
 
 let myLambda = new IntegrifyLambda(config)
 
 exports.handler = myLambda.handler;
~~~~