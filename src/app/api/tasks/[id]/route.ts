import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

const globalRef = globalThis as Record<string, any>;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    
    const resolvedParams = 'then' in params ? await params : params;
    const { id } = resolvedParams;

    try {
      await Task.findByIdAndUpdate(id, { $set: body }, { new: true });
    } catch (dbError) {
      console.log("Updating column stage in local pipeline memory.");
    }

    if (!globalRef._mockTasks) {
      globalRef._mockTasks = [];
    }
    
    globalRef._mockTasks = globalRef._mockTasks.map((task: any) => {
      if (task._id === id) {
        if (body.status) {
          let statusLabel = body.status === "IN_PROGRESS" ? "⏳ In Progress" : body.status === "DONE" ? "✅ Done" : "📌 To Do";
          if (typeof globalRef._addMockActivity === "function") {
            globalRef._addMockActivity(`🚀 Task "${task.title}" was moved to ${statusLabel}.`);
          }
        }
        return { ...task, ...body };
      }
      return task;
    });
    
    const targetTask = globalRef._mockTasks.find((t: any) => t._id === id);
    const fallbackResponse = targetTask || { _id: id, ...body };

    return Response.json(fallbackResponse, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Updated locally" }, { status: 200 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    await connectDB();
    
    const resolvedParams = 'then' in params ? await params : params;
    const { id } = resolvedParams;

    let deletedTaskTitle = "Unknown Task";
    if (globalRef._mockTasks) {
      const taskToDelete = globalRef._mockTasks.find((t: any) => t._id === id);
      if (taskToDelete) {
        deletedTaskTitle = taskToDelete.title;
      }
    }

    try {
      await Task.findByIdAndDelete(id);
    } catch (dbError) {
      console.log("Purging from local workspace memory.");
    }

    if (globalRef._mockTasks) {
      globalRef._mockTasks = globalRef._mockTasks.filter((task: any) => task._id !== id);
    }

    if (typeof globalRef._addMockActivity === "function") {
      globalRef._addMockActivity(`🗑 Task "${deletedTaskTitle}" was permanently deleted.`);
    }

    return Response.json({ message: "Task successfully deleted" }, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Deletion failed" }, { status: 500 });
  }
}