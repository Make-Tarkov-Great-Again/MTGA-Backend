'use strict'
const { logger, FastifyResponse, writeFile } = require("../utilities");


module.exports = async function notifierRoutes(app, opt) {

    // Client Notifier Routes //
    app.post("/client/WebSocketAddress", async (request, reply) => {
        return FastifyResponse.zlibReply(
            reply,
            FastifyResponse.getWebSocketUrl()
        );
    });

    app.post("/client/notifier/channel/create", async (request, reply) => {
        const sessionID = await FastifyResponse.getSessionID(request)
        return FastifyResponse.zlibJsonReply(
            reply,
            FastifyResponse.applyBody(FastifyResponse.getNotifier(sessionID))
        );
    });

    app.post("/:sessionID", async (request, reply) => {
        logger.logError("NOTIFIER GET HIT");
            return FastifyResponse.zlibJsonReply(
                reply,
                FastifyResponse.applyBody("ok")
        );
    });

    app.get("/socket", { websocket: true }, async (connection, request, reply) => {
        logger.logError("NOTIFIER getwebsocket GET HIT");
        connection.socket.on('message', message => {
            connection.socket.send('NOTIFIER message HIT')
        })

        connection.socket.on('upgrade', message => {
            connection.socket.send('NOTIFIER upgrade HIT')
        })
    });
};
