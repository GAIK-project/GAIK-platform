import { NextResponse } from 'next/server';
import { createServerClient } from './../../utils/supabaseragbuilder/server';
import { buildLinkTree } from '@/lib/ragbuilder/treebot2';

interface LinkNode {
    title: string;
    linkUrl: string;
    children: LinkNode[];
}

export async function POST(req: Request) {
  try {
    // Parse the request body
    const body = await req.json();
    const { title } = body;
    
    console.log(title);
    let newTitle : string = title.toString();

    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
      
    let testTree : any = await buildLinkTree("https://yle.fi/");
    console.log(testTree);
    
    // Return success response
    return NextResponse.json({ testTree });
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: "An unexpected error occurred" }, 
      { status: 500 }
    );
  }
}