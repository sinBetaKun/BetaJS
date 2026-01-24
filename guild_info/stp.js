module.exports = {
    gldID : "1289828773436325998",
    chIDs : {
        role_description : "1292317475974680636",
        log : "1299245707848585236",
        authority_forum : "1292318672026865735",
    },
    roles : {
        choices : {
            stp_level : {
                beginer : '1289839032523558933',
                middle : '1289839761053454336',
                senior : '1289838778827018292',
            },
            ymme : {
                studying : '1289832840183418941',
                developer : '1289832456920502354',
            },
            debugger : {
                debugger : '1464571276281511946',
            },
            voter : {
                voter : '1464577325554471034',
            }
        },
        muted : '1299085759311118407'
    },
    send_err(message, client) {
        client.channels.cache.get(this.chIDs.log).send({
            content: message,
        });
    },
    send_log(message, client) {
        client.channels.cache.get(this.chIDs.log).send({
            content: message,
        });
    }
}