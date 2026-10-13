'use client'

import { ANIMATION_DELAY } from '@/consts'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'
import { useSize } from '@/hooks/use-size'

interface Props {
	className?: string
	order: number
	width: number
	height?: number
	autoHeight?: boolean
	onHeightChange?: (height: number) => void
	x: number
	y: number
	children: React.ReactNode
}

export default function Card({ children, order, width, height, autoHeight, onHeightChange, x, y, className }: Props) {
	const { maxSM, init } = useSize()
	const cardRef = useRef<HTMLDivElement>(null)
	let [show, setShow] = useState(false)
	if (maxSM && init) order = 0

	useEffect(() => {
		if (show) return
		if (x === 0 && y === 0) return
		setTimeout(
			() => {
				setShow(true)
			},
			order * ANIMATION_DELAY * 1000
		)
	}, [x, y, show])

	useEffect(() => {
		const card = cardRef.current
		if (!card || !onHeightChange) return
		const update = () => onHeightChange(card.offsetHeight)
		update()
		const observer = new ResizeObserver(update)
		observer.observe(card)
		return () => observer.disconnect()
	}, [show, onHeightChange])

	const cardHeight = autoHeight ? 'auto' : height

	if (show)
		return (
			<motion.div
				ref={cardRef}
				className={cn('card squircle', className)}
				style={{ minHeight: autoHeight ? height : undefined }}
				initial={{ opacity: 0, scale: 0.6, left: x, top: y, width, height: cardHeight }}
				animate={{ opacity: 1, scale: 1, left: x, top: y, width, height: cardHeight }}
				whileHover={{ scale: 1.05 }}
				whileTap={{ scale: 0.95 }}>
				{children}
			</motion.div>
		)

	return null
}
