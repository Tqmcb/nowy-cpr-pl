/** AdminResponse */
export interface AdminResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** BlogAdminKeyRequest */
export interface BlogAdminKeyRequest {
  /** Admin Key */
  admin_key: string;
}

/** BlogImportRequest */
export interface BlogImportRequest {
  /** Admin Key */
  admin_key: string;
}

/** BlogImportResponse */
export interface BlogImportResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /**
   * Imported Count
   * @default 0
   */
  imported_count?: number | null;
}

/** BlogPostCreate */
export interface BlogPostCreate {
  /** Title */
  title: string;
  /** Content */
  content: string;
  /**
   * Excerpt
   * @default ""
   */
  excerpt?: string | null;
  /**
   * Image Url
   * @default ""
   */
  image_url?: string | null;
  /**
   * Author
   * @default "Zespół Multicert"
   */
  author?: string | null;
  /**
   * Is Published
   * @default true
   */
  is_published?: boolean | null;
  /**
   * Category
   * @default "Ogólne"
   */
  category?: string | null;
}

/** BlogPostResponse */
export interface BlogPostResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /** Post */
  post?: object | null;
}

/** BlogPostUpdate */
export interface BlogPostUpdate {
  /** Title */
  title?: string | null;
  /** Content */
  content?: string | null;
  /** Excerpt */
  excerpt?: string | null;
  /** Image Url */
  image_url?: string | null;
  /** Author */
  author?: string | null;
  /** Is Published */
  is_published?: boolean | null;
  /** Category */
  category?: string | null;
}

/** BlogPostsResponse */
export interface BlogPostsResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /**
   * Posts
   * @default []
   */
  posts?: object[];
}

/** CheckAuthRequest */
export interface CheckAuthRequest {
  /** Email */
  email: string;
}

/** CheckAuthResponse */
export interface CheckAuthResponse {
  /** Exists */
  exists: boolean;
  /** Message */
  message: string;
}

/** CreateAdminRequest */
export interface CreateAdminRequest {
  /** Email */
  email: string;
  /** Password */
  password: string;
  /**
   * Full Name
   * @default ""
   */
  full_name?: string;
  /**
   * Supabase Url
   * @default ""
   */
  supabase_url?: string;
  /**
   * Supabase Key
   * @default ""
   */
  supabase_key?: string;
  /**
   * Service Role Key
   * @default ""
   */
  service_role_key?: string;
}

/** CreateAdminResponse */
export interface CreateAdminResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** HTTPValidationError */
export interface HTTPValidationError {
  /** Detail */
  detail?: ValidationError[];
}

/** HealthResponse */
export interface HealthResponse {
  /** Status */
  status: string;
}

/** LoginRequest */
export interface LoginRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

/** LoginResponse */
export interface LoginResponse {
  /** Message */
  message: string;
  /** Session Token */
  session_token: string | null;
  /** User Data */
  user_data: object | null;
}

/** LogoutRequest */
export interface LogoutRequest {
  /** Session Token */
  session_token: string;
}

/** ProductDataImport */
export interface ProductDataImport {
  /** Admin Key */
  admin_key: string;
}

/** ProductDataResponse */
export interface ProductDataResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** SessionCheckResponse */
export interface SessionCheckResponse {
  /** Is Authenticated */
  is_authenticated: boolean;
  /** User */
  user?: object | null;
  /**
   * Message
   * @default "Session check completed"
   */
  message?: string;
}

/** SignInRequest */
export interface SignInRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

/** SignUpResponse */
export interface SignUpResponse {
  /** Message */
  message: string;
}

/** SupabaseConfig */
export interface SupabaseConfig {
  /** Supabase Url */
  supabase_url: string;
  /** Supabase Anon Key */
  supabase_anon_key: string;
  /** Supabase Service Role Key */
  supabase_service_role_key?: string | null;
  /** Admin Key */
  admin_key: string;
}

/** SupabaseConnectionRequest */
export interface SupabaseConnectionRequest {
  /** Supabase Url */
  supabase_url: string;
  /** Supabase Anon Key */
  supabase_anon_key: string;
}

/** SupabaseConnectionResponse */
export interface SupabaseConnectionResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /**
   * Tables Count
   * @default 0
   */
  tables_count?: number;
}

/** SupabaseResponse */
export interface SupabaseResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** TokenData */
export interface TokenData {
  /** Token */
  token?: string | null;
}

/** UserData */
export interface UserData {
  /** Email */
  email: string;
  /** Password */
  password: string;
  /** Full Name */
  full_name?: string | null;
}

/** UserLogin */
export interface UserLogin {
  /** Email */
  email: string;
  /** Password */
  password: string;
}

/** UserSignup */
export interface UserSignup {
  /** Email */
  email: string;
  /** Password */
  password: string;
  /** Full Name */
  full_name?: string | null;
}

/** ValidationError */
export interface ValidationError {
  /** Location */
  loc: (string | number)[];
  /** Message */
  msg: string;
  /** Error Type */
  type: string;
}

/** VerifyAuthRequest */
export interface VerifyAuthRequest {
  /** Token */
  token: string;
}

/** AuthResponse */
export interface AppApisAuthApiAuthResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /** Access Token */
  access_token?: string | null;
  /** Refresh Token */
  refresh_token?: string | null;
  /** User Id */
  user_id?: string | null;
  /** Email */
  email?: string | null;
  /** Metadata */
  metadata?: object | null;
}

