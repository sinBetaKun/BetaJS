module.exports = {
    gldID : '1343231695020888115',
    role : {
        dl : '1363751965712187405',
        up : '1363755362439659522',
        muted : '1450557756464697406',
    },
    chIDs : {
        d_ctgry : '1363773256473247776',
        cmn_apl : '1363752311448670268',
        cmn_apl_log : '1363753317880037497',
        uplder_list: '1363755658037563492',
        log : '1450562333331030068',
    },
    send_log(message, client) {
        client.channels.cache.get(this.chIDs.log).send({
            content: message,
        });
    }
}