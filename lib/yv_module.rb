module YvModule

  def i18nize(hash)
    lang_key = I18n.locale.to_s.gsub("-", "_")
    hash.has_key?(lang_key) ? hash[lang_key] : hash["default"]
  end

  def attributes(*args)
    array = args
    array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
    attrs = {}
    array.each do |var|
      attrs[var] = instance_variable_get("@#{var}")
    end
    attrs
  end

  def hash_to_vars(opts)
    opts.each do |k, v|
      self.instance_variable_set("@#{k}", v)
    end
  end

  def self.included(base)
    base.extend ClassMethods
  end

  module ClassMethods
    def set_defaults(opts = {})
      @defaults = opts
    end

    def attr_i18n_reader(*args)
      args.each { |a| define_method(a) { i18nize(instance_variable_get("@#{a}")) } }
    end
  end

end
