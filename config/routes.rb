YouversionWeb::Application.routes.draw do
  filter :locale, exclude: /^\/auth\/facebook\/callback/, include_default_locale: false

  get "*path",          to: redirect("http://www.nic.bible/?utm_source=com"),  constraints: { subdomain: 'nic' }
  get "*path",          to: redirect("http://american.bible/?utm_source=com"), constraints: { subdomain: 'american' }
  get "/",          to: redirect("http://www.nic.bible/?utm_source=com"),  constraints: { subdomain: 'nic' }
  get "/",          to: redirect("http://american.bible/?utm_source=com"), constraints: { subdomain: 'american' }

  get "/ping",          to: "ping#ping"
  get "/running",       to: "ping#running"
  get "/terms",         to: "pages#terms"
  get "/privacy",       to: "pages#privacy"
  get "/donate",        to: "pages#donate"
  get "/about",         to: "pages#about"
  get "/header",        to: "pages#header"
  get "/myPlansLink",   to: "plans#my_plans_link"
  get "/isLoggedIn",    to: "users#is_logged_in"
  get "/getSettings",   to: "users#user_settings"
  post "/updateSettings",     to: "users#user_update_settings"
  get "/resetPassword", to: "users#reset_password"
  # get "/press",         to: redirect("http://youversion.com/press")
  get "/bibleappforkids", to: redirect("https://bibleappforkids.com")

  get "/marriage",      to: redirect("http://blog.youversion.com/2015/10/top-10-marriage-bible-plans-on-youversion/")
  get "/200million",    to: redirect("http://installs.youversion.com/200million/index.html")
  get "/250million",    to: redirect("http://installs.youversion.com/250million/index.html")
  get "/redesign",      to: redirect("http://blog.youversion.com/2016/01/all-new-bible-dot-com-by-youversion-bible-app/")
  get "/blog-events",      to: redirect("http://blog.youversion.com/2016/03/introducing-events-the-newest-feature-in-the-bible-app")
  get "volunteer-form", to: redirect("https://lifechurch.formstack.com/forms/volunteer_interest_form")

  get "/press",         to: "pages#press"
  get "/generic_error", to: "pages#generic_error"
  get "/search",        to: "search#show",                as: "search"
  get "/confirm-email", to: "users#confirm_email",        as: "confirm_email"
  get "/ni%C3%B1os",    to: "redirects#ninos"
  get "/ninos",         to: "redirects#ninos"
  get "/ertong",        to: "redirects#ertong"
  get "/%E5%84%BF%E7%AB%A5",           to: "redirects#ertong"
  get "/%EC%96%B4%EB%A6%B0%EC%9D%B4",  to: "redirects#aideul"
  get "/%D8%A7%D8%B7%D9%81%D8%A7%D9%84",   to: "redirects#ar_kids"
  get "/criancas",      to: "redirects#criancas"
  get "/crian%C3%A7as", to: "redirects#criancas"
  get "/deti",          to: "redirects#deti"
  get "/kinderen",      to: "redirects#kinderen"
  get "/kinder",        to: "redirects#kinder"
  get "/enfants",       to: "redirects#enfants"
  get "/anak",       to: "redirects#anak"
  get "/cocuk",      to: "redirects#cocuk"
  get "/kodomo",      to: "redirects#kodomo"
  get "/%E3%81%93%E3%81%A9%E3%82%82",      to: "redirects#kodomo"
  get "/er-tong",        to: "redirects#er_tong"
  get "/%E5%85%92%E7%AB%A5",        to: "redirects#er_tong"
  get "/kinders",         to: "redirects#kinderbybel"
  get "/kinderbybel",     to: "redirects#kinderbybel"
  get "/bybelvirkinders", to: "redirects#kinderbybel"
  get "/pambata",       to: "redirects#pambatang"
  get "/pambatangbibleapp", to: "redirects#pambatang"
  get "/%E0%B9%80%E0%B8%94%E0%B9%87%E0%B8%81", to: "redirects#thaibafk"
  get "/thieunhi",       to: "redirects#thieunhi"
  get "/thi%E1%BA%BFunhi", to: "redirects#thieunhi"
  get "/ragazzi",        to: "redirects#ragazzi"
  get "/dzieci",        to: "redirects#dzieci"
  get "/bibliadzieci",        to: "redirects#dzieci"
  get "/copii",        to: "redirects#copii"

  get "/trending-bible-verses", to: "pages#trending"
  get "/verse-of-the-day", to: "pages#votd"
  get "/bible-verse-of-the-day", to: "pages#votd", as: "votd"
  get "/wmf",           to: "redirects#wmf"
  get "/world-meeting-of-families-app",           to: "pages#world-meeting-of-families-app"
  get "/apple-app-site-association", to: "pages#apple_app_site_association"


  match "/app(/:store)", to: AppStoreController.action(:index)
  get "/search(/:category)",to: "search#category", as: "search"

  
  resources :comments,  only: [:create,:destroy]
  resources :likes,     only: [:create,:destroy]

  resources :friendships, only: [:create, :destroy] do
    get :requests, on: :collection
    post :offer, on: :collection
  end
  
  resource :notifications, only: [:show, :edit, :update, :destroy]
  resources :vod_subscriptions, only: [:index, :create, :destroy]

  # Custom campaign pages
  scope module: 'campaigns' do
    get "/100million",    to: "pages#hundred_million"
    resources 'kids',     only: [:index, :create]
    resources 'christmas', only: [:index]
  end

  # Bible
  match 'bible(/:version/:reference)' => 'references#show', :as => 'reference', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  match 'bible/:version/:reference/notes' => 'notes#sidebar', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  match 'bible-chapters/:version/:reference' => 'references#chapters', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}

  # Single Verse / Range page for SEO
  match 'passage/:reference' => 'references#passage', constraints: {:reference => /[^\/]*/}


  get "/events", to: "features#events"

  resources "events", only: [:show]
  resources "versions",   only:   [:index, :show]
  resources "audiobibles", :path => '/audio-bible-app-versions', only: [:index, :show]
  resources "languages",   only:   [:index, :show]
  

  resources :licenses, except: [:index,:show,:new,:create,:edit,:update,:destroy] do
    get :authorize, on: :collection
  end

  match '/notes/related/(:reference)' => "notes#related", as: "related_notes", constraints: {reference: /[^\/]*/}
  

  # Metal controller
  # This is our second highest throughput action
  get "/highlights/:version/:reference", to: JsonController.action(:reference_highlights), constraints: {version: /[^\/\.]*/, reference: /[^\/]*/}
  get "/highlights/colors", to: JsonController.action(:highlight_colors)
  get "/bookmarks/labels", to: JsonController.action(:bookmarks_labels)
  get "/bookmarks/:version/:reference", to: JsonController.action(:reference_bookmarks), constraints: {version: /[^\/\.]*/, reference: /[^\/]*/}
  get "/notes/:version/:reference", to: JsonController.action(:reference_notes), constraints: {version: /[^\/\.]*/, reference: /[^\/]*/}

  resources :videos, only: [:index,:show] do
    get :series,    on: :member
    get :publisher, on: :member
  end

  # Users
  resources :users, shallow: true, :id => /.*/, only: [:destroy]
  resources :users, shallow: true, :id => /([^\/])+?/, except: [:new, :create, :destroy] do

    get "_cards", on: :member, as: 'cards'

    resources :friends, only: [:index,:destroy] do
      get "_list", on: :collection
    end

    resource :email,    only: [:show,:update]
    resource :password, only: [:show,:update]
    resource :avatar,   only: [:show,:update],  path: "picture"
    resources :devices, only: [:index,:destroy]

    # bible.com/users/:id/connections => connections#index    
    get :connections, on: :member, to: "connections#index", as: 'connections'

    get :delete_account, on: :member
    get :notes,       on: :member, as: 'notes'
    get :bookmarks,   on: :member, as: 'bookmarks'
    get '_bookmarks', on: :member
    get :highlights,  on: :member, as: 'highlights'
    get :images,      on: :member, as: 'images'
    get :badges,      on: :member, as: 'badges'

    match 'badge/:id' => 'badges#show', as: 'badge'
  end

  get "/confirm-update-email/:token",    to: "emails#confirm_update"

  # Top level LocationSettings route
  resource :language_settings, only: [:update]

  # Necessary as we don't want subscriptions routes to be shallow
  scope "/users/:user_id" do
    resources :subscriptions, path: '/reading-plans', :user_id => /([^\/])+?/ do
      get   :calendar,    on: :member
      get   :devo,   on: :member
      get   :ref,    on: :member
      get   :plan_complete, on: :member
      get   :day_complete, on: :member
      get   :mark_complete, on: :member
    end
  end

  # match '/users/:user_id/reading-plans/completed' => 'subscriptions#completed', via: :get


  resources :moments, only: [:index,:show] do
    get "_cards", on: :collection
    get "related", on: :collection
    # get "introduction", on: :collection
  end

  get "/moments/:id/comments", to: "moments#show"
  get "/moments/:id/comments/:comment_id", to: "moments#show"

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
  match '/reading-plans/:id/day/:day/completed' => 'plans#day_complete', as: "day_complete_plan", via: :get

  get '/reading-plans-collection/:id' => 'plans#plan_collection'
  get '/recommended-plans-collection/:id' => 'plans#plan_collection'
  get '/saved-plans-collection' => 'plans#plan_collection'



  # Reading Plans
  # Legacy links that need to be supported
  # ------------------------------------------------------------------------------------------

  get "/users/:user_id/completed-reading-plans",  to: "subscriptions#completed"
  get "/users/:user_id/saved-reading-plans",      to: "subscriptions#saved"
  post "/users/:user_id/reading-plans/save-for-later", to: "subscriptions#saveForLater"
  post "/users/:user_id/reading-plans/remove-saved", to: "subscriptions#removeSaved"

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
   
  # Legacy routes, many used in transactional emails
  get "/friends",                          to: "redirects#friends"
  get "/bookmarks",                        to: "redirects#bookmarks"
  get "/highlights",                       to: "redirects#highlights"
  get "/notes",                            to: "redirects#notes"
  get "/badges",                           to: "redirects#badges"
  get "/profile",                          to: "redirects#profile"  
  get "/settings",                         to: "redirects#settings"
  get "/settings/profile",                 to: "redirects#settings"
  get "/settings/update_email",            to: "redirects#settings_email"
  get "/settings/password",                to: "redirects#settings_password"
  get "/settings/picture",                 to: "redirects#settings_picture"
  get "/settings/devices",                 to: "redirects#settings_devices"
  get "/settings/notifications",           to: "redirects#settings_notifications", as: "notification_settings"
  get "/settings/delete_account",          to: "redirects#delete_account"
  get "/settings/vod_subscriptions",       to: "redirects#settings_vod_subscriptions"
  get "/settings/connections",             to: "redirects#settings_connections"

# Redirect to a.youversion.com/groups/lifechurchtv
  get "/lifechurchtv",  to: "redirects#lifechurchtv"

  get "pages/feed", to: "pages#feed"
  get "pages/detail", to: "pages#detail"
  get "pages/requests", to: "pages#requests"
  get "pages/notifications", to: "pages#notifications"
  get "pages/intro", to: "pages#intro"


  root to: 'pages#home'

  get "features/events", to: "features#events"
  # This is to handle a bug in Android's link
  get "features/events.", to: "features#events"
  get "features/events-faq", to: "features#events-faq"
  get "features/events-resources", to: "features#events-resources"
  get "features/market-your-event", to: "features#events-resources"

  get "404", to: "pages#error_404"

  # Bible.us short url's are being handed to Web to manage.
  match "*path", to: ShortUrlsController.action(:index), format: false

  # Rails 3.1 hack to catch any remaining routes (404's)
  # with globbing setting params[:path] to the bad path
  #match '*path', :to => 'pages#routing_error'


end
