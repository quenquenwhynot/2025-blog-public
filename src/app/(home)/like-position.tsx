import LikeButton from '@/components/like-button'
import { ANIMATION_DELAY, CARD_SPACING } from '@/consts'
import { motion } from 'motion/react'
import { useCenterStore } from '@/hooks/use-center'
import { useConfigStore, useHomeLayoutStore } from './stores/config-store'
import { HomeDraggableLayer } from './home-draggable-layer'

export default function LikePosition() {
	const center = useCenterStore()
	const { cardStyles, siteContent } = useConfigStore()
	const styles = cardStyles.likePosition
	const hiCardStyles = cardStyles.hiCard
	const socialButtonsStyles = cardStyles.socialButtons
	const musicCardStyles = cardStyles.musicCard
	const { socialButtonsSize, musicHeight } = useHomeLayoutStore()
	const socialWidth = socialButtonsSize.width || socialButtonsStyles.width
	const socialHeight = socialButtonsSize.height || socialButtonsStyles.height
	const socialX = socialButtonsStyles.offsetX !== null ? center.x + socialButtonsStyles.offsetX : center.x + hiCardStyles.width / 2 - socialWidth
	const socialY = socialButtonsStyles.offsetY !== null ? center.y + socialButtonsStyles.offsetY : center.y + hiCardStyles.height / 2 + CARD_SPACING
	const musicX = musicCardStyles.offsetX !== null ? center.x + musicCardStyles.offsetX : socialX + socialWidth - musicCardStyles.width
	const musicY = musicCardStyles.offsetY !== null ? center.y + musicCardStyles.offsetY : socialY + socialHeight + CARD_SPACING

	const x = styles.offsetX !== null ? center.x + styles.offsetX : musicX + musicCardStyles.width + CARD_SPACING
	const y = styles.offsetY !== null ? center.y + styles.offsetY : musicY + ((musicHeight || musicCardStyles.height) - styles.height) / 2

	return (
		<HomeDraggableLayer cardKey='likePosition' x={x} y={y} width={styles.width} height={styles.height}>
			<motion.div
				className='absolute max-sm:static'
				style={{ width: styles.width, height: styles.height }}
				initial={{ left: x, top: y }}
				animate={{ left: x, top: y }}>
				{siteContent.enableChristmas && (
					<>
						<img
							src='/images/christmas/snow-13.webp'
							alt='Christmas decoration'
							className='pointer-events-none absolute'
							style={{ width: 40, left: -4, top: -4, opacity: 0.9 }}
						/>
					</>
				)}

				<LikeButton className='flex h-full w-full items-center justify-center p-0' delay={styles.order * ANIMATION_DELAY * 1000} />
			</motion.div>
		</HomeDraggableLayer>
	)
}
