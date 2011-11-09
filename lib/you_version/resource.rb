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
      def list_path
        "#{name.tableize}/items"
      end

      def resource_path
        "#{name.tableize}/view"        
      end
      
      def update_path
        "#{name.tableize}/update"
      end
      
      def create_path
        "#{name.tableize}/create"
      end
      
      def delete_path
        "#{name.tabelize}/delete"
      end
      
      def find(id, auth = nil, params = {})        
        response = get(resource_path, id: id ) do |e|   # anonymous    
          get(resource_path, id: id, auth: auth) do |e| # auth'ed
            raise ResourceError.new(errors.map { |e| e["error"] })
          end
        end

        new(response.merge(:auth => auth))
      end
      
      def all(params = {})
        response = YvApi.get(list_path) do |errors|
          raise ResourceError.new(errors.map { |e| e["error"] })
        end

        response.map {|data| new(data.merge(:auth => auth))}
      end
      
      def for_user(user_id, auth)
        all(auth, {:user_id => user_id, :auth => auth})
      end

      def create(data)
        new(data).save
      end
      
      def destroy(id, auth = nil)
        @token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

        response = post(delete_path, {:id => id, :auth => auth})) do |errors|
          raise ResourceError.new(errors.map { |e| e["error"] })
        end
        response
      end
      
      attr_accessor :resource_attributes
      def attribute(attr_name)
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
      
      def post(path, params)
        # TODO: Is this slow?  Nasty?  Probably. :(
        calling_method = caller.first.match(/`(.*)'$/)[1]
        if @secure_methods.include?(calling_method.to_sym)
          YvApi.post(path, params.merge(:secure => true))
        else
          YvApi.post(path)          
        end
      end
      
      def get(path, params)
        # TODO: Is this slow?  Nasty?  Probably. :(
        calling_method = caller.first.match(/`(.*)'$/)[1]
        if @secure_methods.include?(calling_method.to_sym)
          YvApi.get(path, params.merge(:secure => true))
        else
          YvApi.get(path)          
        end
      end
    end

    attr_accessor :attributes
    
    attribute :id
    attribute :version
    attribute :auth
    
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
    def save(auth = nil)
      response = false
      
      before_save
      token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

      response = self.class.post(self.class.create_path, attributes.merge(:token => token, :auth => auth)) do |errors|
        raise ResourceError.new(errors.map { |e| e["error"] })
      end
      
      self.id = response.id
      self.version = Version.new(response.version)
      
      after_save(response)
      
      response
    end

    def before_update; end;
    def after_update(response); end;  
    def update(auth = nil)
      response = false
      
      before_update
      token = Digest::MD5.hexdigest "#{auth.username}.Yv6-#{auth.password}"

      response = self.class.post(self.class.update_path, attributes.merge(:token => token, :auth => auth)) do |errors|
        raise ResourceError.new(errors.map { |e| e["error"] })
      end
      
      self.version = Version.new(response.version)
      
      after_update(response)
      
      response
    end
    
    def before_destroy; end;
    def after_destroy; end;
    def destroy(auth = nil)
      before_destroy
      self.class.destroy(self.id, auth)
      after_destroy
    end
  end
end