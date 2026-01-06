import {
  AppApisSupabaseAuthApiSignUpRequest,
  AppApisSupabaseAuthNewSignUpRequest,
  BlogAdminKeyRequest,
  BlogImportRequest,
  BlogPostCreate,
  BlogPostUpdate,
  CheckAuth2Data,
  CheckAuthRequest,
  CheckHealthData,
  CheckHealthResult,
  CheckHealthStatusData,
  CheckSupabaseConnectionData,
  CheckSupabaseConnectionStatusData,
  CreateAdminData,
  CreateAdminRequest,
  CreateBlogPostData,
  DeleteBlogPostData,
  GetBlogPostBySlug2Data,
  GetBlogPostBySlugData,
  GetBlogPosts2Data,
  GetBlogPostsData,
  HealthCheckData,
  ImportBlogPostsData,
  ImportSamplePostsData,
  ImportSupabaseProductDataData,
  InitAdminTablesData,
  LogInData,
  LogOutData,
  Login2Data,
  LoginData,
  LoginRequest,
  Logout2Data,
  LogoutData,
  LogoutRequest,
  ProductDataImport,
  ResetPasswordData,
  SaveSupabaseConfigData,
  SignInRequest,
  SignUpData,
  SigninData,
  SignupApiData,
  SignupData,
  SupabaseConfig,
  SupabaseConnectionRequest,
  TokenData,
  UpdateBlogPostData,
  UserData,
  UserLogin,
  UserSignup,
  VerifyAuthApiData,
  VerifyAuthData,
  VerifyAuthGetData,
} from "./data-contracts";

export namespace Brain {
  /**
   * @description Check health of application. Returns 200 when OK, 500 when not.
   * @name check_health
   * @summary Check Health
   * @request GET:/_healthz
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthData;
  }

  /**
   * No description
   * @tags dbtn/module:auth_api
   * @name health_check
   * @summary Health Check
   * @request GET:/routes/health-check
   */
  export namespace health_check {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthCheckData;
  }

