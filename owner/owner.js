const config = window.FLOKI_CONFIG;

const supabaseClient = window.supabase.createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);

const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");
const loginButton = document.getElementById("loginButton");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "";
  loginButton.disabled = true;
  loginButton.textContent = "PLEASE WAIT...";

  try {
    // تسجيل الدخول باستخدام Supabase
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // التأكد أن الحساب موجود ضمن قائمة Owner
    const { data: admin, error: adminError } = await supabaseClient
      .from("site_admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError) throw adminError;

    if (!admin) {
      await supabaseClient.auth.signOut();
      throw new Error("This account does not have Owner access.");
    }

    message.style.color = "#d6ad55";
    message.textContent = "Login successful!";

    window.location.href = "dashboard.html";

  } catch (error) {
    message.style.color = "#ff7777";
    message.textContent = error.message || "Login failed.";
  }

  loginButton.disabled = false;
  loginButton.textContent = "SIGN IN";
});