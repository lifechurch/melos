module Model
  
  def initialize_class(instance, params = {}, reg_data)
    reg_data.merge! params
    set_class_values(instance, reg_data)
  end
  
  def set_class_values(instance, values)
    values.each do |k,v|    
      # Create instance variable
      self.instance_variable_set("@#{k}", v)
      # Create the getter
      self.class.send(:define_method, k, proc{self.instance_variable_get("@#{k}")})
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
    return_val = ""
    values.each do |ref|
      return_val << "#{ref.osis}+"
    end
    return_val[0..-2]
  end

  # PARM (values): Array of Reference hashies
  # RETURN: String in OSIS format
  def self.hash_to_osis_noversion(values)
    return_val = ""
    values.each do |ref|
      return_val << "#{ref.osis_noversion}+"
    end
    return_val[0..-2]
  end

end
