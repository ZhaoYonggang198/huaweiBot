class Request {
    constructor(req) {
        this._body = req;
    }

    get body() {
        return this._body;
    }

    get session() {
        return this.body.session;
    }

    get isNewSession() {
        return this.session.isNew
    }

    get sessionId() {
        return this.session.sessionId
    }

    get endpoint() {
        return this.body.endpoint
    }

    get appId() {
        return this.endpoint.auth.application.appId;
    }

    get deviceId() {
        return this.endpoint.device.deviceId;
    }

    get userId() {
        return this.endpoint.auth.user.userId
    }

    get inquire() {
        return this.body.inquire;
    }    

    get intent() {
        return this.inquire.intent;
    }

    get intentName() {
        if (!this.intentzz) return null;
        return this.intent.name;
    }

    get inquireId() {
        return this.inquire.inquireId;
    }

    get utterance() {
        return this.inquire.utterance;
    }

    get utteranceType() {
        return this.utterance.type;
    }

    get utteranceOrigin() {
        return this.utterance.origin
    }
}

module.exports = Request;