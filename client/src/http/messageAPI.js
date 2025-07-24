import { $host } from './index'

export const createMessage = async (formData) => {
    const { data } = await $host.post('message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
}
