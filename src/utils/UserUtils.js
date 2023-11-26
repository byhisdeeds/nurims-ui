
export function isValidUserRole(user, role) {
  // return user.hasOwnProperty("profile") && (user.profile["role"].includes(`'${role}'`));
  // // (user.profile["role"].includes('sysadmin') || user.profile["role"].includes(`'${role}'`));
  if (user.hasOwnProperty("profile")) {
    if (Array.isArray(role)) {
      for (const r of role) {
        if (user.profile["role"].includes(`'${r}'`)) {
          return true;
        }
      }
    } else if (typeof role === "string") {
      return user.profile["role"].includes(`'${role}'`);
    }
  }
  return false;
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