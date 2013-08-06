if Rails.env.development? || Rails.env.test?

  silence_warnings do
    begin
      require 'pry'
      IRB = Pry
    rescue LoadError
    end
  end

  if defined?(Zeus)
    class Zeus::Rails
      def console
        Pry.start
      end 
    end
  end

end