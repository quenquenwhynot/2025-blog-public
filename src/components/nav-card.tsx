'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { House } from 'lucide-react'
import { useCenterStore } from '@/hooks/use-center'
import { ANIMATION_DELAY, CARD_SPACING } from '@/consts'
import ScrollOutlineSVG from '@/svgs/scroll-outline.svg'
import ScrollFilledSVG from '@/svgs/scroll-filled.svg'
import ProjectsFilledSVG from '@/svgs/projects-filled.svg'
import ProjectsOutlineSVG from '@/svgs/projects-outline.svg'
import AboutFilledSVG from '@/svgs/about-filled.svg'
import AboutOutlineSVG from '@/svgs/about-outline.svg'
import ShareFilledSVG from '@/svgs/share-filled.svg'
import ShareOutlineSVG from '@/svgs/share-outline.svg'
import WebsiteFilledSVG from '@/svgs/website-filled.svg'
import WebsiteOutlineSVG from '@/svgs/website-outline.svg'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useSize } from '@/hooks/use-size'
import { useConfigStore } from '@/app/(home)/stores/config-store'
import { HomeDraggableLayer } from '@/app/(home)/home-draggable-layer'

const list = [
	{ icon: ScrollOutlineSVG, iconActive: ScrollFilledSVG, label: '近期文章', href: '/blog' },
	{ icon: ProjectsOutlineSVG, iconActive: ProjectsFilledSVG, label: '我的项目', href: '/projects' },
	{ icon: AboutOutlineSVG, iconActive: AboutFilledSVG, label: '关于网站', href: '/about' },
	{ icon: ShareOutlineSVG, iconActive: ShareFilledSVG, label: '推荐分享', href: '/share' },
	{ icon: WebsiteOutlineSVG, iconActive: WebsiteFilledSVG, label: '优秀博客', href: '/bloggers' }
]

