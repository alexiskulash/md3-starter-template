import { useState } from "react";
import "@material/web/list/list.js";
import "@material/web/list/list-item.js";
import "@material/web/checkbox/checkbox.js";
import "@material/web/icon/icon.js";
import "@material/web/iconbutton/filled-icon-button.js";
import "@material/web/divider/divider.js";
import type { Task, Calendar } from "../types/calendar";

interface TaskSidebarProps {
  unscheduledTasks: Task[];
  completedTasks: Task[];
  calendars: Calendar[];
  onTaskClick: (task: Task) => void;
  onToggleComplete: (taskId: string) => void;
  onCreateTask: () => void;
}

export function TaskSidebar({
  unscheduledTasks,
  completedTasks,
  calendars,
  onTaskClick,
  onToggleComplete,
  onCreateTask,
}: TaskSidebarProps) {
  const [showCompleted, setShowCompleted] = useState(false);

  // Get calendar color for a task
  const getTaskCalendar = (task: Task) => {
    return calendars.find((c) => c.id === task.calendarId);
  };

  // Format due date for display
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    
    const diffTime = taskDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays === -1) return "Yesterday";
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    if (diffDays < 7) return `In ${diffDays} days`;
    
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  return (
    <div
      style={{
        width: "300px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid hsl(var(--md-sys-color-outline-variant))",
        background: "hsl(var(--md-sys-color-surface))",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid hsl(var(--md-sys-color-outline-variant))",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: 500,
            color: "hsl(var(--md-sys-color-on-surface))",
          }}
        >
          Tasks
        </h2>
        <md-filled-icon-button onClick={onCreateTask}>
          <md-icon>add</md-icon>
        </md-filled-icon-button>
      </div>

      {/* Unscheduled Tasks */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {unscheduledTasks.length === 0 ? (
          <div
            style={{
              padding: "24px 16px",
              textAlign: "center",
              color: "hsl(var(--md-sys-color-on-surface-variant))",
              fontSize: "14px",
            }}
          >
            No unscheduled tasks
          </div>
        ) : (
          <md-list>
            {unscheduledTasks.map((task) => {
              const calendar = getTaskCalendar(task);
              const dueText = formatDueDate(task.dueDate);
              
              return (
                <md-list-item
                  key={task.id}
                  type="button"
                  onClick={() => onTaskClick(task)}
                  style={{
                    cursor: "pointer",
                    "--md-list-item-label-text-color": "hsl(var(--md-sys-color-on-surface))",
                  } as any}
                >
                  <div slot="start">
                    <md-checkbox
                      onClick={(e: any) => {
                        e.stopPropagation();
                        onToggleComplete(task.id);
                      }}
                    />
                  </div>
                  <div
                    slot="headline"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: calendar?.color,
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {task.title}
                    </span>
                  </div>
                  {(dueText || task.estimatedDuration) && (
                    <div
                      slot="supporting-text"
                      style={{
                        fontSize: "12px",
                        color: "hsl(var(--md-sys-color-on-surface-variant))",
                      }}
                    >
                      {dueText && <span>{dueText}</span>}
                      {dueText && task.estimatedDuration && <span> • </span>}
                      {task.estimatedDuration && <span>{task.estimatedDuration} min</span>}
                    </div>
                  )}
                </md-list-item>
              );
            })}
          </md-list>
        )}

        {/* Completed Tasks Section */}
        {completedTasks.length > 0 && (
          <>
            <md-divider style={{ margin: "8px 0" }} />
            <div
              style={{
                padding: "8px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: "hsl(var(--md-sys-color-on-surface-variant))",
                }}
              >
                Completed ({completedTasks.length})
              </span>
              <md-icon style={{ fontSize: "20px", color: "hsl(var(--md-sys-color-on-surface-variant))" }}>
                {showCompleted ? "expand_less" : "expand_more"}
              </md-icon>
            </div>

            {showCompleted && (
              <md-list>
                {completedTasks.map((task) => {
                  const calendar = getTaskCalendar(task);
                  
                  return (
                    <md-list-item
                      key={task.id}
                      type="button"
                      onClick={() => onTaskClick(task)}
                      style={{
                        cursor: "pointer",
                        opacity: 0.6,
                        "--md-list-item-label-text-color": "hsl(var(--md-sys-color-on-surface))",
                      } as any}
                    >
                      <div slot="start">
                        <md-checkbox
                          checked={true}
                          onClick={(e: any) => {
                            e.stopPropagation();
                            onToggleComplete(task.id);
                          }}
                        />
                      </div>
                      <div
                        slot="headline"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          textDecoration: "line-through",
                        }}
                      >
                        <div
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: calendar?.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {task.title}
                        </span>
                      </div>
                    </md-list-item>
                  );
                })}
              </md-list>
            )}
          </>
        )}
      </div>
    </div>
  );
}
