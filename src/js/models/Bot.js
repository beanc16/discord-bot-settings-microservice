class Bot
{
    constructor({
        _id,
        appId,
        servers,
        data,
    })
    {
        if (_id)
        {
            this._id = _id;
        }

        this.appId = appId;
        this.servers = servers;
        this.data = (data) ? data : {};
    }
}



module.exports = Bot;
