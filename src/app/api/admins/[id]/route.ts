import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/mongodb";
import AdminUser from "@/models/AdminUser";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();
    const admin = await AdminUser.findByIdAndDelete(resolvedParams.id);
    
    if (!admin) {
      return NextResponse.json({ success: false, error: "Admin not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: admin });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete admin" }, { status: 500 });
  }
}
