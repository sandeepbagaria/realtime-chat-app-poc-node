const socket = io()

let temp = -1

// Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
// const $searchForm = document.querySelector('#search-form')
// const $searchFormInput = $searchForm.querySelector('input')


// Templates
const messageTemplate1 = document.querySelector('#message-template1').innerHTML
const messageTemplate2 = document.querySelector('#message-template2').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

// query string
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

let messagesList = []

const autoScroll = () => {
    // const $newMessage = $messages.lastElementChild

    // const newMessageStyles = getComputedStyle($newMessage)
    // const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    // const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // const visibleHeight = $messages.offsetHeight

    // // this is height of messages container
    // const containerHeight = $messages.scrollHeight

    // const scrollOffset = $messages.scrollTop + visibleHeight

    // if(containerHeight - newMessageHeight <= scrollOffset) {
    //     $messages.scrollTop = $messages.scrollHeight
    // }
    $messages.scrollTop = $messages.scrollHeight
}

socket.on('message', (message) => {
    // messagesList =  message.messagesList
    // if(temp != -1) {
    //     console.log($messages.getElementsByClassName('real-message')[temp].innerHTML)
    // }
    if(message.username === 'Admin') {
        const html = Mustache.render(messageTemplate1, { 
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm:ss')
    })
        $messages.insertAdjacentHTML('beforeend', html)
        autoScroll()
    } else {
        const html = Mustache.render(messageTemplate2, { 
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('H:mm:ss')
    })
        temp = temp + 1;
        $messages.insertAdjacentHTML('beforeend', html)
        autoScroll()
    }
})

socket.on('locationMessage', (locationMessage) => {
    const html = Mustache.render(locationTemplate, { 
        username: locationMessage.username,
        locationURL: locationMessage.text,
        createdAt: moment(locationMessage.createdAt).format('H:mm:ss')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users,
        count: users.length
    })
    document.querySelector('#sidebar').innerHTML = html
})

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    // Disable button after clicking on send button
    $messageFormButton.setAttribute('disabled', 'disabled')   
    
    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ""
        $messageFormInput.focus()
        if(error) {
            console.log(error)
        }
        console.log('Message delivered!')
    })
})

$locationButton.addEventListener('click', () => {
    
    // Condition to check if Geolocation is supported by your browser or not
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            lat : position.coords.latitude,
            long: position.coords.longitude
        }, () => {
            $locationButton.removeAttribute('disabled')
        })
    })
})

socket.emit('join', {
    username, room
}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})

// const searchMessages = () => {
//     console.log($searchFormInput)
// }