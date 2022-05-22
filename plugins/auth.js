export default function ({ $auth }) {
  $auth.onRedirect((to, from) => {
    if (from === "/") {
      if ($auth.user.level == 1) {
        return "/admin/dashboard";
      } else if ($auth.user.level == 2) {
        return "/sekdes/dashboard";
      } else {
        return "/kades/dashboard";
      }
    } else {
      const uri = from.split("/");
    }
  });
}
