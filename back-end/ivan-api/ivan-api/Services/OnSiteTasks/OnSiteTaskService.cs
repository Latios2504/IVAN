using AutoMapper;
using DocumentFormat.OpenXml.Office2010.Excel;
using DocumentFormat.OpenXml.Spreadsheet;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.TaskAssignments;
using ivan_api.Models;
using ivan_api.Repository.EventRegistrationRepo;
using ivan_api.Repository.OnSiteTasks;
using ivan_api.Repository.TaskAssignments;
using ivan_api.Repository.UserManagement;

namespace ivan_api.Services.OnSiteTasks
{
    public class OnSiteTaskService : IOnSiteTaskService
    {
        private readonly IOnSiteTaskRepository _repository;
        private readonly IMapper _mapper;
        private readonly ITaskAssignmentRepository _taskAssignmentRepository;
        private readonly IEventRegistrationRepository _eventRegistrationRepository;
        private readonly IUserRepository _userRepository;

        public OnSiteTaskService(IOnSiteTaskRepository repository, IMapper mapper, ITaskAssignmentRepository taskAssignmentRepository, IEventRegistrationRepository eventRegistrationRepository, IUserRepository userRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _taskAssignmentRepository = taskAssignmentRepository;
            _eventRegistrationRepository = eventRegistrationRepository;
            _userRepository = userRepository;
        }

        public async Task<bool> AddOnSiteTask(OnSiteTaskInputModel onSiteTaskInputModel, int createdById)
        {
            var task = _mapper.Map<OnSiteTask>(onSiteTaskInputModel);
            task.CreatedAt = DateTime.Now;
            task.UpdatedAt = DateTime.Now;

            if (onSiteTaskInputModel.StartTime.HasValue && onSiteTaskInputModel.EndTime.HasValue)
            {
                task.EstimatedHours =
                    (decimal)(onSiteTaskInputModel.EndTime.Value - onSiteTaskInputModel.StartTime.Value).TotalHours;
            }
            else
            {
                task.EstimatedHours = null;
            }
            task.StatusId = 4;//On Hold
            task.CreatedBy = createdById;

            return await _repository.AddOnSiteTask(task);
        }

        public async Task<bool> UpdateOnSiteTask(OnSiteTaskUpdateModel OnSiteTaskUpdateModel, int id)
        {
            var existingTask = await _repository.GetOnSiteTaskById(id);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            _mapper.Map(OnSiteTaskUpdateModel, existingTask);
            existingTask.UpdatedAt = DateTime.Now;

            if (OnSiteTaskUpdateModel.StartTime.HasValue && OnSiteTaskUpdateModel.EndTime.HasValue)
            {
                existingTask.EstimatedHours =
                    (decimal)(OnSiteTaskUpdateModel.EndTime.Value - OnSiteTaskUpdateModel.StartTime.Value).TotalHours;
            }
            else
            {
                existingTask.EstimatedHours = null;
            }

            return await _repository.UpdateOnSiteTask(existingTask);
        }

