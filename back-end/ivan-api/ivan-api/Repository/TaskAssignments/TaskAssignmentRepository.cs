using AutoMapper;
using DocumentFormat.OpenXml.Office2010.Excel;
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
    }
}
