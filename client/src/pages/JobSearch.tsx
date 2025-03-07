import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Clock,
  Briefcase,
  Building,
  Award,
  UserCircle,
  Upload,
  Percent,
  PlusCircle,
  ToggleLeft,
  Loader,
  Bell,
  Home,
  Bookmark,
  Star,
  Settings,
  FileText,
  CheckCircle,
  XCircle,
  Calendar,
  Tag,
  Mail,
  ChevronDown,
  Search,
  Info,
  Users,
  BarChart,
  AlertTriangle,
  Trash,
  FileQuestion,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";

// Define interfaces
interface Job {
  id?: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills_required: string;
  experience_required: string;
  date_posted: string;
  url: string;
  match_percentage?: number;
  keywords?: string[];
  application_deadline?: string;
  job_type?: string;
  salary_range?: string;
  isBookmarked?: boolean;
  applied?: boolean;
  applicationStatus?:
    | "applied"
    | "screening"
    | "interviewing"
    | "rejected"
    | "offered"
    | null;
}

interface Resume {
  id: string;
  name: string;
  file: File;
  url: string;
  uploadDate: string;
  score?: number;
  categoryScores?: {
    format: number;
    content: number;
    relevance: number;
    clarity: number;
    impact_statements: number;
    skills_presentation: number;
    [key: string]: number;
  };
  feedback?: {
    format: string;
    content: string;
    relevance: string;
    clarity: string;
    impact_statements: string;
    skills_presentation: string;
    [key: string]: string;
  };
  recommendations?: string[];
  scoreLoading?: boolean;
}

interface Profile {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  skills: string;
  experience: string;
  education: string;
  interests: string;
  resumes: Resume[]; // Changed from a single resume to an array
  preferredLocation?: string;
  jobTitle?: string;
  bio?: string;
  avatarUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  notificationPreferences: {
    email: boolean;
    jobAlerts: boolean;
    applicationUpdates: boolean;
    newMatchingJobs: boolean;
  };
}

interface Notification {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: "job_match" | "application_update" | "system" | "deadline";
  relatedJobId?: number;
}

interface Application {
  id: number;
  jobId: number;
  date: string;
  status: "applied" | "screening" | "interviewing" | "rejected" | "offered";
  notes: string;
}

interface UserStats {
  applicationsSubmitted: number;
  bookmarkedJobs: number;
  profileViews: number;
  matchScore: number;
}

const defaultProfile: Profile = {
  id: 9,
  fullName: "",
  email: "",
  phone: "",
  skills: "",
  experience: "",
  education: "",
  interests: "",
  resumes: null,
  notificationPreferences: {
    email: true,
    jobAlerts: true,
    applicationUpdates: true,
    newMatchingJobs: true,
  },
};

// Sample data for demo
const sampleEducation = [
  {
    degree: "Bachelor of Technology",
    field: "Computer Science",
    university: "University of Technology",
    year: "2021-2025",
  },
  {
    degree: "Higher Secondary",
    field: "Science",
    university: "National Public School",
    year: "2019-2021",
  },
];

const sampleStats: UserStats = {
  applicationsSubmitted: 8,
  bookmarkedJobs: 12,
  profileViews: 24,
  matchScore: 75,
};

