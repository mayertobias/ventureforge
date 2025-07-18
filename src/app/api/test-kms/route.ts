import { NextRequest, NextResponse } from "next/server";
import { AWSKMSService } from "@/lib/kms-aws";

export async function GET(request: NextRequest) {
  try {
    // Test AWS KMS configuration
    const isValid = await AWSKMSService.validateConfiguration();
    
    if (isValid) {
      return NextResponse.json({
        success: true,
        message: "AWS KMS is properly configured and working!",
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "AWS KMS configuration validation failed",
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
  } catch (error) {
    console.error("KMS test error:", error);
    return NextResponse.json({
      success: false,
      message: "AWS KMS test failed",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}