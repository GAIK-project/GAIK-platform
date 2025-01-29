create or replace function match_documents (
  -- Funktio ottaa kolme parametria:
  query_embedding vector(1536),        -- Haettava vektori
  match_threshold float default 0.7,   -- Minimisimilaarisuus (oletuksena 0.7)
  match_count int default 5            -- Palautettavien tulosten määrä
) 
-- Määrittelemme palautettavan taulun rakenteen
returns table (
  id integer,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql   -- Kerromme että käytämme PL/pgSQL-kieltä
as $$             -- merkitsee koodilohkon alkua (dollar-quoted string literal)
begin             -- PL/pgSQL lohkon alku
  return query    -- Palautetaan kyselyn tulos

  select
    d.id,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) as similarity  -- Cosine similarity laskenta
  from documents d
  where 1 - (d.embedding <=> query_embedding) > match_threshold  -- Filtteröinti
  order by similarity desc  -- Järjestys parhaimmasta osumasta huonoimpaan
  limit match_count;       -- Rajoitetaan tulosten määrä
end;              -- PL/pgSQL lohkon loppu
$$;              -- Koodilohkon loppu