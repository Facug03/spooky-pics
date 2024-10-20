'use server'

import { createClient } from '@/utils/supabase/server'

export const updateLike = async (post_id: number, like: boolean): Promise<{ error: string | null; success: boolean }> => {
  const supabase = createClient()

  const { data: dataUser, error: errorUser } = await supabase.auth.getUser()

  if (errorUser) {
    return {
      error: 'An error has ocurred',
      success: false
    }
  }

  if (like) {
    const { error: errorLike } = await supabase.from('like').insert({ post_id, user_id: dataUser.user.id })

    if (errorLike) {
      return {
        error: 'An error has ocurred',
        success: false
      }
    }

    return {
      success: true,
      error: null
    }
  }

  const { error: errorLike } = await supabase.from('like').delete().match({ post_id, user_id: dataUser.user.id })

  console.log({ errorLike, post_id, dataUser })

  if (errorLike) {
    return {
      error: 'An error has ocurred',
      success: false
    }
  }

  return { success: true, error: null }
}
