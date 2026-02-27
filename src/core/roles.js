export const USER_TYPES = {
  ADMINISTRATOR: "Administrator",
  TEACHER: "Teacher",
  STUDENT: "Student",
};

export function dashboardPathForRole(userType = "") {
  if (userType === USER_TYPES.TEACHER) return "/teacher/dashboard";
  if (userType === USER_TYPES.STUDENT) return "/student/dashboard";
  return "/admin/dashboard";
}

export function profilePathForRole(userType = "") {
  if (userType === USER_TYPES.TEACHER) return "/teacher/profile";
  if (userType === USER_TYPES.STUDENT) return "/student/profile";
  return "/admin/profile";
}
