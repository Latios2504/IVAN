import React, { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { onSiteTaskService } from "@/services/onSiteTaskService";
import { eventService } from "@/services/eventService";
import type {
  OnSiteTaskViewModel,
  OnSiteTaskInput,
  PagedOnSiteTaskResult,
} from "@/types/onSiteTask";
import type { EventDto } from "@/types/event";

const OnSiteTaskManagementPage: React.FC = () => {
  const [tasks, setTasks] = useState<OnSiteTaskViewModel[]>([]);
  const [events, setEvents] = useState<EventDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OnSiteTaskViewModel | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [formData, setFormData] = useState<OnSiteTaskInput>({
    eventId: 0,
    categoryId: 1,
    statusId: 1,
    taskName: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    requiredSkills: "",
    priority: "Medium",
    difficulty: "Medium",
    instructions: "",
    materials: "",
    safetyRequirements: "",
    completionCriteria: "",
    notes: "",
  });

  useEffect(() => {
    loadTasks();
    loadEvents();
  }, [currentPage, selectedEvent, selectedStatus]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const result: PagedOnSiteTaskResult =
        await onSiteTaskService.getOnSiteTasks(currentPage, 10);
      setTasks(result.items);
      setTotalPages(result.totalPages);
    } catch (error) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadEvents = async () => {
    try {
      const eventResult = await eventService.getOrganizationEvents({
        page: 1,
        size: 50,
        sortBy: "startDate",
        sortDirection: "desc",
      });
      setEvents(eventResult.items);
    } catch (error) {
      console.error("Failed to load events:", error);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!formData.eventId) {
        toast.error("Please select an event");
        return;
      }

      await onSiteTaskService.createOnSiteTask(formData);
      toast.success("Task created successfully");
      setIsDialogOpen(false);
      resetForm();
      loadTasks();
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      // Note: Delete functionality not implemented in backend yet
      toast.info("Delete functionality will be implemented soon");
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  const resetForm = () => {
    setFormData({
      eventId: 0,
      categoryId: 1,
      statusId: 1,
      taskName: "",
      description: "",
      startTime: "",
      endTime: "",
      location: "",
      requiredSkills: "",
      priority: "Medium",
      difficulty: "Medium",
      instructions: "",
      materials: "",
      safetyRequirements: "",
      completionCriteria: "",
      notes: "",
    });
  };

  const getStatusBadge = (statusId: number) => {
    const statusMap: Record<
      number,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      1: { label: "Pending", variant: "outline" },
      2: { label: "In Progress", variant: "default" },
      3: { label: "Completed", variant: "secondary" },
      4: { label: "Verified", variant: "default" },
    };

    const status = statusMap[statusId] || {
      label: "Unknown",
      variant: "outline",
    };
    return <Badge variant={status.variant}>{status.label}</Badge>;
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

  const filteredTasks = tasks.filter(
    (task) =>
      task.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            On-Site Task Management
          </h1>
          <p className="text-muted-foreground">
            Manage tasks for events and assign volunteers
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Task
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Task</DialogTitle>
              <DialogDescription>
                Create a new on-site task for an event
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event">Event *</Label>
                  <Select
                    value={formData.eventId.toString()}
                    onValueChange={(value) =>
                      setFormData({ ...formData, eventId: parseInt(value) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem
                          key={event.eventId}
                          value={event.eventId.toString()}
                        >
                          {event.eventName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taskName">Task Name *</Label>
                  <Input
                    id="taskName"
                    value={formData.taskName}
                    onChange={(e) =>
                      setFormData({ ...formData, taskName: e.target.value })
                    }
                    placeholder="Enter task name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Task description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) =>
                      setFormData({ ...formData, priority: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select
                    value={formData.difficulty}
                    onValueChange={(value) =>
                      setFormData({ ...formData, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Easy">Easy</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    placeholder="Task location"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  placeholder="Detailed instructions for the task"
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select value={selectedEvent} onValueChange={setSelectedEvent}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Events" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                {events.map((event) => (
                  <SelectItem
                    key={event.eventId}
                    value={event.eventId.toString()}
                  >
                    {event.eventName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="1">Pending</SelectItem>
                <SelectItem value="2">In Progress</SelectItem>
                <SelectItem value="3">Completed</SelectItem>
                <SelectItem value="4">Verified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <Card
              key={task.taskId}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{task.taskName}</CardTitle>
                  <div className="flex space-x-1">
                    {getStatusBadge(task.statusId)}
                    {getPriorityBadge(task.priority)}
                  </div>
                </div>
                <CardDescription className="line-clamp-2">
                  {task.description || "No description provided"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-2 h-4 w-4" />
                  {task.startTime
                    ? new Date(task.startTime).toLocaleDateString()
                    : "No date set"}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-2 h-4 w-4" />
                  {task.location || "No location specified"}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {task.assignedVolunteers || 0} /{" "}
                  {task.requiredVolunteers || 0} volunteers
                </div>
                {task.estimatedHours && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="mr-2 h-4 w-4" />
                    {task.estimatedHours} hours estimated
                  </div>
                )}

                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-1 h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteTask(task.taskId)}
                  >
                    <Trash2 className="mr-1 h-3 w-3" />
                    Delete
                  </Button>
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

export default OnSiteTaskManagementPage;
