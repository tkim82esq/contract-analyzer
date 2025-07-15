import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface TemplateFeedback {
  contractType: string;
  partyRole: string;
  suggestedRisk: {
    category: string;
    severity: "high" | "medium" | "low";
    description: string;
  };
  existingRisksCount: number;
  timestamp: string;
  userAgent?: string;
}

// Get the feedback file path - in production, this would be a database
function getFeedbackFilePath(): string {
  const feedbackDir = path.join(process.cwd(), "feedback");

  // Create feedback directory if it doesn't exist
  if (!fs.existsSync(feedbackDir)) {
    fs.mkdirSync(feedbackDir, { recursive: true });
  }

  return path.join(feedbackDir, "template-feedback.json");
}

// Load existing feedback
function loadFeedback(): TemplateFeedback[] {
  const filePath = getFeedbackFilePath();

  if (!fs.existsSync(filePath)) {
    return [];
  }

  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error loading feedback:", error);
    return [];
  }
}

// Save feedback
function saveFeedback(feedback: TemplateFeedback[]): void {
  const filePath = getFeedbackFilePath();

  try {
    fs.writeFileSync(filePath, JSON.stringify(feedback, null, 2));
  } catch (error) {
    console.error("Error saving feedback:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.contractType ||
      !body.partyRole ||
      !body.suggestedRisk?.description
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create feedback entry
    const feedbackEntry: TemplateFeedback = {
      contractType: body.contractType,
      partyRole: body.partyRole,
      suggestedRisk: {
        category: body.suggestedRisk.category || "General",
        severity: body.suggestedRisk.severity || "medium",
        description: body.suggestedRisk.description.trim(),
      },
      existingRisksCount: body.existingRisksCount || 0,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get("user-agent") || undefined,
    };

    // Load existing feedback
    const allFeedback = loadFeedback();

    // Add new feedback
    allFeedback.push(feedbackEntry);

    // Save updated feedback
    saveFeedback(allFeedback);

    // Log for monitoring (in production, this would go to a proper logging service)
    console.log(
      `Template feedback received for ${body.contractType} (${body.partyRole}):`,
      {
        category: feedbackEntry.suggestedRisk.category,
        severity: feedbackEntry.suggestedRisk.severity,
        description:
          feedbackEntry.suggestedRisk.description.substring(0, 100) + "...",
      },
    );

    // In a production environment, you might also want to:
    // 1. Send to a database or data warehouse
    // 2. Trigger notifications for template maintainers
    // 3. Add to a queue for periodic template review

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your feedback. It will help us improve our analysis.",
      feedbackId: `${feedbackEntry.contractType}-${Date.now()}`,
    });
  } catch (error) {
    console.error("Error processing template feedback:", error);
    return NextResponse.json(
      { error: "Failed to process feedback" },
      { status: 500 },
    );
  }
}

// GET endpoint to retrieve feedback for analysis (admin use)
export async function GET(request: NextRequest) {
  try {
    // In production, this should be protected by authentication
    const { searchParams } = new URL(request.url);
    const contractType = searchParams.get("contractType");

    let feedback = loadFeedback();

    // Filter by contract type if specified
    if (contractType) {
      feedback = feedback.filter((f) => f.contractType === contractType);
    }

    // Group feedback by contract type for easier analysis
    const groupedFeedback = feedback.reduce(
      (acc, item) => {
        const key = `${item.contractType}`;
        if (!acc[key]) {
          acc[key] = {
            contractType: item.contractType,
            feedbackCount: 0,
            suggestions: [],
          };
        }

        acc[key].feedbackCount++;
        acc[key].suggestions.push({
          partyRole: item.partyRole,
          risk: item.suggestedRisk,
          timestamp: item.timestamp,
        });

        return acc;
      },
      {} as Record<string, any>,
    );

    return NextResponse.json({
      totalFeedback: feedback.length,
      contractTypes: Object.keys(groupedFeedback).length,
      feedback: Object.values(groupedFeedback),
    });
  } catch (error) {
    console.error("Error retrieving feedback:", error);
    return NextResponse.json(
      { error: "Failed to retrieve feedback" },
      { status: 500 },
    );
  }
}
