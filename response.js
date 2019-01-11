const ErrorRepsonse = require('./error')

class Response {
    constructor() {
        this._body = {
            version : "1.0",
            reply: {
                speech: {
                    type: "text",
                    text: "",
                    ssml: ""
                },
                isEndSession: false,
                commands: []
            },
            errorCode: "0",
            errorMessage: "ok"
        }
    }

    speak(text) {
        this._body.reply.speech = {
            type: 'text',
            text,
            ssml: ''
        }
        return this;        
    }

    reply(text) {
        return this.speak(text);
    }
    
    playAudio(url, token, offsetMs) {
        let command = {
            head: {
                namespace: 'AudioPlayer',
                name: 'play'
            },
            body: {
                playBehavior: '',
                stream: {
                    url,
                    token,
                    posInMilliSeconds: offsetMs
                }
            }
        }
        return this.appendToCommands(command)
    }

    stopAudio() {
        let command = {
            head: {
                namespace: 'AudioPlayer',
                name: 'stop'
            }
        }
        return this.appendToCommands(command)
    }

    setPlayMode(mode) {
        let command = {
            head: {
                namespace: 'AudioPlayer',
                name: 'stop'
            },
            body: {
                playMode: mode
            }
        }
        return this.appendToCommands(command)
    }

    setAuthStatus(authStatus) {
        let command = {
            head: {
                namespace: 'Authorization',
                name: 'AuthStatus'
            },
            body: {
                AuthStatus: authStatus
            }
        }
    }

    appendToCommands(item) {
        if (!this._body.reply.hasOwnProperty('commands')) {
            this._body.response['commands'] = [item];
            return this;
        }
        this._body.response.commands.push(item);
        return this;        
    }

    closeSession(flag = true) {
        this._body.reply.isEndSession = flag;
        return this;
    }

    setError(error) {
        this._body.errorCode = ErrorRepsonse[error].errorCode
        this._body.errorMessage = ErrorRepsonse[error].errorMessage
        return this;
    }

    get body() {
        return this._body;
    }
}

module.exports = Response;