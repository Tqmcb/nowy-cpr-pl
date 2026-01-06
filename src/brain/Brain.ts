import {
  AppApisSupabaseAuthApiSignUpRequest,
  AppApisSupabaseAuthNewSignUpRequest,
  BlogAdminKeyRequest,
  BlogImportRequest,
  BlogPostCreate,
  BlogPostUpdate,
  CheckAuth2Data,
  CheckAuth2Error,
  CheckAuthRequest,
  CheckHealthData,
  CheckHealthResult,
  CheckHealthStatusData,
  CheckSupabaseConnectionData,
  CheckSupabaseConnectionStatusData,
  CheckSupabaseConnectionStatusError,
  CreateAdminData,
  CreateAdminError,
  CreateAdminRequest,
  CreateBlogPostData,
  CreateBlogPostError,
  DeleteBlogPostData,
  DeleteBlogPostError,
  DeleteBlogPostParams,
  GetBlogPostBySlug2Data,
  GetBlogPostBySlug2Error,
  GetBlogPostBySlug2Params,
  GetBlogPostBySlugData,
  GetBlogPostBySlugError,
  GetBlogPostBySlugParams,
  GetBlogPosts2Data,
  GetBlogPosts2Error,
  GetBlogPosts2Params,
  GetBlogPostsData,
  HealthCheckData,
  ImportBlogPostsData,
  ImportBlogPostsError,
  ImportSamplePostsData,
  ImportSamplePostsError,
  ImportSupabaseProductDataData,
  ImportSupabaseProductDataError,
  InitAdminTablesData,
  LogInData,
  LogInError,
  LogOutData,
  LogOutError,
  Login2Data,
  Login2Error,
  LoginData,
  LoginError,
  LoginRequest,
  Logout2Data,
  Logout2Error,
  LogoutData,
  LogoutError,
  LogoutRequest,
  ProductDataImport,
  ResetPasswordData,
  ResetPasswordError,
  SaveSupabaseConfigData,
  SaveSupabaseConfigError,
  SignInRequest,
  SignUpData,
  SignUpError,
  SigninData,
  SigninError,
  SignupApiData,
  SignupApiError,
  SignupData,
  SignupError,
  SupabaseConfig,
  SupabaseConnectionRequest,
  TokenData,
  UpdateBlogPostData,
  UpdateBlogPostError,
  UpdateBlogPostParams,
  UserData,
  UserLogin,
  UserSignup,
  VerifyAuthApiData,
  VerifyAuthApiError,
  VerifyAuthData,
  VerifyAuthError,
  VerifyAuthGetData,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Brain<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   *
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthData, any>({
      path: `/_healthz`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:auth_api
   * @name health_check
   * @summary Health Check
   * @request GET:/routes/health-check
   */
  health_check = (params: RequestParams = {}) =>
    this.request<HealthCheckData, any>({
      path: `/routes/health-check`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:auth_check
   * @name check_auth2
   * @summary Check Auth2
   * @request POST:/routes/check-auth2
   */
  check_auth2 = (data: CheckAuthRequest, params: RequestParams = {}) =>
    this.request<CheckAuth2Data, CheckAuth2Error>({
      path: `/routes/check-auth2`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:admin_setup
   * @name create_admin
   * @summary Create Admin
   * @request POST:/routes/create-admin
   */
  create_admin = (data: CreateAdminRequest, params: RequestParams = {}) =>
    this.request<CreateAdminData, CreateAdminError>({
      path: `/routes/create-admin`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:auth_api
   * @name signup
   * @summary Signup
   * @request POST:/routes/signup
   */
  signup = (data: UserSignup, params: RequestParams = {}) =>
    this.request<SignupData, SignupError>({
      path: `/routes/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_fixed
   * @name signin
   * @summary Signin
   * @request POST:/routes/signin
   */
  signin = (data: UserData, params: RequestParams = {}) =>
    this.request<SigninData, SigninError>({
      path: `/routes/signin`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_fixed
   * @name reset_password
   * @summary Reset Password
   * @request POST:/routes/reset-password
   */
  reset_password = (data: UserData, params: RequestParams = {}) =>
    this.request<ResetPasswordData, ResetPasswordError>({
      path: `/routes/reset-password`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_fixed
   * @name verify_auth_get
   * @summary Verify Auth Get
   * @request GET:/routes/verify-auth
   */
  verify_auth_get = (params: RequestParams = {}) =>
    this.request<VerifyAuthGetData, any>({
      path: `/routes/verify-auth`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:auth_api
   * @name verify_auth
   * @summary Verify Auth
   * @request POST:/routes/verify-auth
   */
  verify_auth = (data: TokenData, params: RequestParams = {}) =>
    this.request<VerifyAuthData, VerifyAuthError>({
      path: `/routes/verify-auth`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_fixed
   * @name check_health_status
   * @summary Check Health Status
   * @request GET:/routes/health-status
   */
  check_health_status = (params: RequestParams = {}) =>
    this.request<CheckHealthStatusData, any>({
      path: `/routes/health-status`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_new
   * @name log_in
   * @summary Log In
   * @request POST:/routes/log-in
   */
  log_in = (data: LoginRequest, params: RequestParams = {}) =>
    this.request<LogInData, LogInError>({
      path: `/routes/log-in`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_new
   * @name sign_up
   * @summary Sign Up
   * @request POST:/routes/sign-up
   */
  sign_up = (data: AppApisSupabaseAuthNewSignUpRequest, params: RequestParams = {}) =>
    this.request<SignUpData, SignUpError>({
      path: `/routes/sign-up`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase_auth_new
   * @name log_out
   * @summary Log Out
   * @request POST:/routes/log-out
   */
  log_out = (data: LogoutRequest, params: RequestParams = {}) =>
    this.request<LogOutData, LogOutError>({
      path: `/routes/log-out`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:admin
   * @name check_health
   * @summary Check Health
   * @request GET:/routes/health
   */
  check_health = (params: RequestParams = {}) =>
    this.request<CheckHealthResult, any>({
      path: `/routes/health`,
      method: "GET",
      ...params,
    });

  /**
   * @description Sprawdza połączenie z bazą danych Supabase używając podanych parametrów
   *
   * @tags dbtn/module:supabase_connection
   * @name check_supabase_connection_status
   * @summary Check Supabase Connection Status
   * @request POST:/routes/check-supabase-connection
   */
  check_supabase_connection_status = (data: SupabaseConnectionRequest, params: RequestParams = {}) =>
    this.request<CheckSupabaseConnectionStatusData, CheckSupabaseConnectionStatusError>({
      path: `/routes/check-supabase-connection`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Register a new user in Supabase.
   *
   * @tags dbtn/module:supabase_auth_api
   * @name signup_api
   * @summary Signup Api
   * @request POST:/routes/auth/signup
   */
  signup_api = (data: AppApisSupabaseAuthApiSignUpRequest, params: RequestParams = {}) =>
    this.request<SignupApiData, SignupApiError>({
      path: `/routes/auth/signup`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Sign in an existing user.
   *
   * @tags dbtn/module:supabase_auth_api
   * @name login
   * @summary Login
   * @request POST:/routes/auth/login
   */
  login = (data: SignInRequest, params: RequestParams = {}) =>
    this.request<LoginData, LoginError>({
      path: `/routes/auth/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * @description Log out a user by invalidating their session.
   *
   * @tags dbtn/module:supabase_auth_api
   * @name logout
   * @summary Logout
   * @request POST:/routes/auth/logout
   */
  logout = (params: RequestParams = {}) =>
    this.request<LogoutData, LogoutError>({
      path: `/routes/auth/logout`,
      method: "POST",
      ...params,
    });

  /**
   * @description Verify a JWT token and return user information if valid.
   *
   * @tags dbtn/module:supabase_auth_api
   * @name verify_auth_api
   * @summary Verify Auth Api
   * @request GET:/routes/auth/verify
   */
  verify_auth_api = (params: RequestParams = {}) =>
    this.request<VerifyAuthApiData, VerifyAuthApiError>({
      path: `/routes/auth/verify`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:auth_api
   * @name login2
   * @summary Login
   * @request POST:/routes/login
   * @originalName login
   * @duplicate
   */
  login2 = (data: UserLogin, params: RequestParams = {}) =>
    this.request<Login2Data, Login2Error>({
      path: `/routes/login`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:auth_api
   * @name logout2
   * @summary Logout
   * @request POST:/routes/logout
   * @originalName logout
   * @duplicate
   */
  logout2 = (params: RequestParams = {}) =>
    this.request<Logout2Data, Logout2Error>({
      path: `/routes/logout`,
      method: "POST",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:admin
   * @name init_admin_tables
   * @summary Init Admin Tables
   * @request POST:/routes/init-admin-tables
   * @secure
   */
  init_admin_tables = (params: RequestParams = {}) =>
    this.request<InitAdminTablesData, any>({
      path: `/routes/init-admin-tables`,
      method: "POST",
      secure: true,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:blog
   * @name import_blog_posts
   * @summary Import Blog Posts
   * @request POST:/routes/import-blog-posts
   * @secure
   */
  import_blog_posts = (data: BlogImportRequest, params: RequestParams = {}) =>
    this.request<ImportBlogPostsData, ImportBlogPostsError>({
      path: `/routes/import-blog-posts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:blog
   * @name get_blog_posts
   * @summary Get Blog Posts
   * @request GET:/routes/posts
   */
  get_blog_posts = (params: RequestParams = {}) =>
    this.request<GetBlogPostsData, any>({
      path: `/routes/posts`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:blog
   * @name get_blog_post_by_slug
   * @summary Get Blog Post By Slug
   * @request GET:/routes/post/{slug}
   */
  get_blog_post_by_slug = ({ slug, ...query }: GetBlogPostBySlugParams, params: RequestParams = {}) =>
    this.request<GetBlogPostBySlugData, GetBlogPostBySlugError>({
      path: `/routes/post/${slug}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:local_blog
   * @name get_blog_posts2
   * @summary Get Blog Posts
   * @request GET:/routes/local-posts
   * @originalName get_blog_posts
   * @duplicate
   */
  get_blog_posts2 = (query: GetBlogPosts2Params, params: RequestParams = {}) =>
    this.request<GetBlogPosts2Data, GetBlogPosts2Error>({
      path: `/routes/local-posts`,
      method: "GET",
      query: query,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:local_blog
   * @name get_blog_post_by_slug2
   * @summary Get Blog Post By Slug
   * @request GET:/routes/local-post/{slug}
   * @originalName get_blog_post_by_slug
   * @duplicate
   */
  get_blog_post_by_slug2 = ({ slug, ...query }: GetBlogPostBySlug2Params, params: RequestParams = {}) =>
    this.request<GetBlogPostBySlug2Data, GetBlogPostBySlug2Error>({
      path: `/routes/local-post/${slug}`,
      method: "GET",
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:local_blog
   * @name create_blog_post
   * @summary Create Blog Post
   * @request POST:/routes/local-post
   * @secure
   */
  create_blog_post = (data: BlogPostCreate, params: RequestParams = {}) =>
    this.request<CreateBlogPostData, CreateBlogPostError>({
      path: `/routes/local-post`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:local_blog
   * @name update_blog_post
   * @summary Update Blog Post
   * @request PUT:/routes/local-post/{post_id}
   * @secure
   */
  update_blog_post = ({ postId, ...query }: UpdateBlogPostParams, data: BlogPostUpdate, params: RequestParams = {}) =>
    this.request<UpdateBlogPostData, UpdateBlogPostError>({
      path: `/routes/local-post/${postId}`,
      method: "PUT",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:local_blog
   * @name delete_blog_post
   * @summary Delete Blog Post
   * @request DELETE:/routes/local-post/{post_id}
   * @secure
   */
  delete_blog_post = ({ postId, ...query }: DeleteBlogPostParams, params: RequestParams = {}) =>
    this.request<DeleteBlogPostData, DeleteBlogPostError>({
      path: `/routes/local-post/${postId}`,
      method: "DELETE",
      secure: true,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:local_blog
   * @name import_sample_posts
   * @summary Import Sample Posts
   * @request POST:/routes/import-sample-posts
   * @secure
   */
  import_sample_posts = (data: BlogAdminKeyRequest, params: RequestParams = {}) =>
    this.request<ImportSamplePostsData, ImportSamplePostsError>({
      path: `/routes/import-sample-posts`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase
   * @name save_supabase_config
   * @summary Save Supabase Config
   * @request POST:/routes/update-supabase-config
   */
  save_supabase_config = (data: SupabaseConfig, params: RequestParams = {}) =>
    this.request<SaveSupabaseConfigData, SaveSupabaseConfigError>({
      path: `/routes/update-supabase-config`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase
   * @name import_supabase_product_data
   * @summary Import Supabase Product Data
   * @request POST:/routes/import-product-data
   * @secure
   */
  import_supabase_product_data = (data: ProductDataImport, params: RequestParams = {}) =>
    this.request<ImportSupabaseProductDataData, ImportSupabaseProductDataError>({
      path: `/routes/import-product-data`,
      method: "POST",
      body: data,
      secure: true,
      type: ContentType.Json,
      ...params,
    });

  /**
   * No description
   *
   * @tags dbtn/module:supabase
   * @name check_supabase_connection
   * @summary Check Supabase Connection
   * @request GET:/routes/supabase-health
   */
  check_supabase_connection = (params: RequestParams = {}) =>
    this.request<CheckSupabaseConnectionData, any>({
      path: `/routes/supabase-health`,
      method: "GET",
      ...params,
    });
}
