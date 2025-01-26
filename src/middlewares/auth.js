const adminAuth = (req, res, next) => {
        console.log("Admin is checking here...")
        const token = "xyz";
        const isAdminAuthorized = (token === "xyz");
        if(!isAdminAuthorized){
          res.status(401).send("unAuthorized")
        }else {
          next();
        }
      }

module.exports = {
    adminAuth
}