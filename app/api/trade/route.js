import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { user_id, amount, direction } = await req.json()
    
    if (!amount || amount < 1500) {
      return Response.json({ error: 'Min trade is 1500 UGX' }, { status: 400 })
    }

    // 1. Get or create current OPEN round
    let { data: round } = await supabase
      .from('trade_rounds')
      .select('id')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!round) {
      const newRoundId = `round-${Date.now()}`
      const { data: created } = await supabase
        .from('trade_rounds')
        .insert({ id: newRoundId, status: 'OPEN' })
        .select()
        .single()
      round = created
    }

    // 2. Check user wallet balance
    const { data: profile } = await supabase
      .from('profiles')
      .select('g_wallet')
      .eq('id', user_id)
      .single()

    if (!profile || Number(profile.g_wallet) < Number(amount)) {
      return Response.json({ error: 'Insufficient G-Wallet balance' }, { status: 400 })
    }

    // 3. Deduct from wallet
    await supabase.rpc('increment_g_wallet', { user_id, amount: -Number(amount) })

    // 4. Record trade
    const { data: trade } = await supabase.from('trades').insert({
      user_id,
      round_id: round.id,
      amount,
      direction,
      status: 'PENDING'
    }).select().single()

    // 5. Update round aggregates
    const updateField = direction === 'UP' ? 'up_total' : 'down_total'
    const countField = direction === 'UP' ? 'up_count' : 'down_count'
    
    await supabase.rpc('increment_round_totals', { 
      r_id: round.id, 
      amt: Number(amount), 
      is_up: direction === 'UP' 
    })

    return Response.json({ success: true, trade })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
