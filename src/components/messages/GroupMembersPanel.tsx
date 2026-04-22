"use client";

import { useState, useEffect } from "react";
import { getGroupMembers, kickMember, leaveGroup, toggleMuteMember } from "@/actions/group.actions";
import { Users, Shield, LogOut, X, Copy, Check, MoreVertical, Trash2, MicOff, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

type Member = {
  id: number;
  userId: string;
  userRole: string;
  username: string;
  displayName: string;
  isOwner: boolean;
  isMuted: boolean;
};

export default function GroupMembersPanel({
  group,
  currentUserId
}: {
  group: any;
  currentUserId: string;
}) {
  const [members, setMembers] = useState<Member[]>(group.members || []);
  const [loading, setLoading] = useState(!group.members);
  const router = useRouter();

  const me = members.find(m => m.userId === currentUserId);
  const isOwner = me?.isOwner || false;

  useEffect(() => {
    if (!group.members) {
      async function load() {
        try {
          const data = await getGroupMembers(group.id);
          setMembers(data as any);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      load();
    }
  }, [group.id, group.members]);

  async function handleKick(userId: string) {
    if (!window.confirm("Are you sure you want to kick this member?")) return;
    try {
      await kickMember(group.id, userId);
      setMembers(prev => prev.filter(m => m.userId !== userId));
      router.refresh();
    } catch (e) {
      alert("Failed to kick member");
    }
  }

  async function handleToggleMute(userId: string) {
    try {
      await toggleMuteMember(group.id, userId);
      setMembers(prev => prev.map(m => m.userId === userId ? { ...m, isMuted: !m.isMuted } : m));
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Failed to toggle mute");
    }
  }

  async function handleLeave() {
    if (!window.confirm("Are you sure you want to leave this group?")) return;
    try {
      await leaveGroup(group.id);
      router.push("/messages");
      router.refresh();
    } catch (e: any) {
      alert(e.message || "Failed to leave group");
    }
  }

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
        {loading ? (
          <div className="flex justify-center py-10">
            <span className="animate-spin w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full" />
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-muted/50 flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 border border-border/20">
                    {m.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[14px] font-semibold truncate text-foreground">{m.displayName}</span>
                      {m.isOwner && <Shield className="w-3 h-3 text-amber-500 fill-amber-500" />}
                      {m.isMuted && <MicOff className="w-3 h-3 text-red-500" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground truncate">@{m.username}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground capitalize border border-border/20 font-medium">
                        {m.userRole}
                      </span>
                    </div>
                  </div>
                </div>

                {isOwner && !m.isOwner && (
                  <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-all">
                    <button
                      onClick={() => handleToggleMute(m.userId)}
                      className={`p-2 rounded-lg transition-all ${m.isMuted ? "text-blue-500 hover:bg-blue-500/10" : "text-muted-foreground hover:bg-muted"}`}
                      title={m.isMuted ? "Unmute Member" : "Mute Member"}
                    >
                      {m.isMuted ? <Mic className="size-4" /> : <MicOff className="size-4" />}
                    </button>
                    <button
                      onClick={() => handleKick(m.userId)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Kick Member"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 border-t border-border/30 bg-muted/5">
        {!me?.isOwner ? (
          <button
            onClick={handleLeave}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-500/10 border border-red-500/10 transition-all active:scale-[0.98]"
          >
            <LogOut className="w-4 h-4" />
            Leave Group
          </button>
        ) : (
          <p className="text-[11px] text-center text-muted-foreground font-medium">
            You are the owner of this group.
          </p>
        )}
      </div>
    </div>
  );
}
