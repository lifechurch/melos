YouversionWeb::Application.routes.draw do
  filter :locale, include_default_locale: false
  match 'donate/us', :to => 'donations#us', :as => 'us_donation', :via => [:get]
  match 'donate/relay_response', :to => 'donations#relay_response', :as => 'donations_relay_response', :via => [:post]
  match 'donate/receipt', :to => 'donations#receipt', :as => 'donations_receipt', :via => [:get]
  match 'open' => 'pages#open'

  # Bible
  match 'bible(/:reference)' => 'references#show', :as => 'reference', :constraints => {:reference => /[^\/]*/}
  match 'bible/:reference/highlights' => 'references#highlights', :as => 'reference_highlights', :constraints => {:reference => /[^\/]*/}
  match 'bible/:reference/notes' => 'references#notes', :as => 'reference_notes', :constraints => {:reference => /[^\/]*/}
  resources 'versions', :only => [:index, :show]

  resources 'bookmarks', :except => [:index] 

  resources 'likes', :only => [:index]
  match 'notes/:id/like' => 'notes#like',    :as => 'like', :via => :put
  
  match 'search' => 'search#show'
  match 'privacy' => 'users#privacy'
  match 'terms' => 'users#terms'

  # Users
  resources 'users', :except => [:new, :create] do
    match 'notes' => 'users#notes', as: 'notes'
    match 'bookmarks' => 'users#bookmarks', as: 'bookmarks'
    match 'likes' => 'users#likes', as: 'likes'
    match 'following' => 'users#following', as: 'following'
    match 'followers' => 'users#followers', as: 'followers'
    match 'follow' => 'users#follow', as: 'follow'
    match 'unfollow' => 'users#unfollow', as: 'unfollow'
    match 'badges' => 'users#badges', as: 'badges'
    match 'badge/:id' => 'badges#show', as: 'badge'
    resources 'plans', :only =>[:index], :path =>'reading-plans'
  end
  post 'share' => 'users#share', as: 'share'
  resources 'highlights', only: [:create]

  resources 'notes', :except => [:index]
  match 'notes' => 'notes#index', :as => 'all_notes'
  match 'sign-up' => 'users#new',    :as => 'sign_up', :via => :get
  match 'sign-up' => 'users#create', :as => 'sign_up', :via => :post
  match 'sign-up/facebook' => 'users#create_facebook', :as => 'facebook_sign_up', :via => :post
  match 'sign-up/facebook' => 'users#new_facebook', as: 'facebook_sign_up', :via => :get
  match 'sign-up/success' => 'users#sign_up_success', as: 'sign_up_success'
  match 'confirm-email' => 'users#confirm_email', :as => "confirm_email"
  
  # Sessions
  match 'sign-in'  => 'sessions#new',     :as => 'sign_in', :via => :get
  match 'sign-in'  => 'sessions#create',  :as => 'sign_in', :via => :post
  match 'sign-out' => 'sessions#destroy', :as => 'sign_out'
  match 'api-test' => 'api_test#index'

  #Reading Plans
  resources :plans, :only => [:index, :show, :update], :path => 'reading-plans' do
    match 'users' => 'plans#users_index'
    match 'settings' => 'plans#settings'
    match 'calendar' => 'plans#calendar'
    match 'start' => 'plans#start'
  end

  # profile stuff
  match 'settings/password'      => 'users#password', :as => 'password', :via => :get
  match 'settings/password'      => 'users#update_password', :as => 'password', :via => :post
  match 'settings/picture'       => 'users#picture', :as => 'picture', :via => :get
  match 'settings/picture'       => 'users#update_picture', :as => 'picture', :via => :put
  match 'settings/notifications' => 'users#notifications', :as => 'notifications', :via => :get
  match 'settings/notifications' => 'users#update_notifications', :as => 'notifications', :via => :put
  match 'settings/connections'   => 'users#connections', :as => 'connections'
  match 'settings/devices'       => 'users#devices', :as => 'devices'
  match 'devices/:id'            => 'users#destroy_device', :as => 'device', :via => :delete
  match 'settings'               => 'users#profile', :as => 'profile', :via => :get
  match 'settings'               => 'users#update_profile', :as => 'profile', :via => :put
  get   'settings/update_email'  => 'users#update_email_form', as: 'update_email'
  put   'settings/update_email'  => 'users#update_email', as: 'update_email'
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
  match 'donate' => 'pages#donate'
  match 'about' => 'pages#about'
  match 'press' => 'pages#press'
  match 'l10n' => 'pages#l10n'
  match 'donate/us' => 'pages#donate_form', :as => 'donate_form'
  match 'friends' => 'users#following'
  match 'bookmarks' => 'users#bookmarks'


  root to: 'references#show'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
