import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "vps-italia-legacy-db.firebaseapp.com",
  projectId: "vps-italia-legacy-db",
  storageBucket: "vps-italia-legacy-db.firebasestorage.app",
  messagingSenderId: "62508633313",
  appId: "1:62508633313:web:51b0d9ad1ac5c5d9217ba0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = "datasmartltd@protonmail.ch";
const password = "Toronto999@#";

async function run() {
  try {
    console.log("Tentando login no Firebase com:", email);
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("SUCESSO! Login realizado perfeitamente. UID:", cred.user.uid);
    process.exit(0);
  } catch (err) {
    console.log("Erro no login:", err.code, err.message);
    if (err.code === "auth/user-not-found" || err.code === "auth/invalid-credential") {
      console.log("Tentando cadastrar o usuário no Firebase agora...");
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, password);
        console.log("USUÁRIO CADASTRADO COM SUCESSO! UID:", newCred.user.uid);
        process.exit(0);
      } catch (createErr) {
        console.log("Erro ao cadastrar:", createErr.code, createErr.message);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
}
run();
