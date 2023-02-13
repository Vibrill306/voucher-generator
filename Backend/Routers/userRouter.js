const express = require("express")
const userRouter = express.Router();
const userModel = require('../models/userModel')
const { getUser, updateUser, deleteUser, getAllUser } = require('../controller/userController');
const { signup, login, isAuthorised, protectRoute, forgetpassword, resetpassword } = require('../controller/authController');
const { logout } = require('../controller/authController')
const multer = require('multer');
const { updateProfileImage } = require('../controller/userController')

//user ke option

userRouter.route('/:id').patch(updateUser).delete(deleteUser)

userRouter
    .route('/signup')
    .post(signup)

// userRouter
//     .route('/signup2')
//     .get((req, res) => res.send('send123'))

// userRouter
//     .route('/ProfileImage')
//     .get((req, res) => {res.sendFile('D:\\krishna\\backend-start\\Vibrill-Hospitality\\Backend\\multer.html')})

userRouter
    .route('/login')
    .post(login)

userRouter
    .route('/logout')
    .get(logout)

userRouter
    .route('/forgetpassword')
    .post(forgetpassword)

userRouter
    .route('/resetpassword/:token')
    .post(resetpassword)

//multer for fileupload
// upload-> Storage(kaha upload hogi), filter
const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images')
    },
    filename: function (req, file, cb) {
        cb(null, `usr-${Date.now()}.jpeg`)
    }
});

const filter = function (req, file, cb) {
    if (file.mimetype.startsWith("image")) {
        cb(null, true)
    } else {
        cb(new Error("Not an Image! Please upload an image"), false)
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: filter
})

//profile page

// userRouter.use(protectRoute);

userRouter
    .route('/userProfile')
    .get(getUser)

userRouter.post('/ProfileImage', upload.single('photo'), (req, res) => { updateProfileImage });
//get request

userRouter
    .get('/ProfileImage', (req, res) => {
        console.log("hello")
        return res.sendFile('D:/krishna/backend-start/Vibrill-Hospitality/Backend/multer.html')
        // res.send("hello") 

    })


//admin specific function

// userRouter.use(isAuthorised(['admin']));
// userRouter
//     .route('/')
//     .get(getAllUser)



userRouter
    .route("/getCookies")
    .get(getCookies)

userRouter
    .route("/setCookies")
    .get(setCookies)



function setCookies(req, res) {
    // res.setHeader('Set-Cookie','isLoggedIn=true',{maxAge:1000*60*60*24, secure:true, httpOnly:true})
    res.cookie('isLoggedIn', true, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true });
    res.cookie('isPrimeMember', true)
    res.send('cookies has been set')
}

function getCookies(req, res) {
    let cookies = req.cookies.isLoggedIn;
    console.log('cookies:', cookies);
    res.send('cookies received')
}

module.exports = userRouter;