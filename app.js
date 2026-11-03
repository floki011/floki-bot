const config = window.FLOKI_CONFIG;

let currentLanguage = "en";
let websiteContent = {};

const defaultContent = {
  title_en: "POWER. CONTROL. SECURITY.",
  title_ar: "القوة. التحكم. الحماية.",
  description_en: "Floki Bot is an all-in-one Discord server management system featuring advanced logging, moderation, voice channel tracking, administrative controls, and server management tools.",
  description_ar: "Floki Bot نظام متكامل لإدارة سيرفرات Discord، يوفر تسجيل الأحداث المتقدم، والإشراف والحماية، وتتبع الرومات الصوتية، والتحكم الإداري، وأدوات إدارة السيرفر.",
  featuresTitle_en: "Powerful Server Management",
  featuresTitle_ar: "إدارة قوية للسيرفر",
  featuresDescription_en: "Everything your Discord community needs in one place.",
  featuresDescription_ar: "كل ما يحتاجه مجتمع Discord الخاص بك في مكان واحد."
};

const translations = {
  en: {
    features: "WHAT WE OFFER",
    feature1Title: "Advanced Logging",
    feature1Text: "Monitor server events and keep track of important activities.",
    feature2Title: "Moderation",
    feature2Text: "Manage your community with powerful moderation tools.",
    feature3Title: "Voice Tracking",
    feature3Text: "Track voice channel activity and member movements.",
    feature4Title: "Admin Controls",
    feature4Text: "Keep administrative actions organized and monitored.",
    language: "عربي"
  },
  ar: {
    features: "ماذا نقدم",
    feature1Title: "تسجيل الأحداث",
    feature1Text: "راقب أحداث السيرفر وتابع جميع الأنشطة المهمة.",
    feature2Title: "الإشراف والحماية",
    feature2Text: "أدر مجتمعك باستخدام أدوات إشراف متقدمة.",
    feature3Title: "تتبع الرومات الصوتية",
    feature3Text: "تابع نشاط الرومات الصوتية وحركة الأعضاء.",
    feature4Title: "التحكم الإداري",
    feature4Text: "نظّم الإجراءات الإدارية وراقبها.",
    language: "English"
  }
};

function setText(id, value) {
  const element = document.getElementById(id);
  if (element && typeof value === "string") {
    element.textContent = value;
  }
}

function applyLanguage(language) {
  currentLanguage = language;
  const isArabic = language === "ar";
  const t = translations[language];

  document.documentElement.lang = language;
  document.documentElement.dir = isArabic ? "rtl" : "ltr";
  document.body.dir = isArabic ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-ar]").forEach(element => {
    element.textContent = isArabic
      ? element.dataset.ar
      : element.dataset.en;
  });

  setText("heroTitle",
    websiteContent[isArabic ? "title_ar" : "title_en"] ||
    defaultContent[isArabic ? "title_ar" : "title_en"]
  );

  setText("heroDescription",
    websiteContent[isArabic ? "description_ar" : "description_en"] ||
    defaultContent[isArabic ? "description_ar" : "description_en"]
  );

  setText("featuresTitle",
    websiteContent[isArabic ? "featuresTitle_ar" : "featuresTitle_en"] ||
    defaultContent[isArabic ? "featuresTitle_ar" : "featuresTitle_en"]
  );

  setText("featuresDescription",
    websiteContent[isArabic ? "featuresDescription_ar" : "featuresDescription_en"] ||
    defaultContent[isArabic ? "featuresDescription_ar" : "featuresDescription_en"]
  );

  setText("feature1Title", t.feature1Title);
  setText("feature1Text", t.feature1Text);
  setText("feature2Title", t.feature2Title);
  setText("feature2Text", t.feature2Text);
  setText("feature3Title", t.feature3Title);
  setText("feature3Text", t.feature3Text);
  setText("feature4Title", t.feature4Title);
  setText("feature4Text", t.feature4Text);

  const languageButton = document.getElementById("languageBtn");
  if (languageButton) {
    languageButton.textContent = t.language;
  }

  document.title = isArabic
    ? "Floki Bot | القوة والتحكم والحماية"
    : "Floki Bot | Power. Control. Security.";
}

async function loadWebsiteContent() {
  if (!config || !config.SUPABASE_URL || !config.SUPABASE_ANON_KEY) {
    console.error("Supabase configuration is missing.");
    return;
  }

  if (!window.supabase) {
    console.error("Supabase library failed to load.");
    return;
  }

  try {
    const client = window.supabase.createClient(
      config.SUPABASE_URL,
      config.SUPABASE_ANON_KEY
    );

    const { data, error } = await client
      .from("site_content")
      .select("content")
      .eq("id", 1)
      .single();

    if (error) throw error;

    websiteContent = data?.content || {};
    applyLanguage(currentLanguage);

  } catch (error) {
    console.error("Could not load website content:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const languageButton = document.getElementById("languageBtn");

  if (languageButton) {
    languageButton.addEventListener("click", () => {
      applyLanguage(currentLanguage === "en" ? "ar" : "en");
    });
  }

  applyLanguage("en");
  loadWebsiteContent();
});