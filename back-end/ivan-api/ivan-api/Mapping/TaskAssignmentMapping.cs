using AutoMapper;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.DTOs.TaskAssignments;
using ivan_api.Models;

namespace ivan_api.Mapping
{
    public class TaskAssignmentMapping : Profile
    {
        public TaskAssignmentMapping()
        {
            CreateMap<TaskAssignment, TaskAssignmentViewModel>();
            CreateMap<TaskAssignmentViewModel, TaskAssignment>();

            CreateMap<TaskAssignment, TaskAssignmentInputModel>();
            CreateMap<TaskAssignmentInputModel, TaskAssignment>();

            CreateMap<TaskAssignment, TaskAssignmentUpdateModel>();
            CreateMap<TaskAssignmentUpdateModel, TaskAssignment>();

            CreateMap<TaskAssignmentInputModel, TaskAssignmentViewModel>();
            CreateMap<TaskAssignmentViewModel, TaskAssignmentInputModel>();

            CreateMap<TaskAssignmentUpdateModel, TaskAssignmentViewModel>();
            CreateMap<TaskAssignmentViewModel, TaskAssignmentUpdateModel>();

            CreateMap<TaskAssignmentUpdateModel, TaskAssignmentInputModel>();
            CreateMap<TaskAssignmentInputModel, TaskAssignmentUpdateModel>();
        }
    }
}
