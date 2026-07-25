import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { transaction_id, action } = await req.json() // action = 'APPROVE' or 'REJECT'

    // 1. Fetch transaction details
    const { data: tx, error: fetchErr } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', transaction_id)
      .single()

    if (fetchErr || !tx) {
      return Response.json({ error: 'Transaction not found' }, { status: 404 })
    }

    if (tx.status !== 'PENDING') {
      return Response.json({ error: 'Transaction is already processed' }, { status: 400 })
    }

    if (action === 'APPROVE') {
      // Update transaction status to COMPLETED
      await supabase
        .from('transactions')
        .update({ status: 'COMPLETED' })
        .eq('id', transaction_id)

      // Increment user's G-Wallet balance
      await supabase.rpc('increment_g_wallet', {
        user_id: tx.user_id,
        amount: Number(tx.amount)
      })

      return Response.json({ success: true, message: 'Deposit approved and credited to G-Wallet' })
    } else if (action === 'REJECT') {
      await supabase
        .from('transactions')
        .update({ status: 'REJECTED' })
        .eq('id', transaction_id)

      return Response.json({ success: true, message: 'Deposit request rejected' })
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
