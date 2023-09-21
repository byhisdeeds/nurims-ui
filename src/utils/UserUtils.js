
export function isValidUserRole(user, role) {
  return role === 'sysadmin' ? true : user.hasOwnProperty("profile") && (user.profile["role"].includes(`'${role}'`));
}
