import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";
import Activity from "@/models/Activity";

const globalRef = globalThis as Record<string, any>;

if (!globalRef._mockTasks) {
  globalRef._mockTasks = [];
}

export async function GET() {
  try {
    await connectDB();
    let tasks = [];
    try {
      tasks = await Task.find();
    } catch {
      tasks = globalRef._mockTasks;
    }
    return Response.json(tasks.length ? tasks : globalRef._mockTasks);
  } catch (error) {
    return Response.json(globalRef._mockTasks);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();

    const newTask = {
      _id: body._id || String(Date.now()),
      title: body.title,
      description: body.description || "No description provided.",
      priority: body.priority || "low",
      assignedTo: body.assignedTo || "Unassigned",
      status: body.status || "TODO",
      deadline: body.deadline ? new Date(body.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "No Deadline",
      createdAt: new Date().toISOString()
    };

    try {
      await Task.create(newTask);
    } catch {
      console.log("Saving task to local pipeline bypass memory.");
    }

    globalRef._mockTasks.push(newTask);

    try {
      const assignmentText = newTask.assignedTo !== "Unassigned" ? `and assigned it to ${newTask.assignedTo}` : "";
      const logText = `🎯 New task "${newTask.title}" was created by a club member ${assignmentText}.`;
      
      if (typeof globalRef._addMockActivity === "function") {
        globalRef._addMockActivity(logText);
      }
      await Activity.create({ text: logText });
    } catch {
    }

    return Response.json(newTask, { status: 201 });
  } catch (error) {
    return Response.json({ message: "Task created locally" }, { status: 201 });
  }
}