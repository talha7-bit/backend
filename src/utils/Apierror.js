class Apierror extends Error{
    constructor(statusCode,message,errors=[]){
        super(message)
        this.statusCode=statusCode,
        this.errors=errors,
        this.data=null,
        this.success=false
    }
}


export {Apierror}