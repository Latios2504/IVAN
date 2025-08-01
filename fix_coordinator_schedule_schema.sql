-- Fix for Coordinator Schedule Database Schema
-- Drop the existing foreign key constraint
USE VolunteerManagementSystem;
GO

-- Drop the problematic foreign key constraint
ALTER TABLE CoordinatorSchedules 
DROP CONSTRAINT [FK__Coordinat__Coord__531856C7]; -- You may need to find the actual constraint name
GO

-- Add the correct foreign key constraint
ALTER TABLE CoordinatorSchedules 
ADD CONSTRAINT FK_CoordinatorSchedules_VolunteerCoordinators_CoordinatorId
FOREIGN KEY (CoordinatorId) REFERENCES VolunteerCoordinators(CoordinatorId) ON DELETE CASCADE;
GO

-- Also add missing navigation properties to VolunteerCoordinators if not exists
-- This will be handled in the model regeneration

-- Alternative: Drop and recreate the table with correct schema
/*
DROP TABLE CoordinatorSchedules;
GO

-- Coordinator Schedules with corrected foreign key
CREATE TABLE CoordinatorSchedules (
    ScheduleId INT IDENTITY(1,1) PRIMARY KEY,
    CoordinatorId INT NOT NULL,
    EventId INT,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(1000),
    StartDateTime DATETIME2 NOT NULL,
    EndDateTime DATETIME2 NOT NULL,
    Location NVARCHAR(500),
    ScheduleType NVARCHAR(50),
    Priority NVARCHAR(20),
    Status NVARCHAR(50),
    IsAllDay BIT DEFAULT 0,
    ReminderMinutes INT DEFAULT 60,
    Notes NVARCHAR(1000),
    CreatedBy INT,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (CoordinatorId) REFERENCES VolunteerCoordinators(CoordinatorId) ON DELETE CASCADE,
    FOREIGN KEY (EventId) REFERENCES Events(EventId),
    FOREIGN KEY (CreatedBy) REFERENCES Users(UserId)
);
GO
*/
