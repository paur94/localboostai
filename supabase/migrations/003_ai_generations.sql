-- AI multi-output generations table
CREATE TABLE IF NOT EXISTS ai_generations (
  id            uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id       text        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name text        NOT NULL,
  business_category text    NOT NULL,
  target_audience text,
  promotion_text  text,
  tone          text        NOT NULL DEFAULT 'professional',
  language      text        NOT NULL DEFAULT 'en',
  image_count   int         NOT NULL DEFAULT 0,
  result        jsonb,
  tokens_used   int         NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_generations_user_id_idx ON ai_generations (user_id);
CREATE INDEX IF NOT EXISTS ai_generations_created_at_idx ON ai_generations (created_at DESC);

ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Service role has full access (all server operations use the service role key)
CREATE POLICY "Service role full access on ai_generations"
  ON ai_generations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
