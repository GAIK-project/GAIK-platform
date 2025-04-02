CREATE OR REPLACE FUNCTION match_documents_dynamic(
    table_name TEXT,                     -- Dynamic table name
    query_embedding VECTOR(1536),        -- Vector to search for
    match_threshold FLOAT DEFAULT 0.7,   -- Minimum similarity threshold
    match_count INT DEFAULT 5            -- Max number of results
)
RETURNS TABLE (
    id INTEGER,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY EXECUTE FORMAT(
        'SELECT
            id,
            content,
            metadata,
            1 - (embedding <=> $1) AS similarity
         FROM %I
         WHERE 1 - (embedding <=> $1) > $2
         ORDER BY similarity DESC
         LIMIT $3',
        table_name
    )
    USING query_embedding, match_threshold, match_count;
END;
$$;
