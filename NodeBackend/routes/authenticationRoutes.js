
module.exports = function(app, mongoose) { 
    const Account = mongoose.model('accounts')
    app.get('/account', async (req, res) => {
            const { rusername, rpassword } = req.query;
    
            if (rusername == null || rpassword == null) {
                res.send("Invalid credentials")
                return;
            }
    
            var userAccount = await Account.findOne({ username: rusername });
            if (userAccount == null) {
                console.log("Create new account...");
                var newAccount = new Account({
                    username: rusername,
                    password: rpassword,
                    lastAuthentication: Date.now()
                })
                await newAccount.save();
                res.send(newAccount);
                return;
            } else {
                if (rpassword == userAccount.password) {
                    userAccount.lastAuthentication = Date.now();
                    await userAccount.save();
                    console.log("Retrieving account...");
                    res.send(userAccount);
                } else {
                    res.send("Invalid credentials")
                }
            }
    })
}
