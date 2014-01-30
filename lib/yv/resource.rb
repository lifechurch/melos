module YV
  
  class AuthRequired < StandardError
  end

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
    extend  ActiveModel::Naming
    include ActiveModel::Conversion

    attr_accessor :errors

    class << self

      # Class method to make a GET request to a provided API path
      # optional opts are passed along to the underlying request
      #
      # returns an array [api_data, api_errors]
      # api_data   = Hashie::Mash
      # api_errors = Array of YV::API::Error instances
      def get( path , opts = {} )
        response = YV::API::Client.get(path, opts)
        YV::API::ResponseHandler.new(response).process
      end

      # Is this necessary?  Can we rollup API::Results into main #get method?
      def get_results(path,opts={})
        data,errs = get(path, opts)
        return YV::API::Results.new(data,errs)
      end


      # Class method to make a POST request to a provided API path
      # optional opts are passed along to the underlying request
      #
      # returns an array [api_data, api_errors]
      # api_data   = Hashie::Mash
      # api_errors = Array of YV::API::Error instances
      def post( path, opts = {})
        response = YV::API::Client.post(path, opts)
        YV::API::ResponseHandler.new(response).process
      end


      # API path prefix used to generate many API calls
      # Ex: users in users/view
      # Override in subclass if name.tableize is not an appropriate prefix
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

      # Configuration API endpoint call for a Resource subclass
      # Returns an instance of YV::API::Results
      def configuration(opts = {})
        opts = opts.merge({cache_for: YV::Caching.a_very_long_time}) if opts[:auth] == nil
        data, errs = get(configuration_path,opts)
        return YV::API::Results.new( data , errs )
      end

      # Return a list of available locales from a subclass configuration call
      def available_locales
        results = configuration()
        results.data.available_language_tags.map{|tag| YV::Conversions.to_app_lang_code(tag).to_sym}
      end

      # Find a resource by id and optional parameters
      # Returns a YV::API::Results decorator for a single instance
      # requires subclasss to define the #map class method to appropriately
      # map a #view API response

      def find(id, params = {})
        opts = prepare_opts!
        opts[:id] = id if id
        opts.merge! params  # Let params override if it already has an :id

        data, errs = get(resource_path, opts)
        map(YV::API::Results.new(data.merge!(auth: params.delete(:auth)),errs), new() , :find)
      end


      # Find a list of resources given optional parameters
      # Returns a YV::API::Results decorator for an array of instances
      # requires subclass to define the #map_all class method to appropriately
      # map API responses

      def all(params = {})
        opts = prepare_opts!(params)
        data, errs = get(list_path,opts)
        data = [] if not_found?(errs)
        map_all(YV::API::Results.new(data,errs)) 
      end

      # Create a resource.  Creates an instance and calls save on it.
      def create(data)
        new(data).save
      end

      # Destroy a resource. TODO - make this similar to create -> find instance via id, call destroy. allows for callbacks etc.
      def destroy(id, auth = nil)
        opts = prepare_opts!({auth: auth})
        opts[self.destroy_id_param] = id
        data, errs = post(delete_path, opts)

        map_delete(YV::API::Results.new(data,errs))
      end

      def destroy_id_param
        :id
        #:ids
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

      def attributes(atts)
        atts.each {|att| attribute(att)}
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


      # Abstracted method for raising errors from an array of YV::API::Error instances
      # should be called from within Resource subclass

      def raise_errors( active_model_errs, msg = nil)
        raise "#{msg}: #{active_model_errs.full_messages.join(",")}"
      end


      def api_response_mapper(klass)
        @api_response_mapper = klass
      end


      def map_all(results)
        raise "Declare an API Response Mapper" unless @api_response_mapper.present?
        results.data = @api_response_mapper.map_all(results.data)
        results
      end

      def map_delete(results)
        raise "Declare an API Response Mapper" unless @api_response_mapper.present?
        results.data = @api_response_mapper.map_delete(results.data)
        results
      end

      # Map results to an instance for a given action
      def map(results,instance,action)
        raise "Declare an API Response Mapper" unless @api_response_mapper.present?
        if results.valid?
          results.data = case action
            when :find
              @api_response_mapper.map(results.data, new(), :find)
            when :create, :update
              @api_response_mapper.map(results.data, instance, action)
          end
        end
        return results
      end

      def api_debug(bool)
        @api_response_mapper = YV::API::Mapper::Base if bool
      end

      private

      def not_found?(errs)
        return false if errs.nil?
        not_found_responses = [/^No(.*)found$/, /^(.*)s( |\.)not( |_)found$/, /^Search did not match any documents$/]
        return true if errs.length == 1 && not_found_responses.detect { |r| r.match( errs.first.error )}
        return false
      end

    end
    # End class methods ----------------------------------------------------------------------------------------------

    # Begin main instance methods ------------------------------------------------------------------------------------

    attr_accessor :attributes, :associations

    attribute :id
    attribute :auth

    def after_build; end

    def initialize(data = {})
      @attributes = Hashie::Mash.new(data)
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

    # TODO: private?
    def persist(path)
      data, errs = self.class.post(path,attributes.merge(auth: self.auth))
      return YV::API::Results.new( data , errs )
    end

    def persist_moment(path,opts={})
      raise "Moment kind required." unless opts[:kind]
      data, errs = self.class.post( path ,opts.merge(auth: self.auth))
      return YV::API::Results.new( data , errs )
    end


    def before_save; end;
    def after_save(api_results); end;
    
    def save
      unless (self.persisted? == false && self.class == User)
        raise YV::AuthRequired unless auth_present?
      end

      self.persisted? ? before_update : before_save

      begin
        resource_path = self.persisted? ? self.class.update_path : self.class.create_path
        results = persist(resource_path)
      ensure
        self.persisted? ? after_update(results) : after_save(results)
      end

      if results.valid?
         action = persisted? ? :update : :create
         self.class.map(results,self,action)
      else
         results
      end
    end

    
    def before_update; before_save; end;
    def after_update(api_results); after_save(api_results); end;

    def update(updated_attributes = {})
      updated_attributes.each { |k, v| self.send("#{k}=".to_sym, v) }
      save
    end

    def before_destroy; end;
    def after_destroy; end;
    def destroy
      raise YV::AuthRequired unless auth_present?
      before_destroy

      results = nil
      begin
        results = self.class.destroy(self.id, self.auth)
      ensure
        after_destroy
      end

      return results
    end


    def auth_present?
      raise YV::AuthRequired unless self.auth
      true
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


    private

    # Allows us to call class level raise_errors method at the instance level
    # Reasoning is because we have instance level methods that hit the API
    # and need a way to raise/report errors.
    # This in turn keeps us from having to write: self.class.raise_errors
    # in the instance method ... a little bit cleaner.

    def raise_errors(errs,msg = nil)
      self.class.raise_errors(errs,msg)
    end

    def set_created_dt
      self.created_dt = Time.now.iso8601
    end

  end
end
