const { database } = require("../../../app");
const { profile } = require("../../models/profile");
const utilities = require("../../utilities");
const { getBody } = require("../../utilities");
const { fastifyResponse } = require("../../utilities/fastifyResponse");
const logger = require("../../utilities/logger");


class gameController {
    constructor() {
    }

    // JET Basics //
    static modeOfflinePatches = async (request = null, reply = null) => {
        return await fastifyResponse.zlibJsonReply(reply, database.core.serverConfig.Patches);
    }

    static modeOfflinePatchNodes = async (request = null, reply = null) => {
        return await fastifyResponse.zlibJsonReply(reply, database.core.serverConfig.PatchNodes)
    }
    // Game //

    static clientGameStart = async (request = null, reply = null) => {
        let playerProfile = profile.get(await fastifyResponse.getSessionID(request));
        if (playerProfile) {
            return await fastifyResponse.zlibJsonReply
                (
                    reply,
                    fastifyResponse.applyBody
                    (
                        {utc_time: Date.now() / 1000},
                        0,
                        null
                    )
                )
        } else {
            return await fastifyResponse.zlibJsonReply
            (
                reply, 
                fastifyResponse.applyBody
                (
                    {utc_time: Date.now() / 1000}, 
                    999, 
                    "Profile Not Found!!"
                )
            )
        }
    }

    static clientGameVersionValidate = async (request = null, reply = null) => {
        logger.logInfo("Client connected with version: " + request.body.version.major);
        return await fastifyResponse.zlibJsonReply
        (
            reply, 
            fastifyResponse.applyBody(null)
        )
    }

    static clientGameConfig = async (request = null, reply = null) => {
        const sessionID = await fastifyResponse.getSessionID(request);
        const responseObject = {
            queued: false,
            banTime: 0,
            hash: "BAN0",
            lang: "en",
            ndaFree: false,
            reportAvailable: true,
            languages: database.languages,
            aid: sessionID,
            token: sessionID,
            taxonomy: 6,
            activeProfileId: "pmc" + sessionID,
            nickname: "user",
            backend: {
              Trading: fastifyResponse.getBackendURL(),
              Messaging: fastifyResponse.getBackendURL(),
              Main: fastifyResponse.getBackendURL(),
              RagFair: fastifyResponse.getBackendURL(),
            },
            totalInGame: 0,
            utc_time: utilities.getCurrentTimestamp(),
        }

        return await fastifyResponse.zlibJsonReply
        (
            reply, 
            fastifyResponse.applyBody(responseObject)
        )
    }
}

module.exports.gameController = gameController;