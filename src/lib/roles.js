const roleHomePaths = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
};

function roleHomePath(role) {
  return roleHomePaths[role] || "/login";
}

export { roleHomePath };