const JobPortal = () => {
  // State Management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [originalJobs, setOriginalJobs] = useState<Job[]>([
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp",
      location: "Pune, Maharashtra",
      description:
        "We are looking for a Frontend Developer with experience in React and modern JavaScript frameworks.",
      skills_required: "React, JavaScript, TypeScript, CSS",
      experience_required: "2+ years",
      date_posted: "2025-02-15",
      url: "https://example.com/apply",
      keywords: ["frontend", "react", "javascript", "web development"],
      application_deadline: "2025-03-30",
      job_type: "Full-time",
      salary_range: "₹8-12 LPA",
      isBookmarked: false,
    },
    {
      id: 2,
      title: "Backend Engineer",
      company: "DataSystems",
      location: "Mumbai, Maharashtra",
      description:
        "Backend Engineer position available for experienced Node.js developers.",
      skills_required: "Node.js, Express, MongoDB, REST APIs",
      experience_required: "3+ years",
      date_posted: "2025-02-20",
      url: "https://example.com/apply",
      keywords: ["backend", "node.js", "mongodb", "api"],
      application_deadline: "2025-04-15",
      job_type: "Full-time",
      salary_range: "₹10-15 LPA",
      isBookmarked: true,
    },
    {
      id: 3,
      title: "Machine Learning Intern",
      company: "AI Solutions",
      location: "Bangalore, Karnataka",
      description:
        "Join our team as a Machine Learning Intern to work on cutting-edge AI projects.",
      skills_required: "Python, TensorFlow, Data Analysis, Mathematics",
      experience_required: "0-1 year",
      date_posted: "2025-02-25",
      url: "https://example.com/apply",
      keywords: ["internship", "machine learning", "python", "ai"],
      application_deadline: "2025-03-25",
      job_type: "Internship",
      salary_range: "₹25-35K per month",
      isBookmarked: false,
    },
    {
      id: 4,
      title: "Full Stack Developer",
      company: "WebTech Solutions",
      location: "Remote",
      description:
        "Looking for a passionate Full Stack Developer to join our remote team.",
      skills_required: "React, Node.js, MongoDB, AWS",
      experience_required: "2-4 years",
      date_posted: "2025-02-28",
      url: "https://example.com/apply",
      keywords: ["fullstack", "react", "node.js", "remote"],
      application_deadline: "2025-04-10",
      job_type: "Full-time",
      salary_range: "₹12-18 LPA",
      isBookmarked: false,
    },
  ]);

  const [jobs, setJobs] = useState<Job[]>([...originalJobs]);
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isFetchingFromAPI, setIsFetchingFromAPI] = useState(false);
  const [searchMethod, setSearchMethod] = useState<"local" | "api">("local");
  const [bookmarkedJobs, setBookmarkedJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 1,
      jobId: 2,
      date: "2025-02-22",
      status: "screening",
      notes: "Initial application submitted",
    },
    {
      id: 2,
      jobId: 3,
      date: "2025-02-27",
      status: "applied",
      notes: "Waiting for response",
    },
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New matching job",
      message:
        "A new Frontend Developer position at TechCorp matches your profile",
      date: "2025-02-16",
      read: false,
      type: "job_match",
      relatedJobId: 1,
    },
    {
      id: 2,
      title: "Application Update",
      message:
        "Your application for Backend Engineer at DataSystems has moved to screening stage",
      date: "2025-02-23",
      read: true,
      type: "application_update",
      relatedJobId: 2,
    },
    {
      id: 3,
      title: "Application Deadline",
      message:
        "The Machine Learning Intern position application deadline is approaching",
      date: "2025-02-20",
      read: false,
      type: "deadline",
      relatedJobId: 3,
    },
  ]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const [profileData, setProfileData] = useState<Profile>({
    id: 1,
    fullName: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
    education: "",
    interests: "",
    resumes: [],
    notificationPreferences: {
      email: true,
      jobAlerts: true,
      applicationUpdates: true,
      newMatchingJobs: true,
    },
  });
  const [resumePreviewOpen, setResumePreviewOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [recommendationsOpen, setRecommendationsOpen] = useState(false);
  const [selectedResumeScore, setSelectedResumeScore] = useState<Resume | null>(
    null
  );
  const [userStats, setUserStats] = useState<UserStats>(sampleStats);
  const [educationList, setEducationList] = useState(sampleEducation);
  const [showNotifications, setShowNotifications] = useState(false);
  const [jobFilters, setJobFilters] = useState({
    jobType: "",
    experienceLevel: "",
    datePosted: "",
  });

  // Admin job posting state
  const [newJob, setNewJob] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    skills_required: "",
    experience_required: "",
    date_posted: new Date().toISOString().split("T")[0],
    url: "",
    job_type: "Full-time",
    application_deadline: "",
    salary_range: "",
  });

  // Effect to count unread notifications
  useEffect(() => {
    const count = notifications.filter(
      (notification) => !notification.read
    ).length;
    setUnreadNotifications(count);
  }, [notifications]);

  // Effect to update bookmarked jobs
  useEffect(() => {
    const bookmarked = originalJobs.filter((job) => job.isBookmarked);
    setBookmarkedJobs(bookmarked);
  }, [originalJobs]);

  const [showJobForm, setShowJobForm] = useState(false);
  // Toggle admin mode
  const toggleAdminMode = () => {
    setIsAdmin(!isAdmin);
    setShowJobForm(false);
    setActiveTab("dashboard");
  };

  // Toggle search method
  const toggleSearchMethod = () => {
    setSearchMethod((prev) => (prev === "local" ? "api" : "local"));
  };

  // Mark notification as read
  const markNotificationAsRead = (id: number) => {
    const updatedNotifications = notifications.map((notification) =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    const updatedNotifications = notifications.map((notification) => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
  };

  // Filter jobs
  const filterJobs = (
    jobsToFilter: Job[],
    query: string,
    loc: string,
    filters: any
  ) => {
    return jobsToFilter.filter((job) => {
      // Basic filtering (keyword and location)
      const matchesKeyword =
        !query ||
        job.title.toLowerCase().includes(query.toLowerCase()) ||
        job.description.toLowerCase().includes(query.toLowerCase()) ||
        job.skills_required.toLowerCase().includes(query.toLowerCase()) ||
        job.company.toLowerCase().includes(query.toLowerCase()) ||
        (job.keywords &&
          job.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query.toLowerCase())
          ));

      const matchesLocation =
        !loc || job.location.toLowerCase().includes(loc.toLowerCase());

      // Additional filters
      const matchesJobType =
        !filters.jobType || job.job_type === filters.jobType;
      const matchesExperience =
        !filters.experienceLevel ||
        matchExperienceLevel(job.experience_required, filters.experienceLevel);
      const matchesDatePosted =
        !filters.datePosted ||
        isWithinDateRange(job.date_posted, filters.datePosted);

      return (
        matchesKeyword &&
        matchesLocation &&
        matchesJobType &&
        matchesExperience &&
        matchesDatePosted
      );
    });
  };

  // Helper function to match experience level filter
  const matchExperienceLevel = (jobExperience: string, filterLevel: string) => {
    const experienceYears = parseInt(jobExperience);

    switch (filterLevel) {
      case "entry":
        return (
          jobExperience.includes("0") ||
          jobExperience.includes("1") ||
          jobExperience.toLowerCase().includes("intern")
        );
      case "mid":
        return (
          jobExperience.includes("2") ||
          jobExperience.includes("3") ||
          jobExperience.includes("4")
        );
      case "senior":
        return (
          parseInt(jobExperience) >= 5 ||
          jobExperience.toLowerCase().includes("senior")
        );
      default:
        return true;
    }
  };

  // Helper function to check if a job was posted within selected date range
  const isWithinDateRange = (datePosted: string, range: string) => {
    const postDate = new Date(datePosted);
    const today = new Date();

    switch (range) {
      case "today":
        return postDate.toDateString() === today.toDateString();
      case "week":
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        return postDate >= lastWeek;
      case "month":
        const lastMonth = new Date();
        lastMonth.setMonth(today.getMonth() - 1);
        return postDate >= lastMonth;
      default:
        return true;
    }
  };

  // API-based job search
  const searchJobsViaAPI = async (keyword: string, loc: string) => {
    setIsFetchingFromAPI(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:5004/api/jobs/search",
        {
          keyword: keyword,
          location: loc,
          profile_id: profileData.id,
        }
      );

      if (response.data && response.data.length > 0) {
        // Map the API response to our job interface
        const apiJobs = response.data.map((job: any, index: number) => ({
          id: index + 1000, // Unique ID for API jobs
          title: job.title || "Untitled Position",
          company: job.company || "Unknown Company",
          location: job.location || loc || "Remote",
          description: job.description || "No description available",
          skills_required: job.skills_required || "",
          experience_required: job.experience_required || "Not specified",
          date_posted:
            job.date_posted || new Date().toISOString().split("T")[0],
          url: job.url || "#",
          match_percentage: job.match_percentage || 0,
          keywords: job.keywords || [],
          application_deadline: job.application_deadline || "",
          job_type: job.job_type || "Full-time",
          salary_range: job.salary_range || "Not disclosed",
          isBookmarked: false,
        }));

        setJobs(apiJobs);

        // Create notifications for high matching jobs
        const highMatchJobs = apiJobs.filter(
          (job) => job.match_percentage && job.match_percentage > 80
        );
        if (highMatchJobs.length > 0) {
          const newNotifications = highMatchJobs.map((job, index) => ({
            id: Date.now() + index,
            title: "New high match job",
            message: `A new ${job.title} position at ${job.company} has a ${job.match_percentage}% match with your profile`,
            date: new Date().toISOString().split("T")[0],
            read: false,
            type: "job_match" as const,
            relatedJobId: job.id,
          }));
          setNotifications((prev) => [...newNotifications, ...prev]);
        }

        // Add new jobs to original jobs list if they don't exist
        setOriginalJobs((prev) => {
          const existingTitles = new Set(
            prev.map((job) => `${job.title}-${job.company}`)
          );
          const newJobs = apiJobs.filter(
            (job) => !existingTitles.has(`${job.title}-${job.company}`)
          );
          return [...prev, ...newJobs];
        });
      } else {
        setError("No jobs found from the API. Try different search terms.");
        setJobs([]);
      }
    } catch (err) {
      console.error("Error searching jobs via API:", err);
      setError("Failed to fetch jobs from the API. Please try again later.");
      // Fall back to local filtering if API fails
      const filteredJobs = filterJobs(originalJobs, keyword, loc, jobFilters);
      setJobs(filteredJobs);
    } finally {
      setIsFetchingFromAPI(false);
    }
  };

  // Handle search
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);

    if (searchMethod === "api") {
      // Use API search
      await searchJobsViaAPI(searchQuery, location);
    } else {
      // Use local filtering
      const filteredJobs = filterJobs(
        originalJobs,
        searchQuery,
        location,
        jobFilters
      );
      setJobs(filteredJobs);

      // If no jobs found, show message
      if (filteredJobs.length === 0) {
        setError(
          "No matching jobs found. Try different search terms or location."
        );
      }
    }

    setIsLoading(false);
  };

  // Handle profile changes
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle notification preference changes
  const handleNotificationPrefChange = (setting: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [setting]: value,
      },
    }));
  };

  // Handle resume upload
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    // Create a unique ID for the resume
    const resumeId = Date.now().toString();

    // Create object URL for preview
    const url = URL.createObjectURL(file);

    // Create new resume object
    const newResume: Resume = {
      id: resumeId,
      name: file.name,
      file: file,
      url: url,
      uploadDate: new Date().toISOString(),
      scoreLoading: false,
    };

    setProfileData((prev) => ({
      ...prev,
      resumes: [...(prev.resumes || []), newResume],
    }));

    // Upload the resume to the server
    uploadResumeToServer(newResume);
  };

  // const uploadResumeToServer = async (resume: Resume) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("resume", resume.file);
  //     formData.append("userId", profileData.id?.toString() || "");
  //     formData.append("resumeId", resume.id);

  //     const response = await fetch("http://localhost:5000/api/resume", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to upload resume");
  //     }

  //     const data = await response.json();
  //     console.log("Resume uploaded successfully:", data);

  //     // Update the resume with the server response if a fileUrl is provided
  //     if (data.fileUrl) {
  //       setProfileData((prev) => ({
  //         ...prev,
  //         resumes: prev.resumes.map((r) =>
  //           r.id === resume.id ? { ...r, url: data.fileUrl } : r
  //         ),
  //       }));
  //     }
  //   } catch (error) {
  //     console.error("Error uploading resume:", error);
  //     setError("Failed to upload resume. Please try again later.");
  //   }
  // };

  const uploadResumeToServer = async (resume: Resume) => {
    try {
      if (!profileData.id) {
        setError("User ID is missing. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume.file);
      formData.append("userId", profileData.id.toString());
      formData.append("resumeId", resume.id);

      const response = await fetch("http://localhost:5000/api/resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload resume");
      }

      const data = await response.json();
      console.log("✅ Resume uploaded successfully:", data);

      // Update the resume with the server response if a fileUrl is provided
      if (data.fileUrl) {
        setProfileData((prev) => ({
          ...prev,
          resumes: prev.resumes.map((r) =>
            r.id === resume.id ? { ...r, url: data.fileUrl } : r
          ),
        }));
      }
    } catch (error) {
      console.error("❌ Error uploading resume:", error);
      setError("Failed to upload resume. Please try again later.");
    }
  };

  const handleViewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setResumePreviewOpen(true);
  };

  const handleDeleteResume = async (resumeId: string) => {
    try {
      const response = await fetch(`/api/delete-resume/${resumeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete resume");
      }

      // Find the resume before removing it to revoke the URL
      const resumeToDelete = profileData.resumes.find((r) => r.id === resumeId);

      // Remove the resume from state
      setProfileData((prev) => ({
        ...prev,
        resumes: prev.resumes.filter((r) => r.id !== resumeId),
      }));

      // Clean up the URL to prevent memory leaks
      if (resumeToDelete && resumeToDelete.url.startsWith("blob:")) {
        URL.revokeObjectURL(resumeToDelete.url);
      }
    } catch (error) {
      console.error("Error deleting resume:", error);
      setError("Failed to delete resume. Please try again later.");
    }
  };

  const handleGetATSScore = async (resumeId: string) => {
    // Set loading state for the specific resume
    setProfileData((prev) => ({
      ...prev,
      resumes: prev.resumes.map((r) =>
        r.id === resumeId ? { ...r, scoreLoading: true } : r
      ),
    }));

    try {
      const response = await fetch(`/api/analyze-resume/${resumeId}`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to analyze resume");
      }

      const scoreData = await response.json();

      // Update the resume with the score data
      setProfileData((prev) => ({
        ...prev,
        resumes: prev.resumes.map((r) =>
          r.id === resumeId
            ? {
                ...r,
                score: scoreData.overall_score,
                categoryScores: scoreData.category_scores,
                feedback: scoreData.feedback,
                recommendations: scoreData.recommendations,
                scoreLoading: false,
              }
            : r
        ),
      }));

      // Find the resume name for the notification
      const resumeName =
        profileData.resumes.find((r) => r.id === resumeId)?.name ||
        "Your resume";

      // Create and add notification
      const newNotification = {
        id: Date.now(),
        title: "Resume Analysis Complete",
        message: `${resumeName} has been analyzed.`,
        date: new Date().toISOString().split("T")[0],
        read: false,
        type: "system" as const,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    } catch (error) {
      console.error("Error analyzing resume:", error);

      // Reset loading state
      setProfileData((prev) => ({
        ...prev,
        resumes: prev.resumes.map((r) =>
          r.id === resumeId ? { ...r, scoreLoading: false } : r
        ),
      }));

      // Show error notification
      setError("Failed to analyze resume. Please try again later.");
    }
  };

  const handleViewRecommendations = (resumeId: string) => {
    const resume = profileData.resumes.find((r) => r.id === resumeId);
    if (resume && resume.score !== undefined) {
      setSelectedResumeScore(resume);
      setRecommendationsOpen(true);
    }
  };

  const handleDownloadRecommendations = (resume: Resume) => {
    // Generate HTML report
    const htmlReport = generateHTMLReport(resume);

    // Create a blob and download it
    const blob = new Blob([htmlReport], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Resume_Analysis_${resume.name.split(".")[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateHTMLReport = (resume: Resume) => {
    // Helper function to get color based on score
    const getScoreColor = (score: number) => {
      if (score >= 80) return "green";
      if (score >= 60) return "orange";
      return "red";
    };

    // Format category name helper
    const formatCategoryName = (category: string) => {
      return category
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    };

    // Basic HTML template
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Resume Evaluation Results</title>
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
          <style>
              body {
                  background-color: #f8f9fa;
                  padding: 2rem;
              }
              .results-container {
                  max-width: 800px;
                  margin: 0 auto;
                  background-color: #fff;
                  border-radius: 10px;
                  box-shadow: 0 0 20px rgba(0,0,0,0.1);
                  padding: 2rem;
              }
              .header {
                  text-align: center;
                  margin-bottom: 2rem;
              }
              .score-circle {
                  width: 120px;
                  height: 120px;
                  border-radius: 50%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 2rem;
                  font-weight: bold;
                  color: white;
                  margin: 0 auto 1.5rem;
              }
              .feedback-card {
                  margin-bottom: 1rem;
                  border-left: 5px solid #007bff;
              }
              .recommendation-item {
                  background-color: #f8f9fa;
                  border-left: 4px solid #28a745;
                  padding: 1rem;
                  margin-bottom: 0.5rem;
                  border-radius: 0 4px 4px 0;
              }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="results-container">
                  <div class="header">
                      <h1>Resume Evaluation Results</h1>
                      <p class="text-muted">File: ${resume.name}</p>
                      <p class="text-muted">Evaluated on: ${new Date().toLocaleString()}</p>
                  </div>
  
                  <!-- Overall Score -->
                  <div class="text-center mb-4">
                      <div class="score-circle" style="background-color: ${getScoreColor(
                        resume.score || 0
                      )};">
                          ${resume.score}/100
                      </div>
                      <h3>Overall Score</h3>
                  </div>
  
                  <!-- Category Scores -->
                  <div class="card mb-4">
                      <div class="card-header bg-primary text-white">
                          <h4 class="mb-0">Category Scores</h4>
                      </div>
                      <div class="card-body">
                          ${
                            resume.categoryScores
                              ? Object.entries(resume.categoryScores)
                                  .map(
                                    ([category, score]) => `
                          <div class="mb-3">
                              <div class="d-flex justify-content-between">
                                  <label>${formatCategoryName(category)}</label>
                                  <span>${score}/100</span>
                              </div>
                              <div class="progress">
                                  <div class="progress-bar bg-${
                                    Number(score) >= 80
                                      ? "success"
                                      : Number(score) >= 60
                                      ? "warning"
                                      : "danger"
                                  }" 
                                       role="progressbar" style="width: ${score}%;" 
                                       aria-valuenow="${score}" aria-valuemin="0" aria-valuemax="100">${score}%</div>
                              </div>
                          </div>
                          `
                                  )
                                  .join("")
                              : ""
                          }
                      </div>
                  </div>
  
                  <!-- Feedback -->
                  <div class="card mb-4">
                      <div class="card-header bg-info text-white">
                          <h4 class="mb-0">Detailed Feedback</h4>
                      </div>
                      <div class="card-body">
                          ${
                            resume.feedback
                              ? Object.entries(resume.feedback)
                                  .map(
                                    ([category, feedback]) => `
                          <div class="card feedback-card mb-3">
                              <div class="card-body">
                                  <h5 class="card-title">${formatCategoryName(
                                    category
                                  )}</h5>
                                  <p class="card-text">${feedback}</p>
                              </div>
                          </div>
                          `
                                  )
                                  .join("")
                              : ""
                          }
                      </div>
                  </div>
  
                  <!-- Recommendations -->
                  <div class="card">
                      <div class="card-header bg-success text-white">
                          <h4 class="mb-0">Recommendations for Improvement</h4>
                      </div>
                      <div class="card-body">
                          ${
                            resume.recommendations
                              ? resume.recommendations
                                  .map(
                                    (recommendation) => `
                          <div class="recommendation-item">
                              ${recommendation}
                          </div>
                          `
                                  )
                                  .join("")
                              : ""
                          }
                      </div>
                  </div>
              </div>
          </div>
      </body>
      </html>
    `;
  };

  const formatCategoryName = (category: string): string => {
    return category
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Helper function to get color class based on score
  const getScoreColor = (score: number): string => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Handle profile submission
  const handleProfileSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Simulate profile update
    setTimeout(() => {
      // Create notification for profile update
      const newNotification = {
        id: Date.now(),
        title: "Profile updated",
        message: "Your profile has been successfully updated",
        date: new Date().toISOString().split("T")[0],
        read: false,
        type: "system" as const,
      };
      setNotifications((prev) => [newNotification, ...prev]);

      // If we have jobs, recalculate matches
      if (jobs.length > 0) {
        const skillsArray = profileData.skills
          .toLowerCase()
          .split(",")
          .map((s) => s.trim());
        const updatedJobs = jobs.map((job) => {
          const jobSkills = job.skills_required
            .toLowerCase()
            .split(",")
            .map((s) => s.trim());
          let matches = 0;
          skillsArray.forEach((skill) => {
            if (
              jobSkills.some(
                (jobSkill) =>
                  jobSkill.includes(skill) || skill.includes(jobSkill)
              )
            ) {
              matches++;
            }
          });
          const match_percentage = Math.round(
            (matches / Math.max(jobSkills.length, 1)) * 100
          );
          return {
            ...job,
            match_percentage,
          };
        });
        setJobs(updatedJobs);
      }

      setIsLoading(false);
    }, 800);
  };

  // Handle education add/edit
  const handleAddEducation = (education: any) => {
    setEducationList((prev) => [...prev, education]);
  };

  // Handle bookmark toggle
  const toggleBookmark = (jobId: number) => {
    setOriginalJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );

    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    );

    // Update bookmarked count
    const job = originalJobs.find((j) => j.id === jobId);
    if (job) {
      if (!job.isBookmarked) {
        setUserStats((prev) => ({
          ...prev,
          bookmarkedJobs: prev.bookmarkedJobs + 1,
        }));
      } else {
        setUserStats((prev) => ({
          ...prev,
          bookmarkedJobs: prev.bookmarkedJobs - 1,
        }));
      }
    }
  };

  // Handle job application
  const handleApplyToJob = (jobId: number) => {
    // Check if already applied
    const existingApplication = applications.find((app) => app.jobId === jobId);
    if (existingApplication) {
      return;
    }

    // Create new application
    const newApplication = {
      id: Date.now(),
      jobId,
      date: new Date().toISOString().split("T")[0],
      status: "applied" as const,
      notes: "Application submitted",
    };

    setApplications((prev) => [...prev, newApplication]);

    // Update jobs to show applied status
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, applied: true, applicationStatus: "applied" }
          : job
      )
    );

    setOriginalJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, applied: true, applicationStatus: "applied" }
          : job
      )
    );

    // Create notification
    const job = originalJobs.find((j) => j.id === jobId);
    if (job) {
      const newNotification = {
        id: Date.now(),
        title: "Application submitted",
        message: `Your application for ${job.title} at ${job.company} has been submitted`,
        date: new Date().toISOString().split("T")[0],
        read: false,
        type: "application_update" as const,
        relatedJobId: jobId,
      };
      setNotifications((prev) => [newNotification, ...prev]);
    }

    // Update application count
    setUserStats((prev) => ({
      ...prev,
      applicationsSubmitted: prev.applicationsSubmitted + 1,
    }));
  };

  // Handle adding new job
  const handleAddJob = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newJobWithId: Job = {
      ...newJob,
      id: Date.now(), // Generate a unique ID
    };
    setOriginalJobs((prev) => [newJobWithId, ...prev]);
    setNewJob({
      title: "",
      company: "",
      location: "",
      description: "",
      skills_required: "",
      experience_required: "",
      date_posted: new Date().toISOString().split("T")[0],
      url: "",
      job_type: "Full-time",
      application_deadline: "",
      salary_range: "",
    });
    setShowJobForm(false); // Hide the form after submission
  };

  // Handle input changes for the new job form
  const handleNewJobChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setNewJob((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle job type select change
  const handleJobTypeChange = (value: string) => {
    setNewJob((prev) => ({
      ...prev,
      job_type: value,
    }));
  };

  // Render admin interface
  const renderAdminInterface = () => {
    if (!isAdmin) return null;

    return (
      <div className="space-y-6">
        {/* Admin Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building className="w-6 h-6" />
            Admin Dashboard
          </h2>
          <div className="flex gap-4">
            <Button onClick={() => setShowJobForm(!showJobForm)}>
              <PlusCircle className="w-4 h-4 mr-2" />
              {showJobForm ? "Hide Job Form" : "Post New Job"}
            </Button>
            <Button variant="outline" onClick={toggleAdminMode}>
              Exit Admin Mode
            </Button>
          </div>
        </div>

        {/* Job Posting Form */}
        {showJobForm && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Job Posting</CardTitle>
              <CardDescription>
                Fill in the details below to post a new job opportunity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddJob} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newJob.title}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={newJob.company}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      value={newJob.location}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_type">Job Type</Label>
                    <Select
                      value={newJob.job_type}
                      onValueChange={handleJobTypeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={newJob.description}
                      onChange={handleNewJobChange}
                      rows={4}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills_required">Skills Required</Label>
                    <Input
                      id="skills_required"
                      name="skills_required"
                      value={newJob.skills_required}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience_required">
                      Experience Required
                    </Label>
                    <Input
                      id="experience_required"
                      name="experience_required"
                      value={newJob.experience_required}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="application_deadline">
                      Application Deadline
                    </Label>
                    <Input
                      id="application_deadline"
                      type="date"
                      name="application_deadline"
                      value={newJob.application_deadline}
                      onChange={handleNewJobChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="salary_range">Salary Range</Label>
                    <Input
                      id="salary_range"
                      name="salary_range"
                      value={newJob.salary_range}
                      onChange={handleNewJobChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="url">Application URL</Label>
                    <Input
                      id="url"
                      name="url"
                      value={newJob.url}
                      onChange={handleNewJobChange}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button type="submit">Post Job</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Jobs List with Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Job Listings & Applications</CardTitle>
            <CardDescription>
              Manage jobs and view applicant details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {originalJobs.map((job) => {
              const jobApplications = applications.filter(
                (app) => app.jobId === job.id
              );

              return (
                <Card key={job.id} className="relative">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company} • {job.location}
                        </div>
                        <div className="flex gap-2 items-center">
                          <Badge variant="outline">
                            <Users className="h-4 w-4 mr-1" />
                            Applications: {jobApplications.length}
                          </Badge>
                          <Badge variant="outline">{job.job_type}</Badge>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setOriginalJobs((prev) =>
                              prev.filter((j) => j.id !== job.id)
                            );
                          }}
                          className="text-red-600"
                        >
                          Delete
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Applications
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                {job.title} Applications
                              </DialogTitle>
                              <DialogDescription>
                                {job.company} • {jobApplications.length}{" "}
                                applicants
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {/* Job Details */}
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {job.location}
                                </div>
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  {job.job_type}
                                </div>
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 mr-2" />
                                  {job.experience_required}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Posted: {job.date_posted}
                                </div>
                              </div>

                              {/* Applications List */}
                              <div>
                                <h3 className="font-semibold mb-3">
                                  Applicants
                                </h3>
                                {jobApplications.length > 0 ? (
                                  <div className="space-y-3">
                                    {jobApplications.map((app, index) => (
                                      <div
                                        key={app.id}
                                        className="border rounded-lg p-3"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-medium">
                                              Applicant #{index + 1}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                              Status:{" "}
                                              <span className="capitalize">
                                                {app.status}
                                              </span>
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              Applied on: {app.date}
                                            </p>
                                          </div>
                                          <Button variant="outline" size="sm">
                                            View Profile
                                          </Button>
                                        </div>
                                        <div className="mt-2 text-sm">
                                          <p>Notes: {app.notes}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-4 text-gray-500">
                                    No applications received yet
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </CardContent>
        </Card>
      </div>
    );
  };

  // Clear search and reset jobs
  const clearSearch = () => {
    setSearchQuery("");
    setLocation("");
    setJobFilters({
      jobType: "",
      experienceLevel: "",
      datePosted: "",
    });
    setJobs([...originalJobs]);
    setError(null);
  };

  // Render application status badge
  const renderApplicationStatus = (status: string) => {
    switch (status) {
      case "applied":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Applied
          </Badge>
        );
      case "screening":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Screening
          </Badge>
        );
      case "interviewing":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            Interviewing
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-red-100 text-red-800">
            Rejected
          </Badge>
        );
      case "offered":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Offered
          </Badge>
        );
      default:
        return null;
    }
  };

  // Get application for a job
  const getApplicationForJob = (jobId: number) => {
    return applications.find((app) => app.jobId === jobId);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header/Navigation */}
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center">
          <Briefcase className="w-8 h-8 mr-2 text-blue-600" />
          Career Hub {isAdmin && "(Admin Mode)"}
        </h1>

        <div className="flex items-center gap-4">
          {/* Search Method Toggle */}
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                searchMethod === "api"
                  ? "text-green-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {searchMethod === "api" ? "API Search" : "Local Search"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleSearchMethod}
              className={`text-xs px-2 py-1 h-8 ${
                searchMethod === "api" ? "bg-green-50" : ""
              }`}
            >
              <ToggleLeft className="w-4 h-4 mr-1" />
              Toggle
            </Button>
          </div>

          {/* Admin Mode Toggle */}
          <div className="flex items-center gap-2">
            <span
              className={`text-sm ${
                isAdmin ? "text-blue-600 font-medium" : "text-gray-500"
              }`}
            >
              {isAdmin ? "Admin Mode" : "Student Mode"}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleAdminMode}
              className={`text-xs px-2 py-1 h-8 ${isAdmin ? "bg-blue-50" : ""}`}
            >
              <ToggleLeft className="w-4 h-4 mr-1" />
              Toggle
            </Button>
          </div>

          {/* Notifications */}
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs">
                    {unreadNotifications}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-medium">Notifications</h3>
                {unreadNotifications > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllNotificationsAsRead}
                    className="text-xs h-8"
                  >
                    Mark all as read
                  </Button>
                )}
              </div>
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No notifications
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b hover:bg-gray-50 ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                      onClick={() => markNotificationAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        {notification.type === "job_match" && (
                          <Tag className="h-5 w-5 text-blue-600" />
                        )}
                        {notification.type === "application_update" && (
                          <FileText className="h-5 w-5 text-green-600" />
                        )}
                        {notification.type === "system" && (
                          <Info className="h-5 w-5 text-purple-600" />
                        )}
                        {notification.type === "deadline" && (
                          <Clock className="h-5 w-5 text-yellow-600" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.date}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </PopoverContent>
          </Popover>

          {/* User Profile */}
          <Avatar className="h-8 w-8">
            <AvatarImage src={profileData.avatarUrl} />
            <AvatarFallback>
              {profileData.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full mb-6"
      >
        {!isAdmin && (
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-1">
              <Home className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-1">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger
              value="applications"
              className="flex items-center gap-1"
            >
              <FileText className="h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="flex items-center gap-1">
              <Bookmark className="h-4 w-4" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1">
              <UserCircle className="h-4 w-4" />
              Profile
            </TabsTrigger>
          </TabsList>
        )}

        {/* Dashboard Tab Content */}
        {!isAdmin && (
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Welcome to Career Hub</CardTitle>
                  <CardDescription>
                    Your job search platform for students and recent graduates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium mb-2">
                        Hello, {profileData.fullName || "Student"}
                      </h3>
                      <p className="text-gray-600">
                        {profileData.jobTitle
                          ? `Looking for opportunities as ${profileData.jobTitle}`
                          : "Complete your profile to get personalized job recommendations"}
                      </p>
                      {profileData.resumes ? (
                        <div className="mt-2 flex items-center text-sm text-green-600">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resume uploaded
                        </div>
                      ) : (
                        <div className="mt-2 flex items-center text-sm text-yellow-600">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Upload your resume to improve job matching
                        </div>
                      )}
                    </div>
                    <div className="w-full md:w-auto">
                      <Button
                        onClick={() => setActiveTab("jobs")}
                        className="w-full md:w-auto"
                      >
                        Find Jobs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Applications
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats.applicationsSubmitted}
                  </div>
                  <p className="text-xs text-muted-foreground">Jobs applied</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Bookmarks
                  </CardTitle>
                  <Bookmark className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats.bookmarkedJobs}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Saved for later
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Profile Match
                  </CardTitle>
                  <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {userStats.matchScore}%
                  </div>
                  <div className="mt-2">
                    <Progress value={userStats.matchScore} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="col-span-3 md:col-span-2">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {applications.length > 0 ? (
                      applications.slice(0, 3).map((app) => {
                        const job = originalJobs.find(
                          (j) => j.id === app.jobId
                        );
                        return job ? (
                          <div
                            key={app.id}
                            className="flex items-start gap-4 pb-3 border-b"
                          >
                            <div className="bg-gray-100 p-2 rounded-full">
                              <Building className="h-5 w-5 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium">{job.title}</h4>
                              <p className="text-sm text-gray-600">
                                {job.company}
                              </p>
                              <div className="flex items-center mt-1 gap-2">
                                <span className="text-xs text-gray-500">
                                  Applied on {app.date}
                                </span>
                                {renderApplicationStatus(app.status)}
                              </div>
                            </div>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <p className="text-gray-500">No recent applications</p>
                    )}

                    {applications.length > 0 && (
                      <Button
                        variant="ghost"
                        className="w-full mt-2"
                        onClick={() => setActiveTab("applications")}
                      >
                        View all applications
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Jobs */}
              <Card className="col-span-3 md:col-span-1">
                <CardHeader>
                  <CardTitle>Recommended Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {originalJobs.slice(0, 3).map((job) => (
                      <div
                        key={job.id}
                        className="flex flex-col gap-2 pb-3 border-b"
                      >
                        <h4 className="font-medium">{job.title}</h4>
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setActiveTab("jobs")}
                          className="w-full mt-1"
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full mt-2"
                      onClick={() => setActiveTab("jobs")}
                    >
                      View more jobs
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* Jobs Tab Content */}
        <TabsContent value="jobs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Search Jobs</CardTitle>
              <CardDescription>
                Find the perfect job opportunity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Job title, keywords, or company"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative flex-1">
                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button
                    onClick={handleSearch}
                    disabled={isLoading || isFetchingFromAPI}
                    className="min-w-[120px]"
                  >
                    {isLoading || isFetchingFromAPI ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />{" "}
                        Searching
                      </>
                    ) : (
                      "Search"
                    )}
                  </Button>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-800 p-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <Card key={job.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {job.description}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {job.skills_required
                            .split(",")
                            .map((skill, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs"
                              >
                                {skill.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {job.match_percentage && (
                          <Badge className="flex items-center gap-1 bg-green-100 text-green-800">
                            <Percent className="h-4 w-4" />
                            {job.match_percentage}% Match
                          </Badge>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{job.title}</DialogTitle>
                              <div className="text-sm text-gray-600">
                                {job.company}
                              </div>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {job.location}
                                </div>
                                <div className="flex items-center">
                                  <Briefcase className="h-4 w-4 mr-2" />
                                  {job.job_type || "Full-time"}
                                </div>
                                <div className="flex items-center">
                                  <Award className="h-4 w-4 mr-2" />
                                  {job.experience_required}
                                </div>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {job.date_posted}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">
                                  Description
                                </h4>
                                <p className="text-sm whitespace-pre-line">
                                  {job.description}
                                </p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">
                                  Requirements
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                  {job.skills_required
                                    .split(",")
                                    .map((skill, index) => (
                                      <Badge key={index} variant="secondary">
                                        {skill.trim()}
                                      </Badge>
                                    ))}
                                </div>
                              </div>
                              <Button asChild>
                                <a
                                  href={job.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  Apply Now
                                </a>
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-10 border rounded-lg bg-gray-50 col-span-full">
                <Search className="h-10 w-10 mx-auto text-gray-400" />
                <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
                <p className="mt-1 text-gray-500">
                  Try adjusting your search criteria
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        {/* Applications Tab Content */}
        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Applications</CardTitle>
              <CardDescription>
                Track the status of your job applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              {applications.length > 0 ? (
                <div className="space-y-6">
                  {applications.map((app) => {
                    const job = originalJobs.find((j) => j.id === app.jobId);
                    return job ? (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-medium">{job.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="mt-2">
                              {renderApplicationStatus(app.status)}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              Applied on
                            </div>
                            <div className="font-medium">{app.date}</div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mt-2"
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Application Details</DialogTitle>
                                  <DialogDescription>
                                    Status: {app.status} | Applied on {app.date}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid grid-cols-2 gap-4 py-4">
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Building className="h-4 w-4 mr-2" />
                                      <span>{job.company}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <MapPin className="h-4 w-4 mr-2" />
                                      <span>{job.location}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Briefcase className="h-4 w-4 mr-2" />
                                      <span>{job.job_type}</span>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Award className="h-4 w-4 mr-2" />
                                      <span>{job.experience_required}</span>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-4 w-4 mr-2" />
                                      <span>
                                        Deadline: {job.application_deadline}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Tag className="h-4 w-4 mr-2" />
                                      <span>
                                        Match: {job.match_percentage}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-medium">
                                    Application Notes
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {app.notes}
                                  </p>
                                </div>
                                <div className="flex justify-end gap-2 mt-4">
                                  <Button variant="outline">
                                    Withdraw Application
                                  </Button>
                                  <Button asChild>
                                    <a
                                      href={job.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      View Job Posting
                                    </a>
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">
                    No applications yet
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Apply to jobs to track their progress here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookmarks Tab Content */}
        <TabsContent value="bookmarks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bookmarked Jobs</CardTitle>
              <CardDescription>Your saved job opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              {bookmarkedJobs.length > 0 ? (
                <div className="space-y-4">
                  {bookmarkedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Building className="h-4 w-4 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleBookmark(job.id || 0)}
                              className="text-blue-600"
                            >
                              <Bookmark className="h-5 w-5 fill-current" />
                            </Button>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <Bookmark className="h-10 w-10 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium">
                    No bookmarked jobs
                  </h3>
                  <p className="mt-1 text-gray-500">
                    Save jobs by clicking the bookmark icon
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab Content */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                Manage your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleProfileChange}
                      placeholder="Separate skills with commas"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      name="experience"
                      value={profileData.experience}
                      onChange={handleProfileChange}
                      rows={3}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="education">Education</Label>
                    <div className="space-y-4">
                      {educationList.map((edu, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="font-medium">
                            {edu.degree} in {edu.field}
                          </div>
                          <div className="text-sm text-gray-600">
                            {edu.university}
                          </div>
                          <div className="text-sm text-gray-500">
                            {edu.year}
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Resumes</Label>
                    <div className="space-y-4">
                      {/* Display uploaded resumes */}
                      {profileData.resumes && profileData.resumes.length > 0 ? (
                        <div className="space-y-3">
                          {profileData.resumes.map((resume, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between border rounded-lg p-4"
                            >
                              <div className="flex items-center">
                                <FileText className="h-5 w-5 mr-2 text-blue-500" />
                                <div>
                                  <div className="font-medium">
                                    {resume.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {new Date(
                                      resume.uploadDate
                                    ).toLocaleDateString()}
                                    {resume.score && (
                                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        ATS Score: {resume.score}/100
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewResume(resume)}
                                >
                                  View
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleGetATSScore(resume.id)}
                                  disabled={resume.scoreLoading}
                                >
                                  {resume.scoreLoading ? (
                                    <>
                                      <Loader className="h-3 w-3 animate-spin mr-1" />{" "}
                                      Analyzing
                                    </>
                                  ) : resume.score ? (
                                    "Re-Analyze"
                                  ) : (
                                    "Get ATS Score"
                                  )}
                                </Button>
                                {resume.score && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleViewRecommendations(resume.id)
                                    }
                                  >
                                    Recommendations
                                  </Button>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-500"
                                  onClick={() => handleDeleteResume(resume.id)}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center p-4 border border-dashed rounded-lg">
                          <FileQuestion className="h-8 w-8 mx-auto text-gray-400" />
                          <p className="text-sm text-gray-500 mt-2">
                            No resumes uploaded yet
                          </p>
                        </div>
                      )}

                      {/* Upload new resume button */}
                      <div className="flex items-center gap-4">
                        <Label
                          htmlFor="resumeUpload"
                          className="flex flex-1 items-center gap-2 rounded-md border p-4 hover:bg-gray-50 cursor-pointer"
                        >
                          <Upload className="h-5 w-5" />
                          <span>Upload a new resume</span>
                        </Label>
                        <Input
                          id="resumeUpload"
                          type="file"
                          className="hidden"
                          onChange={handleResumeUpload}
                          accept=".pdf,.doc,.docx"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <Label>Notification Preferences</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Email Notifications</div>
                          <div className="text-sm text-gray-500">
                            Receive important updates via email
                          </div>
                        </div>
                        <Switch
                          checked={profileData.notificationPreferences.email}
                          onCheckedChange={(checked) =>
                            handleNotificationPrefChange("email", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Job Alerts</div>
                          <div className="text-sm text-gray-500">
                            Get notified about new job matches
                          </div>
                        </div>
                        <Switch
                          checked={
                            profileData.notificationPreferences.jobAlerts
                          }
                          onCheckedChange={(checked) =>
                            handleNotificationPrefChange("jobAlerts", checked)
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Application Updates</div>
                          <div className="text-sm text-gray-500">
                            Stay informed about your applications
                          </div>
                        </div>
                        <Switch
                          checked={
                            profileData.notificationPreferences
                              .applicationUpdates
                          }
                          onCheckedChange={(checked) =>
                            handleNotificationPrefChange(
                              "applicationUpdates",
                              checked
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4">
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 animate-spin mr-2" />{" "}
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Resume Preview Modal */}
          {resumePreviewOpen && selectedResume && (
            <Dialog
              open={resumePreviewOpen}
              onOpenChange={setResumePreviewOpen}
            >
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>
                    Resume Preview: {selectedResume.name}
                  </DialogTitle>
                </DialogHeader>
                <div className="h-96 overflow-auto border rounded">
                  <iframe
                    src={selectedResume.url}
                    className="w-full h-full"
                    title="Resume Preview"
                  />
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setResumePreviewOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => window.open(selectedResume.url, "_blank")}
                  >
                    Open in New Tab
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {/* ATS Recommendations Modal */}
          {recommendationsOpen && selectedResumeScore && (
            <Dialog
              open={recommendationsOpen}
              onOpenChange={setRecommendationsOpen}
            >
              <DialogContent className="sm:max-w-4xl">
                <DialogHeader>
                  <DialogTitle>ATS Score Analysis</DialogTitle>
                  <DialogDescription>
                    Resume: {selectedResumeScore.name} - Score:{" "}
                    {selectedResumeScore.score}/100
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium">Category Scores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      {selectedResumeScore.categoryScores &&
                        Object.entries(selectedResumeScore.categoryScores).map(
                          ([category, score]) => (
                            <div key={category} className="space-y-1">
                              <div className="flex justify-between">
                                <span className="text-sm">
                                  {formatCategoryName(category)}
                                </span>
                                <span className="text-sm font-medium">
                                  {score}/100
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getScoreColor(
                                    Number(score)
                                  )}`}
                                  style={{ width: `${score}%` }}
                                ></div>
                              </div>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Detailed Feedback</h3>
                    <div className="space-y-3 mt-2">
                      {selectedResumeScore.feedback &&
                        Object.entries(selectedResumeScore.feedback).map(
                          ([category, feedback]) => (
                            <div
                              key={category}
                              className="border-l-4 border-blue-500 pl-4 py-2"
                            >
                              <h4 className="font-medium">
                                {formatCategoryName(category)}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {feedback}
                              </p>
                            </div>
                          )
                        )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Recommendations</h3>
                    <ul className="list-disc list-inside space-y-2 mt-2">
                      {selectedResumeScore.recommendations &&
                        selectedResumeScore.recommendations.map(
                          (recommendation, index) => (
                            <li key={index} className="text-sm">
                              {recommendation}
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setRecommendationsOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() =>
                      handleDownloadRecommendations(selectedResumeScore)
                    }
                  >
                    Download Report
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </TabsContent>
      </Tabs>
      {/* Conditionally render admin interface or regular interface */}
      {/* Main Content Area */}
      {isAdmin ? (
        renderAdminInterface()
      ) : (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full mb-6"
        ></Tabs>
      )}
    </div>
  );
};

export default JobPortal;
