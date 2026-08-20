"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Bell,
  BellRing,
  Check,
  CheckCheck,
  DollarSign,
  Filter,
  Mail,
  MessageSquare,
  Radio,
  ShieldAlert,
  Smartphone,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button, ButtonLink } from "@/components/ui/button";
import { api } from "@/lib/api";
import { NotificationLog } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [filterRole, setFilterRole] = useState<"all" | "guest" | "host">("all");
  const [filterType, setFilterType] = useState<"all" | "Push" | "SMS" | "Email">("all");

  useEffect(() => {
    async function loadNotifications() {
      const data = await api.notifications.list();
      setNotifications(data);
    }
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id: string) => {
    await api.notifications.markRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = async () => {
    await api.notifications.markAllRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const filtered = notifications.filter((n) => {
    const roleMatch = filterRole === "all" || n.userRole === filterRole;
    const typeMatch = filterType === "all" || n.notificationType === filterType;
    return roleMatch && typeMatch;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Notifications
          </h1>
          <p className="mt-1 text-ink-muted text-sm">
            Dispatched hazard broadcasts, escrow payouts, and booking safety alerts.
          </p>
        </div>

        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead} className="gap-1.5 self-start sm:self-auto text-xs">
            <CheckCheck size={14} /> Mark All as Read
          </Button>
        )}
      </div>

      {/* Filter Bar */}
      <Card className="mt-8 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink-subtle flex items-center gap-1">
              <Filter size={14} /> Role:
            </span>
            <div className="flex rounded-lg border border-line p-1 bg-canvas">
              {(["all", "guest", "host"] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={cn(
                    "px-3 py-1 rounded-md text-xs font-semibold capitalize transition-all",
                    filterRole === role ? "bg-surface shadow-xs text-ink" : "text-ink-muted hover:text-ink"
                  )}
                >
                  {role === "all" ? "All Recipient Roles" : `${role} Alerts`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-ink-subtle">Channel:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="rounded-lg border border-line bg-surface px-2.5 py-1 text-xs font-medium"
            >
              <option value="all">All Channels</option>
              <option value="Push">App Push Notification</option>
              <option value="SMS">Emergency SMS</option>
              <option value="Email">Secure Email</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Notifications List */}
      <div className="mt-6 space-y-4">
        {filtered.map((item) => (
          <Card
            key={item.id}
            className={cn(
              "p-5 transition-all border-l-4",
              !item.isRead ? "bg-brand-50/20 border-l-brand-600 shadow-xs" : "border-l-line opacity-90",
              item.severity === "warning" && "border-l-danger bg-red-50/20"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl",
                    item.severity === "warning"
                      ? "bg-red-100 text-danger"
                      : "bg-brand-100 text-brand-800"
                  )}
                >
                  {item.notificationType === "Push" ? (
                    <BellRing size={18} />
                  ) : item.notificationType === "SMS" ? (
                    <Smartphone size={18} />
                  ) : (
                    <Mail size={18} />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-sm text-ink">{item.title}</span>
                    {!item.isRead && (
                      <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        NEW
                      </span>
                    )}
                    <span className="rounded-md bg-canvas px-2 py-0.5 text-[10px] font-medium text-ink-subtle uppercase">
                      {item.notificationType} • {item.userRole}
                    </span>
                  </div>

                  <p className="text-xs text-ink-muted leading-relaxed">{item.messageContent}</p>

                  <div className="flex flex-wrap items-center gap-4 text-[11px] text-ink-subtle pt-2">
                    <span>Dispatched: {item.dispatchedAt}</span>
                    {item.relatedBookingId && (
                      <Link href="/bookings" className="text-brand-700 font-semibold hover:underline">
                        Booking: {item.relatedBookingId}
                      </Link>
                    )}
                    {item.warningId && (
                      <Link href="/warnings" className="text-danger font-semibold hover:underline">
                        Warning Ref: {item.warningId}
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {!item.isRead && (
                <button
                  type="button"
                  onClick={() => markAsRead(item.id)}
                  title="Mark as read"
                  className="rounded-md p-1.5 text-ink-subtle hover:bg-black/5 hover:text-ink"
                >
                  <Check size={16} />
                </button>
              )}
            </div>
          </Card>
        ))}

        {filtered.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCheck size={40} className="mx-auto text-safe" />
            <h3 className="mt-3 text-base font-bold">No notifications found</h3>
            <p className="mt-1 text-xs text-ink-muted">You are completely up to date.</p>
          </Card>
        )}
      </div>

      <div className="mt-12 rounded-xl border border-line bg-surface p-6 text-xs text-ink-muted space-y-2">
        <p className="font-bold text-ink flex items-center gap-1.5">
          <ShieldAlert size={14} className="text-brand-700" /> Multi-channel Priority Protocol:
        </p>
        <p>
          In accordance with the CFD Warnings pipeline, critical mountain hazards trigger simultaneous SMS dispatch to cellular phones (even when mobile internet is degraded) alongside in-app push notifications.
        </p>
      </div>
    </div>
  );
}
