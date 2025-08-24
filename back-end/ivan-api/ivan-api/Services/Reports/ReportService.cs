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

            // Enhanced Completion Gates Validation
            await ValidateEventCompletionGates(eventId);

            // Generate comprehensive report content
            var reportContent = await GenerateEventReportContent(eventId);

            var report = _mapper.Map<Report>(reportInputModel);
            report.Content = reportContent + report.Content;
            report.CreatedAt = DateTime.Now;
            report.GeneratedDate = DateTime.Now;

            return await _repository.AddEventReport(report, eventId);
        }

        private async Task ValidateEventCompletionGates(int eventId)
        {
            // Gate 1: Validate all OnSite Tasks are completed or canceled
            await ValidateOnSiteTasksCompletion(eventId);

            // Gate 2: Validate all Event Registrations are reviewed
            await ValidateEventRegistrationsReviewed(eventId);

            // Gate 3: Validate all Task Assignments are completed
            await ValidateTaskAssignmentsCompletion(eventId);

            // Gate 4: Validate approved volunteers have checked out
            await ValidateVolunteerCheckOut(eventId);

            // Gate 5: Validate event timing constraints
            await ValidateEventTimingConstraints(eventId);
        }

        private async Task ValidateOnSiteTasksCompletion(int eventId)
        {
            var taskList = (await _onSiteTaskRepository.GetAllOnSiteTasks())
                .Where(t => t.EventId == eventId).ToList();

            var incompleteTasks = taskList.Where(t => t.StatusId != 3 /*completed*/ && t.StatusId != 5 /*canceled*/).ToList();
            
            if (incompleteTasks.Any())
            {
                var taskNames = string.Join(", ", incompleteTasks.Select(t => t.TaskName ?? $"Task {t.TaskId}"));
                throw new Exception($"Not all OnSite tasks are completed or canceled. Incomplete tasks: {taskNames}");
            }
        }

        private async Task ValidateEventRegistrationsReviewed(int eventId)
        {
            var regList = (await _eventRegistrationRepository.GetAllEventRegistrationsAsync())
                .Where(r => r.EventId == eventId).ToList();

            var unreviewed = regList.Where(reg => 
                !((reg.ApprovedBy.HasValue && reg.ApprovedDate.HasValue) || 
                  (reg.RejectedBy.HasValue && reg.RejectedDate.HasValue) || 
                  reg.CancelledDate.HasValue)).ToList();

            if (unreviewed.Any())
            {
                throw new Exception($"Not all Event Registrations have been reviewed. {unreviewed.Count} registrations are still pending review.");
            }
        }

        private async Task ValidateTaskAssignmentsCompletion(int eventId)
        {
            var assignmentList = (await _taskAssignmentRepository.SearchTaskAssignmentsByEventId(eventId)).ToList();
            var incompleteAssignments = assignmentList.Where(a => !a.Status.Equals("Completed", StringComparison.OrdinalIgnoreCase)).ToList();

            if (incompleteAssignments.Any())
            {
                throw new Exception($"Not all task assignments are completed. {incompleteAssignments.Count} assignments are still incomplete.");
            }
        }

        private async Task ValidateVolunteerCheckOut(int eventId)
        {
            var approvedRegistrations = (await _eventRegistrationRepository.GetAllEventRegistrationsAsync())
                .Where(r => r.EventId == eventId && r.ApprovedBy.HasValue && r.ApprovedDate.HasValue)
                .ToList();

            var notCheckedOut = approvedRegistrations.Where(r => r.CheckInTime.HasValue && !r.CheckOutTime.HasValue).ToList();

            if (notCheckedOut.Any())
            {
                throw new Exception($"Not all approved volunteers have checked out. {notCheckedOut.Count} volunteers are still checked in.");
            }
        }

        private async Task ValidateEventTimingConstraints(int eventId)
        {
            var eventEntity = await _eventRepository.GetByIdAsync(eventId);
            if (eventEntity == null) return;

            var now = DateTime.UtcNow;
            
            // Event should have ended before completion report can be generated
            if (now < eventEntity.EndDate)
            {
                throw new Exception($"Event has not ended yet. Event ends at {eventEntity.EndDate:yyyy-MM-dd HH:mm} UTC.");
            }

            // Allow some buffer time after event end for final check-outs and cleanup
            var bufferTime = eventEntity.EndDate.AddHours(2); // 2-hour buffer
            if (now < bufferTime)
            {
                throw new Exception($"Please wait until {bufferTime:yyyy-MM-dd HH:mm} UTC before generating completion report to allow for final check-outs and cleanup.");
            }
        }

        private async Task<string> GenerateEventReportContent(int eventId)
        {
            // OnSite Tasks Statistics
            var taskList = (await _onSiteTaskRepository.GetAllOnSiteTasks())
                .Where(t => t.EventId == eventId).ToList();
            
            int compCount = taskList.Count(t => t.StatusId == 3);
            int cancelCount = taskList.Count(t => t.StatusId == 5);
            int total = taskList.Count;
            decimal? totalActualHours = taskList.Where(t => t.StatusId == 3 && t.ActualHours.HasValue)
                .Sum(t => t.ActualHours.Value);
            var averageHours = total > 0 ? totalActualHours / total : 0;

            // Registration Statistics
            var regList = (await _eventRegistrationRepository.GetAllEventRegistrationsAsync())
                .Where(r => r.EventId == eventId).ToList();
            
            int totalRegs = regList.Count;
            int approvedCount = regList.Count(r => r.ApprovedBy.HasValue && r.ApprovedDate.HasValue);
            int rejectedCount = regList.Count(r => r.RejectedBy.HasValue && r.RejectedDate.HasValue);
            int canceledRegsCount = regList.Count(r => r.CancelledDate.HasValue);
            int attendedCount = regList.Count(r => r.CheckInTime.HasValue);
            int completedCount = regList.Count(r => r.CheckInTime.HasValue && r.CheckOutTime.HasValue);

            // Task Assignment Statistics
            var assignmentList = (await _taskAssignmentRepository.SearchTaskAssignmentsByEventId(eventId)).ToList();
            int totalAssignments = assignmentList.Count;
            int completedAssignments = assignmentList.Count(a => a.Status.Equals("Completed", StringComparison.OrdinalIgnoreCase));

            // Calculate volunteer hours
            decimal totalVolunteerHours = regList.Where(r => r.ActualHours.HasValue).Sum(r => r.ActualHours.Value);
            decimal averageVolunteerHours = approvedCount > 0 ? totalVolunteerHours / approvedCount : 0;

            return $"=== EVENT COMPLETION REPORT ===\n" +
                   $"Generated: {DateTime.UtcNow:yyyy-MM-dd HH:mm} UTC\n\n" +
                   
                   $"=== ONSITE TASKS SUMMARY ===\n" +
                   $"Total Tasks: {total}\n" +
                   $"Completed Tasks: {compCount}\n" +
                   $"Canceled Tasks: {cancelCount}\n" +
                   $"Task Completion Rate: {(total > 0 ? (compCount * 100.0 / total):0):F1}%\n" +
                   $"Total Task Hours: {totalActualHours:F2}\n" +
                   $"Average Hours per Task: {averageHours:F2}\n\n" +
                   
                   $"=== VOLUNTEER REGISTRATION SUMMARY ===\n" +
                   $"Total Registrations: {totalRegs}\n" +
                   $"Approved Registrations: {approvedCount}\n" +
                   $"Rejected Registrations: {rejectedCount}\n" +
                   $"Canceled Registrations: {canceledRegsCount}\n" +
                   $"Volunteers Attended: {attendedCount}\n" +
                   $"Volunteers Completed: {completedCount}\n" +
                   $"Attendance Rate: {(approvedCount > 0 ? (attendedCount * 100.0 / approvedCount):0):F1}%\n" +
                   $"Completion Rate: {(attendedCount > 0 ? (completedCount * 100.0 / attendedCount):0):F1}%\n\n" +
                   
                   $"=== TASK ASSIGNMENTS SUMMARY ===\n" +
                   $"Total Assignments: {totalAssignments}\n" +
                   $"Completed Assignments: {completedAssignments}\n" +
                   $"Assignment Completion Rate: {(totalAssignments > 0 ? (completedAssignments * 100.0 / totalAssignments):0):F1}%\n\n" +
                   
                   $"=== VOLUNTEER HOURS SUMMARY ===\n" +
                   $"Total Volunteer Hours: {totalVolunteerHours:F2}\n" +
                   $"Average Hours per Volunteer: {averageVolunteerHours:F2}\n\n" +
                   
                   $"=== COMPLETION GATES STATUS ===\n" +
                   $"✓ All OnSite Tasks completed or canceled\n" +
                   $"✓ All Event Registrations reviewed\n" +
                   $"✓ All Task Assignments completed\n" +
                   $"✓ All approved volunteers checked out\n" +
                   $"✓ Event timing constraints satisfied\n\n";
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
