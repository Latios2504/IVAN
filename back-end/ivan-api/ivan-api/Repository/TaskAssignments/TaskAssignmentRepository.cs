using AutoMapper;
using DocumentFormat.OpenXml.Office2010.Excel;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.Models;
using Microsoft.EntityFrameworkCore;

namespace ivan_api.Repository.TaskAssignments
{
    public class TaskAssignmentRepository : ITaskAssignmentRepository
    {
        private readonly VolunteerManagementSystemContext _context;
        private readonly IMapper _mapper;

        public TaskAssignmentRepository(VolunteerManagementSystemContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<bool> AddTaskAssignment(TaskAssignment taskAssignment)
        {
            await _context.TaskAssignments.AddAsync(taskAssignment);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> UpdateTaskAssignment(TaskAssignment taskAssignment)
        {
            _context.ChangeTracker.Clear();//
            _context.TaskAssignments.Attach(taskAssignment);
            _context.Entry(taskAssignment).State = EntityState.Modified;

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> DeleteTaskAssignment(int id)
        {
            var assign = await _context.TaskAssignments.FindAsync(id);
            if (assign == null)
                return false;

            _context.TaskAssignments.Remove(assign);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<TaskAssignment> GetTaskAssignmentById(int id)
        {
            var assignment = await _context.TaskAssignments
                .Include(x => x.AssignedByNavigation)
                .Include(x => x.Task)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => x.AssignmentId == id);
            return assignment;
        }

        public async Task<TaskAssignment> SearchTaskAssignment(int? taskId, int? volunteerId)
        {
            if (!taskId.HasValue || taskId < 0)
                taskId = null;

            if (!volunteerId.HasValue || volunteerId < 0)
                volunteerId = null;

            var assignment = await _context.TaskAssignments
                .Include(x => x.AssignedByNavigation)
                .Include(x => x.Task)
                .Include(x => x.Volunteer)
                .SingleOrDefaultAsync(x => taskId == null ? 1 == 1 : taskId == x.TaskId && volunteerId == null ? 1 == 1 : volunteerId == x.VolunteerId);
            return assignment;
        }

        public async Task<IEnumerable<TaskAssignment>> SearchTaskAssignmentsByTaskId(int taskId)
        {
            var assignments = _context.TaskAssignments
                .Include(x => x.AssignedByNavigation)
                .Include(x => x.Task)
                .Include(x => x.Volunteer)
                .Where(x => x.TaskId == taskId);
            return assignments;
        }

        public async Task<IEnumerable<TaskAssignment>> SearchTaskAssignmentsByEventId(int eventId)
        {
            var assignments = _context.TaskAssignments
                .Include(x => x.AssignedByNavigation)
                .Include(x => x.Task)
                .Include(x => x.Volunteer)
                .Where(x => x.Task.EventId == eventId);
            return assignments;
        }

        public async Task<IEnumerable<TaskAssignment>> GetAllTaskAssignments()
        {
            var assignments = _context.TaskAssignments
                .Include(x => x.AssignedByNavigation)
                    .ThenInclude(u => u.UserProfiles)
                .Include(x => x.Task)
                    .ThenInclude(t => t.Event)
                .Include(x => x.Task)
                    .ThenInclude(t => t.Status)
                .Include(x => x.Volunteer)
                    .ThenInclude(v => v.User)
                        .ThenInclude(u => u.UserProfiles);
            return assignments;
        }

        public async Task<int> GetLastId()
        {
            var query = _context.TaskAssignments
                .Include(x => x.AssignedByNavigation)
                .Include(x => x.Task)
                .Include(x => x.Volunteer)
                .AsQueryable();

            if (query == null) return -1;

            return query.ToList().Last().AssignmentId;
        }

        public async Task<PagedResultDto<TaskAssignment>> GetVolunteerAssignmentsPaged(
            int volunteerId,
            int pageNumber,
            int pageSize,
            int? eventId,
            int? statusId,
            DateTime? from,
            DateTime? to)
        {
            var query = _context.TaskAssignments
                .AsNoTracking()
                .Include(a => a.AssignedByNavigation)
                .Include(a => a.Volunteer)
                .Include(a => a.Task)                // include task
                    .ThenInclude(t => t.Event)       // include event để FE có thể show nhanh tên sự kiện
                .Include(a => a.Task)
                    .ThenInclude(t => t.Status)      // include status của task
                .Where(a => a.VolunteerId == volunteerId)
                .AsQueryable();

            if (eventId.HasValue)
                query = query.Where(a => a.Task.EventId == eventId.Value);

            if (statusId.HasValue)
                query = query.Where(a => a.Task.StatusId == statusId.Value);

            if (from.HasValue)
                query = query.Where(a => a.Task.StartTime >= from.Value);

            if (to.HasValue)
                query = query.Where(a => a.Task.EndTime <= to.Value);

            var totalCount = await query.CountAsync();

            var items = await query
                .OrderBy(a => a.Task.StartTime)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResultDto<TaskAssignment>
            {
                Items = items,
                TotalCount = totalCount,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }

        public async Task<PagedResultDto<CoordinatorAssignedTaskListItemDto>> GetAssignmentsByAssignedByPaged(
            int assignedByUserId, int pageNumber, int pageSize,
            int? eventId, int? statusId, int? volunteerId, DateTime? from, DateTime? to)
        {
            // KHÔNG Include user navigation để tránh kéo passwordHash/salt
            var q = _context.TaskAssignments
                .AsNoTracking()
                .Where(x => x.AssignedBy == assignedByUserId);

            if (eventId.HasValue) q = q.Where(x => x.Task.EventId == eventId.Value);
            if (statusId.HasValue) q = q.Where(x => x.Task.StatusId == statusId.Value);
            if (volunteerId.HasValue) q = q.Where(x => x.VolunteerId == volunteerId.Value);
            if (from.HasValue) q = q.Where(x => x.Task.StartTime >= from.Value);
            if (to.HasValue) q = q.Where(x => x.Task.EndTime <= to.Value);

            var total = await q.CountAsync();

            // Projection => chỉ chọn trường cần (sẽ tạo JOIN vừa đủ, không kéo full object)
            var items = await q
                .OrderByDescending(x => x.Task.StartTime)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => new CoordinatorAssignedTaskListItemDto
                {
                    AssignmentId = a.AssignmentId,
                    TaskId = a.TaskId,
                    EventId = a.Task.EventId,
                    EventName = a.Task.Event.EventName,
                    TaskName = a.Task.TaskName,
                    TaskStatusName = a.Task.Status.StatusName,
                    VolunteerId = a.VolunteerId,
                    VolunteerDisplay =
                        a.Volunteer.User != null
                            ? (a.Volunteer.User.UserProfiles.FirstOrDefault().FullName)
                            : ("Volunteer #" + a.VolunteerId),
                    StartTime = a.Task.StartTime,
                    EndTime = a.Task.EndTime,
                    Location = a.Task.Location,
                    AssignmentStatus = a.Status
                })
                .ToListAsync();

            return new PagedResultDto<CoordinatorAssignedTaskListItemDto>
            {
                Items = items,
                TotalCount = total,
                PageNumber = pageNumber,
                PageSize = pageSize
            };
        }
    }
}
