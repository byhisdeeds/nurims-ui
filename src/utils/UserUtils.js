
export function isValidUserRole(user, role) {
  return user.hasOwnProperty("profile") && (user.profile["role"].includes(`'${role}'`));
    // (user.profile["role"].includes('sysadmin') || user.profile["role"].includes(`'${role}'`));
}
