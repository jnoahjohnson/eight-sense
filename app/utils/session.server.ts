import bcrypt from "bcryptjs";
import { createCookieSessionStorage, redirect } from "remix";
import { db } from "./db.server";

type LoginForm = {
  email: string;
  password: string;
};

interface RegisterForm extends LoginForm {
  name: string;
}

export async function login({ email, password }: LoginForm) {
  let user = await db.user.findUnique({
    where: { email },
  });
  if (!user) return null;
  let isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;
  return user;
}

export async function register({ email, password, name }: RegisterForm) {
  let passwordHash = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { email, passwordHash, name },
  });
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

let storage = createCookieSessionStorage({
  cookie: {
    name: "sense_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    // let searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect("/auth/login");
  }
  return userId;
}

export async function createUserSession(userId: string, redirectTo: string) {
  let session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
}

export async function getUser(request: Request) {
  let userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    let user = await db.user.findUnique({
      where: { id: userId },
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  let session = await storage.getSession(request.headers.get("Cookie"));
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await storage.destroySession(session),
    },
  });
}
