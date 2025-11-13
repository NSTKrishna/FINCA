const prisma = require('../db/config');

const access = async (req, res) => {
    const {email , password} = req.body;
    try 
    {
        const user = await prisma.user.findUnique({
            where : {
                email : email
            }
        })
    }
    catch (err) {
        res.status(500).json({message : "Server error"});
    }
}