
const argon2i = require('argon2-ffi').argon2i;
const myCrypto = require('crypto');

module.exports = function(app, mongoose) { 

    const Account = mongoose.model('accounts')
    app.post('/account/login', async (req, res) => {
            const { rusername, rpassword } = req.body;
    
            if (rusername == null || rpassword == null || rusername == "" || rpassword == "") {
                console.log("no input");
                res.send("-1") // no input
                return;
            }
    
            var userAccount = await Account.findOne({ username: rusername });
            if (userAccount != null) {
                argon2i.verify(userAccount.password, rpassword).then(async(isCorrect) => {
                    if (isCorrect) {
                        userAccount.lastAuthentication = Date.now();
                        await userAccount.save();
                        console.log("Retrieving account...");
                        res.send(userAccount);
                    } else {
                        console.log("password error")
                        res.send("-2") // password error
                    }
                })
            } else {
                    console.log("username error")
                    res.send("-2") // username error
            }
    })

    app.post('/account/create', async (req, res) => {
        const { rusername, rpassword } = req.body;

        if (rusername == null || rpassword == null || rusername == "" || rpassword == "") {
            console.log("no input");
            res.send("-1") // no input
            return;
        }

        var userAccount = await Account.findOne({ username: rusername });
        if (userAccount == null) {

            // Generate a unique salt which is array of 32 bytes for every account with function of randomByte of crypto 
            myCrypto.randomBytes(32, function(err, salt){

               // use the salt to hash the password with one way algorithm of argon2i.
                argon2i.hash(rpassword,salt).then(async(hashedPassword) => {
                    var newAccount = new Account({
                        permission: 0,
                        username: rusername,
                        password: hashedPassword,
                        salt: salt,
                        lastAuthentication: Date.now(),
                        active: true
                    })
                    await newAccount.save();
                    console.log("Create new account...");
                    res.send(newAccount);
                    return;
                })
            })

           
        } else {
            console.log("This username is taken");
            res.send("-2"); //This username is taken.
            return;
        }
})
}

