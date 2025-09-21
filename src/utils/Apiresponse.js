class Apiresponse{
    constructor(statusCode,data,message,errors){
        this.statusCode=statusCode,
        this.message=message,
        this.data=data,
        this.success=true,
        this.errors=null
    }
}

export {Apiresponse}