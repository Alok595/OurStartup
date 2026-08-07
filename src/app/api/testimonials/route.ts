import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Testimonial from "@/models/Testimonial";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, company, content, rating } = body;

    if (!name || !content || !rating) {
      return NextResponse.json({ error: "Name, content, and rating are required" }, { status: 400 });
    }

    await connectToDatabase();

    const newTestimonial = await Testimonial.create({
      name,
      company: company || "",
      content,
      rating: Number(rating),
      isApproved: false, // Default to hidden
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Error creating testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const admin = searchParams.get("admin") === "true";

    await connectToDatabase();

    let query = {};
    if (!admin) {
      query = { isApproved: true };
    }

    const testimonials = await Testimonial.find(query).sort({ createdAt: -1 });

    return NextResponse.json(testimonials, { status: 200 });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
