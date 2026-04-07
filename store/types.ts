export enum UserRole {
  SALES = "Sales",
  CUSTOMER_SUCCESS = "Customer Success",
  EXECUTIVE = "Executive",
  ADMIN = "Admin",
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface AuthResponseData extends User {
  token?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

export interface UpdateUserPayload extends Partial<CreateUserPayload> {
  id: string;
}

export interface UserState {
  users: User[];
  selectedUser: User | null;
  isFetchingUsers: boolean;
  isGetSingleUserLoading: boolean;
  isCreateUserLoading: boolean;
  isUpdateUserLoading: boolean;
  isDeleteUserLoading: boolean;
  fetchUsersError: string | null;
  getSingleUserError: string | null;
  createUserError: string | null;
  updateUserError: string | null;
  deleteUserError: string | null;
  page: number;
  limit: number;
  totalUsers: number;
  totalPages: number;
}

export interface FetchUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T> {
  page: number;
  limit: number;
  totalUsers?: number;
  totalHospitals?: number;
  totalContacts?: number;
  totalProducts?: number;
  totalGPOs?: number;
  totalIDNs?: number;
  totalPages: number;
}

export interface Hospital {
  _id: string;
  idn: { name: string };
  hospitalName: string;
  address: string;
  user: string;
  city: string;
  state: string;
  zip: string;
  gpo: string;
  competitiveProduct: string;
  teamHospital: boolean;
  magnetHospital: boolean;
  products: string[];
  notes: string;
  contacts: string[];
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  user: string;
  designation: string;
  hospital: string | Hospital;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HospitalState {
  hospitals: Hospital[];
  selectedHospital: Hospital | null;
  isFetchingHospitals: boolean;
  isGetSingleHospitalLoading: boolean;
  fetchHospitalsError: string | null;
  getSingleHospitalError: string | null;
  page: number;
  limit: number;
  totalHospitals: number;
  totalPages: number;
}

export interface ContactState {
  contacts: Contact[];
  selectedContact: Contact | null;
  isFetchingContacts: boolean;
  isCreateContactLoading: boolean;
  fetchContactsError: string | null;
  createContactError: string | null;
  page: number;
  limit: number;
  totalContacts: number;
  totalPages: number;
}

export interface CreateContactPayload {
  firstName: string;
  lastName: string;
  designation: string;
  hospital: string;
  phoneNumber: string;
  email: string;
  isPrimary: boolean;
}

export interface FetchContactsParams {
  page?: number;
  limit?: number;
  search?: string;
  userId?: string;
}

export interface FetchHospitalsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isFetchingProducts: boolean;
  isGetSingleProductLoading: boolean;
  isCreateProductLoading: boolean;
  isUpdateProductLoading: boolean;
  isDeleteProductLoading: boolean;
  fetchProductsError: string | null;
  getSingleProductError: string | null;
  createProductError: string | null;
  updateProductError: string | null;
  deleteProductError: string | null;
  page: number;
  limit: number;
  totalProducts: number;
  totalPages: number;
}

export interface CreateProductPayload {
  name: string;
  description: string;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GPO {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GPOState {
  gpos: GPO[];
  selectedGPO: GPO | null;
  isFetchingGPOs: boolean;
  isGetSingleGPOLoading: boolean;
  isCreateGPOLoading: boolean;
  isUpdateGPOLoading: boolean;
  isDeleteGPOLoading: boolean;
  fetchGPOsError: string | null;
  getSingleGPOError: string | null;
  createGPOError: string | null;
  updateGPOError: string | null;
  deleteGPOError: string | null;
  page: number;
  limit: number;
  totalGPOs: number;
  totalPages: number;
}

export interface CreateGPOPayload {
  name: string;
}

export interface UpdateGPOPayload extends Partial<CreateGPOPayload> {
  id: string;
}

export interface FetchGPOsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface IDN {
  _id: string;
  name: string;
}

export interface IDNState {
  idns: IDN[];
  selectedIDN: IDN | null;
  isFetchingIDNs: boolean;
  isGetSingleIDNLoading: boolean;
  isCreateIDNLoading: boolean;
  isUpdateIDNLoading: boolean;
  isDeleteIDNLoading: boolean;
  fetchIDNsError: string | null;
  getSingleIDNError: string | null;
  createIDNError: string | null;
  updateIDNError: string | null;
  deleteIDNError: string | null;
  page: number;
  limit: number;
  totalIDNs: number;
  totalPages: number;
}

export interface CreateIDNPayload {
  name: string;
}

export interface UpdateIDNPayload extends Partial<CreateIDNPayload> {
  id: string;
}

export interface FetchIDNsParams {
  page?: number;
  limit?: number;
  search?: string;
}
