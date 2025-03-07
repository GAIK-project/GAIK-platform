import { NextResponse } from 'next/server';
import { createServerClient } from './../../utils/supabaseragbuilder/server';
// import { createServerClient } from '@/lib/db/supabase/server'; // Tänkin pitäis toimii

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { title } = body;
    
    console.log(title);

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    
    // Get the Supabase client
    const supabase = await createServerClient();
    
    // Insert the todo
    const { data, error } = await supabase
    .from('todos')
    .insert([{ todos: title }])  // Käytä 'todos' jos sarakenimikin on 'todos'
    // Vika oli tossa että piti olla todos:title
    .select();
      
    if (error) {
      console.error('Error adding todo:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // Return success response
    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}