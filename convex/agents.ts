import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Agent roles
export const AgentRole = v.union(
  v.literal("lead_manager"),
  v.literal("sales"),
  v.literal("content"),
  v.literal("builder"),
  v.literal("outreach")
);

export const TaskType = v.union(
  v.literal("lead_followup"),
  v.literal("demo_request"),
  v.literal("feature_request"),
  v.literal("bug_fix"),
  v.literal("content_write"),
  v.literal("outreach")
);

export const TaskStatus = v.union(
  v.literal("pending"),
  v.literal("in_progress"),
  v.literal("completed"),
  v.literal("blocked")
);

// Create a new task
export const createTask = mutation({
  args: {
    type: TaskType,
    assignedTo: AgentRole,
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    title: v.string(),
    description: v.string(),
    data: v.optional(v.string()), // JSON string for task-specific data
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("agent_tasks", {
      type: args.type,
      assignedTo: args.assignedTo,
      status: "pending",
      priority: args.priority,
      title: args.title,
      description: args.description,
      data: args.data,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return taskId;
  },
});

// Get tasks for a specific agent
export const getTasksForAgent = query({
  args: {
    agentRole: AgentRole,
    status: v.optional(TaskStatus),
  },
  handler: async (ctx, args) => {
    let tasksQuery = ctx.db
      .query("agent_tasks")
      .withIndex("by_agent", (q) => q.eq("assignedTo", args.agentRole));

    const tasks = await tasksQuery.collect();

    if (args.status) {
      return tasks.filter((t) => t.status === args.status);
    }

    return tasks.sort((a, b) => {
      // Sort by priority then by creation date
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 };
      const aPriority = priorityOrder[a.priority];
      const bPriority = priorityOrder[b.priority];
      if (aPriority !== bPriority) return aPriority - bPriority;
      return b.createdAt - a.createdAt;
    });
  },
});

// Update task status
export const updateTaskStatus = mutation({
  args: {
    taskId: v.id("agent_tasks"),
    status: TaskStatus,
    result: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const updateData: any = {
      status: args.status,
      updatedAt: Date.now(),
    };

    if (args.status === "completed") {
      updateData.completedAt = Date.now();
      if (args.result) {
        updateData.result = args.result;
      }
    }

    await ctx.db.patch(args.taskId, updateData);
    return { success: true };
  },
});

// Post a message to the agent message board
export const postMessage = mutation({
  args: {
    from: AgentRole,
    to: v.union(AgentRole, v.literal("all")),
    content: v.string(),
    relatedTaskId: v.optional(v.id("agent_tasks")),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("agent_messages", {
      from: args.from,
      to: args.to,
      content: args.content,
      relatedTaskId: args.relatedTaskId,
      read: false,
      timestamp: Date.now(),
    });
    return messageId;
  },
});

// Get unread messages for an agent
export const getUnreadMessages = query({
  args: {
    agentRole: AgentRole,
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("agent_messages")
      .filter((q) =>
        q.and(
          q.or(
            q.eq(q.field("to"), args.agentRole),
            q.eq(q.field("to"), "all")
          ),
          q.eq(q.field("read"), false)
        )
      )
      .collect();

    return messages.sort((a, b) => a.timestamp - b.timestamp);
  },
});

// Mark message as read
export const markMessageRead = mutation({
  args: {
    messageId: v.id("agent_messages"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.messageId, { read: true });
    return { success: true };
  },
});

// Log agent activity
export const logActivity = mutation({
  args: {
    agentRole: AgentRole,
    action: v.string(),
    details: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("agent_activity", {
      agentRole: args.agentRole,
      action: args.action,
      details: args.details,
      timestamp: Date.now(),
    });
    return { success: true };
  },
});

// Get recent activity for all agents
export const getRecentActivity = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const activity = await ctx.db
      .query("agent_activity")
      .order("desc")
      .take(limit);
    return activity;
  },
});
