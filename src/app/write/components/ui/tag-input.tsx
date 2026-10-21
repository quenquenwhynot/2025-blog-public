import { useState } from 'react'

type TagInputProps = {
	tags: string[]
	onChange: (tags: string[]) => void
}

export function TagInput({ tags, onChange }: TagInputProps) {
	const [tagInput, setTagInput] = useState<string>('')

	const handleAddTag = () => {
		const tag = tagInput.trim()
		if (!tag) return
		if (!tags.includes(tag)) onChange([...tags, tag])
		setTagInput('')
	}

	const handleRemoveTag = (index: number) => {
		onChange(tags.filter((_, i) => i !== index))
	}

	return (
		<div className='bg-card w-full rounded-lg border px-3 py-2'>
			{tags.length > 0 && (
				<div className='mb-2 flex flex-wrap gap-2'>
					{tags.map((tag, index) => (
						<span key={index} className='flex items-center gap-1.5 rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-700'>
							#{tag}
							<button type='button' onClick={() => handleRemoveTag(index)} className='text-secondary'>
								×
							</button>
						</span>
					))}
				</div>
			)}
			<input
				type='text'
				placeholder='添加标签（回车或离开输入框保存）'
				className='w-full bg-transparent text-sm outline-none'
				value={tagInput}
				onChange={e => setTagInput(e.target.value)}
				onBlur={handleAddTag}
				onKeyDown={e => {
					if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) {
						e.preventDefault()
						handleAddTag()
					}
				}}
			/>
		</div>
	)
}
