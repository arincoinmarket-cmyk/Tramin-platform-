import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { user_id, type, amount, price_per_unit } = await req.json() // type = 'BUY' or 'SELL'

    if (!amount || amount <= 0 || !price_per_unit || price_per_unit <= 0) {
      return Response.json({ error: 'Valid amount and price are required' }, { status: 400 })
    }

    // Insert order into p2p_orders table
    const { data: order, error } = await supabase
      .from('p2p_orders')
      .insert({
        user_id,
        type,
        amount: Number(amount),
        price_per_unit: Number(price_per_unit),
        status: 'OPEN'
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, message: 'P2P Order created successfully', order })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
