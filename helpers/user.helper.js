exports.signup={
        isValiedBody:(data)=>{
            if(!data.name || !(data.email || data.mobile) || !data.username){
                return false
            }
            return true
        }
    }