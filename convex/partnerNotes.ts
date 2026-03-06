import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getOrg, getOrgId } from "./lib/getOrg";

/**
 * Partner Notes — threaded internal notes per partner.
 * Team members can add timestamped notes about conversations,
 * follow-ups, escalations, and other partner context.
 */

// List notes for a partner (newest first)
export const list = query({
  args: { partnerId: v.id("partners") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) return [];

    const notes = await ctx.db
      .query("partnerNotes")
      .withIndex("by_org_and_partner", (q) =>
        q.eq("organizationId", orgId).eq("partnerId", args.partnerId)
      )
      .collect();

    // Sort: pinned first, then by createdAt descending
    return notes.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt - a.createdAt;
    });
  },
});

// Add a new note
export const add = mutation({
  args: {
    partnerId: v.id("partners"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const org = await getOrg(ctx);
    if (!org) throw new Error("Not authenticated");

    // Get current user info from Clerk identity
    const identity = await ctx.auth.getUserIdentity();
    const authorName = identity?.name || identity?.email || "Team Member";
    const authorEmail = identity?.email || "";

    const noteId = await ctx.db.insert("partnerNotes", {
      organizationId: org._id,
      partnerId: args.partnerId,
      authorName,
      authorEmail,
      content: args.content,
      isPinned: false,
      createdAt: Date.now(),
    });

    // Audit log entry
    await ctx.db.insert("audit_log", {
      organizationId: org._id,
      userId: identity?.subject || "system",
      action: "partner_note.created",
      entityType: "partner",
      entityId: args.partnerId,
      metadata: JSON.stringify({ noteId }),
      changes: "{}",
      createdAt: Date.now(),
    });

    return noteId;
  },
});

// Update a note's content
export const update = mutation({
  args: {
    noteId: v.id("partnerNotes"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.organizationId !== orgId) {
      throw new Error("Note not found");
    }

    await ctx.db.patch(args.noteId, {
      content: args.content,
      updatedAt: Date.now(),
    });
  },
});

// Toggle pin status
export const togglePin = mutation({
  args: { noteId: v.id("partnerNotes") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.organizationId !== orgId) {
      throw new Error("Note not found");
    }

    await ctx.db.patch(args.noteId, {
      isPinned: !note.isPinned,
    });
  },
});

// Delete a note
export const remove = mutation({
  args: { noteId: v.id("partnerNotes") },
  handler: async (ctx, args) => {
    const orgId = await getOrgId(ctx);
    if (!orgId) throw new Error("Not authenticated");

    const note = await ctx.db.get(args.noteId);
    if (!note || note.organizationId !== orgId) {
      throw new Error("Note not found");
    }

    await ctx.db.delete(args.noteId);
  },
});
