import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  const page = request.nextUrl.searchParams.get('page')
  const limit = 10

  if (!page) {
    return NextResponse.json({ error: 'Missing page or tag' }, { status: 400 })
  }

  if (typeof page !== 'string' || Number.isNaN(Number.parseInt(page))) {
    return NextResponse.json({ error: 'Invalid page or tag' }, { status: 400 })
  }

  const pageNumber = Number.parseInt(page)
  const from = pageNumber * limit
  const to = (pageNumber + 1) * limit
  const supabase = createClient()
  const { data, error } = await supabase.from('post').select('*').range(from, to)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(
    { data: data ?? [], currentPage: pageNumber + 1, nextPage: (data ?? []).length === limit ? pageNumber + 2 : null },
    { status: 200 }
  )
}
