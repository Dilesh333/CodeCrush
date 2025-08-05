const e = require("express")
const validator = require("validator")

const validateSignupData = (req) =>{

    const {firstName,lastName,emailId,password} =req.body

    if(!firstName || !lastName){
        throw new Error("Name is not valid")
    }else if(!validator.isEmail(emailId)){
        throw new Error("Please Enter a valid Email")
    }else if(!validator.isStrongPassword(password)){
        throw new Error("Please Enter a stong Password ")
    }
}

module.exports = {
    validateSignupData
}