import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Fetch latest open round
    const { data: round } = await supabase
      .from('trade_rounds')
      .select('*')
      .eq('status', 'OPEN')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!round) return Response.json({ message: 'No open round to settle' })

    // Mark closed
    await supabase
      .from('trade_rounds')
      .update({ status: 'CLOSED', closed_at: new Date().toISOString() })
      .eq('id', round.id)

    // Settle trades
    const { data: trades } = await supabase
      .from('trades')
      .select('*')
      .eq('round_id', round.id)
      .eq('status', 'PENDING')

    let upSum = 0, downSum = 0
    const upTrades = [], downTrades = []

    (trades || []).forEach(t => {
      if (t.direction === 'UP') {
        upSum += Number(t.amount)
        upTrades.push(t)
      } else {
        downSum += Number(t.amount)
        downTrades.push(t)
      }
    })

    // Minority group wins rule
    let result = 'DRAW'
    let winners = []
    
    if (upSum > downSum) {
      result = 'DOWN'
      winners = downTrades
    } else if (downSum > upSum) {
      result = 'UP'
      winners = upTrades
    }

    await supabase.from('trade_rounds').update({ status: 'SETTLED', result }).eq('id', round.id)

    // Pay winners based on tier profit rules
    for (const w of winners) {
      const stake = Number(w.amount)
      let profitRate = 0.20 // 20% default
      if (stake >= 1500 && stake <= 3000) profitRate = 0.40 // 40%
      else if (stake >= 3100 && stake <= 5000) profitRate = 0.30 // 30%

      const payout = stake + (stake * profitRate)
      await supabase.from('trades').update({ status: 'WON', payout }).eq('id', w.id)
      await supabase.rpc('increment_g_wallet', { user_id: w.user_id, amount: payout })
    }

    // Auto open new round
    const nextRoundId = `round-${Date.now()}`
    await supabase.from('trade_rounds').insert({ id: nextRoundId, status: 'OPEN' })

    return Response.json({ success: true, settled: round.id, result, next: nextRoundId })
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}
