import { storageService } from '../async-storage.service'

const LOGGEDIN_USER_KEY = 'loggedinUser'
const USERS_KEY = 'users'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    getLoggedinUser,
    _saveLoggedinUser,
}

async function getUsers(filterUsers = {}) {
    let users = await storageService.query(USERS_KEY)

    if (filterUsers.txt) {
        const regExp = new RegExp(filterUsers.txt, 'i')
        users = users.filter(user => regExp.test(user.email) || regExp.test(user.fullname))
    }

    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get(USERS_KEY, userId)
}

function remove(userId) {
    return storageService.remove(USERS_KEY, userId)
}


async function login(userCred) {
    const users = await storageService.query(USERS_KEY)
    const user = users.find(user => user.email === userCred.email)

    if (user) return _saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'

    const user = await storageService.post(USERS_KEY, userCred)
    return _saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(LOGGEDIN_USER_KEY)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(LOGGEDIN_USER_KEY))
}

function _saveLoggedinUser(user) {
    user = {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
    }
    sessionStorage.setItem(LOGGEDIN_USER_KEY, JSON.stringify(user))
    return user
}