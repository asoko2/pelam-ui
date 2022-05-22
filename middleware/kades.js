export default function ({ $auth, redirect }) {
  if ($auth.user.level != 3) {
    redirect("/");
  }
}
