'use server'

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
    redirect('/login')
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
    console.log(resp.error)
    throw new Error('An error occurred while uploading the post')
  }

  const postTagRelations = tags.map((tag) => ({
    post_id: resp.data.id,
    tag_id: tag
  }))

  const relation = await supabase.from('post_tag').insert(postTagRelations)

  if (relation.error) {
    console.log(relation.error)
    await supabase.from('post').delete().eq('id', resp.data.id)
    throw new Error('An error occurred while uploading the post')
  }

  redirect(`/photo/${resp.data.id}`)
}
