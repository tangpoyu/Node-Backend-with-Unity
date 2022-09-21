
const argon2i = require('argon2-ffi').argon2i;
const myCrypto = require('crypto');
const passwordRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,24})");

module.exports = function(app, mongoose) { 

    const Account = mongoose.model('accounts')
    app.post('/account/login', async (req, res) => {
            
            const { rusername, rpassword } = req.body;
    
            if (rusername == null || rpassword == null || rusername == "" || rpassword == "") {
                sendResponse(res,-1,"no input")
                return;
            }

            if(rusername.length < 8 || rusername.length > 24 || !passwordRegex.test(rpassword)){
                console.log("Invalid credentials");
                sendResponse(res,-2,"Invalid credentials.");
                return;
            }
    
            var userAccount = await Account.findOne({ username: rusername },'_id');
            if (userAccount != null) {
                var userAccount = await Account.findOne({ username: rusername },'permission username active password');
                argon2i.verify(userAccount.password, rpassword).then(async(isCorrect) => {
                    if (isCorrect) {
                        userAccount.lastAuthentication = Date.now();
                        await userAccount.save();
                        console.log("Retrieving account...");
                        sendResponse(res,0,"Retrieving account",(({_id,permission,username,active}) => ({_id,permission,username,active}))(userAccount));
                    } else {
                        console.log("password error")
                        sendResponse(res,-2,"Invalid credentials.");
                    }
                })
            } else {
                    console.log("username error")
                    sendResponse(res,-2,"Invalid credentials.");
            }
    })

    app.post('/account/create', async (req, res) => {
        const { rusername, rpassword } = req.body;

        if (rusername == null || rpassword == null || rusername == "" || rpassword == "") {
            console.log("no input");
            sendResponse(res,-1,"no input")
            return;
        }

        if(rusername.length < 8 || rusername.length > 24){
            console.log("Invalid credentials");
            sendResponse(res,-2,"Invalid credentials.");
            return;
        }

        if(!passwordRegex.test(rpassword)){
            console.log("Unsafe password");
            sendResponse(res,-3,"Unsafe password.");
            return;
        }

        var userAccount = await Account.findOne({ username: rusername },"_id");
        if (userAccount == null) {

            // Generate a unique salt which is array of 32 bytes for every account with function of randomByte of crypto 
            myCrypto.randomBytes(32, function(err, salt){

               // use the salt to hash the password with one way algorithm of argon2i.
                argon2i.hash(rpassword,salt).then(async(hashedPassword) => {
                    var newAccount = new Account({
                        permission: 0,
                        username: rusername,
                        password: hashedPassword,
                        lastAuthentication: Date.now(),
                        active: true
                    })
                    await newAccount.save();
                    console.log(newAccount);
                    console.log("Create new account...");
                    sendResponse(res,0,"Create new account...",(({_id,permission,username,active}) => ({_id,permission,username,active}))(newAccount))
                    return;
                })
            })

           
        } else {
            console.log("This username is taken");
            sendResponse(res,-2,"Invalid credentials.");
            return;
        }
})
}

function sendResponse(res,code, msg, data=null){
    var response = {};
    response.code = code;
    response.msg = msg;
    if(data != null) response.data = data;
    res.send(response);
}
