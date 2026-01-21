import type { AdminSession } from "../core/security/session";
import type { User, UserRole } from "../data/models";

// Application state interfaces
export interface AppState {
  user: AdminSession | null;
  device: string;
  adminReady: boolean;
  loading: boolean;
  error: string | null;
}

export interface UserState {
  currentUser: User | null;
  users: User[];
  selectedRole: UserRole | null;
  loading: boolean;
  error: string | null;
}

export interface SubjectState {
  subjects: any[];
  selectedSubject: any | null;
  classGroups: any[];
  loading: boolean;
  error: string | null;
}

export interface ModuleState {
  modules: any[];
  selectedModule: any | null;
  loading: boolean;
  error: string | null;
}

// Initial state
export const initialAppState: AppState = {
  user: null,
  device: "desktop",
  adminReady: false,
  loading: false,
  error: null,
};

export const initialUserState: UserState = {
  currentUser: null,
  users: [],
  selectedRole: null,
  loading: false,
  error: null,
};

export const initialSubjectState: SubjectState = {
  subjects: [],
  selectedSubject: null,
  classGroups: [],
  loading: false,
  error: null,
};

export const initialModuleState: ModuleState = {
  modules: [],
  selectedModule: null,
  loading: false,
  error: null,
};

// State action types
export type AppStateAction = 
  | { type: "SET_USER"; payload: AdminSession | null }
  | { type: "SET_DEVICE"; payload: string }
  | { type: "SET_ADMIN_READY"; payload: boolean }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

export type UserStateAction = 
  | { type: "SET_CURRENT_USER"; payload: User | null }
  | { type: "SET_USERS"; payload: User[] }
  | { type: "ADD_USER"; payload: User }
  | { type: "UPDATE_USER"; payload: { id: number; updates: Partial<User> } }
  | { type: "DELETE_USER"; payload: number }
  | { type: "SET_SELECTED_ROLE"; payload: UserRole | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

export type SubjectStateAction = 
  | { type: "SET_SUBJECTS"; payload: any[] }
  | { type: "SET_SELECTED_SUBJECT"; payload: any | null }
  | { type: "SET_CLASS_GROUPS"; payload: any[] }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

export type ModuleStateAction = 
  | { type: "SET_MODULES"; payload: any[] }
  | { type: "SET_SELECTED_MODULE"; payload: any | null }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "CLEAR_ERROR" };

// State reducers
export const appReducer = (state: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload };
    case "SET_DEVICE":
      return { ...state, device: action.payload };
    case "SET_ADMIN_READY":
      return { ...state, adminReady: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const userReducer = (state: UserState, action: UserStateAction): UserState => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "SET_USERS":
      return { ...state, users: action.payload };
    case "ADD_USER":
      return { ...state, users: [...state.users, action.payload] };
    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map(user =>
          user.id === action.payload.id ? { ...user, ...action.payload.updates } : user
        ),
      };
    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload),
      };
    case "SET_SELECTED_ROLE":
      return { ...state, selectedRole: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const subjectReducer = (state: SubjectState, action: SubjectStateAction): SubjectState => {
  switch (action.type) {
    case "SET_SUBJECTS":
      return { ...state, subjects: action.payload };
    case "SET_SELECTED_SUBJECT":
      return { ...state, selectedSubject: action.payload };
    case "SET_CLASS_GROUPS":
      return { ...state, classGroups: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};

export const moduleReducer = (state: ModuleState, action: ModuleStateAction): ModuleState => {
  switch (action.type) {
    case "SET_MODULES":
      return { ...state, modules: action.payload };
    case "SET_SELECTED_MODULE":
      return { ...state, selectedModule: action.payload };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      return state;
  }
};
