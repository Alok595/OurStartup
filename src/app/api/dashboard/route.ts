import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import Lead from "@/models/Lead";
import Testimonial from "@/models/Testimonial";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Fetch counts & activity in parallel with Promise.all and .lean() for maximum speed
    const [totalProjects, totalLeads, totalStories, recentLeads, recentProjects] = await Promise.all([
      Project.countDocuments(),
      Lead.countDocuments(),
      Testimonial.countDocuments(),
      Lead.find({}).sort({ createdAt: -1 }).limit(3).lean(),
      Project.find({}).sort({ createdAt: -1 }).limit(3).lean(),
    ]);

    const activity = [
      ...recentLeads.map(l => ({
        id: l._id.toString(),
        type: "lead",
        action: "New Lead Submission",
        target: l.name,
        time: l.createdAt,
        status: l.status || "New"
      })),
      ...recentProjects.map(p => ({
        id: p._id.toString(),
        type: "project",
        action: "Project Added",
        target: p.title,
        time: p.createdAt,
        status: p.category || "Project"
      }))
    ];

    // Sort combined activity by newest first
    activity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          totalProjects,
          totalLeads,
          totalStories,
          conversionRate: "4.2%" // Mocked trend
        },
        recentActivity: activity.slice(0, 5) // Top 5
      }
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
