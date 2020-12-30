messagesList = []

const generateMessage = (username, text) => {
    messagesList.push(text)

    return {
        username,
        text,
        createdAt: new Date().getTime(),
        messagesList
    }
}

const generateLocationMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime(),
        messagesList
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}