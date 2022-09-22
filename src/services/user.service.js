import { storageService } from './async-storage.service'
// import { httpService } from './http.service'
import { store } from '../store/store'
import { getActionSetWatchedUser } from '../store/review.actions'
import { socketService, SOCKET_EVENT_USER_UPDATED, SOCKET_EMIT_USER_WATCH } from './socket.service'
import { showSuccessMsg } from '../services/event-bus.service'


const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getLoggedinUser,
    saveLocalUser,
    getUsers,
    getById,
    remove,
    update,
    changeScore,
    getUsers,
    getMembers
}

window.userService = userService

function getUsers() {
    return storageService.query('user')
    // return httpService.get(`user`)
}

function onUserUpdate(user) {
    showSuccessMsg(`This user ${user.fullname} just got updated from socket, new score: ${user.score}`)
    store.dispatch(getActionSetWatchedUser(user))
}

async function getById(userId) {
    const user = await storageService.get('user', userId)
    // const user = await httpService.get(`user/${userId}`)

    socketService.emit(SOCKET_EMIT_USER_WATCH, userId)
    socketService.off(SOCKET_EVENT_USER_UPDATED, onUserUpdate)
    socketService.on(SOCKET_EVENT_USER_UPDATED, onUserUpdate)

    return user
}
function remove(userId) {
    return storageService.remove('user', userId)
    // return httpService.delete(`user/${userId}`)
}

async function update(user) {
    await storageService.put('user', user)
    // user = await httpService.put(`user/${user._id}`, user)
    // Handle case in which admin updates other user's details
    if (getLoggedinUser()._id === user._id) saveLocalUser(user)
    return user;
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)
    // const user = await httpService.post('auth/login', userCred)
    if (user) {
        socketService.login(user._id)
        return saveLocalUser(user)
    }
}


async function signup(userCred) {
    console.log('userCred service:', userCred)

    const user = await storageService.post('user', userCred)
    // const user = await httpService.post('auth/signup', userCred)
    socketService.login(user._id)
    return saveLocalUser(user)
}
async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    socketService.logout()
    // return await httpService.post('auth/logout')
}

async function changeScore(by) {
    const user = getLoggedinUser()
    if (!user) throw new Error('Not loggedin')
    user.score = user.score + by || by
    await update(user)
    return user.score
}


function saveLocalUser(user) {
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

// ;(async ()=>{
//     await userService.signup({fullname: 'Puki Norma', username: 'user1', password:'123',score: 10000, isAdmin: false})
//     await userService.signup({fullname: 'Master Adminov', username: 'admin', password:'123', score: 10000, isAdmin: true})
//     await userService.signup({fullname: 'Muki G', username: 'muki', password:'123', score: 10000})
// })()
function getMembers() {
    return gUsers
}

const gUsers = [
    {
        _id: '1011',
        fullname: 'Eldad Yikne',
        img: `https://res.cloudinary.com/dwdpgwxqv/image/upload/v1663583512/sprint%204%20/T03E3RZ2KHV-U03GZ4S8P7C-0dcebbbdbc4f-512_tlntp4.jpg
        `
    },
    {
        _id: '1012',
        fullname: 'Dekel Ido',
        img: `https://res.cloudinary.com/dwdpgwxqv/image/upload/v1663583549/sprint%204%20/T03E3RZ2KHV-U03KC7A8R6F-97b018241b8a-512_ougkz6.jpg
        `
    },
    {
        _id: '1013',
        fullname: 'Yaara Yehuda',
        img: `https://res.cloudinary.com/dwdpgwxqv/image/upload/v1663583460/sprint%204%20/T03E3RZ2KHV-U03KVHTDXAR-77f29bd19fdf-512_vqrj3l.jpg
        `
    },
    {
        _id: '1014',
        fullname: 'Roi Yotvat',
        img: `https://res.cloudinary.com/dwdpgwxqv/image/upload/v1663583580/sprint%204%20/T03E3RZ2KHV-U03HE9ZJTA6-79c26a7781c8-512_m1ydbz.png
        `
    },
]
