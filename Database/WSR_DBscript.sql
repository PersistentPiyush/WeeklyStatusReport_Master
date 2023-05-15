USE [wsr]
GO

/****** Object:  Table [dbo].[WSR_Teams]    Script Date: 5/15/2023 10:52:24 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[WSR_Teams](
	[TeamID] [int] NOT NULL,
	[TeamName] [nvarchar](100) NULL,
	[SummaryID] [int] NULL,
	[LeadName] [nvarchar](100) NULL,
	[TaskCompleted] [nvarchar](max) NULL,
	[TaskInProgress] [nvarchar](max) NULL,
	[CurrentWeekPlan] [nvarchar](max) NULL
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


USE [wsr]
GO

/****** Object:  Table [dbo].[WSR_ActionItems]    Script Date: 5/15/2023 10:52:11 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[WSR_ActionItems](
	[ActionItemID] [int] IDENTITY(1,1) NOT NULL,
	[SummaryID] [int] NULL,
	[ActionItem] [nvarchar](max) NULL,
	[Owner] [nvarchar](100) NULL,
	[ETA] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[Remarks] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
 CONSTRAINT [PK_WSR_ActionItems] PRIMARY KEY CLUSTERED 
(
	[ActionItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[WSR_ActionItems] ADD  CONSTRAINT [DF_WSR_ActionItems_isActive]  DEFAULT ((1)) FOR [isActive]
GO


USE [wsr]
GO

/****** Object:  Table [dbo].[WSR_SummaryDetails]    Script Date: 5/15/2023 10:52:18 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[WSR_SummaryDetails](
	[SummaryID] [int] IDENTITY(1,1) NOT NULL,
	[Overall] [nvarchar](max) NULL,
	[OverallStatus] [char](1) NULL,
	[Schedule] [nvarchar](max) NULL,
	[ScheduleStatus] [char](1) NULL,
	[Resource] [nvarchar](max) NULL,
	[ResourceStatus] [char](1) NULL,
	[Risk] [nvarchar](max) NULL,
	[RiskStatus] [char](1) NULL,
	[WeekEndingDate] [datetime] NULL,
	[CreatedBy] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NULL,
	[UpdatedBy] [nvarchar](100) NULL,
	[UpdatedOn] [datetime] NULL,
	[Name] [nvarchar](100) NULL,
 CONSTRAINT [PK_WSR_SummaryDetails] PRIMARY KEY CLUSTERED 
(
	[SummaryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


