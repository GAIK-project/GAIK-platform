import { NextResponse } from 'next/server';
import { createServerClient } from './../../utils/supabaseragbuilder/server';

export async function POST(req: Request) {
  const supabase = await createServerClient();
  const { title } = await req.json();
  console.log("juu:", req.body);
    let data = "";
    if(supabase){
        const { data, error } = await supabase
        .from('todos')
        .insert([{ title }]);
    
      if (error) {
        console.error('Error adding todo:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }
    else{
        console.log("supa: ", supabase);
    }

  

  return NextResponse.json({ data });
}
