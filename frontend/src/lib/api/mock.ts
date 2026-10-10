// In-memory stand-in for the backend, used until the real API exists.
// Each function matches an operation in docs/openapi.yaml, except where noted.

import type {
  AuthResponse,
  Friendship,
  Group,
  Post,
  PostResponse,
  PublicUser,
  User,
} from "./types";

export const ME_ID = "u-me";

type Db = {
  people: PublicUser[];
  friendIds: string[];
  requests: Friendship[];
  groups: Group[];
  posts: Post[];
  responses: PostResponse[];
};

let db: Db | null = null;

// Seeded on first use so timestamps are relative to when the app was opened.
function seed(): Db {
  const t0 = Date.now();
  const at = (minutes: number) => new Date(t0 + minutes * 60_000).toISOString();
  const person = (id: string, username: string, displayName: string): PublicUser => ({
    id,
    username,
    displayName,
    avatarUrl: null,
  });
  const post = (p: Partial<Post> & Pick<Post, "id" | "posterId" | "placeName" | "expiresAt">): Post => ({
    placeId: `mock-${p.id}`,
    lat: 12.9716,
    lng: 77.5946,
    note: null,
    etaMode: "STATIC",
    declaredEta: null,
    posterLastLat: null,
    posterLastLng: null,
    posterLastLocationAt: null,
    visibilityScope: "ALL_FRIENDS",
    groupId: null,
    status: "ACTIVE",
    createdAt: at(-15),
    ...p,
  });
  const response = (
    id: string,
    postId: string,
    userId: string,
    status: PostResponse["status"],
    extra: Partial<PostResponse> = {},
  ): PostResponse => ({
    id,
    postId,
    userId,
    status,
    sharingEta: false,
    createdAt: at(-10),
    updatedAt: at(-10),
    ...extra,
  });

  return {
    people: [
      person("u-aanya", "aanya", "Aanya Rao"),
      person("u-rohan", "rohan.k", "Rohan Kulkarni"),
      person("u-meera", "meera", "Meera Iyer"),
      person("u-kabir", "kabir", "Kabir Shah"),
      person("u-ishaan", "ishaan", "Ishaan Verma"),
    ],
    friendIds: ["u-aanya", "u-rohan", "u-meera", "u-kabir"],
    requests: [
      {
        id: "f-ishaan",
        requesterId: "u-ishaan",
        addresseeId: ME_ID,
        status: "PENDING",
        createdAt: at(-180),
        respondedAt: null,
      },
    ],
    groups: [
      {
        id: "g-courts",
        name: "Evening badminton",
        creatorId: "u-rohan",
        createdAt: at(-60 * 24 * 20),
        members: [
          { userId: "u-rohan", role: "ADMIN", joinedAt: at(-60 * 24 * 20) },
          { userId: ME_ID, role: "MEMBER", joinedAt: at(-60 * 24 * 19) },
          { userId: "u-kabir", role: "MEMBER", joinedAt: at(-60 * 24 * 19) },
          { userId: "u-aanya", role: "MEMBER", joinedAt: at(-60 * 24 * 12) },
        ],
      },
      {
        id: "g-study",
        name: "Library regulars",
        creatorId: ME_ID,
        createdAt: at(-60 * 24 * 40),
        members: [
          { userId: ME_ID, role: "ADMIN", joinedAt: at(-60 * 24 * 40) },
          { userId: "u-meera", role: "MEMBER", joinedAt: at(-60 * 24 * 40) },
        ],
      },
    ],
    posts: [
      post({
        id: "p-mall",
        posterId: "u-aanya",
        placeName: "City Centre Mall",
        note: "Picking up a birthday gift, then the food court.",
        declaredEta: at(25),
        expiresAt: at(120),
      }),
      post({
        id: "p-courts",
        posterId: "u-rohan",
        placeName: "Indoor Courts, Sports Complex",
        note: "Badminton. We need a fourth.",
        etaMode: "LIVE",
        posterLastLat: 12.9698,
        posterLastLng: 77.5921,
        posterLastLocationAt: at(-1),
        visibilityScope: "GROUP",
        groupId: "g-courts",
        expiresAt: at(90),
        createdAt: at(-6),
      }),
      post({
        id: "p-coffee",
        posterId: ME_ID,
        placeName: "Corner Coffee House",
        note: "Working from here till six.",
        declaredEta: at(10),
        visibilityScope: "SPECIFIC_FRIENDS",
        expiresAt: at(180),
        createdAt: at(-30),
      }),
    ],
    responses: [
      response("r-1", "p-mall", "u-rohan", "GOING"),
      response("r-2", "p-mall", "u-meera", "MAYBE"),
      response("r-3", "p-courts", "u-kabir", "GOING"),
      response("r-4", "p-courts", "u-aanya", "CANT"),
      response("r-5", "p-coffee", "u-aanya", "GOING", {
        sharingEta: true,
        eta: "6 min",
        lastLocationAt: at(-1),
      }),
      response("r-6", "p-coffee", "u-meera", "ARRIVED"),
      response("r-7", "p-coffee", "u-kabir", "MAYBE"),
    ],
  };
}

function getDb(): Db {
  return (db ??= seed());
}

function reply<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), 150));
}

function mockUser(email: string, username?: string, displayName?: string): User {
  const local = email.split("@")[0] || "you";
  return {
    id: ME_ID,
    email,
    username: username || local,
    displayName: displayName || local,
    avatarUrl: null,
    createdAt: new Date().toISOString(),
  };
}

// Accepts any credentials. Real validation arrives with the backend in Phase 2.
export function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return reply({ token: "mock-token", user: mockUser(input.email) });
}

export function signup(input: {
  email: string;
  password: string;
  username: string;
  displayName: string;
}): Promise<AuthResponse> {
  return reply({
    token: "mock-token",
    user: mockUser(input.email, input.username, input.displayName),
  });
}

export function listPosts(): Promise<Post[]> {
  return reply(getDb().posts.filter((p) => p.status === "ACTIVE"));
}

export function getPost(id: string): Promise<Post | null> {
  return reply(getDb().posts.find((p) => p.id === id && p.status === "ACTIVE") ?? null);
}

export function listResponses(postId: string): Promise<PostResponse[]> {
  return reply(getDb().responses.filter((r) => r.postId === postId));
}

export function listFriends(): Promise<PublicUser[]> {
  const { people, friendIds } = getDb();
  return reply(people.filter((p) => friendIds.includes(p.id)));
}

export function listFriendRequests(): Promise<Friendship[]> {
  return reply(getDb().requests.filter((r) => r.status === "PENDING"));
}

export function listGroups(): Promise<Group[]> {
  return reply(getDb().groups);
}

// Not in the contract. Posts, responses and group members carry only user IDs,
// so the UI needs some way to turn an ID into a name.
export function listPeople(): Promise<PublicUser[]> {
  return reply(getDb().people);
}
