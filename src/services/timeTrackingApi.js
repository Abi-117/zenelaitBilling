import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* PROJECTS */
export const fetchProjects = () => API.get("/projects");
export const createProject = data => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = id => API.delete(`/projects/${id}`);

/* TIMESHEETS */
export const fetchTimesheets = () => API.get("/timesheets");
export const createTimesheet = data => API.post("/timesheets", data);
export const updateTimesheet = (id, data) => API.put(`/timesheets/${id}`, data);
export const deleteTimesheet = id => API.delete(`/timesheets/${id}`);
