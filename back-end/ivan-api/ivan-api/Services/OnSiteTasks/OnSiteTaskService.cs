using AutoMapper;
using ivan_api.Models;
using ivan_api.DTOs.OnSiteTasks;
using ivan_api.Repository.OnSiteTasks;
using ivan_api.DTOs.Common;

namespace ivan_api.Services.OnSiteTasks
{
    public class OnSiteTaskService : IOnSiteTaskService
    {
        private readonly IOnSiteTaskRepository _repository;
        private readonly IMapper _mapper;

        public OnSiteTaskService(IOnSiteTaskRepository repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        public async Task<bool> AddOnSiteTask(OnSiteTaskInputModel onSiteTaskInputModel)
        {
            var task = _mapper.Map<OnSiteTask>(onSiteTaskInputModel);
            task.CreatedAt = DateTime.Now;
            task.UpdatedAt = DateTime.Now;

            return await _repository.AddOnSiteTask(task);
        }

        public async Task<bool> UpdateOnSiteTask(OnSiteTaskViewModel onSiteTaskViewModel)
        {
            var existingTask = await _repository.GetOnSiteTaskById(onSiteTaskViewModel.TaskId);
            if (existingTask == null)
            {
                throw new Exception("On Site Task not found");
            }

            _mapper.Map(onSiteTaskViewModel, existingTask);
            existingTask.UpdatedAt = DateTime.Now;
            return await _repository.UpdateOnSiteTask(existingTask);
        }

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

        public async Task<PagedResultDto<OnSiteTaskViewModel>> GetList(int pageNumber, int pageSize)
        {
            return await _repository.GetOnSiteTasksAsync(pageNumber, pageSize);
        }
    }
}
