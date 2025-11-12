import {
    Account,
    Client,
    ID,
    Models,
    Query,
    TablesDB,
} from "react-native-appwrite";
import "react-native-url-polyfill/auto";

const APPWRITE_ENDPOINT = "https://nyc.cloud.appwrite.io/v1";
const APPWRITE_PROJECT_ID = "68f8eca00020d0b00702";
const APPWRITE_PLATFORM_NAME = "edu.fhu.fhu-social-club";
const DATABASE_ID = "6908d1cd0021a16d1690";
const MEMBERS_TABLE_ID = "members";
const EVENTS_TABLE_ID = "events";

export interface MemberRow extends Models.Row {
  id: number;
  firstName: string;
  lastName: string;
  relationshipStatus: "Single" | "Taken" | "Complicated";
  classification: "Freshman" | "Sophomore" | "Junior" | "Senior";
  userID?: string;
  club:
    | "Phi Kappa Alpha"
    | "Omega Chi"
    | "Chi Beta Chi"
    | "Sigma Rho"
    | "Xi Chi Delta";
  phone: string;
  email: string;
  showEmail: boolean;
  showPhone: boolean;
  imageURL: string;
  officer: string | null;
}

export type MemberInput = {
  firstName?: string;
  lastName?: string;
  userID?: string;
  club:
    | "Phi Kappa Alpha"
    | "Omega Chi"
    | "Chi Beta Chi"
    | "Sigma Rho"
    | "Xi Chi Delta";
  phone?: string | undefined;
  email?: string | undefined;
};

export interface EventRow extends Models.Row {
  title: string;
  description: string;
  date: string;
  time: string;
  club: string;
  location: string;
}

export function createAppWriteService() {
  const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setPlatform(APPWRITE_PLATFORM_NAME);

  const account = new Account(client);
  const tables = new TablesDB(client);

  const registerWithEmail = async ({
    email,
    password,
    name,
    phone,
    club,
  }: {
    email: string;
    password: string;
    name: string;
    phone: string;
    club:
      | "Phi Kappa Alpha"
      | "Omega Chi"
      | "Chi Beta Chi"
      | "Sigma Rho"
      | "Xi Chi Delta";
  }): Promise<Models.User<Models.Preferences> | null> => {
    try {
      await account.create({ userId: ID.unique(), email, password, name });
      await account.createEmailPasswordSession({ email, password });
      const user = await account.get<Models.User<Models.Preferences>>();
      await createMemberForUser(user, { email, phone, club });

      return user;
    } catch (exception) {
      console.error(
        "[registerWithEmail] Error during registration:",
        exception
      );
      return null;
    }
  };

  const loginWithEmail = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    await account.createEmailPasswordSession({ email, password });

    return await account.get<Models.User<Models.Preferences>>();
  };

  const getCurrentUser = async () => {
    try {
      const user = await account.get<Models.User<Models.Preferences>>();
      return user;
    } catch {
      return null;
    }
  };

  const logoutCurrentDevice = async () => {
    await account.deleteSession({ sessionId: "current" });
  };

  const getMemberByUserId = async (userID: string): Promise<MemberRow> => {
    const response = await tables.listRows<MemberRow>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_TABLE_ID,
      queries: [Query.equal("userID", userID), Query.limit(1)],
    });

    return response.rows[0] ?? null;
  };

  const getMembersByClub = async (club: string): Promise<MemberRow[]> => {
    const response = await tables.listRows<MemberRow>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_TABLE_ID,
      queries: [Query.equal("club", club)],
    });

    return response.rows;
  };

  const getEvents = async (): Promise<EventRow[]> => {
    const response = await tables.listRows<EventRow>({
      databaseId: DATABASE_ID,
      tableId: EVENTS_TABLE_ID,
      queries: [Query.orderAsc("date")],
    });

    return response.rows;
  };

  const createMemberForUser = async (
    user: Models.User<Models.Preferences>,
    extra?: Partial<MemberInput>
  ): Promise<MemberRow> => {
    const [firstName = "", lastName = ""] = (user.name || "").split(" ");
    const email = user.email ?? extra?.email ?? null;

    return tables.createRow<MemberRow>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_TABLE_ID,
      rowId: ID.unique(),
      data: {
        firstName: extra?.firstName ?? firstName,
        lastName: extra?.lastName ?? lastName,
        userID: user.$id,
        club: extra?.club ?? "Chi Beta Chi",
        phone: extra?.phone ?? "111-111-1111",
        email,
        id: Math.floor(Math.random() * (100000 - 1000) + 1000),
        relationshipStatus: "Single",
        officer: null,
        classification: "Freshman",
        imageURL:
          "https://www.nomadfoods.com/wp-content/uploads/2018/08/placeholder-1-e1533569576673-1200x1200.png",
        showEmail: true,
        showPhone: true,
      },
    });
  };

  const ensureMemberForUser = async (
    user: Models.User<Models.Preferences>,
    extra?: Partial<MemberInput>
  ): Promise<MemberRow> => {
    const existing = await getMemberByUserId(user.$id);
    return existing ?? (await createMemberForUser(user, extra));
  };

  const updateMember = async (
    rowId: string,
    data: Partial<MemberInput>
  ): Promise<MemberRow> => {
    return tables.updateRow<MemberRow>({
      databaseId: DATABASE_ID,
      tableId: MEMBERS_TABLE_ID,
      rowId,
      data,
    });
  };

  return {
    client,
    account,
    tables,

    getCurrentUser,
    registerWithEmail,
    loginWithEmail,
    logoutCurrentDevice,

    getMemberByUserId,
    getMembersByClub,
    getEvents,
    createMemberForUser,
    ensureMemberForUser,
    updateMember,
  };
}