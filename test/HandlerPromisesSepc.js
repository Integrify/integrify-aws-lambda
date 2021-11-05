

var IntegrifyLambda = require("../index.js");
var expect = require("expect")

let _calculateAge = function _calculateAge(birthday, target) {
    // birthday is a date. target is a date, is optional and defaults to today
    var endDate = target ? target : Date.now();
    var ageDifMs = endDate - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
var config = {
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

//create an instance of the IntegrifyLambda with the config
let myLambda = new IntegrifyLambda(config);

describe('promise tests suite', function() {
    it("should return config.inputs", async function() {
        var event = {"operation": "config.getInputs"}
        const result = await myLambda.handler(event, null)
       
        expect(result.length).toBeGreaterThan(0);

        

    });

    it("should return config.getHelp", async function() {
        var event = {"operation": "config.getHelpUrl"}
        const result = await myLambda.handler(event, null)
        expect(result.length).toBeGreaterThan(0);

        

    });


    it("should return config.outputs", async function() {
        var event = {"operation": "config.getOutputs"}
        const result = await myLambda.handler(event, null)
        expect(result.length).toBeGreaterThan(0);


    });

    it("should return config.icon", async function() {
        var event = {"operation": "config.getIcon"}
        const result = await myLambda.handler(event, null)
        expect(result.indexOf(".svg")).toBeGreaterThan(0);

    });

    it("should execute and return values", async() => {
        var event = { "operation": "runtime.execute",
            "inputs": {
                "name": "Awsome Developer",
                "birthday": "1968-02-07",
                "targetDate": "2025-01-01" }
        }

        const result = await myLambda.handler(event, null);
        console.log(result)
        expect(result.age).toBeGreaterThan(0);
    
    });

})