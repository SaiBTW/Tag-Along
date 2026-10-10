// Mirrors the schemas in docs/openapi.yaml. Change the spec first, then this file.

export type User = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
};

export type PublicUser = Pick<User, "id" | "username" | "displayName" | "avatarUrl">;

export type AuthResponse = { token: string; user: User };

export type FriendshipStatus = "PENDING" | "ACCEPTED" | "DECLINED";

export type Friendship = {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: FriendshipStatus;
  createdAt: string;
  respondedAt: string | null;
};

export type GroupMembership = {
  userId: string;
  role: "ADMIN" | "MEMBER";
  joinedAt: string;
};

export type Group = {
  id: string;
  name: string;
  creatorId: string;
  createdAt: string;
  members: GroupMembership[];
};

export type EtaMode = "STATIC" | "LIVE";
export type VisibilityScope = "ALL_FRIENDS" | "SPECIFIC_FRIENDS" | "GROUP";
export type PostStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export type Post = {
  id: string;
  posterId: string;
  placeName: string;
  placeId: string;
  lat: number;
  lng: number;
  note: string | null;
  etaMode: EtaMode;
  declaredEta: string | null;
  posterLastLat: number | null;
  posterLastLng: number | null;
  posterLastLocationAt: string | null;
  visibilityScope: VisibilityScope;
  groupId: string | null;
  expiresAt: string;
  status: PostStatus;
  createdAt: string;
};

export type ResponseStatus = "GOING" | "MAYBE" | "CANT" | "ARRIVED";

// `Response` in the spec; renamed here so it doesn't shadow the fetch Response global.
export type PostResponse = {
  id: string;
  postId: string;
  userId: string;
  status: ResponseStatus;
  sharingEta: boolean;
  // Present only in the poster's view of a response with sharingEta = true.
  eta?: string | null;
  lastLocationAt?: string | null;
  createdAt: string;
  updatedAt: string;
};
