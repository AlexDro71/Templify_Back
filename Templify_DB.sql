USE [master]
GO
/****** Object:  Database [templifyBD]    Script Date: 1/7/2024 10:59:27 ******/
CREATE DATABASE [templifyBD]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'templifyBD', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\templifyBD.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'templifyBD_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.MSSQLSERVER\MSSQL\DATA\templifyBD_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [templifyBD] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [templifyBD].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [templifyBD] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [templifyBD] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [templifyBD] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [templifyBD] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [templifyBD] SET ARITHABORT OFF 
GO
ALTER DATABASE [templifyBD] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [templifyBD] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [templifyBD] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [templifyBD] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [templifyBD] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [templifyBD] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [templifyBD] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [templifyBD] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [templifyBD] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [templifyBD] SET  DISABLE_BROKER 
GO
ALTER DATABASE [templifyBD] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [templifyBD] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [templifyBD] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [templifyBD] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [templifyBD] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [templifyBD] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [templifyBD] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [templifyBD] SET RECOVERY FULL 
GO
ALTER DATABASE [templifyBD] SET  MULTI_USER 
GO
ALTER DATABASE [templifyBD] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [templifyBD] SET DB_CHAINING OFF 
GO
ALTER DATABASE [templifyBD] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [templifyBD] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [templifyBD] SET DELAYED_DURABILITY = DISABLED 
GO
EXEC sys.sp_db_vardecimal_storage_format N'templifyBD', N'ON'
GO
ALTER DATABASE [templifyBD] SET QUERY_STORE = OFF
GO
USE [templifyBD]
GO
/****** Object:  User [alumno]    Script Date: 1/7/2024 10:59:27 ******/
CREATE USER [alumno] FOR LOGIN [alumno] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[Archivos]    Script Date: 1/7/2024 10:59:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Archivos](
	[idUsuario] [int] NOT NULL,
	[formato] [varchar](10) NOT NULL,
	[id] [int] NOT NULL,
	[alto] [int] NOT NULL,
	[ancho] [int] NOT NULL,
 CONSTRAINT [PK_Archivos] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[archivoX(planXUs)]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[archivoX(planXUs)](
	[idArchivo] [int] NOT NULL,
	[idPlanXUs] [int] NOT NULL,
	[idAssetXPlantilla] [int] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[assetXPlantilla]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[assetXPlantilla](
	[id] [int] NOT NULL,
	[ancho] [int] NOT NULL,
	[alto] [int] NOT NULL,
	[fkPlantilla] [int] NOT NULL,
 CONSTRAINT [PK_assetXPlantilla] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[planDePago]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[planDePago](
	[id] [int] NOT NULL,
	[metodo] [varchar](25) NOT NULL,
	[fechaInicio] [datetime] NOT NULL,
	[fechaFin] [datetime] NOT NULL,
	[precio] [int] NOT NULL,
	[caracteristicas] [text] NOT NULL,
 CONSTRAINT [PK_planDePago] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[plantilla]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[plantilla](
	[texto] [text] NOT NULL,
	[colores] [text] NOT NULL,
	[id] [int] NOT NULL,
	[fkPlantilla] [int] NOT NULL,
	[fkTemplateMaster] [int] NOT NULL,
 CONSTRAINT [PK_plantilla] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[planXUs]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[planXUs](
	[idPlantilla] [int] NOT NULL,
	[id] [int] NOT NULL,
	[idUsuario] [int] NOT NULL,
 CONSTRAINT [PK_planXUs] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[templateMaster]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[templateMaster](
	[id] [int] NOT NULL,
	[nombre] [varchar](20) NOT NULL,
	[contraseña] [text] NOT NULL,
 CONSTRAINT [PK_templateMaster] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[tipoDePlantilla]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tipoDePlantilla](
	[id] [int] NOT NULL,
	[nombre] [varchar](20) NOT NULL,
	[alto] [int] NOT NULL,
	[ancho] [int] NOT NULL,
 CONSTRAINT [PK_tipoDePlantilla] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Usuario]    Script Date: 1/7/2024 10:59:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Usuario](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[empresa] [nvarchar](50) NULL,
	[nombre] [nvarchar](50) NULL,
	[mail] [nvarchar](50) NULL,
	[password] [nvarchar](50) NULL,
	[apellido] [nvarchar](50) NULL,
	[username] [nvarchar](50) NULL,
	[planDePago] [int] NULL,
 CONSTRAINT [PK_Usuario] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[Usuario] ON 

INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (1, N'a', N'a', N'a', NULL, NULL, NULL)
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (2, N'a', N'a', N'a', NULL, NULL, NULL)
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (3, N'b', N'b', N'b', NULL, NULL, NULL)
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (4, N'SIA', N'Alex', N'a@a.gmail', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (5, N'SIA', N'Alex', N'a@a.gmail', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (6, N'SIA', N'Alex', N'a@a.gmail', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (7, N'SIA', N'Alex', N'a@a.gmail', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (8, N'SIA', N'Alex', N'a@a.gmail', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (9, N'SIA', N'Alex', N'a@a.a', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (10, N'SIA', N'Alex', N'a@a.a', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (11, N'SIA', N'Alex', N'a@a.a', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (12, N'SIA', N'Alex', N'a@a.a', N'Bolivia123', N'Droblas', N'Papu123')
INSERT [dbo].[Usuario] ([id], [empresa], [nombre], [mail], [password], [apellido], [username]) VALUES (13, N'SIA', N'Alex', N'a@a.a', N'Bolivia123', N'Droblas', N'Papu123')
SET IDENTITY_INSERT [dbo].[Usuario] OFF
GO
ALTER TABLE [dbo].[Archivos]  WITH CHECK ADD  CONSTRAINT [FK_Archivos_Usuario] FOREIGN KEY([idUsuario])
REFERENCES [dbo].[Usuario] ([id])
GO
ALTER TABLE [dbo].[Archivos] CHECK CONSTRAINT [FK_Archivos_Usuario]
GO
ALTER TABLE [dbo].[archivoX(planXUs)]  WITH CHECK ADD  CONSTRAINT [FK_archivoX(planXUs)_Archivos] FOREIGN KEY([idArchivo])
REFERENCES [dbo].[Archivos] ([id])
GO
ALTER TABLE [dbo].[archivoX(planXUs)] CHECK CONSTRAINT [FK_archivoX(planXUs)_Archivos]
GO
ALTER TABLE [dbo].[archivoX(planXUs)]  WITH CHECK ADD  CONSTRAINT [FK_archivoX(planXUs)_planXUs] FOREIGN KEY([idPlanXUs])
REFERENCES [dbo].[planXUs] ([id])
GO
ALTER TABLE [dbo].[archivoX(planXUs)] CHECK CONSTRAINT [FK_archivoX(planXUs)_planXUs]
GO
ALTER TABLE [dbo].[assetXPlantilla]  WITH CHECK ADD  CONSTRAINT [FK_assetXPlantilla_plantilla] FOREIGN KEY([fkPlantilla])
REFERENCES [dbo].[plantilla] ([id])
GO
ALTER TABLE [dbo].[assetXPlantilla] CHECK CONSTRAINT [FK_assetXPlantilla_plantilla]
GO
ALTER TABLE [dbo].[plantilla]  WITH CHECK ADD  CONSTRAINT [FK_plantilla_templateMaster] FOREIGN KEY([fkTemplateMaster])
REFERENCES [dbo].[templateMaster] ([id])
GO
ALTER TABLE [dbo].[plantilla] CHECK CONSTRAINT [FK_plantilla_templateMaster]
GO
ALTER TABLE [dbo].[plantilla]  WITH CHECK ADD  CONSTRAINT [FK_plantilla_tipoDePlantilla] FOREIGN KEY([fkPlantilla])
REFERENCES [dbo].[tipoDePlantilla] ([id])
GO
ALTER TABLE [dbo].[plantilla] CHECK CONSTRAINT [FK_plantilla_tipoDePlantilla]
GO
ALTER TABLE [dbo].[planXUs]  WITH CHECK ADD  CONSTRAINT [FK_planXUs_plantilla] FOREIGN KEY([idPlantilla])
REFERENCES [dbo].[plantilla] ([id])
GO
ALTER TABLE [dbo].[planXUs] CHECK CONSTRAINT [FK_planXUs_plantilla]
GO
ALTER TABLE [dbo].[planXUs]  WITH CHECK ADD  CONSTRAINT [FK_planXUs_Usuario] FOREIGN KEY([idUsuario])
REFERENCES [dbo].[Usuario] ([id])
GO
ALTER TABLE [dbo].[planXUs] CHECK CONSTRAINT [FK_planXUs_Usuario]
GO
USE [master]
GO
ALTER DATABASE [templifyBD] SET  READ_WRITE 
GO
