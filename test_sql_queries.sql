-- =========================================================
-- TEST SQL QUERIES FOR IVAN VOLUNTEER SYSTEM
-- =========================================================

-- Test 1: Hoạt động tình nguyện gần đây nhất
SELECT TOP 1 
    EventId, 
    EventName, 
    StartDate, 
    EndDate,
    Location,
    Description,
    MaxVolunteers,
    CurrentVolunteers
FROM Events 
WHERE IsActive = 1 
ORDER BY StartDate DESC;

-- Test 2: Các hoạt động tình nguyện có thể tham gia
SELECT TOP 10
    EventId,
    EventName,
    StartDate,
    EndDate,
    Location,
    MaxVolunteers,
    CurrentVolunteers,
    (MaxVolunteers - CurrentVolunteers) as AvailableSlots,
    Description,
    RequiredSkills,
    Benefits
FROM Events 
WHERE IsActive = 1 
    AND CurrentVolunteers < MaxVolunteers
    AND StartDate >= GETDATE()
ORDER BY StartDate ASC;

-- Test 3: Thông tin tình nguyện viên
SELECT 
    vp.VolunteerId,
    up.FirstName + ' ' + up.LastName as FullName,
    vp.StudentId,
    vp.University,
    vp.Major,
    vp.YearOfStudy,
    vp.VolunteerHours,
    vp.Rating,
    vp.IsVerified
FROM VolunteerProfiles vp
JOIN Users u ON vp.UserId = u.UserId
JOIN UserProfiles up ON u.UserId = up.UserId
WHERE vp.IsActive = 1;

-- Test 4: Kỹ năng của tình nguyện viên
SELECT 
    vs.VolunteerId,
    up.FirstName + ' ' + up.LastName as FullName,
    s.SkillName,
    vs.ProficiencyLevel,
    vs.YearsOfExperience
FROM VolunteerSkills vs
JOIN Skills s ON vs.SkillId = s.SkillId
JOIN VolunteerProfiles vp ON vs.VolunteerId = vp.VolunteerId
JOIN Users u ON vp.UserId = u.UserId
JOIN UserProfiles up ON u.UserId = up.UserId;

-- Test 5: Đăng ký sự kiện
SELECT 
    er.RegistrationId,
    e.EventName,
    up.FirstName + ' ' + up.LastName as VolunteerName,
    er.ApplicationDate,
    er.StatusId,
    e.StartDate,
    e.Location
FROM EventRegistrations er
JOIN Events e ON er.EventId = e.EventId
JOIN VolunteerProfiles vp ON er.VolunteerId = vp.VolunteerId
JOIN Users u ON vp.UserId = u.UserId
JOIN UserProfiles up ON u.UserId = up.UserId
WHERE e.IsActive = 1
ORDER BY er.ApplicationDate DESC;

-- Test 6: Thống kê sự kiện theo tổ chức
SELECT 
    o.OrganizationName,
    COUNT(e.EventId) as TotalEvents,
    SUM(e.MaxVolunteers) as TotalMaxVolunteers,
    SUM(e.CurrentVolunteers) as TotalCurrentVolunteers,
    AVG(e.Rating) as AverageRating
FROM Organizations o
LEFT JOIN Events e ON o.OrganizationId = e.OrganizationId
WHERE o.IsActive = 1
GROUP BY o.OrganizationId, o.OrganizationName
ORDER BY TotalEvents DESC; 