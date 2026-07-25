import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { user_id, amount, phone_number, secret_id } = await req.json()

    if (!amount || amount < 5000) {
      return Response.json({ error: 'Minimum deposit is 5,000 UGX' }, { status: 400 })
    }

    if (!phone_number || !secret_id) {
      return Response.json({ error: 'Phone number and Secret ID are required' }, { status: 400 })
    }

    // Insert pending deposit transaction
    const { data: transaction, error } = await supabase
      .from('transactions')
      .insert({
        user_id,
        type: 'DEPOSIT',
        amount: Number(amount),
        wallet: 'G',
        status: 'PENDING'
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, message: 'Deposit request submitted for admin approval', transaction })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
