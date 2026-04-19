import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAhjKRVo-onRr4_1PwyPiKrV_tGIC01ZfM",
  authDomain: "disenossmith-b36da.firebaseapp.com",
  projectId: "disenossmith-b36da",
  storageBucket: "disenossmith-b36da.firebasestorage.app",
  messagingSenderId: "916345355521",
  appId: "1:916345355521:web:6a885a12d0b1d635682f00",
  measurementId: "G-YWRSE1JX8V",
};

const EMAILJS_SERVICE_ID = "service_ghiwdwi";
const EMAILJS_TEMPLATE_ID = "template_yrcc89m";
const EMAILJS_PUBLIC_KEY = "gEyYRrwE2-P-mZJkT";

function qs(id) {
  return document.getElementById(id);
}

function initFirebaseAuthUI() {
  const authBtn = qs("authBtn");
  const authStatus = qs("authStatus");
  if (!authBtn || !authStatus) return;

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  try {
    getAnalytics(app);
  } catch {
    // Analytics may fail on non-HTTPS/local environments.
  }

  const setSignedOut = () => {
    authStatus.textContent = "Invitado";
    authBtn.textContent = "Iniciar sesión";
    authBtn.dataset.state = "signedOut";
  };

  const setSignedIn = (user) => {
    const label = user?.displayName || user?.email || "Usuario";
    authStatus.textContent = label;
    authBtn.textContent = "Cerrar sesión";
    authBtn.dataset.state = "signedIn";
  };

  onAuthStateChanged(auth, (user) => {
    if (user) setSignedIn(user);
    else setSignedOut();
  });

  authBtn.addEventListener("click", async () => {
    const isSignedIn = authBtn.dataset.state === "signedIn";
    authBtn.disabled = true;
    try {
      if (isSignedIn) await signOut(auth);
      else await signInWithPopup(auth, provider);
    } catch (err) {
      console.error(err);
      alert("No se pudo iniciar sesión. Revisa que Firebase Auth (Google) esté habilitado.");
    } finally {
      authBtn.disabled = false;
    }
  });
}

function initWhatsAppCTAs() {
  const phoneNumber = "573183027747";
  document.addEventListener("click", (e) => {
    const btn = e.target.closest(".whatsapp-cta");
    if (!btn) return;
    const text = btn.getAttribute("data-whatsapp") || "Hola, quiero información.";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, "_blank");
  });
}

function initEmailJSContactForm() {
  const form = qs("contactForm");
  const status = qs("contactStatus");
  const submit = qs("contactSubmit");
  if (!form || !status) return;

  const emailjs = window.emailjs;
  if (!emailjs) {
    status.textContent = "No se pudo cargar el servicio de contacto. Intenta recargar la página.";
    return;
  }

  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "";

    if (submit) submit.disabled = true;
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form);
      form.reset();
      status.textContent = "Mensaje enviado. Gracias, te contactaremos pronto.";
    } catch (err) {
      console.error(err);
      status.textContent = "No se pudo enviar el mensaje. Intenta de nuevo en unos minutos.";
    } finally {
      if (submit) submit.disabled = false;
    }
  });
}

initFirebaseAuthUI();
initWhatsAppCTAs();
initEmailJSContactForm();

