import connectDB from "@/lib/mongodb";
import Activity from "@/models/Activity";

const globalRef = globalThis as Record<string, any>;

let mockActivities: any[] = [];

globalRef._addMockActivity = function(text: string) {
  mockActivities.unshift({
    _id: String(Date.now()),
    text,
    createdAt: new Date().toISOString()
  });
};

export async function GET() {
  try {
    await connectDB();
    let activities = [];
    try {
      activities = await Activity.find().sort({ createdAt: -1 }).limit(15);
    } catch {
      activities = mockActivities;
    }
    return Response.json(activities.length ? activities : mockActivities);
  } catch (error) {
    return Response.json(mockActivities);
  }
}