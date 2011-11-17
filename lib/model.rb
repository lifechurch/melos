module Model
# Caedmon et al: I'm pretty sure I moved everything that was being used in this file to
  # the new YvModule and YvModel. I'll leave it in for now, but if you're still using it,
  # try to move over to YvModel/YvModule.
  #
  # -cb
  #
  def self.included(base)
    base.extend(ClassMethods)

  end

  module ClassMethods
    def attr_i18n_reader(*args)
      args.each { |a| define_method(a) { i18nize(instance_variable_get("@#{a}")) } }
    end
  end

  def initialize_class(instance, params = {}, reg_data)
    reg_data.merge! params
    set_class_values(instance, reg_data)
  end
  
  def set_class_values(instance, values)
    values.each do |k,v|    
      # Create instance variable
      self.instance_variable_set("@#{k}", v)
      # Create the getter
      # self.class.send(:define_method, k, proc{self.instance_variable_get("@#{k}")})
      # Create the setter
      self.class.send(:define_method, "#{k}=", proc{|v| self.instance_variable_set("@#{k}", v)})
    end    
  end

  
  def class_attributes(*args)
    array = args
    array = self.instance_variables.map { |e| e.to_s.gsub("@", "").to_sym} if array == []
    attrs = {}
    array.each do |var|
      attrs[var] = instance_variable_get("@#{var}")
    end
    attrs
  end

  # PARM (values): Array of Reference hashies
  # RETURN: String in OSIS format
  def self.hash_to_osis(values)
    values.map(&:osis).join('+')
  end

  # PARM (values): Array of Reference hashies
  # RETURN: String in OSIS format
  def self.hash_to_osis_noversion(values)
    values.map(&:osis_noversion).join('+')
  end

  def i18nize(hash)
    lang_key = I18n.locale.to_s.gsub("-", "_")
    hash.has_key?(lang_key) ? hash[lang_key] : hash["default"]
  end
end
