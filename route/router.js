const url = require('url');
const controller = require('../controllers/controller.js');

const router = {
    handleRequest: (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        if (pathname === '/') {
            controller.homeHandleRequest(req, res);
        } else if (pathname === '/login') {
            res.send('Login !')
            // controller.loginHandleRequest(req, res);
        } else if (pathname === '/logout') {
            res.send('Log out!')
            // controller.logoutHandleRequest(req, res);
        } else if (pathname === '/getToken') {
            res.send('Token!')
            // controller.getTokenHandleRequest(req, res);
        }else if (pathname === '/getUserDatas') {
            res.send('Get Datas !')
            // controller.getUserDatas(req, res);
        }
        // } else {
        //     const error = {
        //         status: 404,
        //         text: 'Page non trouvée',
        //     };
        //     controller.errorHandleRequest(req, res, error);
        // }
    }
};

module.exports = router;
