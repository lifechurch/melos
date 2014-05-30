YouversionWeb::Application.routes.draw do
  filter :locale, exclude: /^\/auth\/facebook\/callback/, include_default_locale: false

  get "/terms",         to: "pages#terms"
  get "/privacy",       to: "pages#privacy"
  get "/donate",        to: "pages#donate"
  get "/about",         to: "pages#about"
  get "/press",         to: redirect("http://youversion.com/press")
  get "/generic_error", to: "pages#generic_error"
  get "/search",        to: "search#show",                as: "search"
  get "/confirm-email", to: "users#confirm_email",        as: "confirm_email"

  match "/app(/:store)", to: AppStoreController.action(:index)
  get "/search(/:category)",to: "search#category", as: "search"

  
  resources :comments,  only: [:create,:destroy]
  resources :likes,     only: [:create,:destroy]

  resources :friendships, only: [:create, :destroy] do
    get :requests, on: :collection
    post :offer, on: :collection
  end
  
  resource :notifications, only: [:show, :edit, :update]
  
  # Custom campaign pages
  scope module: 'campaigns' do
    get "/100million",    to: "pages#hundred_million"
    resources 'kids',     only: [:index, :create]
  end

  # Bible
  match 'bible(/:version/:reference)' => 'references#show', :as => 'reference', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  match 'bible/:version/:reference/notes' => 'notes#sidebar', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}

  
  resources "versions",   only:   [:index, :show]
  

  resources :licenses, except: [:index,:show,:new,:create,:edit,:update,:destroy] do
    get :authorize, on: :collection
  end

  match '/notes/related/(:reference)' => "notes#related", as: "related_notes", constraints: {reference: /[^\/]*/}
  

  # Metal controller
  # This is our second highest throughput action
  get "/highlights/:version/:reference", to: JsonController.action(:reference_highlights), constraints: {version: /[^\/\.]*/, reference: /[^\/]*/}
  get "/highlights/colors", to: JsonController.action(:highlight_colors)
  get "/bookmarks/labels", to: JsonController.action(:bookmarks_labels)


  resources :videos, only: [:index,:show] do
    get :series,    on: :member
    get :publisher, on: :member
  end

  # Users
  resources :users, shallow: true, except: [:new, :create] do

    get "_cards", on: :collection

    resources :friends, only: [:index,:destroy] do
      get "_list", on: :collection
    end

    resource :email,    only: [:show,:update]
    resource :password, only: [:show,:update]
    resource :avatar,   only: [:show,:update],  path: "picture"
    resources :devices, only: [:index,:destroy]


    # bible.com/users/:id/connections => connections#index
    
    # removing for 3.1 social launch until we have proper API to add twitter/facebook credentials again.
    # get :connections, on: :member, to: "connections#index"

    get :delete_account, on: :member
    get :notes,       on: :member, as: 'notes'
    get :bookmarks,   on: :member, as: 'bookmarks'
    get :highlights,  on: :member, as: 'highlights'
    get :badges,      on: :member, as: 'badges'

    match 'badge/:id' => 'badges#show', as: 'badge'
  end

  get "/confirm-update-email/:token",    to: "emails#confirm_update"




  # Necessary as we don't want subscriptions routes to be shallow
  scope "/users/:user_id" do
    resources :subscriptions, path: '/reading-plans' do
      get   :calendar,    on: :member
    end
  end

  resources :moments, only: [:index,:show] do
    get "_cards", on: :collection
    get "related", on: :collection
    get "introduction", on: :collection
  end

  resources :notes, :except => [:index] do
    get "_cards", on: :collection
  end

  resources "bookmarks",  except: [:index, :new] do
    get "_cards", on: :collection
  end

  resources :highlights, only: [:create,:show,:destroy] do
    get "_cards", on: :collection
  end

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
  get   "share/new",                       to: "users#new_share",            as: "new_share"
  post  "share",                           to: "users#share",                as: "share"

  get   "/settings/forgot_password",       to: "password_resets#new",        as: "forgot_password"
  post  "/settings/forgot_password",       to: "password_resets#create",     as: "forgot_password"

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
  get "/settings/update_email",            to: "redirects#settings_email"
  get "/settings/password",                to: "redirects#settings_password"
  get "/settings/picture",                 to: "redirects#settings_picture"
  get "/settings/devices",                 to: "redirects#settings_devices"
  get "/settings/notifications",           to: "redirects#settings_notifications", as: "notification_settings"
  get "/settings/delete_account",          to: "redirects#delete_account"
  
  # Removed for 3.1 social - will be making a comeback
  #get "/settings/connections",             to: "redirects#settings_connections"

# Redirect to a.youversion.com/groups/lifechurchtv
  get "/lifechurchtv",  to: "redirects#lifechurchtv"

  get "pages/feed", to: "pages#feed"
  get "pages/detail", to: "pages#detail"
  get "pages/requests", to: "pages#requests"
  get "pages/notifications", to: "pages#notifications"
  get "pages/intro", to: "pages#intro"


  root to: 'pages#home'


  get "404", to: "pages#error_404"

  # Bible.us short url's are being handed to Web to manage.
  match "*path", to: ShortUrlsController.action(:index), format: false

  # Rails 3.1 hack to catch any remaining routes (404's)
  # with globbing setting params[:path] to the bad path
  #match '*path', :to => 'pages#routing_error'


end
