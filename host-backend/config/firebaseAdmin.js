//host-backend
// config/firebaseAdmin.js
// Verifies Firebase ID tokens from "Sign in with Google".
// Only FIREBASE_PROJECT_ID is needed — token verification uses Google's
// public keys, so no service-account JSON is required.
"use strict";

const { initializeApp, getApps } = require("firebase-admin/app");
const { getAuth } = require("firebase-admin/auth");

function firebaseAuth() {
  if (!process.env.FIREBASE_PROJECT_ID)
    throw new Error("FIREBASE_PROJECT_ID is not set in .env");
  if (!getApps().length)
    initializeApp({ projectId: process.env.FIREBASE_PROJECT_ID });
  return getAuth();
}

const verifyFirebaseIdToken = (idToken) =>
  firebaseAuth().verifyIdToken(idToken);

module.exports = { verifyFirebaseIdToken };
