module YvLogger
  module Logger
    def apc(object, level = nil, force = false)
      if (defined? Rails.logger.ap) && (!Rails.env[/\Aproduction/] || force)
        Rails.logger.ap object, level
      else
        level ||= :debug
        Rails.logger.send(level, object)
      end
    end
  end
end

module Kernel
  def apc(object, options = {}, force = false)
    if (defined? ::Kernel.ap) && (!Rails.env[/\Aproduction/] || force)
      ap object
    else
      p object
    end
  end

  module_function :apc
end

Logger.send(:include, YvLogger::Logger)
ActiveSupport::BufferedLogger.send(:include, YvLogger::Logger) if defined?(ActiveSupport::BufferedLogger)
