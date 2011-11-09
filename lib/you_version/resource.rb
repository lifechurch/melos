module YouVersion
  class ResourceError < StandardError
    attr_accessor :errors
    
    def initialize(api_errors)
      @errors = api_errors
    end
  end
  
  class Resource
    extend ActiveModel::Naming
    include ActiveModel::Conversion
    
    class <<self
      # This allows child class to easily override the prefix
      # of its API path, if it happens to not be name.tableize.
      def api_path_prefix
        name.tableize
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
      
      def naughty_find(id, auth = nil, params = {}, &block)

        bad_naughty = nil

        # First try request as an anonymous request
        response = get(resource_path, params.merge(id: id) ) do |e|
          if (e.find {|t| t['key'] =~ /username_and_password.required/})
            # If API said it wants authorization, try again with auth
            get(resource_path, params.merge(id: id, auth: auth)) do |e|
              # Capture errors
              bad_naughty = e
            end
          else
              # Capture errors
            bad_naughty = e
          end

          # Down here we do something with the real error
          if bad_naughty
            if block_given?
              response = block.call(response, bad_naughty)
              # all the weird crap they do now
            end
            raise
          end
        end

        new(response.merge(:auth => auth))
      end
      
      def find(id, auth = nil, params = {})
        response = get(resource_path, id: id ) do |e|   # anonymous
          get(resource_path, id: id, auth: auth) do |e| # auth'ed
            raise ResourceError.new(e.map { |e| e["error"] })
          end
        end

        new(response.merge(:auth => auth))
      end
      
      def all(params = {})
        response = YvApi.get(list_path, params) do |errors|
          raise ResourceError.new(errors.map { |e| e["error"] })
        end
        
        # TODO: Switch to ResourceList here
        response.send(name.tableize).map {|data| new(data.merge(:auth => params[:auth]))}
      end
      
      def for_user(user_id, auth)
        all(auth, {:user_id => user_id, :auth => auth})
      end

      def create(data)
        new(data).save
      end
      
      def destroy(id, auth = nil)
        @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

        response = post(delete_path, {:id => id, :auth => auth}) do |errors|
          raise ResourceError.new(errors.map { |e| e["error"] })
        end
        response
      end
      
      attr_accessor :resource_attributes

      def attribute(attr_name)
        @resource_attributes ||= []
        @resource_attributes << attr_name
        
        define_method(attr_name) do
          attributes[attr_name]
        end
        
        define_method("#{attr_name}=") do |val|
          attributes[attr_name] = val
        end        
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
        YvApi.post(path, securify(params, caller), &block)
      end
      
      def get(path, params, &block)
        YvApi.get(path, securify(params, caller), &block)
      end
    end

    attr_accessor :attributes

    attribute :id
    attribute :auth

    def after_build; end

    def initialize(data = {})
      @attributes = data
      after_build
    end
    
    def persisted?
      return !id.blank?
    end
    
    def to_param
      id
    end
    
    def before_save; end;
    def after_save(response); end;  
    def save
      response = false
      
      before_save
      token = Digest::MD5.hexdigest "#{self.auth.username}.Yv6-#{self.auth.password}"

      response = self.class.post(self.class.create_path, attributes.merge(:token => token, :auth => self.auth)) do |errors|
        raise ResourceError.new(errors.map { |e| e["error"] })
      end
      
      self.id = response.id
      
      after_save(response)
      
      response
    end

    def before_update; before_save; end;
    def after_update(response); after_save(response); end;  
    def update
      response = false
      
      before_update
      token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

      response = self.class.post(self.class.update_path, attributes.merge(:token => token, :auth => self.auth)) do |errors|
        raise ResourceError.new(errors.map { |e| e["error"] })
      end
            
      after_update(response)
      
      response
    end
    
    def before_destroy; end;
    def after_destroy; end;
    def destroy
      before_destroy
      self.class.destroy(self.id, self.auth)
      after_destroy
    end
  end
end
