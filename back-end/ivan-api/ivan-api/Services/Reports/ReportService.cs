using AutoMapper;
using ivan_api.DTOs.Common;
using ivan_api.DTOs.Reports;
using ivan_api.Models;
using ivan_api.Repository.EventRegistrationRepo;
using ivan_api.Repository.EventRepo;
using ivan_api.Repository.OnSiteTasks;
using ivan_api.Repository.OrganizationProfiles;
using ivan_api.Repository.Reports;
using ivan_api.Repository.TaskAssignments;
using Microsoft.Extensions.Logging;
using PdfSharp.Pdf;

namespace ivan_api.Services.Reports
{
    public class ReportService : IReportService
    {
        private readonly IReportRepository _repository;
        private readonly IMapper _mapper;
        private readonly IEventRepository _eventRepository;
        private readonly IOrganizationProfileRepository _organizationProfileRepository;
        private readonly IOnSiteTaskRepository _onSiteTaskRepository;
        private readonly ITaskAssignmentRepository _taskAssignmentRepository;
        private readonly IEventRegistrationRepository _eventRegistrationRepository;

        public ReportService(IReportRepository repository, 
                             IMapper mapper, 
                             IEventRepository eventRepository, 
                             IOrganizationProfileRepository organizationProfileRepository, 
                             IOnSiteTaskRepository onSiteTaskRepository, 
                             ITaskAssignmentRepository taskAssignmentRepository,
                             IEventRegistrationRepository eventRegistrationRepository)
        {
            _repository = repository;
            _mapper = mapper;
            _eventRepository = eventRepository;
            _organizationProfileRepository = organizationProfileRepository;
            _onSiteTaskRepository = onSiteTaskRepository;
            _taskAssignmentRepository = taskAssignmentRepository;
            _eventRegistrationRepository = eventRegistrationRepository;
        }

