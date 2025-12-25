import { httpService } from './http.service'

export const uploadService = {
	uploadImg,
	uploadFile,
}

/**
 * Upload an image file via backend API
 * @param {Event} ev - File input event
 * @param {Object} options - Upload options (folder, resource_type, public_id)
 * @returns {Promise<Object>} Upload result with url, public_id, width, height, etc.
 */
async function uploadImg(ev, options = {}) {
	const file = ev.target.files[0]
	if (!file) throw new Error('No file selected')

	return uploadFile(file, options)
}

/**
 * Upload a file via backend API
 * @param {File} file - File to upload
 * @param {Object} options - Upload options (folder, resource_type, public_id)
 * @returns {Promise<Object>} Upload result with url, public_id, width, height, etc.
 */
async function uploadFile(file, options = {}) {
	const formData = new FormData()
	formData.append('file', file)
	
	// Add optional parameters
	if (options.folder) formData.append('folder', options.folder)
	if (options.resource_type) formData.append('resource_type', options.resource_type)
	if (options.public_id) formData.append('public_id', options.public_id)

	try {
		const response = await httpService.post('upload', formData)
		
		// Backend returns: { success: true, data: { url, public_id, width, height, ... } }
		if (response.success && response.data) {
			// Return in format compatible with existing code (secure_url for backward compatibility)
			return {
				secure_url: response.data.url,
				url: response.data.url,
				public_id: response.data.public_id,
				width: response.data.width,
				height: response.data.height,
				format: response.data.format,
				resource_type: response.data.resource_type,
				bytes: response.data.bytes
			}
		}
		throw new Error('Invalid response from upload service')
	} catch (err) {
		console.error('Upload error:', err)
		throw err
	}
}