  /**
   * No description
   * @tags dbtn/module:auth_check
   * @name check_auth2
   * @summary Check Auth2
   * @request POST:/routes/check-auth2
   */
  export namespace check_auth2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CheckAuthRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CheckAuth2Data;
  }

  /**
   * No description
   * @tags dbtn/module:admin_setup
   * @name create_admin
   * @summary Create Admin
   * @request POST:/routes/create-admin
   */
  export namespace create_admin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateAdminRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CreateAdminData;
  }

  /**
   * No description
   * @tags dbtn/module:auth_api
   * @name signup
   * @summary Signup
   * @request POST:/routes/signup
   */
  export namespace signup {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserSignup;
    export type RequestHeaders = {};
    export type ResponseBody = SignupData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_fixed
   * @name signin
   * @summary Signin
   * @request POST:/routes/signin
   */
  export namespace signin {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserData;
    export type RequestHeaders = {};
    export type ResponseBody = SigninData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_fixed
   * @name reset_password
   * @summary Reset Password
   * @request POST:/routes/reset-password
   */
  export namespace reset_password {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserData;
    export type RequestHeaders = {};
    export type ResponseBody = ResetPasswordData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_fixed
   * @name verify_auth_get
   * @summary Verify Auth Get
   * @request GET:/routes/verify-auth
   */
  export namespace verify_auth_get {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VerifyAuthGetData;
  }

  /**
   * No description
   * @tags dbtn/module:auth_api
   * @name verify_auth
   * @summary Verify Auth
   * @request POST:/routes/verify-auth
   */
  export namespace verify_auth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = TokenData;
    export type RequestHeaders = {};
    export type ResponseBody = VerifyAuthData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_fixed
   * @name check_health_status
   * @summary Check Health Status
   * @request GET:/routes/health-status
   */
  export namespace check_health_status {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthStatusData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_new
   * @name log_in
   * @summary Log In
   * @request POST:/routes/log-in
   */
  export namespace log_in {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LoginRequest;
    export type RequestHeaders = {};
    export type ResponseBody = LogInData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_new
   * @name sign_up
   * @summary Sign Up
   * @request POST:/routes/sign-up
   */
  export namespace sign_up {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppApisSupabaseAuthNewSignUpRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SignUpData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase_auth_new
   * @name log_out
   * @summary Log Out
   * @request POST:/routes/log-out
   */
  export namespace log_out {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = LogoutRequest;
    export type RequestHeaders = {};
    export type ResponseBody = LogOutData;
  }

  /**
   * No description
   * @tags dbtn/module:admin
   * @name check_health
   * @summary Check Health
   * @request GET:/routes/health
   */
  export namespace check_health {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckHealthResult;
  }

  /**
   * @description Sprawdza połączenie z bazą danych Supabase używając podanych parametrów
   * @tags dbtn/module:supabase_connection
   * @name check_supabase_connection_status
   * @summary Check Supabase Connection Status
   * @request POST:/routes/check-supabase-connection
   */
  export namespace check_supabase_connection_status {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SupabaseConnectionRequest;
    export type RequestHeaders = {};
    export type ResponseBody = CheckSupabaseConnectionStatusData;
  }

  /**
   * @description Register a new user in Supabase.
   * @tags dbtn/module:supabase_auth_api
   * @name signup_api
   * @summary Signup Api
   * @request POST:/routes/auth/signup
   */
  export namespace signup_api {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = AppApisSupabaseAuthApiSignUpRequest;
    export type RequestHeaders = {};
    export type ResponseBody = SignupApiData;
  }

  /**
   * @description Sign in an existing user.
   * @tags dbtn/module:supabase_auth_api
   * @name login
   * @summary Login
   * @request POST:/routes/auth/login
   */
  export namespace login {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SignInRequest;
    export type RequestHeaders = {};
    export type ResponseBody = LoginData;
  }

  /**
   * @description Log out a user by invalidating their session.
   * @tags dbtn/module:supabase_auth_api
   * @name logout
   * @summary Logout
   * @request POST:/routes/auth/logout
   */
  export namespace logout {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Authorization */
      Authorization?: string | null;
    };
    export type ResponseBody = LogoutData;
  }

  /**
   * @description Verify a JWT token and return user information if valid.
   * @tags dbtn/module:supabase_auth_api
   * @name verify_auth_api
   * @summary Verify Auth Api
   * @request GET:/routes/auth/verify
   */
  export namespace verify_auth_api {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Authorization */
      Authorization?: string | null;
    };
    export type ResponseBody = VerifyAuthApiData;
  }

  /**
   * No description
   * @tags dbtn/module:auth_api
   * @name login2
   * @summary Login
   * @request POST:/routes/login
   * @originalName login
   * @duplicate
   */
  export namespace login2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = UserLogin;
    export type RequestHeaders = {};
    export type ResponseBody = Login2Data;
  }

  /**
   * No description
   * @tags dbtn/module:auth_api
   * @name logout2
   * @summary Logout
   * @request POST:/routes/logout
   * @originalName logout
   * @duplicate
   */
  export namespace logout2 {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {
      /** Authorization */
      authorization?: string | null;
    };
    export type ResponseBody = Logout2Data;
  }

  /**
   * No description
   * @tags dbtn/module:admin
   * @name init_admin_tables
   * @summary Init Admin Tables
   * @request POST:/routes/init-admin-tables
   * @secure
   */
  export namespace init_admin_tables {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = InitAdminTablesData;
  }

  /**
   * No description
   * @tags dbtn/module:blog
   * @name import_blog_posts
   * @summary Import Blog Posts
   * @request POST:/routes/import-blog-posts
   * @secure
   */
  export namespace import_blog_posts {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BlogImportRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ImportBlogPostsData;
  }

  /**
   * No description
   * @tags dbtn/module:blog
   * @name get_blog_posts
   * @summary Get Blog Posts
   * @request GET:/routes/posts
   */
  export namespace get_blog_posts {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBlogPostsData;
  }

  /**
   * No description
   * @tags dbtn/module:blog
   * @name get_blog_post_by_slug
   * @summary Get Blog Post By Slug
   * @request GET:/routes/post/{slug}
   */
  export namespace get_blog_post_by_slug {
    export type RequestParams = {
      /** Slug */
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBlogPostBySlugData;
  }

  /**
   * No description
   * @tags dbtn/module:local_blog
   * @name get_blog_posts2
   * @summary Get Blog Posts
   * @request GET:/routes/local-posts
   * @originalName get_blog_posts
   * @duplicate
   */
  export namespace get_blog_posts2 {
    export type RequestParams = {};
    export type RequestQuery = {
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBlogPosts2Data;
  }

  /**
   * No description
   * @tags dbtn/module:local_blog
   * @name get_blog_post_by_slug2
   * @summary Get Blog Post By Slug
   * @request GET:/routes/local-post/{slug}
   * @originalName get_blog_post_by_slug
   * @duplicate
   */
  export namespace get_blog_post_by_slug2 {
    export type RequestParams = {
      /** Slug */
      slug: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = GetBlogPostBySlug2Data;
  }

  /**
   * No description
   * @tags dbtn/module:local_blog
   * @name create_blog_post
   * @summary Create Blog Post
   * @request POST:/routes/local-post
   * @secure
   */
  export namespace create_blog_post {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BlogPostCreate;
    export type RequestHeaders = {};
    export type ResponseBody = CreateBlogPostData;
  }

  /**
   * No description
   * @tags dbtn/module:local_blog
   * @name update_blog_post
   * @summary Update Blog Post
   * @request PUT:/routes/local-post/{post_id}
   * @secure
   */
  export namespace update_blog_post {
    export type RequestParams = {
      /** Post Id */
      postId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = BlogPostUpdate;
    export type RequestHeaders = {};
    export type ResponseBody = UpdateBlogPostData;
  }

  /**
   * No description
   * @tags dbtn/module:local_blog
   * @name delete_blog_post
   * @summary Delete Blog Post
   * @request DELETE:/routes/local-post/{post_id}
   * @secure
   */
  export namespace delete_blog_post {
    export type RequestParams = {
      /** Post Id */
      postId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DeleteBlogPostData;
  }

  /**
   * No description
   * @tags dbtn/module:local_blog
   * @name import_sample_posts
   * @summary Import Sample Posts
   * @request POST:/routes/import-sample-posts
   * @secure
   */
  export namespace import_sample_posts {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = BlogAdminKeyRequest;
    export type RequestHeaders = {};
    export type ResponseBody = ImportSamplePostsData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase
   * @name save_supabase_config
   * @summary Save Supabase Config
   * @request POST:/routes/update-supabase-config
   */
  export namespace save_supabase_config {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = SupabaseConfig;
    export type RequestHeaders = {};
    export type ResponseBody = SaveSupabaseConfigData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase
   * @name import_supabase_product_data
   * @summary Import Supabase Product Data
   * @request POST:/routes/import-product-data
   * @secure
   */
  export namespace import_supabase_product_data {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = ProductDataImport;
    export type RequestHeaders = {};
    export type ResponseBody = ImportSupabaseProductDataData;
  }

  /**
   * No description
   * @tags dbtn/module:supabase
   * @name check_supabase_connection
   * @summary Check Supabase Connection
   * @request GET:/routes/supabase-health
   */
  export namespace check_supabase_connection {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CheckSupabaseConnectionData;
  }
}
