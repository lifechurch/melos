YouversionWeb::Application.routes.draw do
  filter :locale, exclude: /^\/auth\/facebook\/callback/, include_default_locale: false

  # Route for tracking requests to /app url.  Specifically desired for BibleSeries analytics
  get "/app", to: "trackings#app"

  get 'donate/us', :to => 'donations#us', :as => 'us_donation'
  post 'donate/us', :to => 'donations#confirm', :as => 'confirm_donation'
  match 'donate/relay_response', :to => 'donations#relay_response', :as => 'donations_relay_response'
  match 'donate/receipt', :to => 'donations#receipt', :as => 'donations_receipt', :via => [:get]
  match 'open' => 'pages#open'

  # Bible
  match 'bible/widgets/bookmarks' => 'references#bookmarks'
  match 'bible(/:version/:reference)' => 'references#show', :as => 'reference', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  match 'bible/:version/:reference/highlights' => 'references#highlights', :as => 'reference_highlights', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  match 'bible/:version/:reference/notes' => 'references#notes', :as => 'reference_notes', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}

  resources 'versions',   :only => [:index, :show]
  resources 'bookmarks',  :except => [:index]
  resources 'likes',      :only => [:index]

  resources :licenses, except: [:index,:show,:new,:create,:edit,:update,:destroy] do
    get :authorize, on: :collection
    get :authenticate, on: :collection
    get :register, on: :collection
  end


  match '/notes/related/(:reference)' => "notes#related", as: "related_notes", constraints: {reference: /[^\/]*/}
  match '/notes' => 'notes#index', :as => 'all_notes', :via => :get
  match 'notes/:id/like' => 'notes#like', :as => 'like', :via => :put
  resources 'notes', :except => [:index]

  match 'search' => 'search#show'
  match 'privacy' => 'pages#privacy'
  match 'terms' => 'pages#terms'
  #catch non-supported languages and still render them
  match '/:locale/terms', :to => 'pages#terms'
  match '/:locale/privacy', :to => 'pages#privacy'

  resources :videos do
    get :series,    on: :member
    get :publisher, on: :member
  end

  # Users
  resources 'users', :except => [:new, :create] do

    get :connections, on: :member

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

    match 'notes' => 'users#notes', as: 'notes'
    match 'bookmarks' => 'users#bookmarks', as: 'bookmarks'
    match 'likes' => 'users#likes', as: 'likes'
    match 'following' => 'users#following', as: 'following'
    match 'followers' => 'users#followers', as: 'followers'
    match 'follow' => 'users#follow', as: 'follow'
    match 'unfollow' => 'users#unfollow', as: 'unfollow'
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
  match "/reading-plans/:id/settings(/email)" => "plans#settings", via: :get

  # Community emails send this link
  # /reading-plans/199-promises-for-your-everyday-life/calendar
  match "/reading-plans/:id/calendar" => "plans#calendar", via: :get


  match 'highlight_colors' => 'users#highlight_colors', as: 'highlight_colors'
  post 'share' => 'users#share', as: 'share'
  get 'share/new' => 'users#new_share', as: 'new_share'
  resources 'highlights', only: [:create]

  match 'sign-up' => 'users#new',    :as => 'sign_up', :via => :get
  match 'sign-up' => 'users#create', :as => 'sign_up', :via => :post
  match 'sign-up/facebook' => 'users#create_facebook', :as => 'facebook_sign_up', :via => :post
  match 'sign-up/facebook' => 'users#new_facebook', as: 'facebook_sign_up', :via => :get
  match 'sign-up/success' => 'users#sign_up_success', as: 'sign_up_success'
  match 'confirm/:hash' => 'users#confirm', :as => "confirm"
  match 'confirm' => 'users#confirmed', :as => "confirm", :via => :post
  match 'confirm-email' => 'users#confirm_email', :as => "confirm_email"
  match 'resend' => 'users#resend_confirmation', :as => "resend_confirmation"

  # Sessions
  match 'sign-in'  => 'sessions#new',     :as => 'sign_in', :via => :get
  match 'sign-in'  => 'sessions#create',  :as => 'sign_in', :via => :post
  match 'sign-out' => 'sessions#destroy', :as => 'sign_out'
  match 'api-test' => 'api_test#index'

  # profile stuff
  match 'devices/:device_id'     => 'users#destroy_device', :as => 'device', :via => :delete
  get   'confirm-update-email/:token' => 'users#confirm_update_email', as: 'confirm_update_email'
  get   'settings/forgot_password' => 'users#forgot_password_form', as: 'forgot_password'
  post  'settings/forgot_password' => 'users#forgot_password', as: 'forgot_password'

  # connetions
  match 'auth/:provider/callback' => 'auth#callback', :as => 'auth_callback'
  match 'auth/:provider/connect'  => 'auth#connect', :as => 'auth_connect'
  match 'connections/:provider/new' => 'connections#new', :as => 'new_connection'
  match 'connections/:provider/create' => 'connections#create', as: 'create_connection'
  delete 'connections/:provider/delete' => 'connections#destroy', as: 'delete_connection'

  match 'mobile' => 'pages#mobile'
  match 'donate' => 'pages#donate', constraints: lambda { |request| request.params[:locale] != "tr" }
  match 'about' => 'pages#about'
  match 'press' => 'pages#press'
  match 'l10n' => 'pages#l10n'
  match 'status' => 'pages#status'
  match 'generic_error' => 'pages#generic_error'
  match 'donate/us' => 'pages#donate_form', :as => 'donate_form'


  # Current redirects to support previous urls.
  match 'friends'   => 'redirects#friends'
  match 'bookmarks' => 'redirects#bookmarks'
  match 'settings'  => 'redirects#settings'
  match 'settings/profile'        => 'redirects#settings'
  match 'settings/connections'    => 'redirects#settings_connections'
  match 'settings/update_email'   => 'redirects#settings_email'
  match 'settings/password'       => 'redirects#settings_password'
  match 'settings/picture'        => 'redirects#settings_picture'
  match 'settings/notifications'  => 'redirects#settings_notifications', as: "notification_settings"
  match 'settings/devices'        => 'redirects#settings_devices'
  match 'settings/delete_account' => 'redirects#delete_account'




  root to: 'pages#home'

  mount_sextant if Rails.env.development?

  # Rails 3.1 hack to catch any remaining routes (404's)
  # with globbing setting params[:path] to the bad path
  match '*path', :to => 'pages#routing_error'


end
