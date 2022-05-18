export default function ({ $auth, redirect }) {
  if ($auth.user.level != 1) {
    redirect("/");
  }
}
