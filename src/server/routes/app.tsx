import * as React from "react";
import * as express from "express";
import * as fs from "fs";
import { LoadState, ReduxState } from "../../common/typings";
import buildDb from "../db/buildDb";
import { getUserProfile } from "../services/userService";
import { renderToString } from "react-dom/server";
import { configureStore } from "../../common/redux/store";
import { AppStatic } from "../../common/AppStatic";

const router = express.Router();

// These are the first level paths (e.g, /something) that don't have SSR
const firstLevelNonSsrPaths = ["search"];

/**
 * Function  that actually sends the application to the client
 */
function sendApp(req: express.Request, res: express.Response, preloadedHtml: string = null, preloadedState: object = null) {
    const composedState = {...preloadedState, ...{loggedUser: req.user}};
    fs.readFile("src/common/index.html", "utf8", (error, data) => {
        let result = data;
        result = result.replace(/\{css\}/g, () => "");
        result = result.replace(/\{js\}/g, () => "http://localhost:8080/bundle.js");
        result = result.replace(/\{preloadedState\}/g, () => JSON.stringify(composedState));
        result = result.replace(/\{html\}/g, () => preloadedHtml || "");
        res.status(200).send(result);
    });
}

for (const path of firstLevelNonSsrPaths) {
    router.route(`/${path}`).get((req, res) => sendApp(req, res));
}

router.route("/:userName").get(async (req, res) => {
    const db = await buildDb();
    const userName = req.params.userName;
    const user = await db.user.findOne({name: userName});
    const userProfile = await getUserProfile(db, user);
    const reduxState: ReduxState = {
        loggedUser: req.user,
        profile: {
            loadState: LoadState.LOADED,
            data: userProfile,
        },
    };
    const store = configureStore(reduxState);
    const preloadedHtml = renderToString(<AppStatic location={req.originalUrl} store={store}/>);
    sendApp(req, res, preloadedHtml, reduxState);
});

/**
 * Wild-card route
 */
router.route("*").get((req, res) => sendApp(req, res));

export default router;