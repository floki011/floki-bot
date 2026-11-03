const config = window.FLOKI_CONFIG;

const db = window.supabase.createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
);

const form = document.getElementById("contentForm");
const statusText = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");

const fields = [
  "brand",
  "title_en",
  "description_en",
  "featuresTitle_en",
  "featuresDescription_en",
  "title_ar",
  "description_ar",
  "featuresTitle_ar",
  "featuresDescription_ar"
];

function showStatus(message, success = true) {
  statusText.textContent = message;
  statusText.style.color = success ? "#d6ad55" : "#ff7777";
}

async function checkOwner() {
  const { data: sessionData, error: sessionError } =
    await db.auth.getSession();

  console.log("SESSION:", sessionData);
  console.log("SESSION ERROR:", sessionError);

  if (sessionError || !sessionData.session) {
    console.error("No active session!");
    alert("Session missing: " + (sessionError?.message || "No session"));
    window.location.href = "index.html";
    return false;
  }

  const user = sessionData.session.user;

  const { data: admin, error } = await db
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  console.log("OWNER DATA:", admin);
  console.log("OWNER ERROR:", error);

  if (error) {
    alert("Owner check error: " + error.message);
    return false;
  }

  if (!admin) {
    alert("Your account is not recognized as Owner.");
    return false;
  }

  return true;
}
  }

  const user = sessionData.session.user;

  const { data: admin, error } = await db
    .from("site_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !admin) {
    await db.auth.signOut();
    window.location.href = "index.html";
    return false;
  }

  return true;
}

async function loadContent() {
  const { data, error } = await db
    .from("site_content")
    .select("content")
    .eq("id", 1)
    .single();

  if (error) {
    showStatus("Failed to load website content.", false);
    console.error(error);
    return;
  }

  const content = data.content || {};

  fields.forEach(field => {
    const input = document.getElementById(field);

    if (input) {
      input.value = content[field] || "";
    }
  });
}

form.addEventListener("submit", async event => {
  event.preventDefault();

  saveBtn.disabled = true;
  saveBtn.textContent = "SAVING...";
  showStatus("Saving changes...");

  const content = {};

  fields.forEach(field => {
    const input = document.getElementById(field);

    if (input) {
      content[field] = input.value.trim();
    }
  });

  try {
    const { error } = await db
      .from("site_content")
      .update({
        content,
        updated_at: new Date().toISOString()
      })
      .eq("id", 1);

    if (error) throw error;

    showStatus("Changes saved successfully!");

  } catch (error) {
    console.error(error);
    showStatus(error.message || "Failed to save changes.", false);
  }

  saveBtn.disabled = false;
  saveBtn.textContent = "SAVE CHANGES";
});

document.getElementById("logoutBtn").addEventListener("click", async () => {
  await db.auth.signOut();
  window.location.href = "index.html";
});

async function startDashboard() {
  const isOwner = await checkOwner();

  if (!isOwner) return;

  await loadContent();
}

startDashboard();