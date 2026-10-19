'use client'

import { useEffect, useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/zh-cn'

dayjs.extend(utc)

export function getBlogTime(date: Date = new Date()) {
	// Capture the visitor's local wall time, then use UTC calendar arithmetic.
	// This keeps the calendar consistent even when browser timezone overrides
	// make local date construction and getTimezoneOffset disagree.
	const localTime = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds())
	return dayjs.utc(localTime).locale('zh-cn')
}

export function getVisitorTimeZone() {
	try {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || ''
	} catch {
		return ''
	}
}

export function useBlogTime(interval = 1000) {
	// Wait until mount so prerendered dates never appear as the current time.
	const [snapshot, setSnapshot] = useState<{ time: Dayjs; timeZone: string } | null>(null)

	useEffect(() => {
		const update = () => setSnapshot({ time: getBlogTime(), timeZone: getVisitorTimeZone() })
		update()
		const timer = window.setInterval(update, interval)
		window.addEventListener('focus', update)
		document.addEventListener('visibilitychange', update)

		return () => {
			window.clearInterval(timer)
			window.removeEventListener('focus', update)
			document.removeEventListener('visibilitychange', update)
		}
	}, [interval])

	return { time: snapshot?.time ?? null, timeZone: snapshot?.timeZone ?? '' }
}
