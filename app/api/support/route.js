import { supabase } from '@/lib/supabase'

export async function POST(req) {
  try {
    const { user_id, subject, message } = await req.json()

    if (!subject || !message) {
      return Response.json({ error: 'Subject and message are required' }, { status: 400 })
    }

    const { data: ticket, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id,
        subject,
        message,
        status: 'OPEN'
      })
      .select()
      .single()

    if (error) throw error

    return Response.json({ success: true, message: 'Support ticket submitted successfully', ticket })
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