        public async Task<bool> AddEventReport(ReportInputModel reportInputModel, int eventId)
        {
            var eventResult = await _eventRepository.GetByIdAsync(eventId);
            if (eventResult == null)
                throw new Exception("Event not found");

            //check all task completed
            int compCount = 0;
            int cancelCount = 0;
            int total = 0;
            decimal? totalActualHours = 0;

            var taskList = (await _onSiteTaskRepository.GetAllOnSiteTasks()).ToList();
            foreach (var task in taskList)
            {
                if (task.EventId == eventId && (task.StatusId != 3 /*completed*/ && task.StatusId != 5 /*canceled*/))
                    throw new Exception("Not all tasks are completed or canceled.");

                if (task.EventId == eventId && task.StatusId == 3 /*completed*/)
                    compCount++;

                if (task.EventId == eventId && task.StatusId == 5 /*canceled*/)
                    cancelCount++;

                if(task.EventId == eventId)
                    total++;

                if (task.ActualHours != null && task.StatusId == 3 /*completed*/)
                    totalActualHours += task.ActualHours;
            }


            var regList = (await _eventRegistrationRepository.GetAllEventRegistrationsAsync()).ToList();
            int totalRegs = 0;
            int approvedCount = 0;
            int rejectedCount = 0;
            int canceledRegsCount = 0;

            foreach ( var reg in regList)
            {
                if (reg.EventId == eventId && 
                    !(
                    (reg.ApprovedBy.HasValue && reg.ApprovedDate.HasValue) || 
                    (reg.RejectedBy.HasValue && reg.RejectedDate.HasValue) || 
                    reg.CancelledDate.HasValue))
                {
                    throw new Exception("Not all Event Registrations has been reviewed");
                }
                if (reg.EventId == eventId)
                    totalRegs++;
                if(reg.EventId == eventId && (reg.ApprovedBy.HasValue && reg.ApprovedDate.HasValue))
                    approvedCount++;
                if (reg.EventId == eventId && (reg.RejectedBy.HasValue && reg.RejectedDate.HasValue))
                    rejectedCount++;
                if (reg.EventId == eventId && reg.CancelledDate.HasValue)
                    canceledRegsCount++;

            }

            var assignmentList = (await _taskAssignmentRepository.SearchTaskAssignmentsByEventId(eventId)).ToList();
            foreach( var assignment in assignmentList)
            {
                if (!assignment.Status.Equals("Completed"))
                    throw new Exception("Not all assignments are completed");
            }

            var averageHours = total > 0 ? totalActualHours / total : 0;


            string contentData = string.Empty;
            contentData = "Number of completed tasks: " + compCount + "\n" +
                          "Number of canceled tasks:" + cancelCount + "\n" +
                          "Total number of tasks:" + total + "\n" +
                          "Avarage hours/task:" + averageHours + "\n" +
                          "\n" +
                          "Total Registrations for Event " + eventId + ":" + totalRegs + "\n" +
                          "Total Approved Registrations:" + approvedCount + "\n" +
                          "Total Rejected Registrations:" + rejectedCount + "\n" +
                          "Total Cancel Registrations:" + canceledRegsCount + "\n" +
                          "\n";

            var report = _mapper.Map<Report>(reportInputModel);
            report.Content = contentData + report.Content;
            report.CreatedAt = DateTime.Now;
            report.GeneratedDate = DateTime.Now;

            return await _repository.AddEventReport(report, eventId);
        }
        public async Task<bool> AddOrganizationReport(ReportInputModel reportInputModel, int orgId)
        {
            var orgResult = await _organizationProfileRepository.GetOrganizationByOrgIdAsync(orgId);
            if (orgResult == null)
                throw new Exception("Organization not found");

            var report = _mapper.Map<Report>(reportInputModel);
            report.CreatedAt = DateTime.Now;
            report.GeneratedDate = DateTime.Now;

            return await _repository.AddOrganizationReport(report, orgId);
        }
        public async Task<IEnumerable<ReportViewModel>> ListEventReport(ReportFilterModel filter)
        {
            var reports = await _repository.ListEventReport(filter);
            return _mapper.Map<IEnumerable<ReportViewModel>>(reports);
        }
        public async Task<IEnumerable<ReportViewModel>> ListOrganizationReport(ReportFilterModel filter)
        {
            var reports = await _repository.ListOrganizationReport(filter);
            return _mapper.Map<IEnumerable<ReportViewModel>>(reports);
        }
        public async Task<IEnumerable<ReportViewModel>> ListSystemReport(ReportFilterModel filter)
        {
            var reports = await _repository.ListSystemReport(filter);
            return _mapper.Map<IEnumerable<ReportViewModel>>(reports);
        }
        public async Task<ReportViewModel> GetEventReportById(int id)
        {
            var report = await _repository.GetEventReportById(id);
            if (report == null)
            {
                throw new Exception("Event Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }
        public async Task<ReportViewModel> GetOrganizationReportById(int id)
        {
            var report = await _repository.GetOrganizationReportById(id);
            if (report == null)
            {
                throw new Exception("Organization Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }
        public async Task<ReportViewModel> GetSystemReportById(int id)
        {
            var report = await _repository.GetSystemReportById(id);
            if (report == null)
            {
                throw new Exception("System Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }

        public async Task<ReportViewModel> GetReportById(int id)
        {
            var report = await _repository.GetReportById(id);
            if (report == null)
            {
                throw new Exception("Report not found");
            }

            return _mapper.Map<ReportViewModel>(report);
        }

        public async Task<PdfDocument> DownloadEventReportById(int id)
        {
            return await _repository.DownloadEventReportById(id);
        }
        public async Task<PdfDocument> DownloadOrganizationReportById(int id)
        {
            return await _repository.DownloadOrganizationReportById(id);
        }
        public async Task<PdfDocument> DownloadSystemReportById(int id)
        {
            return await _repository.DownloadSystemReportById(id);
        }

        public async Task<PdfDocument> DownloadReportById(int id)
        {
            return await _repository.DownloadReportById(id);
        }

        public async Task<PagedResultDto<ReportViewModel>> GetEventReportList(int pageNumber, int pageSize)
        {
            return await _repository.GetEventReportsAsync(pageNumber, pageSize);
        }

        public async Task<PagedResultDto<ReportViewModel>> GetOrganizationReportList(int pageNumber, int pageSize)
        {
            return await _repository.GetOrganizationReportsAsync(pageNumber, pageSize);
        }

        public async Task<PagedResultDto<ReportViewModel>> GetSystemReportList(int pageNumber, int pageSize)
        {
            return await _repository.GetSystemReportsAsync(pageNumber, pageSize);
        }

        public async Task<int> GetLastId() => await _repository.GetLastId();

        public async Task<int> GetLastIdEvent() => await _repository.GetLastIdEvent();

        public async Task<int> GetLastIdOrganization() => await _repository.GetLastIdOrganization();

        public async Task<int> GetLastIdSystem() => await _repository.GetLastIdSystem();
    }
}
