import React, { useState, useEffect } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  PlayCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { onSiteTaskService } from "@/services/onSiteTaskService";
import type { OnSiteTaskDto } from "@/types/onSiteTask";
import type { PagedResultDto } from "@/types/common";

const MyOnSiteTasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<OnSiteTaskDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<OnSiteTaskDto | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [actualHours, setActualHours] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadMyTasks();
  }, [currentPage]);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      const result: PagedResultDto<OnSiteTaskDto> =
        await onSiteTaskService.getOnSiteTasks(currentPage, 10);
      setTasks(result.items);
      setTotalPages(Math.ceil(result.totalCount / 10));
    } catch (error) {
      toast.error("Failed to load your tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async (taskId: number) => {
    try {
      const task = await onSiteTaskService.getOnSiteTaskById(taskId);
      await onSiteTaskService.updateOnSiteTask(taskId, {
        ...task,
        statusId: 2, // Status: In Progress
      });
      toast.success("Task started successfully");
      loadMyTasks();
    } catch (error) {
      toast.error("Failed to start task");
    }
  };

  const handleCompleteTask = async () => {
    if (!selectedTask) return;

    try {
      await onSiteTaskService.updateOnSiteTask(selectedTask.taskId, {
        ...selectedTask,
        statusId: 3, // Status: Completed
        actualHours: actualHours ? parseFloat(actualHours) : undefined,
        notes: completionNotes || selectedTask.notes,
      });
      toast.success("Task completed successfully");
      setIsCompleteDialogOpen(false);
      setCompletionNotes("");
      setActualHours("");
      setSelectedTask(null);
      loadMyTasks();
    } catch (error) {
      toast.error("Failed to complete task");
    }
  };

  const getStatusBadge = (statusId: number) => {
    const statusMap: Record<
      number,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: React.ReactNode;
      }
    > = {
      1: {
        label: "Pending",
        variant: "outline",
        icon: <AlertCircle className="w-3 h-3" />,
      },
      2: {
        label: "In Progress",
        variant: "default",
        icon: <PlayCircle className="w-3 h-3" />,
      },
      3: {
        label: "Completed",
        variant: "secondary",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      4: {
        label: "Verified",
        variant: "default",
        icon: <CheckCircle className="w-3 h-3" />,
      },
    };

    const status = statusMap[statusId] || {
      label: "Unknown",
      variant: "outline",
      icon: null,
    };
    return (
      <Badge variant={status.variant} className="flex items-center gap-1">
        {status.icon}
        {status.label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority?: string) => {
    const priorityColors: Record<string, string> = {
      High: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Low: "bg-green-100 text-green-800",
    };

    const colorClass =
      priorityColors[priority || "Medium"] || priorityColors["Medium"];
    return <Badge className={colorClass}>{priority || "Medium"}</Badge>;
  };

  const getDifficultyBadge = (difficulty?: string) => {
    const difficultyColors: Record<string, string> = {
      Hard: "bg-red-100 text-red-800",
      Medium: "bg-yellow-100 text-yellow-800",
      Easy: "bg-green-100 text-green-800",
    };

    const colorClass =
      difficultyColors[difficulty || "Medium"] || difficultyColors["Medium"];
    return <Badge className={colorClass}>{difficulty || "Medium"}</Badge>;
  };

  const canStartTask = (task: OnSiteTaskDto) => {
    return task.statusId === 1; // Pending
  };

  const canCompleteTask = (task: OnSiteTaskDto) => {
    return task.statusId === 2; // In Progress
  };

  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "Not specified";
    return new Date(dateTime).toLocaleString();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center bg-gradient-to-r from-orange-50/80 via-amber-50/80 to-yellow-50/80 dark:from-orange-950/40 dark:via-amber-950/40 dark:to-yellow-950/40 rounded-xl p-6 border border-orange-200/50 dark:border-orange-800/50">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 dark:from-orange-400 dark:via-amber-400 dark:to-yellow-400 bg-clip-text text-transparent">
            My On-Site Tasks
          </h1>
          <p className="text-muted-foreground">
            View and manage your assigned tasks
          </p>
        </div>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-64">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Tasks Assigned</h3>
            <p className="text-muted-foreground text-center">
              You don't have any tasks assigned at the moment. Check back later
              for new assignments.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card
              key={task.taskId}
              className="bg-gradient-to-br from-slate-50/80 via-gray-50/80 to-zinc-50/80 dark:from-slate-950/50 dark:via-gray-950/50 dark:to-zinc-950/50 border-slate-200/50 dark:border-slate-800/50 hover:shadow-lg transition-all duration-300"
            >
              <CardHeader className="pb-3 bg-gradient-to-r from-indigo-50/60 via-purple-50/60 to-pink-50/60 dark:from-indigo-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-t-lg border-b border-indigo-200/30 dark:border-indigo-800/30">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg text-foreground">
                    {task.taskName}
                  </CardTitle>
                  <div className="flex flex-col space-y-1">
                    {getStatusBadge(task.statusId)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
                <CardDescription className="line-clamp-2 text-muted-foreground">
                  {task.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 bg-gradient-to-br from-white/50 via-slate-50/30 to-gray-50/30 dark:from-slate-900/30 dark:via-gray-900/30 dark:to-zinc-900/30">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {task.startTime
                    ? formatDateTime(task.startTime)
                    : "No start time set"}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {task.location || "No location specified"}
                </div>
                {task.estimatedHours && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {task.estimatedHours} hours estimated
                  </div>
                )}
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-2">Difficulty:</span>
                  {getDifficultyBadge(task.difficulty)}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <Dialog
                    open={
                      isDetailDialogOpen && selectedTask?.taskId === task.taskId
                    }
                    onOpenChange={setIsDetailDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedTask(task)}
                        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/50 dark:border-blue-800/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 text-blue-700 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-200 transition-all duration-300"
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gradient-to-br from-slate-50/95 via-gray-50/95 to-zinc-50/95 dark:from-slate-950/95 dark:via-gray-950/95 dark:to-zinc-950/95 border-slate-200/50 dark:border-slate-800/50">
                      <DialogHeader className="bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 rounded-lg p-4 border border-blue-200/50 dark:border-blue-800/50">
                        <DialogTitle className="text-xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                          {task.taskName}
                        </DialogTitle>
                        <DialogDescription className="text-muted-foreground">
                          Task Details and Instructions
                        </DialogDescription>
                      </DialogHeader>
                      {selectedTask && (
                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium">
                              Description
                            </Label>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedTask.description ||
                                "No description provided"}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-sm font-medium">
                                Start Time
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDateTime(selectedTask.startTime)}
                              </p>
                            </div>
                            <div>
                              <Label className="text-sm font-medium">
                                End Time
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDateTime(selectedTask.endTime)}
                              </p>
                            </div>
                          </div>

                          {selectedTask.instructions && (
                            <div>
                              <Label className="text-sm font-medium">
                                Instructions
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">
                                {selectedTask.instructions}
                              </p>
                            </div>
                          )}

                          {selectedTask.materials && (
                            <div>
                              <Label className="text-sm font-medium">
                                Required Materials
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedTask.materials}
                              </p>
                            </div>
                          )}

                          {selectedTask.safetyRequirements && (
                            <div>
                              <Label className="text-sm font-medium">
                                Safety Requirements
                              </Label>
                              <p className="text-sm mt-1 text-red-600 font-medium">
                                {selectedTask.safetyRequirements}
                              </p>
                            </div>
                          )}

                          {selectedTask.completionCriteria && (
                            <div>
                              <Label className="text-sm font-medium">
                                Completion Criteria
                              </Label>
                              <p className="text-sm text-muted-foreground mt-1">
                                {selectedTask.completionCriteria}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <div className="flex space-x-2">
                    {canStartTask(task) && (
                      <Button
                        size="sm"
                        onClick={() => handleStartTask(task.taskId)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 hover:from-green-600 hover:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white border-0 transition-all duration-300"
                      >
                        <PlayCircle className="mr-1 h-3 w-3" />
                        Start
                      </Button>
                    )}

                    {canCompleteTask(task) && (
                      <Dialog
                        open={
                          isCompleteDialogOpen &&
                          selectedTask?.taskId === task.taskId
                        }
                        onOpenChange={setIsCompleteDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedTask(task)}
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 dark:from-blue-600 dark:to-indigo-600 hover:from-blue-600 hover:to-indigo-600 dark:hover:from-blue-700 dark:hover:to-indigo-700 text-white border-0 transition-all duration-300"
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Complete
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gradient-to-br from-slate-50/95 via-gray-50/95 to-zinc-50/95 dark:from-slate-950/95 dark:via-gray-950/95 dark:to-zinc-950/95 border-slate-200/50 dark:border-slate-800/50">
                          <DialogHeader className="bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-teal-50/80 dark:from-green-950/40 dark:via-emerald-950/40 dark:to-teal-950/40 rounded-lg p-4 border border-green-200/50 dark:border-green-800/50">
                            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                              Complete Task
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground">
                              Mark "{task.taskName}" as completed
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="actualHours">
                                Actual Hours Worked
                              </Label>
                              <Input
                                id="actualHours"
                                type="number"
                                step="0.5"
                                min="0"
                                value={actualHours}
                                onChange={(e) => setActualHours(e.target.value)}
                                placeholder="e.g., 2.5"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="notes">Completion Notes</Label>
                              <Textarea
                                id="notes"
                                value={completionNotes}
                                onChange={(e) =>
                                  setCompletionNotes(e.target.value)
                                }
                                placeholder="Any additional notes about task completion..."
                                rows={3}
                              />
                            </div>
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setIsCompleteDialogOpen(false);
                                  setCompletionNotes("");
                                  setActualHours("");
                                }}
                                className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/50 dark:to-slate-950/50 border-gray-200/50 dark:border-gray-800/50 hover:from-gray-100 hover:to-slate-100 dark:hover:from-gray-900/50 dark:hover:to-slate-900/50 text-gray-700 dark:text-gray-300 transition-all duration-300"
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleCompleteTask}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 hover:from-green-600 hover:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white border-0 transition-all duration-300"
                              >
                                Complete Task
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyOnSiteTasksPage;
