import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STUDENTS, INITIAL_NOTIFICATIONS } from '../mockData/studentData';
import api from "../services/api";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
  !!localStorage.getItem("token")
);

  const [currentUser, setCurrentUser] = useState(() => {
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
});

  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });


  // Global state for students
  const [students, setStudents] = useState([]);

  const [teachers, setTeachers] = useState([]);

  const [marks, setMarks] = useState([]);

  // Dashboard Analytics
  const [dashboardData, setDashboardData] = useState(null);

  const [predictionData, setPredictionData] = useState(null);

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [adminDashboard, setAdminDashboard] = useState(null);

  // Global filters
  const [filters, setFilters] = useState({
    department: 'All',
    semester: 'All',
    division: 'All',
    searchQuery: '',
    riskLevel: 'All'
  });

  // Modals & Selected Student State
  const [activeModal, setActiveModal] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // ML API configuration state
  const [mlApiConfig, setMlApiConfig] = useState({
    endpointUrl: import.meta.env.VITE_ML_API_URL,
    status: 'Simulated Data Active',
    lastConfidence: 94.8,
    isLive: false
});


  const loadAdminDashboard = async () => {

    console.log("loadAdminDashboard called");

    try {

        const response =
            await api.get("/Admin/dashboard");

        console.log("Admin API Response:", response.data);

        setAdminDashboard(response.data);

    }
    catch (err) {

        console.error(
            "Unable to load admin dashboard.",
            err
        );

    }

};

  const loadStudents = async (filterData = filters) => {
  try {

    const response = await api.get("/Students", {
      params: {
        search: filterData.searchQuery || undefined,
        department:
          filterData.department !== "All"
            ? filterData.department
            : undefined,
        semester:
          filterData.semester !== "All"
            ? filterData.semester
            : undefined,
        division:
          filterData.division !== "All"
            ? filterData.division
            : undefined,
        riskLevel:
          filterData.riskLevel !== "All"
            ? filterData.riskLevel
            : undefined
      }
    });


    const apiStudents = response.data;


const mappedStudents = apiStudents.map(student => ({
  id: student.id,

  registrationId: student.registrationId,

  rollNumber: student.rollNumber,

  fullName: student.fullName,

  email: student.email,

  avatarUrl:
    student.avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.fullName}`,

  departmentName: student.departmentName,

  semester: student.semester,

  division: student.division,

  attendancePercentage: student.attendancePercentage,

  averageMarks: student.averageMarks,

  currentGpa: student.currentGpa,

  predictedGpa: student.predictedGpa,

  predictedGrade: student.predictedGrade,

  riskLevel: student.riskLevel,

  status: student.status,

  guardianName: student.guardianName,

  guardianPhone: student.guardianPhone,

  aiRecommendation: student.aiRecommendation,

  attendanceHistory: [80, 82, 84, 86, student.attendancePercentage],

  gpaHistory: [3.0, 3.1, student.currentGpa],


  skills: {
    coding: 75,
    theory: 75,
    lab: 75,
    aptitude: 75,
    projects: 75,
    softSkills: 75
  }
}));

    setStudents(mappedStudents);

  } catch (err) {
    console.error("Unable to load students", err);
  }
};

    const loadTeachers = async () => {
    try {

        const response = await api.get("/Teachers");

        const mappedTeachers = response.data.map(t => ({
            id: t.id,
            fullName: t.fullName,
            email: t.email,
            department: t.department,
            title: t.title,

            avatarUrl:
                t.avatarUrl ||
                `https://api.dicebear.com/7.x/avataaars/svg?seed=${t.fullName}`
        }));

        setTeachers(mappedTeachers);

    } catch (err) {

        console.error("Unable to load teachers", err);

    }
};



const loadDashboard = async () => {
    try {

        const response = await api.get("/Analytics/powerbi-summary");

        setDashboardData(response.data);

    } catch (err) {
        console.error("Unable to load dashboard.", err);
    }
};

const loadPredictions = async () => {
    try {

        const response = await api.get("/Predictions");

        setPredictionData(response.data);

    } catch (err) {
        console.error("Unable to load predictions.", err);
    }
};

