
export function isValidUserRole(user, role) {
  return user.hasOwnProperty("profile") && (user.profile["role"].includes(`'${role}'`));
  // (user.profile["role"].includes('sysadmin') || user.profile["role"].includes(`'${role}'`));
}

export function userFullname(user, users) {
  if (users.hasOwnProperty("users")) {
    for (const u of users.users) {
      if (u[0] === user) {
        return u[1];
      }
    }
  }
  return user;
}