'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/card'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore, useHomeLayoutStore } from './stores/config-store'
import { CARD_SPACING } from '@/consts'
import shareList from '@/app/share/list.json'
import Link from 'next/link'
import { HomeDraggableLayer } from './home-draggable-layer'

type ShareItem = {
	name: string
	url: string
	logo: string
	description: string
	tags: string[]
	stars: number
}

export default function ShareCard() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const [randomItem, setRandomItem] = useState<ShareItem | null>(null)
	const styles = cardStyles.shareCard
	const hiCardStyles = cardStyles.hiCard
	const socialButtonsStyles = cardStyles.socialButtons
	const socialSize = useHomeLayoutStore(state => state.socialButtonsSize)
	const socialWidth = socialSize.width || socialButtonsStyles.width
	const socialHeight = socialSize.height || socialButtonsStyles.height
	const [contentHeight, setContentHeight] = useState(styles.height)

	useEffect(() => {
		const randomIndex = Math.floor(Math.random() * shareList.length)
		setRandomItem(shareList[randomIndex])
	}, [])

	if (!randomItem) {
		return null
	}

	const x =
		styles.offsetX !== null
			? center.x + styles.offsetX
			: socialButtonsStyles.offsetX !== null
				? center.x + socialButtonsStyles.offsetX
				: center.x + hiCardStyles.width / 2 - Math.max(socialWidth, socialButtonsStyles.width)
	const socialY = socialButtonsStyles.offsetY !== null ? center.y + socialButtonsStyles.offsetY : center.y + hiCardStyles.height / 2 + CARD_SPACING
	const y = styles.offsetY !== null ? center.y + styles.offsetY : socialY + socialHeight + CARD_SPACING

	return (
		<HomeDraggableLayer cardKey='shareCard' x={x} y={y} width={styles.width} height={contentHeight}>
			<Card order={styles.order} width={styles.width} height={styles.height} autoHeight onHeightChange={setContentHeight} x={x} y={y}>
				{siteContent.enableChristmas && (
					<>
						<img
							src='/images/christmas/snow-12.webp'
							alt='Christmas decoration'
							className='pointer-events-none absolute'
							style={{ width: 120, left: -12, top: -12, opacity: 0.8 }}
						/>
					</>
				)}

				<h2 className='text-secondary text-sm'>随机推荐</h2>

				<Link href='/share' className='mt-2 block space-y-2'>
					<div className='flex items-center'>
						<div className='relative mr-3 h-12 w-12 shrink-0 overflow-hidden rounded-xl'>
							<img src={randomItem.logo} alt={randomItem.name} className='h-full w-full object-contain' />
						</div>
						<h3 className='min-w-0 text-sm font-medium [overflow-wrap:anywhere]'>{randomItem.name}</h3>
					</div>

					<p className='text-secondary text-xs [overflow-wrap:anywhere]'>{randomItem.description}</p>
				</Link>
			</Card>
		</HomeDraggableLayer>
	)
}
