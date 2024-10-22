import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export const revalidate = 0

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page')
  const tag = request.nextUrl.searchParams.get('tag')
  const limit = 20

  if (!page || !tag) {
    return NextResponse.json({ error: 'Missing page or tag' }, { status: 400 })
  }

  if (typeof page !== 'string' || typeof tag !== 'string' || Number.isNaN(Number.parseInt(page))) {
    return NextResponse.json({ error: 'Invalid page or tag' }, { status: 400 })
  }

  const pageNumber = Number.parseInt(page)
  const from = pageNumber * limit
  const to = (pageNumber + 1) * limit
  const supabase = createClient()
  const { data, error } = await supabase
    .from('post')
    .select('*, tag!inner(*)')
    .eq('tag.name', tag)
    .range(from, to - 1)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(
    { data: data ?? [], currentPage: pageNumber + 1, nextPage: (data ?? []).length === limit ? pageNumber + 2 : null },
    { status: 200 }
  )
}