const runInference = async () => {
  try {
    await api.post("/Predictions/run-inference");

    // Reload data after prediction completes
    await loadStudents();
    await loadPredictions();

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

const loadMarks = async () => {
    try {

        const response = await api.get("/Marks");

        setMarks(response.data);

    } catch (err) {

        console.error(err);

    }
};

  // Apply dark mode class to document tag
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

useEffect(() => {

    if (!isAuthenticated || !currentUser) {

        return;

    }

    if (currentUser.role === "Admin") {

        loadStudents();
        loadTeachers();
        loadAdminDashboard();

    }
    else if (currentUser.role === "Teacher") {

        loadStudents();
        loadDashboard();
        loadMarks();
        loadPredictions();

    }
    else if (currentUser.role === "Student") {

        loadStudents();
        loadMarks();
        loadPredictions();

    }

}, [isAuthenticated, currentUser]);

useEffect(() => {

    if (
        currentUser?.role === "Teacher" ||
        currentUser?.role === "Admin"
    ) {
        loadStudents(filters);
    }

}, [filters, currentUser]);

useEffect(() => {

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {

        api.defaults.headers.common["Authorization"] =
            `Bearer ${token}`;

        setIsAuthenticated(true);
        setCurrentUser(JSON.parse(user));
        setActivePage("dashboard");

    }

}, []);



  const toggleDarkMode = () => setDarkMode(prev => !prev);

const addStudent = async (newStudentData) => {
  try {

    const dto = {
      registrationId: newStudentData.registrationId,
      fullName: newStudentData.name,
      rollNumber: newStudentData.rollNo,
      email: newStudentData.email,
      departmentName: newStudentData.department,
      semester: Number(newStudentData.semester),
      division: newStudentData.division,
      guardianName: newStudentData.guardianName,
      guardianPhone: newStudentData.guardianPhone
};

    await api.post("/Students", dto);

    await loadStudents();

  } catch (err) {
    console.error(err);
    alert("Unable to add student.");
  }
};

  const updateStudent = async (id, updatedFields) => {
  try {
    await api.put(`/Students/${id}`, {
      registrationId: updatedFields.registrationId,
      rollNumber: updatedFields.rollNo,
      fullName: updatedFields.name,
      email: updatedFields.email,
      departmentName: updatedFields.department,
      semester: updatedFields.semester,
      division: updatedFields.division,
      guardianName: updatedFields.guardianName,
      guardianPhone: updatedFields.guardianPhone
    });

    await loadStudents();

  } catch (err) {
    console.error(err);
    alert("Unable to update student.");
  }
};

  const deleteStudent = async (id) => {
  try {
    await api.delete(`/Students/${id}`);
    await loadStudents();
  } catch (err) {
    console.error(err);
    alert("Unable to delete student.");
  }
};

const addTeacher = async (teacherData) => {
    try {

        await api.post("/Teachers", {
            fullName: teacherData.fullName,
            email: teacherData.email,
            department: teacherData.department,
            title: teacherData.title
        });

        await loadTeachers();

    } catch (err) {

        console.error(err);
        alert("Unable to add teacher.");

    }
};

const updateTeacher = async (id, teacherData) => {
    try {

        await api.put(`/Teachers/${id}`, {
            fullName: teacherData.fullName,
            email: teacherData.email,
            department: teacherData.department,
            title: teacherData.title
        });

        await loadTeachers();

    } catch (err) {

        console.error(err);
        alert("Unable to update teacher.");

    }
};

const deleteTeacher = async (id) => {
    try {

        await api.delete(`/Teachers/${id}`);

        await loadTeachers();

    } catch (err) {

        console.error(err);
        alert("Unable to delete teacher.");

    }
};

const resetTeacherPassword = async (id) => {
    try {

        await api.put(`/Teachers/${id}/reset-password`);

    } catch (err) {

        console.error(err);
        alert("Unable to reset password.");

    }
};

  const markAttendance = async (records, department, subject, date) => {
  try {

    const dto = {
      date: date,
      departmentName: department,
      subjectName: subject,
      records: records
    };

    await api.post("/Attendance/batch-mark", dto);

  } catch (err) {
    console.error(err);
    alert("Unable to save attendance.");
  }
};

const saveMarks = async (marksList) => {
  try {

    await api.post("/Marks/save", marksList);

    await Promise.all([
    loadStudents(),
    loadMarks(),
    loadDashboard()
]);

  } catch (err) {
    console.error(err);
    alert("Unable to save marks.");
  }
};

const autoCalculateGrades = async () => {
  try {

    await api.post("/Marks/calculate-grades");

    await loadStudents();

    await loadDashboard();

  } catch (err) {

    console.error(err);

  }
};

const loginUser = async (email, password) => {

    try {

        const response = await api.post("/Auth/login", {
            email,
            password
        });

        const user = response.data;

        localStorage.setItem("token", user.token);

        localStorage.setItem("user", JSON.stringify(user));

        api.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;

        setCurrentUser({

            name: user.name,

            role: user.role,

            email: user.email,

            department: user.department,

            avatar: user.avatar,

            title: user.title

        });

        if (user.role === "Admin") {

            console.log("Admin detected");
            await loadAdminDashboard();
            console.log("Dashboard loaded");

        }

        setIsAuthenticated(true);

        setActivePage("dashboard");

        return user;

    } catch (err) {

    console.error(err);

    throw err;

}

};

  const logoutUser = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    setCurrentUser(null);

    setIsAuthenticated(false);

    setActivePage("login");

};

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      currentUser,
      activePage,
      setActivePage,
      sidebarCollapsed,
      setSidebarCollapsed,
      darkMode,
      toggleDarkMode,
      students,
      setStudents,
      marks,
      loadMarks,
      dashboardData,
      loadDashboard,
      predictionData,
      loadPredictions,
      runInference,
      addStudent,
      updateStudent,
      deleteStudent,
      markAttendance,
      saveMarks,
      autoCalculateGrades,
      notifications,
      setNotifications,
      filters,
      setFilters,
      activeModal,
      setActiveModal,
      selectedStudent,
      setSelectedStudent,
      mlApiConfig,
      setMlApiConfig,
      loginUser,
      logoutUser,
      teachers,
      setTeachers,

      loadTeachers,

      addTeacher,
      updateTeacher,
      deleteTeacher,
      resetTeacherPassword,

      selectedTeacher,
      setSelectedTeacher,

      adminDashboard,
      loadAdminDashboard,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
