'use server'

// import { generateDownloadUrl } from '@/utils/generate-download-url'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function uploadPost({
  aspectRatio,
  title,
  description,
  tags,
  publicId,
  image_url
}: { aspectRatio: string; title: string; description: string; tags: string[]; publicId: string; image_url: string }) {
  const supabase = createClient()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data) {
    redirect('/login?error=An error occurred while uploading the post')
  }

  const resp = await supabase
    .from('post')
    .insert({
      title,
      description,
      image_public_id: publicId,
      user_id: data.user.id,
      image_url: image_url,
      aspect_ratio: aspectRatio
    })
    .select()
    .single()

  if (resp.error) {
    throw new Error('An error occurred while uploading the post')
  }

  const postTagRelations = tags.map((tag) => ({
    post_id: resp.data.id,
    tag_id: tag
  }))

  const relation = await supabase.from('post_tag').insert(postTagRelations)

  if (relation.error) {
    await supabase.from('post').delete().eq('id', resp.data.id)
    throw new Error('An error occurred while uploading the post')
  }

  // console.log(fetch)
  // const getDownloadUrl = await fetch(generateDownloadUrl(image_url))

  // console.log(getDownloadUrl.status)

  redirect(`/photo/${resp.data.id}`)
}
