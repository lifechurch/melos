module YV
  class ResourceError < StandardError
    attr_accessor :errors

    def initialize(api_errors)
      @errors = api_errors.map { |e| (e.is_a? Hash) ? e["error"] : e }
    end

    def message
      @errors.join("\n")
    end

    def has_error?( err )
      @errors.include? err
    end
  end


  class Resource
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    include ActiveModel::Validations

    class << self

      # This allows child class to easily override the prefix
      # of its API path, if it happens not to be name.tableize.
      def api_path_prefix
        name.tableize
      end

      # Class methods to define common api path strings based on the configured
      # api_path_prefix class method.  These api strings are passed to YV::API::Client
      # as path string to make proper request.

      # API path to retrieve a collection of resources
      def list_path
        "#{api_path_prefix}/items"
      end

      # API Path to retrieve an individual resource
      def resource_path
        "#{api_path_prefix}/view"
      end

      # API path to update a resource
      def update_path
        "#{api_path_prefix}/update"
      end

      # Create a resource
      def create_path
        "#{api_path_prefix}/create"
      end

      # Delete a resource
      def delete_path
        "#{api_path_prefix}/delete"
      end

      # Common path for configuration calls
      def configuration_path
        "#{api_path_prefix}/configuration"
      end

      # Makes a call to configuration API endpoint for Resource subclass
      def configuration(opts = {})
        opts = opts.merge({cache_for: YV::Caching.a_very_long_time}) if opts[:auth] == nil
        response = YV::API::Client.get(configuration_path, opts) do |errors|
          raise YV::ResourceError.new(errors)
        end
        return response
      end

      # Return a list of available locales from a subclass configuration call
      def available_locales
        configuration.available_language_tags.map{|tag| YV::Conversions.to_app_lang_code(tag).to_sym}
      end

      # Class configuration method - dynamically defines a method with the name(s) provided as atts
      # defined method will call i18nize on its class
      def attr_i18n_reader(*atts)
        atts.each { |att| define_method(att) { self.class.i18nize(attributes[att.to_s]) } }
      end

      # Lookup and return API data attribute values by current locale
      # API returns data that has been localized at times - ex:
      # "name"=>{"default"=>"Wisdom", "en"=>"Wisdom", "es"=>"..."}
      def i18nize(mash)
        return nil if mash.nil?
        lang_key = YV::Conversions.to_api_lang_code(I18n.locale.to_s)
        lang_key = i18n_key_override(lang_key)  # provide ability to override i18n key used for data returned from API
        
        return mash[lang_key] unless mash[lang_key].nil?

        # try to get localized html
        if mash.html.is_a?(Hashie::Mash)
          val = mash.html.try(:[], lang_key)
          val ||= mash.html.try(:[], 'default')
        end
        # try to get localized text
        if val.blank? && mash.text.is_a?(Hashie::Mash)
          val ||= mash.text.try(:[], lang_key)
          val ||= mash.text.try(:[], 'default')
        end

        val ||= mash["default"] if mash.has_key?(:default)

        # if there is no i18nized string to pull
        # allow root html/text root
        val ||= mash.try(:[], :html) if mash.try(:[], :html).is_a?(String)
        val ||= mash.try(:[], :text) if mash.try(:[], :text).is_a?(String)
        val
      end

      # Default implementation of i18n key override template method
      # Override in any class that needs to change the locale key used to lookup data attributes returned via the API.

        # sadly - we support pt-BR and pt-PT only on the website, however
        # the API likes to return "pt" as localized data attributes.  We need to provide
        # a way to map any discrepancies like this until it's fixed API side :( :( :(
      
      def i18n_key_override(key) # returns String
        return key
      end

      # Set class wide timeout for API calls
      # TODO - understand implications of class wide timeout var.
      def timeout(timeout_sec)
        @api_timeout = timeout_sec
      end

      # Ability to prefilter options prior to API calls in this class
      def prepare_opts!( opts = {} )
        opts[:timeout] = @api_timeout if @api_timeout
        opts
      end

      # Class method to find a resource subclass via API call
      def find(id, params = {}, &block)
        opts = prepare_opts!
        opts[:id] = id if id
        opts.merge! params  # Let params override if it already has an :id

        # First try request as an anonymous request
        response = YV::API::Client.get(resource_path, opts) do |errors|
          if block_given?
            block.call(errors)
          else
            raise ResourceError.new(errors)
          end
        end
        new(response.merge(auth: params.delete(:auth)))
      end


      # Class method to find a list of resources
      def all(params = {})
        auth = params[:auth]

        opts = prepare_opts!(params)

        not_found_responses = [/^No(.*)found$/, /^(.*)s( |\.)not( |_)found$/, /^Search did not match any documents$/]

        response = YV::API::Client.get(list_path, opts) do |errors|
          if errors.detect {|t| t['key'] =~ /auth_user_id.matches/}
            # Then it's the notes thing where you're auth'ed as a different user
            YV::API::Client.get(list_path, opts.merge!(auth: nil)) do |errors|
              if errors.length == 1 && not_found_responses.detect { |r| r.match( errors.first["error"] ) }
                []
              end
            end
          elsif errors.length == 1 && not_found_responses.detect { |r| r.match(errors.first["error"]) }
            []
          else
            raise ResourceError.new(errors)
          end
        end

        items = ResourceList.new
        # sometimes it has an explicit total attribute
        # else we just use implicit length of array returned
        if response.respond_to? :total
          items.total = response.total
        else
          items.total = response.length
        end
        # sometimes the array of items encapsulated with api_prefix
        # if there is other data that comes back with the response
        if response.respond_to? api_path_prefix.gsub('-','_').to_sym
          response.send(api_path_prefix.gsub('-','_')).each {|data| items << new(data.merge(auth:auth))}
        else
          response.each {|data| items << new(data.merge(auth: auth))}
        end
        items
      end

      # Resource list, but just return whatever the API gives us.
      # TODO: As soon as we've finished migrating all the resources,
      # check to see that both all() and all_raw() are really needed.
      # Likely they can be combined or one of them can be eliminated.

      # Currently only used in Bookmark resource.  Find out why and remove or update implementation in bookmark if necessary.
      def all_raw(params = {}, &block)
        response = YV::API::Client.get(list_path, params) do |errors|
          if block_given?
            block.call(errors)
          else
            raise ResourceError.new(errors)
          end
        end
      end

      # Create a resource.  Creates an instance and calls save on it.
      def create(data, &block)
        new(data).save(&block)
      end

      # Destroy a resource. TODO - make this similar to create -> create instance via id, call destroy. allows for callbacks etc.
      def destroy(id, auth = nil, &block)
        opts = prepare_opts!({auth: auth})
        opts[self.destroy_id_param] = id
        YV::API::Client.post(delete_path, opts, &block)
      end

      def destroy_id_param
        :ids
      end


      # Class method to define getter/setter attributes on a model
      # dynamically defines get/set methods for passed in attr_name
      attr_accessor :resource_attributes
      def attribute(attr_name, serialization_class = nil)
        @resource_attributes ||= []
        @resource_attributes << attr_name

        define_method(attr_name) do
          if serialization_class && attributes[attr_name].present?
            serialization_class.new attributes[attr_name]
          else
            attributes[attr_name]
          end
        end

        define_method("#{attr_name}=") do |val|
          if serialization_class
            attributes[attr_name] = (val.respond_to?(:to_attribute) ? val.to_attribute : val.to_s)
          else
            attributes[attr_name] = val
          end
        end
      end

      # Clear memoization at class level
      # instance variables that persist across requests
      def clear_memoization
        instance_variables.each do |var|
          unless [:@inheritable_attributes, :@resource_attributes, :@parent_name].include?(var)
            remove_instance_variable(var.to_sym)
          end
        end
        true
      end

      # Not exactly sure what the need/use case is for this at the moment. Britt (8/23/2013)
      def html_present?(mash)
        return false if mash.nil?

        lang_key = YV::Conversions.to_api_lang_code(I18n.locale.to_s)
        return false unless mash[lang_key].nil?

        val = mash.html.try(:[], lang_key)
        val ||= mash.html.try(:[], :default)
        val.present?
      end
    end

    # Begin main instance methods ------------------------------------------------------------------------------------

    attr_accessor :attributes, :associations

    attribute :id
    attribute :auth

    def after_build; end

    def initialize(data = {})
      @attributes = Hashie::Mash.new(data)
      @associations = {}
      yield self if block_given?
      after_build
    end

    def api_path_prefix
      self.class.api_path_prefix
    end

    def list_path
      self.class.list_path
    end

    def resource_path
      self.class.resource_path
    end

    def update_path
      self.class.update_path
    end

    def create_path
      self.class.create_path
    end

    def delete_path
      self.class.delete_path
    end

    def to_param
      id
    end

    def persisted?
      return !id.blank?
    end

    def persist(path)
      success = true
      response = nil
      response = YV::API::Client.post(path, attributes.merge(auth: self.auth)) do |errors|
        success = false
        errors.map {|err| self.errors[:base] << YV::API::Error.i18nize(e)}
        (yield errors) if block_given?
      end
      [success, response]
    end

    def before_save; end;
    def after_save(response); end;
    
    def save
      unless (self.persisted? == false && self.class == User)
        return false unless auth_present?
      end

      success = true
      response = nil

      self.persisted? ? before_update : before_save

      begin
        resource_path = self.persisted? ? self.class.update_path : self.class.create_path
        success, response = persist(resource_path)

        if success && !self.persisted? && response.id
          assign_id(response.id)
        end
      ensure
        self.persisted? ? after_update(response) : after_save(response)
      end
      success
    end

    def assign_id(id)
      self.id = id
    end

    
    def before_update; before_save; end;
    def after_update(response); after_save(response); end;
    def update(updated_attributes)
      updated_attributes.each { |k, v| self.send("#{k}=".to_sym, v) }
      save
    end

    def before_destroy; end;
    def after_destroy; end;
    def destroy
      return false unless auth_present?

      success = true

      before_destroy

      begin
        response = self.class.destroy(self.id, self.auth) do |errors|
          success = false
          errors.map {|err| self.errors[:base] << YV::API::Error.i18nize(e)}
          (yield errors) if block_given?
        end
      ensure
        after_destroy
      end
      success
    end

    def auth_present?
      if self.auth
        true
      else
        self.errors.add(:base, "auth is required, but it's not set.")
        false
      end
    end

    def created_as_date
      Date.parse(attributes['created_dt'])
    end

    def earned_as_date
      Date.parse(attributes['earned_dt'])
    end

    def updated_as_date
      Date.parse(attributes['updated_dt'])
    end

    def most_recent_date
      Date.parse(attributes['updated_dt'] || attributes['created_dt'])
    end

    # Instance method to add errors to a given resource
    def add_errors( api_errors_array )
      api_errors_array.each do |error|
        self.errors.add(:base, YV::API::Error.i18nize(error))
      end
    end

  end
end
