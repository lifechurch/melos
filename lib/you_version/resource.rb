module YouVersion
  class ResourceError < StandardError
    attr_accessor :errors

    def initialize(api_errors)
      @errors = api_errors.map { |e| (e.is_a? Hash) ? e["error"] : e }
    end

    def message
      @errors.join("\n")
    end
  end

  class Resource
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    include ActiveModel::Validations

    class <<self
      # This allows child class to easily override the prefix
      # of its API path, if it happens not to be name.tableize.
      def api_path_prefix
        name.tableize
      end
      
      def foreign_key
        "#{model_name.singular}_id"
      end

      def list_path
        "#{api_path_prefix}/items"
      end

      def resource_path
        "#{api_path_prefix}/view"
      end

      def update_path
        "#{api_path_prefix}/update"
      end

      def create_path
        "#{api_path_prefix}/create"
      end

      def delete_path
        "#{api_path_prefix}/delete"
      end

      def i18nize(hash)
        lang_key = I18n.locale.to_s.gsub("-", "_")
        hash.has_key?(lang_key) ? hash[lang_key] : hash["default"] unless hash.nil?
      end

      def attr_i18n_reader(*args)
        args.each { |a| define_method(a) { YouVersion::Resource.i18nize(attributes[a.to_s]) } }
      end

      def retry_with_auth?(errors)
        errors.find {|t| t['key'] =~ /(?:username_and_password.required)|(?:users.auth_user_id.or_isset)/}
      end

      def find(id, params = {}, &block) 
        api_errors = nil

        auth = params.delete(:auth)

        opts = {}
        opts[:id] = id if id
        opts.merge! params  # Let params override if it already has an :id
        # First try request as an anonymous request
        puts "lets do this, path is #{resource_path}, opts are #{opts}"
        response = get(resource_path, opts) do |errors|
          puts errors
          if retry_with_auth?(errors)
            # If API said it wants authorization, try again with auth
            inner_response = get(resource_path, opts.merge(auth: auth)) do |errors|
              # Capture errors for handling below
              api_errors = errors
            end
          else
            Rails.logger.info "** Resource.find: got non-auth error: #{errors}"
            api_errors = errors
          end

          if api_errors
            # Sadly, all our attempts failed.
            @errors = api_errors.map { |e| e["error"] }

            if block_given?
              block.call(errors)
            else
              raise ResourceError.new(errors)
            end
          end

          # Propagate the response from the get-with-auth call as the return
          # value for the outer block.
          inner_response
        end
        new(response.merge(:auth => auth))
      end

      def all(params = {})
        response = YvApi.get(list_path, params) do |errors|
          if errors.detect {|t| t['key'] =~ /auth_user_id.matches/}
            # Then it's the notes thing where you're auth'ed as a different user
            all(params.merge(auth: nil))
          elsif errors.length == 1 && [/^No(.*)found$/, /^(.*)s not found$/].detect { |r| r.match(errors.first["error"]) }
            return []
          else
            raise ResourceError.new(errors)
          end
        end

        list = ResourceList.new

        # argh, sometimes it has a total, sometimes it doesn't
        if response.respond_to? :total
          list.total = response.total
        else
          list.total = response.length
        end

        # aaand sometimes it's not encapsulated with api_prefix
        if response.respond_to? api_path_prefix.to_sym
          response.send(api_path_prefix).each {|data| list << new(data.merge(:auth => params[:auth]))}
        else
          response.each {|data| list << new(data.merge(:auth => params[:auth]))}
        end
        list

      end

      # Resource list, but just return whatever the API gives us.
      # TODO: As soon as we've finished migrating all the resources,
      # check to see that both all() and all_raw() are really needed.
      # Likely they can be combined or one of them can be eliminated.
      def all_raw(params = {}, &block)
        response = YvApi.get(list_path, params) do |errors|
          if block_given?
            block.call(errors)
          else
            raise ResourceError.new(errors)
          end
        end
      end

      def create(data, &block)
        new(data).save(&block)
      end

      def destroy(id, auth = nil, &block)
        post(delete_path, {:id => id, :auth => auth}, &block)
      end

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

      def api_version(version)
        @api_version = version
      end

      def secure(*secure_method_names)
        @secure_methods ||= []
        @secure_methods += secure_method_names.map(:to_sym)
      end

      def secure_caller?(caller)
        # TODO: Is this slow?  Nasty?  Probably. :(
        calling_method = caller.first.match(/`(.*)'$/)[1]
        @secure_methods.present? && @secure_methods.include?(calling_method.to_sym)
      end

      # If the calling method is one of those for which
      # we need to use https, add :secure => true to params
      def securify(params, caller)
        params.merge!(:secure => true) if secure_caller?(caller)
        params
      end

      def post(path, params, &block)
        params[:api_version] = @api_version if @api_version
        YvApi.post(path, securify(params, caller), &block)
      end

      def get(path, params, &block)
        params[:api_version] = @api_version if @api_version
        YvApi.get(path, securify(params, caller), &block)
      end

      
      def belongs_to_remote(association_name)
        association_class = association_name.to_s.classify.constantize
        attribute association_class.foreign_key.to_sym

        define_method(association_name.to_s.singularize) do |params = {}|
          associations.delete(association_name) if params[:refresh]

          associations[association_name] ||= association_class.find(self.attributes[association_class.foreign_key].to_i, params)
        end
      end

      def has_many_remote(association_name)
        define_method(association_name.to_s.pluralize) do |params = {}|
          # associations.delete(association_name) if params[:refresh]
          
          association_class = association_name.to_s.classify.constantize
          associations[association_name] ||= association_class.all(params.merge(self.class.foreign_key => self.id))
        end
      end
    end

    attr_accessor :attributes, :associations

    attribute :id
    attribute :auth

    def after_build; end

    def initialize(data = {})
      @attributes = data
      @associations = {}

      after_build
    end

    def persisted?
      return !id.blank?
    end

    def persist_token
      Digest::MD5.hexdigest "#{self.auth[:username]}.Yv6-#{self.auth[:password]}"
    end

    def to_param
      id
    end

    def persist(resource_path)
      response = true
      response_data = nil
      token = self.persist_token
      response_data = self.class.post(resource_path, attributes.merge(:token => token, :auth => self.auth)) do |errors|
        new_errors = errors.map { |e| e["error"] }
        new_errors.each { |e| self.errors[:base] << e }

        if block_given?
          yield errors
        end

        response = false
      end

      [response, response_data]
    end

    def before_save; end;
    def after_save(response); end;
    def save
      unless (self.persisted? == false && self.class == User)
        return false unless authorized?
      end

      response = true
      response_data = nil

      self.persisted? ? before_update : before_save

      begin
        # return false unless valid?

        resource_path = self.persisted? ? self.class.update_path : self.class.create_path
        response, response_data = persist(resource_path)

        if response && ! self.persisted?
          self.id = response_data.id if response_data.id
        end
      ensure
        self.persisted? ? after_update(response_data) : after_save(response_data)
      end
      response
    end

    def before_update; before_save; end;
    def after_update(response); after_save(response); end;

    def update(updated_attributes)
      # self.attributes = self.attributes.merge(updated_attributes)
      updated_attributes.each { |k, v| self.send("#{k}=".to_sym, v) }
      save
    end

    def before_destroy; end;
    def after_destroy; end;
    def destroy
      response = true

      return false unless authorized?

      before_destroy

      begin
        response = self.class.destroy(self.id, self.auth) do |errors|
          new_errors = errors.map { |e| e["error"] }
          self.errors[:base] << new_errors

          if block_given?
            yield errors
          end

          response = false
        end
      ensure
        after_destroy
      end
      response
    end

    def authorized?
      if self.auth
        true
      else
        self.errors.add(:base, "auth is required, but it's not set.")
        false
      end
    end

    def created_as_date
      Date.parse(attributes['created'])
    end

    def updated_as_date
      Date.parse(attributes['updated'])
    end

    def most_recent_date
      Date.parse(attributes['updated'] || attributes['created'])
    end

  end
end
