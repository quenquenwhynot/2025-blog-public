'use client'

import { KJUR } from 'jsrsasign'

export function readFileAsText(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => resolve(String(reader.result || ''))
		reader.onerror = reject
		reader.readAsText(file)
	})
}

export function fileToBase64NoPrefix(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.onload = () => {
			const dataUrl = String(reader.result || '')
			resolve(dataUrl.replace(/^data:[^;]+;base64,/, ''))
		}
		reader.onerror = reject
		reader.readAsDataURL(file)
	})
}

export async function hashFileSHA256(file: File): Promise<string> {
	const buf = await file.arrayBuffer()
	// Web Crypto is unavailable on HTTP pages. Keep image filenames stable there too.
	if (!globalThis.crypto?.subtle) {
		const fileHex = Array.from(new Uint8Array(buf), byte => byte.toString(16).padStart(2, '0')).join('')
		return KJUR.crypto.Util.hashHex(fileHex, 'sha256').slice(0, 16)
	}
	const digest = await globalThis.crypto.subtle.digest('SHA-256', buf)
	const bytes = new Uint8Array(digest)
	let hex = ''
	for (let i = 0; i < bytes.length; i++) {
		const h = bytes[i].toString(16).padStart(2, '0')
		hex += h
	}
	return hex.slice(0, 16)
}
