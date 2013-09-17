YouversionWeb::Application.routes.draw do
  filter :locale, exclude: /^\/auth\/facebook\/callback/, include_default_locale: false

  get "/app",           to: "pages#app"
  get "/terms",         to: "pages#terms"
  get "/privacy",       to: "pages#privacy"
  get "/donate",        to: "pages#donate"
  get "/about",         to: "pages#about"
  get "/press",         to: "pages#press"
  get "/generic_error", to: "pages#generic_error"
  get "/search",        to: "search#show",                as: "search"
  get "/100million",    to: "campaigns#hundred_million"
  get "/confirm-email", to: "users#confirm_email",        as: "confirm_email"


  # Bible
  match 'bible/widgets/bookmarks' => 'references#bookmarks'
  match 'bible(/:version/:reference)' => 'references#show', :as => 'reference', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  match 'bible/:version/:reference/notes' => 'references#notes', :as => 'reference_notes', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}

  resources "bookmarks",  except: [:index, :new]
  resources "versions",   only:   [:index, :show]
  

  resources :licenses, except: [:index,:show,:new,:create,:edit,:update,:destroy] do
    get :authorize, on: :collection
  end

  match '/notes/related/(:reference)' => "notes#related", as: "related_notes", constraints: {reference: /[^\/]*/}
  match '/notes' => 'notes#index', :as => 'all_notes', :via => :get
  resources 'notes', :except => [:index]

  resources 'highlights', only: [:create] do
    get :colors, on: :collection
  end
  get "/highlights/:version/:reference", to: "highlights#for_reference", constraints: {version: /[^\/\.]*/, reference: /[^\/]*/}



  resources :videos do
    get :series,    on: :member
    get :publisher, on: :member
  end

  # Users
  resources 'users', :except => [:new, :create] do

    # bible.com/users/:id/connections => connections#index
    get :connections, on: :member, to: "connections#index"

    get :email, on: :member
    put :update_email, on: :member

    get :password, on: :member
    put :update_password, on: :member

    get :picture, on: :member
    put :update_picture, on: :member

    get :notifications, on: :member
    put :update_notifications, on: :member

    get :devices, on: :member
    get :delete_account, on: :member

    resources :bookmarks, only: [:index] #, shallow: true  <-- TODO - update bookmarks implementation to properly POST for users/:user_id/bookmarks generated route

    match 'notes' => 'users#notes', as: 'notes'
    match 'badges' => 'users#badges', as: 'badges'
    match 'badge/:id' => 'badges#show', as: 'badge'

    resources 'subscriptions', :path => '/reading-plans' do
      get   :calendar,    on: :member
      post  :shelf,       on: :member
    end
  end

  match "subscriptions/:id/sidebar" => "subscriptions#sidebar"

  # /reading-plans
  # /reading-plans/:id
  # /reading-plans/:id/day/:day
  resources :plans, :only => [:index, :show], :path => 'reading-plans'
  match '/reading-plans/:id/day/:day' => 'plans#sample', as: "sample_plan", via: :get

  # Reading Plans
  # Legacy links that need to be supported
  # ------------------------------------------------------------------------------------------

  # featuredplans.youversion.com use this link.
  # /reading-plans/id-slug/start -> "plans#start" -> "subscriptions#new"
  match "/reading-plans/:id/start" => redirect {|params| "/reading-plans/#{params[:id]}" }

  # Community emails send this link
  # /reading-plans/id-slug/settings/email -> "plans#settings" -> "subscriptions#edit"
  get "/reading-plans/:id/settings(/email)", to: "plans#settings"

  # Community emails send this link
  # /reading-plans/199-promises-for-your-everyday-life/calendar
  get "/reading-plans/:id/calendar",       to: "plans#calendar"

  get   "/sign-up",                        to: "users#new",                  as: "sign_up"
  post  "/sign-up",                        to: "users#create",               as: "sign_up"
  get   "/sign-up/facebook",               to: "users#new_facebook",         as: "facebook_sign_up"
  post  "/sign-up/facebook",               to: "users#create_facebook",      as: "facbook_sign_up"
  get   "/sign-up/success",                to: "users#sign_up_success",      as: "sign_up_success"
  get   "/confirm/resend",                 to: "users#resend_confirmation",  as: "resend_confirmation"
  post  "/confirm/resend",                 to: "users#resend_confirmation",  as: "resend_confirmation"
  get   "/confirm-update-email/:token",    to: "users#confirm_update_email", as: "confirm_update_email"
  get   "/settings/forgot_password",       to: "users#forgot_password_form", as: "forgot_password"
  post  "/settings/forgot_password",       to: "users#forgot_password",      as: "forgot_password"
  delete "/devices/:device_id",            to: "users#destroy_device",       as: "device"
  get   "share/new",                       to: "users#new_share",            as: "new_share"
  post  "share",                           to: "users#share",                as: "share"

  # Sessions
  get  "/sign-in",                         to: "sessions#new",               as: "sign_in"
  post "/sign-in",                         to: "sessions#create",            as: "sign_in"
  get  "/sign-out",                        to: "sessions#destroy",           as: "sign_out"
  get  "/api-test",                        to: "api_test#index"  
  
  # connections 
  get "/auth/:provider/callback",          to: "auth#callback",              as: "auth_callback"
  get "/auth/:provider/connect",           to: "auth#connect",               as: "auth_connect"
  get "/connections/:provider/new",        to: "connections#new",            as: "new_connection"
  get "/connections/:provider/create",     to: "connections#create",         as: "create_connection"
  delete "/connections/:provider/delete",  to: "connections#destroy",        as: "delete_connection"
   
  # Legacy routes, many used in transactio nal emails
  get "/friends",                          to: "redirects#settings"
  get "/bookmarks",                        to: "redirects#bookmarks"
  get "/settings",                         to: "redirects#settings"
  get "/settings/profile",                 to: "redirects#settings"
  get "/settings/connections",             to: "redirects#settings_connections"
  get "/settings/update_email",            to: "redirects#settings_email"
  get "/settings/password",                to: "redirects#settings_password"
  get "/settings/picture",                 to: "redirects#settings_picture"
  get "/settings/devices",                 to: "redirects#settings_devices"
  get "/settings/notifications",           to: "redirects#settings_notifications", as: "notification_settings"
  get "/settings/delete_account",          to: "redirects#delete_account"

  root to: 'pages#home'

  # Bible.us short url's are being handed to Web to manage.
  match "*path", to: "redirects#legacy_references", format: false

  # Rails 3.1 hack to catch any remaining routes (404's)
  # with globbing setting params[:path] to the bad path
  #match '*path', :to => 'pages#routing_error'


end