        public async Task<bool> DeleteOnSiteTask(int taskId)
        {
            try
            {
                return await _repository.DeleteOnSiteTask(taskId);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<bool> AssignAllOnSiteTask(int id)
        {
            var existingTask = await _repository.GetOnSiteTaskById(id);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            existingTask.UpdatedAt = DateTime.Now;

            existingTask.StatusId = 1;//not started

            var updateResult = await _repository.UpdateOnSiteTask(existingTask);

            if(!updateResult)
                return false;

            //add assignment
            var eventRegList = (await _eventRegistrationRepository.GetAllEventRegistrationsAsync()).ToList();
            var validVolunnteerIdList = new List<int>();

            foreach (var eventRegistration in eventRegList)//get volunnteers for current event
            {
                if(
                    eventRegistration.EventId == existingTask.EventId &&
                    (
                     eventRegistration.StatusId == 2 ||//Approved
                     eventRegistration.StatusId == 5//Attended
                    )
                  )
                {
                    validVolunnteerIdList.Add(eventRegistration.VolunteerId);
                }
            }

            if(validVolunnteerIdList == null || validVolunnteerIdList.Count == 0)
            {
                throw new Exception("No valid volunteer available");
            }

            //var count = 0;//success count

            foreach(var volunteer in validVolunnteerIdList)
            {
                var existingAssignment = await _taskAssignmentRepository
                    .SearchTaskAssignment(id, volunteer);

                if (existingAssignment != null)//check dpplicate
                {
                    // Skip or update instead of inserting duplicate
                    continue;
                }

                var assignment = new TaskAssignmentInputModel
                {
                    VolunteerId = volunteer,
                    TaskId = id,
                    Status = "Assigned",
                    AssignedDate = DateTime.Now
                };

                var input = _mapper.Map<TaskAssignment>(assignment);
                var assginmentResult = await _taskAssignmentRepository.AddTaskAssignment(input);

                //if (assginmentResult)
                //    count++;
                //else
                if (!assginmentResult)
                    throw new Exception("Failed to assign task to volunter id:" + volunteer);
            }

            //if (count != validVolunnteerIdList.Count)
            //    throw new Exception("Not all tasks assigned successfully");
            return true;

        }

        public async Task<bool> AssignTask(int taskId, int volunteerId)
        {
            var existingTask = await _repository.GetOnSiteTaskById(taskId);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            existingTask.UpdatedAt = DateTime.Now;

            existingTask.StatusId = 1;//not started

            var updateResult = await _repository.UpdateOnSiteTask(existingTask);

            if (!updateResult)
                return false;

            //add assignment
            var eventRegList = (await _eventRegistrationRepository.GetAllEventRegistrationsAsync()).ToList();
            var validVolunnteerIdList = new List<int>();

            foreach (var eventRegistration in eventRegList)//get volunnteers for current event
            {
                if (
                    eventRegistration.EventId == existingTask.EventId &&
                    (
                     eventRegistration.StatusId == 2 ||//Approved
                     eventRegistration.StatusId == 5//Attended
                    )
                  )
                {
                    validVolunnteerIdList.Add(eventRegistration.VolunteerId);
                }
            }

            if (validVolunnteerIdList == null || validVolunnteerIdList.Count == 0)
            {
                throw new Exception("No valid volunteer available");
            }

            if (!validVolunnteerIdList.Contains(volunteerId))
            {
                throw new Exception("No valid volunteer available");
            }

            var existingAssignment = await _taskAssignmentRepository
                .SearchTaskAssignment(taskId, volunteerId);

            if (existingAssignment != null)//check dpplicate
            {
                // Skip or update instead of inserting duplicate
                throw new Exception("Dupplicate task assignment exist");
            }

            var assignment = new TaskAssignmentInputModel
            {
                VolunteerId = volunteerId,
                TaskId = taskId,
                Status = "Assigned",
                AssignedDate = DateTime.Now
            };

            var input = _mapper.Map<TaskAssignment>(assignment);
            var assginmentResult = await _taskAssignmentRepository.AddTaskAssignment(input);

            if (!assginmentResult)
                throw new Exception("Failed to assign task to volunter id:" + volunteerId);

            return true;
        }

        public async Task<bool> StartAllOnSiteTask(int id)
        {
            var existingTask = await _repository.GetOnSiteTaskById(id);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            existingTask.UpdatedAt = DateTime.Now;

            existingTask.StatusId = 2;//In Progress

            var result = await _repository.UpdateOnSiteTask(existingTask);

            var assignmentList = (await _taskAssignmentRepository.SearchTaskAssignmentsByTaskId(existingTask.TaskId)).ToList();

            int count = 0;

            foreach(var assignment in assignmentList)
            {
                assignment.UpdatedAt = DateTime.Now;
                assignment.StartedAt = DateTime.Now;
                assignment.Status = "Started";

                var assignmenResult = await _taskAssignmentRepository.UpdateTaskAssignment(assignment);

                if(assignmenResult) count++;
            }

            if (count == assignmentList.Count() && result)
                return true;
            else
                throw new Exception();
        }

        public async Task<bool> StartTask(int taskId, int volunteerId)
        {
            var existingTask = await _repository.GetOnSiteTaskById(taskId);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            existingTask.UpdatedAt = DateTime.Now;

            existingTask.StatusId = 2;//In Progress

            var result = await _repository.UpdateOnSiteTask(existingTask);

            //var assignmentList = (await _taskAssignmentRepository.SearchTaskAssignmentsByTaskId(existingTask.TaskId)).ToList();
            var assignedtask = await _taskAssignmentRepository.SearchTaskAssignment(taskId, volunteerId);

            assignedtask.UpdatedAt = DateTime.Now;
            assignedtask.StartedAt = DateTime.Now;
            assignedtask.Status = "Started";

            return await _taskAssignmentRepository.UpdateTaskAssignment(assignedtask);
        }

        public async Task<bool> CompleteAllOnSiteTask(int id)
        {
            var existingTask = await _repository.GetOnSiteTaskById(id);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            existingTask.UpdatedAt = DateTime.Now;
            existingTask.CompletedAt = DateTime.Now;
            existingTask.StatusId = 3;//Completed

            var result = await _repository.UpdateOnSiteTask(existingTask);

            var assignmentList = (await _taskAssignmentRepository.SearchTaskAssignmentsByTaskId(existingTask.TaskId)).ToList();

            int count = 0;

            foreach (var assignment in assignmentList)
            {
                assignment.UpdatedAt = DateTime.Now;
                assignment.CompletedAt = DateTime.Now;
                assignment.Status = "Completed";

                var assignmenResult = await _taskAssignmentRepository.UpdateTaskAssignment(assignment);

                if (assignmenResult) count++;
            }

            if (count == assignmentList.Count() && result)
                return true;
            else
                throw new Exception();
        }

        public async Task<bool> UnassigTask(int taskId, int volunteerId)
        {
            var task = await _taskAssignmentRepository.SearchTaskAssignment(taskId, volunteerId);
            if (task == null)
            {
                throw new Exception("Task Assignment not found");
            }

            return await _taskAssignmentRepository.DeleteTaskAssignment(task.AssignmentId);
        }

        public async Task<bool> CompleteTask(int taskId, int volunteerId)
        {
            var assignment = await _taskAssignmentRepository.SearchTaskAssignment(taskId, volunteerId);
            if (assignment == null)
            {
                throw new Exception("Task Assignment not found");
            }

            assignment.UpdatedAt = DateTime.Now;
            assignment.CompletedAt = DateTime.Now;
            assignment.Status = "Completed";
            var assignmenResult = await _taskAssignmentRepository.UpdateTaskAssignment(assignment);

            //check if all assignment is completed => if true, complete on site task
            var list = await _taskAssignmentRepository.SearchTaskAssignmentsByTaskId(taskId);
            bool result = false;

            foreach(var assign in list)
            {
                if (assign.Status == null || !assign.Status.Equals("Completed"))
                    break;
                
                result = true;
            }

            if (result)
            {
                var existingTask = await _repository.GetOnSiteTaskById(taskId);
                if (existingTask == null)
                {
                    throw new Exception("On Site Task not found");
                }

                existingTask.UpdatedAt = DateTime.Now;
                existingTask.CompletedAt = DateTime.Now;
                existingTask.StatusId = 3;//Completed

                await _repository.UpdateOnSiteTask(existingTask);
            }

            return assignmenResult;
        }

        public async Task<bool> AssignTask(int taskId, int volunteerId, int assignedByUserId)
        {
            // Dùng logic gán cũ
            var result = await AssignTask(taskId, volunteerId);
            if (!result) return false;

            // Ghi nhận người giao
            var assignment = await _taskAssignmentRepository.SearchTaskAssignment(taskId, volunteerId);
            if (assignment == null) return false;

            assignment.AssignedBy = assignedByUserId;
            if (assignment.AssignedDate == null) assignment.AssignedDate = DateTime.Now;

            return await _taskAssignmentRepository.UpdateTaskAssignment(assignment);
        }

        //public async Task<bool> StartTask(int taskId, int volunteerId)
        //{
        //    var assignment = await _taskAssignmentRepository.SearchTaskAssignment(taskId, volunteerId);
        //    if (assignment == null)
        //    {
        //        throw new Exception("Task Assignment not found");
        //    }

        //    assignment.UpdatedAt = DateTime.Now;
        //    assignment.CompletedAt = DateTime.Now;
        //    assignment.Status = "Started";
        //    var assignmenResult = await _taskAssignmentRepository.UpdateTaskAssignment(assignment);

        //    return assignmenResult;
        //}

        public async Task<IEnumerable<OnSiteTaskViewModel>> ListOnSiteTask(OnSiteTaskFilterModel filter)
        {
            var tasks = await _repository.ListOnSiteTask(filter);
            return _mapper.Map<IEnumerable<OnSiteTaskViewModel>>(tasks);
        }

        public async Task<OnSiteTaskViewModel> GetOnSiteTaskById(int id)
        {
            var task = await _repository.GetOnSiteTaskById(id);
            if (task == null)
            {
                throw new Exception("On Site Task not found");
            }

            return _mapper.Map<OnSiteTaskViewModel>(task);
        }

        public async Task<IEnumerable<TaskAssignmentViewModel>> GetTaskAssignmentsById(int id)
        {
            var task = await _repository.GetOnSiteTaskById(id);
            if (task == null)
            {
                throw new Exception("On Site Task not found");
            }

            var list = (await _taskAssignmentRepository.SearchTaskAssignmentsByTaskId(id)).ToList();
            var output = new List<TaskAssignmentViewModel>();

            foreach (var assignment in list)
            {
                output.Add(_mapper.Map<TaskAssignmentViewModel>(assignment));
            }

            return output;
        }

        public async Task<PagedResultDto<OnSiteTaskViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetOnSiteTasksAsync(pageNumber, pageSize);
        }

        public async Task<PagedResultDto<OnSiteTaskViewModel>> GetListForCoordinator(int pageNumber, int pageSize, string idValue)
        {
            var user = await _userRepository.GetUserForRoleDetectionAsync(int.Parse(idValue));

            if (user.RoleId != 4)//!= coordinator
                throw new Exception("Invalid user role");

            return await _repository.GetOnSiteTasksByCreatedByIdAsync(pageNumber, pageSize, user.UserId);
        }

        public async Task<int> GetLastId() => await _repository.GetLastId();

        public async Task<TaskAssignmentViewModel> SearchTaskAssignment(int taskId, int volunteerId)
        {
            var assignment = await _taskAssignmentRepository.SearchTaskAssignment(taskId, volunteerId);
            return _mapper.Map<TaskAssignmentViewModel>(assignment);
        }
    }
}
