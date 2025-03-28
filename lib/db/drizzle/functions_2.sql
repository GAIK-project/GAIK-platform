create or replace function match_documents (
  -- Function takes three parameters:
  query_embedding vector(1536),        -- Vector to search for
  match_threshold float default 0.7,   -- Minimum similarity (default 0.7)
  match_count int default 5            -- Number of results to return
) 
-- Define the structure of the returned table
returns table (
  id integer,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql   -- Specify that we are using the PL/pgSQL language
as $$             -- marks the beginning of the code block (dollar-quoted string literal)
begin             -- Start of the PL/pgSQL block
  return query    -- Return the result of the query

  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity  -- Calculate cosine similarity
  from documents d
  where 1 - (d.embedding <=> query_embedding) > match_threshold  -- Filtering
  order by similarity desc  -- Order from best match to worst
  limit match_count;       -- Limit the number of results
end;              -- End of the PL/pgSQL block
$$;              -- End of the code block