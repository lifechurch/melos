YouversionWeb::Application.routes.draw do
  filter :locale, exclude: /^\/auth\/facebook\/callback/, include_default_locale: false

  get "*path",          to: redirect("http://www.nic.bible/?utm_source=com"),  constraints: { subdomain: 'nic' }
  get "*path",          to: redirect("http://american.bible/?utm_source=com"), constraints: { subdomain: 'american' }
  get "/",          to: redirect("http://www.nic.bible/?utm_source=com"),  constraints: { subdomain: 'nic' }
  get "/",          to: redirect("http://american.bible/?utm_source=com"), constraints: { subdomain: 'american' }

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
  get "/300million",    to: redirect("http://installs.youversion.com/2017-year-in-review/index.html")
  get "/2017",          to: redirect("http://installs.youversion.com/2017-year-in-review/index.html")
  get "/2018",          to: redirect("http://blog.youversion.com/?p=25762")
  get "/redesign",      to: redirect("http://blog.youversion.com/2016/01/all-new-bible-dot-com-by-youversion-bible-app/")
  get "/blog-events",      to: redirect("http://blog.youversion.com/2016/03/introducing-events-the-newest-feature-in-the-bible-app")
  get "volunteer-form", to: redirect("https://www.youversion.com/volunteer")

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
  get "/lapset",    to: "redirects#lasten"
  get "/fi/lapset", to: "redirects#lasten"
  get "/barn",        to: "redirects#barn"
  get "/huuhduud",        to: "redirects#huuhduud"
  get "/yezingane",        to: "redirects#yezingane"
  get "/hk/kids",     to: "redirects#hk_kids"
  get "/ua/kids",     to: "redirects#ua_kids"
  get "/paidia",			to: "redirects#paidia"
  get "/ben/kids",		to: "redirects#ben_kids"
  get "/watoto",		to: "redirects#watoto"
  get "/hvvhdvvd",       to: "redirects#hvvhdvvd"
  get "/hvvdvvd",       to: "redirects#hvvdvvd"
  get "/kidsbel",       to: "redirects#kidsbel"
  get "/bel",       to: "redirects#bel"
  get "/nep/kids",       to: "redirects#nep_kids"
  get "/he/yeladim",       to: "redirects#he_kids"
  get "/%D7%99%D7%9C%D7%93%D7%99%D7%9D",       to: "redirects#he_kids"
  get "/he/%D7%99%D7%9C%D7%93%D7%99%D7%9D",       to: "redirects#he_kids"

  get "/hu/gyerek",       to: "redirects#gyerek"
  get "/gyerek",       to: "redirects#gyerek"

	get "/unsubscribe", to: "notifications#unsubscribe"
	get "/unsubscribe/manage", to: "notifications#manage_notifications"

	get "/popular-bible-verses", to: "pages#trending", :as => 'popular'
  get "/trending-bible-verses", to: "redirects#trending"
  get "/verse-of-the-day(/:usfm/:image_id)", to: "pages#votd", as: "votd", :constraints => {:usfm => /[^\/]*/}
  get "/bible-verse-of-the-day", to: "redirects#votd"
  # get "/wmf",           to: "redirects#wmf"
  # get "/world-meeting-of-families-app",           to: "pages#world-meeting-of-families-app"
  get "/apple-app-site-association", to: "pages#apple_app_site_association"

  # get "/users/:username/reading-plans/:id", to: "redirects#show"
  get "/users/:username/reading-plans/:id/devo", to: "redirects#devo"
  get "/users/:username/reading-plans/:id/ref", to: "redirects#ref"

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
  # NOTE: change this to not use the show method for rendering to node
  match 'bible(/:version/:reference)' => 'references#reader', :as => 'reference', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
  # match 'bible(/:version/:reference)' => 'references#show', :as => 'reference', :constraints => {:version => /[^\/\.]*/, :reference => /[^\/]*/}
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
      get   :calendar,      on: :member
      get   :devo,          on: :member
      get   :ref,           on: :member
      get   :plan_complete, on: :member
      get   :day_complete,  on: :member
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
  match '/users/:username/reading-plans/:id/subscription/:subscription_id/day/:day/completed' => 'plans#day_complete', as: "day_complete_plan", via: :get
  match '/users/:username/reading-plans/:id/completed' => 'plans#day_complete', as: "plan_complete_plan", via: :get

  get 'users/:username/reading-plans/:id(-:slug)/subscription/:subscription_id/day/:day/mark-complete' => 'subscriptions#mark_complete'

  get '/snapshot' => 'pages#snapshot', as: "snapshot"
  get '/snapshot/:user_id_hash/:user_id' => 'pages#snapshot'
	get '/users/:username/reading-plans/:id/subscription/:subscription_id' => 'subscriptions#show'
  get '/users/:username/reading-plans/:id/subscription/:subscription_id/day/:day' => 'subscriptions#show', as: "plan_show"
  # get '/users/:username/reading-plans/:id/subscription/:subscription_id/day/:day/devo' => 'subscriptions#devo', as: "plan_devo"
  get '/users/:username/reading-plans/:id/subscription/:subscription_id/day/:day/segment/:content' => 'subscriptions#ref', as: "plan_ref"

  get '/reading-plans-collection/:id' => 'plans#plan_collection'
  get '/recommended-plans-collection/:id' => 'plans#plan_collection'
  get '/saved-plans-collection' => 'plans#plan_collection'

  # PWF
  get '/reading-plans/:id/together/:together_id/invitation' => 'subscriptions#invitation', as: "pwf_invitation"
  get '/users/:username/reading-plans/:id/together/create' => 'subscriptions#show', as: "pwf_create"
  get '/users/:username/reading-plans/:id/together/:together_id/invite' => 'subscriptions#show', as: "pwf_invite"
  get '/reading-plans/:id/together/:together_id/participants' => 'subscriptions#show', as: "participants"
	get '/subscription/:subscription_id/day/:day/talk-it-over/:content' => 'plans#index'

  # LOOKINSIDE READING PLAN LANDING PAGES
  get '/lookinside/:id' => 'plans#lookinside_view'
  get '/lookinside/:id/read/day/:day' => 'plans#lookinside_sample'

  # Explore
  # get '/explore' => 'explore#index'
  # get '/explore/:topic' => 'explore#index'
  # get '/explore/stories' => 'explore#index'

  # Reading Plans
  # Legacy links that need to be supported
  # ------------------------------------------------------------------------------------------

  get "/users/:user_id/completed-reading-plans",  to: "subscriptions#completed"
  get "/users/:user_id/saved-reading-plans",      to: "subscriptions#saved"
  post "/users/:user_id/reading-plans/save-for-later", to: "subscriptions#saveForLater"
  post "/users/:user_id/reading-plans/remove-saved", to: "subscriptions#removeSaved"

  match "/users/:user_id/download" =>  "users#download", :as => "user_download"

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
  get "/settings/notifications",           to: "redirects#settings_notifications", as: "notification_settings"

  # Adding a totally unique URL to that can be used in emails and that the apps are not currently using
  get "/notification-settings",           to: "redirects#settings_notifications", as: "notification_settings_unique"

  get "/settings/delete_account",          to: "redirects#delete_account"
  get "/settings/vod_subscriptions",       to: "redirects#settings_vod_subscriptions"

# Redirect to a.youversion.com/groups/lifechurchtv
  get "/lifechurchtv",  to: "redirects#lifechurchtv"

  # Redirect for Myanmar Zawgyi
  get "/myz", to: "redirects#myz"
  get "/zawgyi", to: "redirects#zawgyi"

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
