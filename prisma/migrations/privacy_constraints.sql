-- Privacy Enforcement Constraints for VentureForge AI
-- Ensures MEMORY_ONLY projects cannot have sensitive data persisted to database

-- Add check constraints to prevent AI data persistence for MEMORY_ONLY projects
ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_idea" 
CHECK (
  NOT (storageMode = 'MEMORY_ONLY' AND ideaOutput IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_research" 
CHECK (
  NOT (storageMode = 'MEMORY_ONLY' AND researchOutput IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_blueprint" 
CHECK (
  NOT (storageMode = 'MEMORY_ONLY' AND blueprintOutput IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_financial" 
CHECK (
  NOT (storageMode = 'MEMORY_ONLY' AND financialOutput IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_pitch" 
CHECK (
  NOT (storageMode = 'MEMORY_ONLY' AND pitchOutput IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_gtm" 
CHECK (
  NOT (storageMode = 'MEMORY_ONLY' AND gtmOutput IS NOT NULL)
);

-- Create a function to automatically clear AI data when storage mode changes to MEMORY_ONLY
CREATE OR REPLACE FUNCTION clear_ai_data_on_memory_only()
RETURNS TRIGGER AS $$
BEGIN
  -- If storageMode is being set to MEMORY_ONLY, clear all AI data
  IF NEW.storageMode = 'MEMORY_ONLY' THEN
    NEW.ideaOutput := NULL;
    NEW.researchOutput := NULL;
    NEW.blueprintOutput := NULL;
    NEW.financialOutput := NULL;
    NEW.pitchOutput := NULL;
    NEW.gtmOutput := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically enforce privacy when storageMode changes
CREATE TRIGGER privacy_enforcement_trigger
  BEFORE INSERT OR UPDATE ON "Project"
  FOR EACH ROW
  EXECUTE FUNCTION clear_ai_data_on_memory_only();

-- Create function to automatically clear expired memory-only projects
CREATE OR REPLACE FUNCTION cleanup_expired_memory_projects()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM "Project"
  WHERE storageMode = 'MEMORY_ONLY'
    AND expiresAt IS NOT NULL
    AND expiresAt < NOW();
    
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Log the cleanup (optional)
  INSERT INTO "UsageHistory" (
    userId, 
    action, 
    projectName,
    creditsUsed, 
    creditsBalance,
    metadata
  ) VALUES (
    'system', 
    'SYSTEM_CLEANUP',
    'Expired memory projects',
    0,
    0,
    json_build_object(
      'deletedCount', deleted_count,
      'cleanupTime', NOW(),
      'type', 'memory_only_cleanup'
    )
  ) WHERE deleted_count > 0;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Add comments for documentation
COMMENT ON CONSTRAINT "privacy_constraint_idea" ON "Project" IS 
'Ensures MEMORY_ONLY projects cannot store ideaOutput in database - privacy enforcement';

COMMENT ON CONSTRAINT "privacy_constraint_research" ON "Project" IS 
'Ensures MEMORY_ONLY projects cannot store researchOutput in database - privacy enforcement';

COMMENT ON CONSTRAINT "privacy_constraint_blueprint" ON "Project" IS 
'Ensures MEMORY_ONLY projects cannot store blueprintOutput in database - privacy enforcement';

COMMENT ON CONSTRAINT "privacy_constraint_financial" ON "Project" IS 
'Ensures MEMORY_ONLY projects cannot store financialOutput in database - privacy enforcement';

COMMENT ON CONSTRAINT "privacy_constraint_pitch" ON "Project" IS 
'Ensures MEMORY_ONLY projects cannot store pitchOutput in database - privacy enforcement';

COMMENT ON CONSTRAINT "privacy_constraint_gtm" ON "Project" IS 
'Ensures MEMORY_ONLY projects cannot store gtmOutput in database - privacy enforcement';

COMMENT ON FUNCTION clear_ai_data_on_memory_only() IS 
'Automatically clears AI-generated content when project storage mode is set to MEMORY_ONLY';

COMMENT ON FUNCTION cleanup_expired_memory_projects() IS 
'Cleanup function to automatically delete expired MEMORY_ONLY projects for privacy compliance';