import { useCallback, useState } from 'react'
import { readFileAsText } from '@/lib/file-utils'
import { toast } from 'sonner'
import { pushBlog } from '../services/push-blog'
import { deleteBlog } from '../services/delete-blog'
import { useWriteStore } from '../stores/write-store'
import { useAuthStore } from '@/hooks/use-auth'
import { GITHUB_CONFIG } from '@/consts'

export function usePublish() {
	const { loading, setLoading, form, cover, images, mode, originalSlug } = useWriteStore()
	const { isAuth, setPrivateKey } = useAuthStore()
	const [commitUrl, setCommitUrl] = useState<string | null>(null)

	const onChoosePrivateKey = useCallback(
		async (file: File) => {
			const pem = await readFileAsText(file)
			setPrivateKey(pem)
		},
		[setPrivateKey]
	)

	const onPublish = useCallback(async () => {
		try {
			setLoading(true)
			setCommitUrl(null)
			const { commitSha } = await pushBlog({
				form,
				cover,
				images,
				mode,
				originalSlug
			})

			setCommitUrl(`https://github.com/${GITHUB_CONFIG.OWNER}/${GITHUB_CONFIG.REPO}/commit/${commitSha}`)
			toast.success('修改已提交，网站部署完成后生效', { duration: 8000 })
		} catch (err: any) {
			console.error(err)
			toast.error(err?.message || '操作失败')
		} finally {
			setLoading(false)
		}
	}, [form, cover, images, mode, originalSlug, setLoading])

	const onDelete = useCallback(async () => {
		const targetSlug = originalSlug || form.slug
		if (!targetSlug) {
			toast.error('缺少 slug，无法删除')
			return
		}
		try {
			setLoading(true)
			await deleteBlog(targetSlug)
		} catch (err: any) {
			console.error(err)
			toast.error(err?.message || '删除失败')
		} finally {
			setLoading(false)
		}
	}, [form.slug, originalSlug, setLoading])

	return {
		isAuth,
		commitUrl,
		loading,
		onChoosePrivateKey,
		onPublish,
		onDelete
	}
}