export default function NavCard() {
	const pathname = usePathname()
	const center = useCenterStore()
	const { maxSM, init } = useSize()
	const { siteContent, cardStyles } = useConfigStore()
	const styles = cardStyles.navCard
	const hiCardStyles = cardStyles.hiCard
	const sidebarFits = center.x - hiCardStyles.width / 2 - styles.width - CARD_SPACING >= 16
	const form = maxSM || (pathname === '/' && !sidebarFits) ? 'icons' : pathname === '/' ? 'full' : pathname.startsWith('/write') ? 'mini' : 'icons'
	const [hoveredHref, setHoveredHref] = useState<string | null>(null)
	const [contentHeight, setContentHeight] = useState(0)
	const navRef = useRef<HTMLElement>(null)
	const contentRef = useRef<HTMLDivElement>(null)
	const activeHref = list.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`))?.href

	// Fit the actual content, including larger browser fonts, inside the navigation card.
	useEffect(() => {
		if (!init || form !== 'full' || !contentRef.current || !navRef.current) return
		const content = contentRef.current
		const nav = navRef.current
		const measure = () => {
			const padding = getComputedStyle(nav)
			setContentHeight(
				Math.ceil(
					content.offsetHeight +
						parseFloat(padding.paddingTop) +
						parseFloat(padding.paddingBottom) +
						parseFloat(padding.borderTopWidth) +
						parseFloat(padding.borderBottomWidth)
				)
			)
		}
		const observer = new ResizeObserver(measure)
		observer.observe(content)
		measure()
		return () => observer.disconnect()
	}, [form, init])

	useEffect(() => {
		setHoveredHref(null)
	}, [pathname])

	if (!init) return null

	const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
	const availableHeight = styles.offsetY !== null ? center.height - (center.y + styles.offsetY) - 16 : center.y + hiCardStyles.height / 2 - 16
	const fullHeight = Math.min(Math.max(styles.height, contentHeight), Math.max(240, availableHeight))
	const width =
		form === 'full' ? styles.width : form === 'mini' ? Math.max(96, rootFontSize * 6) : Math.min(Math.max(360, rootFontSize * 22.5), center.width - 32)
	const height = form === 'full' ? fullHeight : 64
	const x =
		form === 'full'
			? styles.offsetX !== null
				? center.x + styles.offsetX
				: center.x - hiCardStyles.width / 2 - width - CARD_SPACING
			: maxSM
				? center.x - width / 2
				: 24
	const y = form === 'full' ? (styles.offsetY !== null ? center.y + styles.offsetY : Math.max(16, center.y + hiCardStyles.height / 2 - height)) : 16

	const navigation = (
		<motion.nav
			ref={navRef}
			aria-label='主导航'
			className={cn('card z-20', form === 'full' ? 'squircle overflow-x-hidden overflow-y-auto' : 'flex items-center gap-1 rounded-3xl! p-2!')}
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.2, delay: styles.order * ANIMATION_DELAY }}
			style={{ left: x, top: y, width, height: form === 'full' ? height : undefined, minHeight: form === 'full' ? undefined : 64 }}>
			{form === 'full' ? (
				<div ref={contentRef}>
					{siteContent.enableChristmas && (
						<img
							src='/images/christmas/snow-4.webp'
							alt=''
							className='pointer-events-none absolute'
							style={{ width: 160, left: -18, top: -20, opacity: 0.9 }}
						/>
					)}
					<Link
						href='/'
						aria-label='首页'
						aria-current='page'
						title='返回首页'
						className='focus-visible:outline-brand flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4'>
						<Image src='/images/avatar.png' alt='' width={40} height={40} className='shrink-0 rounded-full' />
						<span className='font-averia min-w-0 truncate text-2xl leading-none font-medium'>{siteContent.meta.title}</span>
					</Link>
					<div className='text-secondary mt-5 mb-2 text-sm uppercase'>General</div>
					<div className='flex flex-col gap-1.5'>
						{list.map(item => {
							const highlighted = hoveredHref === item.href
							const Icon = highlighted ? item.iconActive : item.icon
							return (
								<Link
									key={item.href}
									href={item.href}
									onMouseEnter={() => setHoveredHref(item.href)}
									onMouseLeave={() => setHoveredHref(null)}
									className={cn(
										'focus-visible:outline-brand flex min-h-11 shrink-0 items-center gap-3 rounded-full px-3 py-2 text-base transition-colors focus-visible:outline-2',
										highlighted ? 'text-primary bg-white/80' : 'text-secondary hover:bg-white/60'
									)}>
									<Icon aria-hidden='true' className={cn('h-7 w-7 shrink-0', highlighted && 'text-brand')} />
									<span className='min-w-0 truncate'>{item.label}</span>
								</Link>
							)
						})}
					</div>
				</div>
			) : (
				<>
					<Link
						href='/'
						aria-label='首页'
						aria-current={pathname === '/' ? 'page' : undefined}
						title='返回首页'
						className={cn(
							'focus-visible:outline-brand flex h-11 min-w-0 items-center justify-center gap-1.5 rounded-full transition-colors focus-visible:outline-2',
							maxSM ? 'flex-1' : form === 'mini' ? 'w-full' : 'shrink-0 px-2',
							pathname === '/' ? 'text-brand bg-white/80' : 'text-secondary hover:text-brand hover:bg-white/80'
						)}>
						{maxSM ? (
							<Image src='/images/avatar.png' alt='' width={32} height={32} className='shrink-0 rounded-full' />
						) : (
							<House aria-hidden='true' className='h-6 w-6 shrink-0' />
						)}
						{!maxSM && <span className='text-sm font-medium whitespace-nowrap'>首页</span>}
					</Link>
					{form === 'icons' &&
						list.map(item => {
							const active = activeHref === item.href
							const Icon = active || hoveredHref === item.href ? item.iconActive : item.icon
							return (
								<Link
									key={item.href}
									href={item.href}
									aria-label={item.label}
									aria-current={active ? 'page' : undefined}
									title={item.label}
									onMouseEnter={() => setHoveredHref(item.href)}
									onMouseLeave={() => setHoveredHref(null)}
									className={cn(
										'focus-visible:outline-brand flex h-11 min-w-0 flex-1 items-center justify-center rounded-full transition-colors focus-visible:outline-2',
										active ? 'text-brand bg-white/80' : 'text-secondary hover:text-brand hover:bg-white/80'
									)}>
									<Icon aria-hidden='true' className='h-7 w-7 max-w-full' />
								</Link>
							)
						})}
				</>
			)}
		</motion.nav>
	)

	return form === 'full' ? (
		<HomeDraggableLayer cardKey='navCard' x={x} y={y} width={width} height={height}>
			{navigation}
		</HomeDraggableLayer>
	) : (
		navigation
	)
}
