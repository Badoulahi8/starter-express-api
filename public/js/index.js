import { Login } from "./compenent/login.js";
import { Home } from "./compenent/home.js";
import {Fetch } from "./compenent/fetch.js";

addEventListener('DOMContentLoaded', async () => {
    try {
        var datas = await Fetch("/getToken");
        if (datas.success) {
            Home(datas.token)
        } else {
            Login()
        }
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});