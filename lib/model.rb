module Model
  
  def initialize_class(params = {}, reg_data)
    set_class_values(reg_data.merge(params))
  end
  
  def set_class_values(values)
    values.each do |k, v|
      # Create an accessors and set the initial values for all the params
      self.class.send(:attr_accessor, k)
      self.send("#{k}=", v)
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
  
end
