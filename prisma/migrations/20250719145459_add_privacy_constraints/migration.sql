-- Privacy Enforcement Constraints for VentureForge AI
-- Ensures MEMORY_ONLY projects cannot have sensitive data persisted to database

-- First, clean up existing MEMORY_ONLY projects that have AI data
-- This enforces privacy retroactively
UPDATE "Project" 
SET 
  "ideaOutput" = NULL,
  "researchOutput" = NULL,
  "blueprintOutput" = NULL,
  "financialOutput" = NULL,
  "pitchOutput" = NULL,
  "gtmOutput" = NULL
WHERE "storageMode" = 'MEMORY_ONLY'
  AND (
    "ideaOutput" IS NOT NULL OR
    "researchOutput" IS NOT NULL OR
    "blueprintOutput" IS NOT NULL OR
    "financialOutput" IS NOT NULL OR
    "pitchOutput" IS NOT NULL OR
    "gtmOutput" IS NOT NULL
  );

-- Add check constraints to prevent AI data persistence for MEMORY_ONLY projects
ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_idea" 
CHECK (
  NOT ("storageMode" = 'MEMORY_ONLY' AND "ideaOutput" IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_research" 
CHECK (
  NOT ("storageMode" = 'MEMORY_ONLY' AND "researchOutput" IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_blueprint" 
CHECK (
  NOT ("storageMode" = 'MEMORY_ONLY' AND "blueprintOutput" IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_financial" 
CHECK (
  NOT ("storageMode" = 'MEMORY_ONLY' AND "financialOutput" IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_pitch" 
CHECK (
  NOT ("storageMode" = 'MEMORY_ONLY' AND "pitchOutput" IS NOT NULL)
);

ALTER TABLE "Project" 
ADD CONSTRAINT "privacy_constraint_gtm" 
CHECK (
  NOT ("storageMode" = 'MEMORY_ONLY' AND "gtmOutput" IS NOT NULL)
);

-- Create a function to automatically clear AI data when storage mode changes to MEMORY_ONLY
CREATE OR REPLACE FUNCTION clear_ai_data_on_memory_only()
RETURNS TRIGGER AS $$
BEGIN
  -- If storageMode is being set to MEMORY_ONLY, clear all AI data
  IF NEW."storageMode" = 'MEMORY_ONLY' THEN
    NEW."ideaOutput" := NULL;
    NEW."researchOutput" := NULL;
    NEW."blueprintOutput" := NULL;
    NEW."financialOutput" := NULL;
    NEW."pitchOutput" := NULL;
    NEW."gtmOutput" := NULL;
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
  WHERE "storageMode" = 'MEMORY_ONLY'
    AND "expiresAt" IS NOT NULL
    AND "expiresAt" < NOW();
    
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;