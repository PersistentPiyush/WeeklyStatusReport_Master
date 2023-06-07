USE [wsr]
GO
/****** Object:  Table [dbo].[WSR_ActionItems]    Script Date: 6/7/2023 10:03:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WSR_ActionItems](
	[ActionItemID] [int] NOT NULL,
	[SummaryID] [int] NOT NULL,
	[ActionItem] [nvarchar](max) NULL,
	[Owner] [nvarchar](100) NULL,
	[ETA] [datetime] NULL,
	[Status] [nvarchar](50) NULL,
	[Remarks] [nvarchar](max) NULL,
	[isActive] [bit] NULL,
	[CompletionDate] [datetime] NULL,
 CONSTRAINT [PK_WSR_ActionItems] PRIMARY KEY CLUSTERED 
(
	[ActionItemID] ASC,
	[SummaryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WSR_RemarkHistory]    Script Date: 6/7/2023 10:03:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WSR_RemarkHistory](
	[RemarkID] [int] IDENTITY(1,1) NOT NULL,
	[SummaryID] [int] NOT NULL,
	[ActionItemID] [int] NOT NULL,
	[Remark] [nvarchar](max) NULL,
	[AddedDate] [datetime] NULL,
 CONSTRAINT [PK_WSR_RemarkHistory] PRIMARY KEY CLUSTERED 
(
	[RemarkID] ASC,
	[SummaryID] ASC,
	[ActionItemID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WSR_SummaryDetails]    Script Date: 6/7/2023 10:03:21 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[WSR_SummaryDetails](
	[SummaryID] [int] IDENTITY(1,1) NOT NULL,
	[Overall] [nvarchar](max) NULL,
	[OverallStatus] [char](1) NULL,
	[ScheduleStatus] [char](1) NULL,
	[ResourceStatus] [char](1) NULL,
	[Risk] [nvarchar](max) NULL,
	[RiskStatus] [char](1) NULL,
	[WeekEndingDate] [datetime] NULL,
	[CreatedBy] [nvarchar](100) NULL,
	[CreatedOn] [datetime] NULL,
	[UpdatedBy] [nvarchar](100) NULL,
	[UpdatedOn] [datetime] NULL,
	[Name] [nvarchar](100) NULL,
	[RiskMitigation] [nvarchar](max) NULL,
 CONSTRAINT [PK_WSR_SummaryDetails] PRIMARY KEY CLUSTERED 
(
	[SummaryID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[WSR_Teams]    Script Date: 6/7/2023 10:03:21 AM ******/
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
ALTER TABLE [dbo].[WSR_ActionItems] ADD  CONSTRAINT [DF_WSR_ActionItems_isActive]  DEFAULT ((1)) FOR [isActive]
GO