/** AuthResponse */
export interface AppApisSupabaseAuthApiAuthResponse {
  /** Access Token */
  access_token: string;
  /** Refresh Token */
  refresh_token?: string | null;
  /** User Id */
  user_id: string;
  /** Email */
  email: string;
  /** Metadata */
  metadata?: object | null;
  /** Message */
  message: string;
}

/** LogoutResponse */
export interface AppApisSupabaseAuthApiLogoutResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
}

/** SignUpRequest */
export interface AppApisSupabaseAuthApiSignUpRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
  /** Metadata */
  metadata?: object | null;
}

/** AuthResponse */
export interface AppApisSupabaseAuthFixedAuthResponse {
  /** Success */
  success: boolean;
  /** Message */
  message: string;
  /** Data */
  data?: object | null;
}

/** LogoutResponse */
export interface AppApisSupabaseAuthNewLogoutResponse {
  /** Message */
  message: string;
}

/** SignUpRequest */
export interface AppApisSupabaseAuthNewSignUpRequest {
  /**
   * Email
   * @format email
   */
  email: string;
  /** Password */
  password: string;
}

export type CheckHealthData = HealthResponse;

export type HealthCheckData = any;

export type CheckAuth2Data = CheckAuthResponse;

export type CheckAuth2Error = HTTPValidationError;

export type CreateAdminData = CreateAdminResponse;

export type CreateAdminError = HTTPValidationError;

export type SignupData = AppApisAuthApiAuthResponse;

export type SignupError = HTTPValidationError;

export type SigninData = AppApisSupabaseAuthFixedAuthResponse;

export type SigninError = HTTPValidationError;

export type ResetPasswordData = AppApisSupabaseAuthFixedAuthResponse;

export type ResetPasswordError = HTTPValidationError;

export type VerifyAuthGetData = SessionCheckResponse;

export type VerifyAuthData = any;

export type VerifyAuthError = HTTPValidationError;

/** Response Check Health Status */
export type CheckHealthStatusData = object;

export type LogInData = LoginResponse;

export type LogInError = HTTPValidationError;

export type SignUpData = SignUpResponse;

export type SignUpError = HTTPValidationError;

export type LogOutData = AppApisSupabaseAuthNewLogoutResponse;

export type LogOutError = HTTPValidationError;

export type CheckHealthResult = any;

export type CheckSupabaseConnectionStatusData = SupabaseConnectionResponse;

export type CheckSupabaseConnectionStatusError = HTTPValidationError;

export type SignupApiData = AppApisSupabaseAuthApiAuthResponse;

export type SignupApiError = HTTPValidationError;

export type LoginData = AppApisSupabaseAuthApiAuthResponse;

export type LoginError = HTTPValidationError;

export type LogoutData = AppApisSupabaseAuthApiLogoutResponse;

export type LogoutError = HTTPValidationError;

export type VerifyAuthApiData = any;

export type VerifyAuthApiError = HTTPValidationError;

export type Login2Data = AppApisAuthApiAuthResponse;

export type Login2Error = HTTPValidationError;

export type Logout2Data = any;

export type Logout2Error = HTTPValidationError;

export type InitAdminTablesData = AdminResponse;

export type ImportBlogPostsData = BlogImportResponse;

export type ImportBlogPostsError = HTTPValidationError;

export type GetBlogPostsData = any;

export interface GetBlogPostBySlugParams {
  /** Slug */
  slug: string;
}

export type GetBlogPostBySlugData = any;

export type GetBlogPostBySlugError = HTTPValidationError;

export interface GetBlogPosts2Params {
  /** Category */
  category?: string | null;
  /**
   * Limit
   * @min 1
   * @max 100
   * @default 10
   */
  limit?: number;
  /**
   * Offset
   * @min 0
   * @default 0
   */
  offset?: number;
  /**
   * Published Only
   * @default true
   */
  published_only?: boolean;
}

export type GetBlogPosts2Data = BlogPostsResponse;

export type GetBlogPosts2Error = HTTPValidationError;

export interface GetBlogPostBySlug2Params {
  /** Slug */
  slug: string;
}

export type GetBlogPostBySlug2Data = BlogPostResponse;

export type GetBlogPostBySlug2Error = HTTPValidationError;

export type CreateBlogPostData = BlogPostResponse;

export type CreateBlogPostError = HTTPValidationError;

export interface UpdateBlogPostParams {
  /** Post Id */
  postId: string;
}

export type UpdateBlogPostData = BlogPostResponse;

export type UpdateBlogPostError = HTTPValidationError;

export interface DeleteBlogPostParams {
  /** Post Id */
  postId: string;
}

export type DeleteBlogPostData = BlogPostResponse;

export type DeleteBlogPostError = HTTPValidationError;

export type ImportSamplePostsData = BlogPostsResponse;

export type ImportSamplePostsError = HTTPValidationError;

export type SaveSupabaseConfigData = SupabaseResponse;

export type SaveSupabaseConfigError = HTTPValidationError;

export type ImportSupabaseProductDataData = ProductDataResponse;

export type ImportSupabaseProductDataError = HTTPValidationError;

export type CheckSupabaseConnectionData = any;
