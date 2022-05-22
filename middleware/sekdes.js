export default function ({ $auth, redirect }) {
  if ($auth.user.level != 2) {
    redirect("/");
  }
}
