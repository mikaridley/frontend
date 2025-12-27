import { httpService } from '../http.service'

const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
	getUsers,
	getById,
	remove,
	update,
	login,
	loginWithGoogle,
	signup,
	logout,
	getLoggedinUser,
	saveLoggedinUser,
}

function getUsers(filterBy = {}) {
	return httpService.get(`user`, filterBy)
}

async function getById(userId) {
	return await httpService.get(`user/${userId}`)
}

function remove(userId) {
	return httpService.delete(`user/${userId}`)
}

async function update({ _id, score }) {
	const user = await httpService.put(`user/${_id}`, { _id, score })

	const loggedinUser = getLoggedinUser()
	if (loggedinUser._id === user._id) saveLoggedinUser(user)

	return user
}

async function login(userCred) {
	const user = await httpService.post('auth/login', userCred)
	if (user) return saveLoggedinUser(user)
}

async function loginWithGoogle(userCred) {
	const user = await httpService.post('auth/google', userCred)
	if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
	if (!userCred.imgUrl) userCred.imgUrl = `https://avatar.oxro.io/avatar.svg?name=${userCred.fullname}&caps=1`

	const user = await httpService.post('auth/signup', userCred)
	return saveLoggedinUser(user)
}

async function logout() {
	sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
	return await httpService.post('auth/logout')
}

function getLoggedinUser() {
	return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
	user = {
		_id: user._id,
		email: user.email,
		fullname: user.fullname,
		imgUrl: user.imgUrl,
	}
	sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
	return user
}
