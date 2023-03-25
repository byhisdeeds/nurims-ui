
export function isValidUserRole(user, role) {
  return user.hasOwnProperty("profile") && (user.profile["role"].includes(`'${role}'`));
}